import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

// Validation schema
const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address'),
  subject: z.string().max(200, 'Subject is too long').optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message is too long'),
})

// POST /api/contact - Submit contact form
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    const body = await request.json()

    // Validate input
    const validation = contactSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      )
    }

    const { name, email, subject, message } = validation.data

    // Create contact submission
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        subject: subject || null,
        message,
        userId: session?.user?.id || null,
        status: 'NEW',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Thank you for contacting us. We will get back to you soon.',
      contactId: contact.id,
    })
  } catch (error) {
    console.error('Error submitting contact form:', error)
    return NextResponse.json(
      { error: 'Failed to submit contact form. Please try again later.' },
      { status: 500 }
    )
  }
}

// GET /api/contact - List contact submissions (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    // Check authentication and admin role
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    if (status) {
      where.status = status
    }

    // Get total count
    const total = await prisma.contact.count({ where })

    // Get contacts
    const contacts = await prisma.contact.findMany({
      where,
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        location: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      contacts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    )
  }
}
