import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

type IpApiResponse = {
  status: string
  country: string
  countryCode: string
  region: string
  regionName: string
  city: string
  zip: string
  lat: number
  lon: number
  timezone: string
  isp: string
  org: string
  as: string
  query: string
}

export async function GET(request: NextRequest) {
  try {
    // Get client IP from headers (Railway/Vercel provides this)
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const clientIp = forwarded?.split(',')[0] || realIp || 'check'

    // Call ip-api.com free tier (no API key required, 45 req/min limit)
    const ipApiUrl = `http://ip-api.com/json/${clientIp}?fields=status,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`

    const response = await fetch(ipApiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('IP geolocation API failed')
    }

    const data: IpApiResponse = await response.json()

    if (data.status !== 'success') {
      return NextResponse.json(
        { error: 'Geolocation detection failed', data },
        { status: 400 }
      )
    }

    // First, try to find exact ZIP match in new ZipCode table
    const zipCodeMatch = await prisma.zipCode.findUnique({
      where: { code: data.zip },
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
          region: data.regionName,
          zip: data.zip,
          lat: data.lat,
          lon: data.lon,
        },
      })
    }

    // Fallback: Check legacy zipCode field on Location (for backwards compatibility)
    const legacyMatch = await prisma.location.findFirst({
      where: {
        zipCode: data.zip,
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
          region: data.regionName,
          zip: data.zip,
          lat: data.lat,
          lon: data.lon,
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
          region: data.regionName,
          zip: data.zip,
          lat: data.lat,
          lon: data.lon,
        },
      })
    }

    // Try by state/region
    const nearbyByState = await prisma.zipCode.findFirst({
      where: {
        state: { contains: data.regionName, mode: 'insensitive' },
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
          region: data.regionName,
          zip: data.zip,
          lat: data.lat,
          lon: data.lon,
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
        region: data.regionName,
        zip: data.zip,
        lat: data.lat,
        lon: data.lon,
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
