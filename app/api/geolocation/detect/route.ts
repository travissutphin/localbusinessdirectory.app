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

    // Find closest location by zip code
    const location = await prisma.location.findFirst({
      where: {
        zipCode: data.zip,
        isActive: true,
      },
    })

    if (location) {
      // Exact zip match found
      return NextResponse.json({
        detected: true,
        matched: true,
        location: {
          id: location.id,
          name: location.name,
          slug: location.slug,
          zipCode: location.zipCode,
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

    // No exact match - try to find nearby location (same region/city)
    const nearbyLocation = await prisma.location.findFirst({
      where: {
        OR: [
          { name: { contains: data.city, mode: 'insensitive' } },
          { region: { contains: data.regionName, mode: 'insensitive' } },
        ],
        isActive: true,
      },
    })

    if (nearbyLocation) {
      return NextResponse.json({
        detected: true,
        matched: true,
        approximate: true,
        location: {
          id: nearbyLocation.id,
          name: nearbyLocation.name,
          slug: nearbyLocation.slug,
          zipCode: nearbyLocation.zipCode,
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

    // No location match found
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
      message: 'Location detected but not available in our directory. Please select manually.',
    })
  } catch (error) {
    console.error('Geolocation detection error:', error)
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
