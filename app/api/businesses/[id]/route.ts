import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { generateUniqueSlug } from '@/lib/slug'

// GET /api/businesses/[id] - Get single business
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const business = await prisma.business.findUnique({
      where: { id: params.id },
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
            icon: true,
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

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    return NextResponse.json({ business })
  } catch (error) {
    console.error('Error fetching business:', error)
    return NextResponse.json(
      { error: 'Failed to fetch business' },
      { status: 500 }
    )
  }
}

// PUT /api/businesses/[id] - Update business
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id!
    const body = await request.json()

    // Check if business exists and belongs to user
    const existingBusiness = await prisma.business.findUnique({
      where: { id: params.id },
    })

    if (!existingBusiness) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    // Only owner can update their business, or admin can update any business
    const isAdmin = session.user.role === 'ADMIN'
    if (!isAdmin && existingBusiness.ownerId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden: You can only update your own businesses' },
        { status: 403 }
      )
    }

    const {
      name,
      description,
      address,
      phone,
      email,
      website,
      facebookUrl,
      instagramUrl,
      linkedinUrl,
      twitterUrl,
      youtubeUrl,
      googleBusinessUrl,
      tiktokUrl,
      hoursJson,
      imageUrl,
    } = body

    // Regenerate slug if name or address changed
    let newSlug = existingBusiness.slug
    if (name !== existingBusiness.name || address !== existingBusiness.address) {
      newSlug = await generateUniqueSlug(
        name,
        address,
        existingBusiness.locationId,
        existingBusiness.directoryId,
        existingBusiness.id
      )
    }

    // Update business (status resets to PENDING if content changed)
    const business = await prisma.business.update({
      where: { id: params.id },
      data: {
        name,
        slug: newSlug,
        description,
        address,
        phone,
        email,
        website,
        facebookUrl,
        instagramUrl,
        linkedinUrl,
        twitterUrl,
        youtubeUrl,
        googleBusinessUrl,
        tiktokUrl,
        hoursJson,
        imageUrl,
        status: 'PENDING', // Reset to pending on edit
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
      },
    })

    return NextResponse.json({ business })
  } catch (error) {
    console.error('Error updating business:', error)
    return NextResponse.json(
      { error: 'Failed to update business' },
      { status: 500 }
    )
  }
}

// DELETE /api/businesses/[id] - Delete business
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id!

    // Check if business exists and belongs to user
    const existingBusiness = await prisma.business.findUnique({
      where: { id: params.id },
    })

    if (!existingBusiness) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    // Only owner can delete their business, or admin can delete any business
    const isAdmin = session.user.role === 'ADMIN'
    if (!isAdmin && existingBusiness.ownerId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden: You can only delete your own businesses' },
        { status: 403 }
      )
    }

    // Delete business
    await prisma.business.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Business deleted successfully' })
  } catch (error) {
    console.error('Error deleting business:', error)
    return NextResponse.json(
      { error: 'Failed to delete business' },
      { status: 500 }
    )
  }
}
