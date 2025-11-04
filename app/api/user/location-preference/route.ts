import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { locationId, setGeolocationFlag } = body

    if (!locationId) {
      return NextResponse.json(
        { error: 'Location ID is required' },
        { status: 400 }
      )
    }

    // Verify location exists
    const location = await prisma.location.findUnique({
      where: { id: locationId },
    })

    if (!location) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      )
    }

    // Update user's location preference and geolocation flag
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        locationPreference: locationId,
        geolocationFlag: setGeolocationFlag === true ? true : undefined,
      },
      include: {
        location: true,
      },
    })

    return NextResponse.json({
      message: 'Location preference updated successfully',
      user: {
        id: updatedUser.id,
        locationPreference: updatedUser.locationPreference,
        geolocationFlag: updatedUser.geolocationFlag,
        location: updatedUser.location,
      },
    })
  } catch (error) {
    console.error('Update location preference error:', error)
    return NextResponse.json(
      { error: 'Failed to update location preference' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        locationPreference: true,
        geolocationFlag: true,
        location: {
          select: {
            id: true,
            name: true,
            slug: true,
            zipCode: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      locationPreference: user.locationPreference,
      geolocationFlag: user.geolocationFlag,
      location: user.location,
    })
  } catch (error) {
    console.error('Get location preference error:', error)
    return NextResponse.json(
      { error: 'Failed to get location preference' },
      { status: 500 }
    )
  }
}
