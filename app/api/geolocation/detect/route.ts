import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

type GeoResponse = {
  ip: string
  city: string
  region: string
  region_code: string
  country: string
  country_code: string
  postal: string
  latitude: number
  longitude: number
  timezone: string
  error?: boolean
  reason?: string
}

export async function GET(request: NextRequest) {
  try {
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const clientIp = forwarded?.split(',')[0] || realIp || ''

    // Use ipapi.co - free HTTPS tier (1000 req/day)
    const geoUrl = clientIp
      ? `https://ipapi.co/${clientIp}/json/`
      : 'https://ipapi.co/json/'

    const response = await fetch(geoUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'frontdoor-directory/1.0',
      },
    })

    if (!response.ok) {
      throw new Error('IP geolocation API failed')
    }

    const data: GeoResponse = await response.json()

    if (data.error) {
      return NextResponse.json(
        { error: 'Geolocation detection failed', reason: data.reason },
        { status: 400 }
      )
    }

    // First, try to find exact ZIP match in new ZipCode table
    const zipCodeMatch = await prisma.zipCode.findUnique({
      where: { code: data.postal },
      include: {
        location: {
          select: {
            id: true,
            name: true,
            slug: true,
            isActive: true,
          },
        },
      },
    })

    if (zipCodeMatch && zipCodeMatch.location.isActive) {
      return NextResponse.json({
        detected: true,
        matched: true,
        matchType: 'exact_zip',
        location: {
          id: zipCodeMatch.location.id,
          name: zipCodeMatch.location.name,
          slug: zipCodeMatch.location.slug,
          zipCode: zipCodeMatch.code,
        },
        geoData: {
          city: data.city,
          region: data.region,
          zip: data.postal,
          lat: data.latitude,
          lon: data.longitude,
        },
      })
    }

    // Fallback: Check legacy zipCode field on Location (for backwards compatibility)
    const legacyMatch = await prisma.location.findFirst({
      where: {
        zipCode: data.postal,
        isActive: true,
      },
    })

    if (legacyMatch) {
      return NextResponse.json({
        detected: true,
        matched: true,
        matchType: 'legacy_zip',
        location: {
          id: legacyMatch.id,
          name: legacyMatch.name,
          slug: legacyMatch.slug,
          zipCode: legacyMatch.zipCode,
        },
        geoData: {
          city: data.city,
          region: data.region,
          zip: data.postal,
          lat: data.latitude,
          lon: data.longitude,
        },
      })
    }

    // Try to find nearby location by city name or region
    const nearbyByCity = await prisma.zipCode.findFirst({
      where: {
        city: { contains: data.city, mode: 'insensitive' },
        location: { isActive: true },
      },
      include: {
        location: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    })

    if (nearbyByCity) {
      return NextResponse.json({
        detected: true,
        matched: true,
        matchType: 'nearby_city',
        approximate: true,
        location: {
          id: nearbyByCity.location.id,
          name: nearbyByCity.location.name,
          slug: nearbyByCity.location.slug,
          zipCode: nearbyByCity.code,
        },
        geoData: {
          city: data.city,
          region: data.region,
          zip: data.postal,
          lat: data.latitude,
          lon: data.longitude,
        },
      })
    }

    // Try by state/region
    const nearbyByState = await prisma.zipCode.findFirst({
      where: {
        state: { contains: data.region, mode: 'insensitive' },
        location: { isActive: true },
      },
      include: {
        location: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    })

    if (nearbyByState) {
      return NextResponse.json({
        detected: true,
        matched: true,
        matchType: 'nearby_state',
        approximate: true,
        location: {
          id: nearbyByState.location.id,
          name: nearbyByState.location.name,
          slug: nearbyByState.location.slug,
          zipCode: nearbyByState.code,
        },
        geoData: {
          city: data.city,
          region: data.region,
          zip: data.postal,
          lat: data.latitude,
          lon: data.longitude,
        },
      })
    }

    // No location match found - return all available locations for manual selection
    const availableLocations = await prisma.location.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({
      detected: true,
      matched: false,
      geoData: {
        city: data.city,
        region: data.region,
        zip: data.postal,
        lat: data.latitude,
        lon: data.longitude,
      },
      availableLocations,
      message: 'Your location is not yet in our directory. Please select from available locations or check back soon!',
    })
  } catch (error) {
    console.error('Geolocation detection error:', error)

    // On error, return available locations for fallback
    try {
      const availableLocations = await prisma.location.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          slug: true,
        },
        orderBy: { name: 'asc' },
      })

      return NextResponse.json({
        detected: false,
        error: 'Failed to detect location',
        fallback: true,
        availableLocations,
      })
    } catch {
      return NextResponse.json(
        {
          detected: false,
          error: 'Failed to detect location',
          fallback: true,
        },
        { status: 500 }
      )
    }
  }
}
