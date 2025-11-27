import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { generateUniqueSlug } from '@/lib/slug'
import { sendBusinessUpdatedPendingEmail, sendAdminPendingBusinessEmail } from '@/lib/email'

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
      include: {
        owner: {
          select: { email: true, name: true }
        },
        location: {
          select: { name: true }
        },
        directory: {
          select: { name: true }
        }
      }
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
      city,
      zipCode,
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

    // Track changes for admin notification
    const changes: Array<{ field: string; oldValue: string; newValue: string }> = []

    const fieldLabels: Record<string, string> = {
      name: 'Business Name',
      description: 'Description',
      city: 'City',
      zipCode: 'ZIP Code',
      address: 'Address',
      phone: 'Phone',
      email: 'Email',
      website: 'Website',
      facebookUrl: 'Facebook',
      instagramUrl: 'Instagram',
      linkedinUrl: 'LinkedIn',
      twitterUrl: 'Twitter',
      youtubeUrl: 'YouTube',
      googleBusinessUrl: 'Google Business',
      tiktokUrl: 'TikTok',
      hoursJson: 'Business Hours',
      imageUrl: 'Image',
    }

    const fieldsToCheck = {
      name, description, city, zipCode, address, phone, email, website,
      facebookUrl, instagramUrl, linkedinUrl, twitterUrl,
      youtubeUrl, googleBusinessUrl, tiktokUrl, hoursJson, imageUrl
    }

    for (const [field, newValue] of Object.entries(fieldsToCheck)) {
      const oldValue = existingBusiness[field as keyof typeof existingBusiness]
      const oldStr = oldValue ? String(oldValue) : ''
      const newStr = newValue ? String(newValue) : ''

      if (oldStr !== newStr) {
        changes.push({
          field: fieldLabels[field] || field,
          oldValue: oldStr || '(empty)',
          newValue: newStr || '(empty)'
        })
      }
    }

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
        city,
        zipCode,
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

    // Send email notifications (non-blocking)
    try {
      // Notify owner that their update is pending
      await sendBusinessUpdatedPendingEmail(
        existingBusiness.owner.email,
        existingBusiness.owner.name || 'Business Owner',
        business.name
      )

      // Notify admin about pending business with changes
      await sendAdminPendingBusinessEmail(
        business.name,
        existingBusiness.owner.name || 'Business Owner',
        existingBusiness.owner.email,
        existingBusiness.location.name,
        existingBusiness.directory.name,
        true, // isUpdate = true
        changes // pass the tracked changes
      )
    } catch (emailError) {
      console.error('Failed to send update notification emails:', emailError)
    }

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
