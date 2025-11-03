import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const locationSlug = searchParams.get('location')

    if (!locationSlug) {
      return NextResponse.json(
        { error: 'Location slug is required' },
        { status: 400 }
      )
    }

    // Find location by slug
    const location = await prisma.location.findUnique({
      where: {
        slug: locationSlug,
        isActive: true,
      },
    })

    if (!location) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      )
    }

    // Fetch directories for this location
    const directories = await prisma.directory.findMany({
      where: {
        locationId: location.id,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        icon: true,
        displayOrder: true,
      },
      orderBy: {
        displayOrder: 'asc',
      },
    })

    return NextResponse.json({
      location: {
        id: location.id,
        name: location.name,
        slug: location.slug,
        zipCode: location.zipCode,
        region: location.region,
        description: location.description,
      },
      directories,
      count: directories.length,
    })
  } catch (error) {
    console.error('Error fetching directories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch directories' },
      { status: 500 }
    )
  }
}
