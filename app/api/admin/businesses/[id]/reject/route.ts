import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

// PUT /api/admin/businesses/[id]/reject - Reject business with reason
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    // Check authentication and admin role
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { reason } = body

    if (!reason || reason.trim().length === 0) {
      return NextResponse.json(
        { error: 'Rejection reason is required' },
        { status: 400 }
      )
    }

    // Check if business exists
    const existingBusiness = await prisma.business.findUnique({
      where: { id: params.id },
    })

    if (!existingBusiness) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    // Reject business
    const business = await prisma.business.update({
      where: { id: params.id },
      data: {
        status: 'REJECTED',
        rejectionReason: reason,
        approvedAt: null, // Clear any previous approval
      },
      include: {
        location: {
          select: {
            name: true,
            slug: true,
          },
        },
        directory: {
          select: {
            name: true,
            slug: true,
          },
        },
        owner: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({
      message: 'Business rejected',
      business,
    })
  } catch (error) {
    console.error('Error rejecting business:', error)
    return NextResponse.json(
      { error: 'Failed to reject business' },
      { status: 500 }
    )
  }
}
