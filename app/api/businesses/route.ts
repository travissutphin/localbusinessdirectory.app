import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { generateUniqueSlug } from '@/lib/slug'

// GET /api/businesses - List businesses with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    const searchParams = request.nextUrl.searchParams
    const locationSlug = searchParams.get('location')
    const directorySlug = searchParams.get('directory')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    // If authenticated and not admin, filter by owner
    if (session?.user && session.user.role !== 'ADMIN') {
      where.ownerId = session.user.id
    }

    // If not authenticated or admin viewing, default to approved only
    if (!session?.user || session.user.role === 'ADMIN') {
      where.status = status || 'APPROVED'
    } else {
      // For owners, show all their businesses regardless of status unless specified
      if (status) {
        where.status = status
      }
    }

    // Filter by location if provided
    if (locationSlug) {
      const location = await prisma.location.findUnique({
        where: { slug: locationSlug },
      })
      if (location) {
        where.locationId = location.id
      }
    }

    // Filter by directory if provided
    if (directorySlug && locationSlug) {
      const location = await prisma.location.findUnique({
        where: { slug: locationSlug },
      })
      if (location) {
        const directory = await prisma.directory.findUnique({
          where: {
            locationId_slug: {
              locationId: location.id,
              slug: directorySlug,
            },
          },
        })
        if (directory) {
          where.directoryId = directory.id
        }
      }
    }

    // Get total count
    const total = await prisma.business.count({ where })

    // Get businesses
    const businesses = await prisma.business.findMany({
      where,
      skip,
      take: limit,
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
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      businesses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching businesses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch businesses' },
      { status: 500 }
    )
  }
}

// POST /api/businesses - Create new business
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id!
    const body = await request.json()

    const {
      name,
      description,
      locationId,
      directoryId,
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
      duplicateFlag,
      potentialDuplicates,
    } = body

    // Validate required fields
    if (!name || !locationId || !directoryId || !description || !address || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description, address, email, locationId, directoryId' },
        { status: 400 }
      )
    }

    // Check owner limit (max 2 businesses)
    const ownerBusinessCount = await prisma.business.count({
      where: {
        ownerId: userId,
      },
    })

    if (ownerBusinessCount >= 2) {
      return NextResponse.json(
        { error: 'Business limit reached. You can only create up to 2 businesses.' },
        { status: 403 }
      )
    }

    // Check for duplicate (same name in same location and directory)
    const existingBusiness = await prisma.business.findUnique({
      where: {
        ownerId_name_locationId: {
          ownerId: userId,
          name,
          locationId,
        },
      },
    })

    if (existingBusiness) {
      return NextResponse.json(
        { error: 'You already have a business with this name in this location' },
        { status: 409 }
      )
    }

    // Verify location and directory exist
    const location = await prisma.location.findUnique({
      where: { id: locationId },
    })

    const directory = await prisma.directory.findUnique({
      where: { id: directoryId },
    })

    if (!location || !directory) {
      return NextResponse.json(
        { error: 'Invalid location or directory' },
        { status: 400 }
      )
    }

    // Generate SEO-friendly slug
    const slug = await generateUniqueSlug(name, address, locationId, directoryId)

    // Create business
    const business = await prisma.business.create({
      data: {
        name,
        slug,
        description,
        ownerId: userId,
        locationId,
        directoryId,
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
        status: 'PENDING',
        duplicateFlag: duplicateFlag || false,
        potentialDuplicates: potentialDuplicates || [],
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

    return NextResponse.json({ business }, { status: 201 })
  } catch (error) {
    console.error('Error creating business:', error)
    return NextResponse.json(
      { error: 'Failed to create business' },
      { status: 500 }
    )
  }
}
