import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

// PUT /api/admin/businesses/[id]/toggle-active - Toggle business active status
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

    // Check if business exists
    const existingBusiness = await prisma.business.findUnique({
      where: { id: params.id },
    })

    if (!existingBusiness) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    // Toggle isActive status
    const business = await prisma.business.update({
      where: { id: params.id },
      data: {
        isActive: !existingBusiness.isActive,
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
      message: `Business ${business.isActive ? 'activated' : 'deactivated'} successfully`,
      business,
    })
  } catch (error) {
    console.error('Error toggling business active status:', error)
    return NextResponse.json(
      { error: 'Failed to toggle business active status' },
      { status: 500 }
    )
  }
}
