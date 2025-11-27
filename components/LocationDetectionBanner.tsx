'use client'

import { useState, useEffect } from 'react'
import { MapPin, X, Loader2, Navigation } from 'lucide-react'
import Link from 'next/link'

type DetectedLocation = {
  id: string
  name: string
  slug: string
  zipCode: string
}

type GeoData = {
  city: string
  region: string
  zip: string
}

const LOCATION_STORAGE_KEY = 'myhbb_location_preference'
const LOCATION_DISMISSED_KEY = 'myhbb_location_dismissed'

export default function LocationDetectionBanner() {
  const [loading, setLoading] = useState(true)
  const [detectedLocation, setDetectedLocation] = useState<DetectedLocation | null>(null)
  const [geoData, setGeoData] = useState<GeoData | null>(null)
  const [dismissed, setDismissed] = useState(false)
  const [hasStoredPreference, setHasStoredPreference] = useState(false)

  useEffect(() => {
    checkAndDetectLocation()
  }, [])

  async function checkAndDetectLocation() {
    // Check if user already has a stored preference or dismissed the banner
    const storedPreference = localStorage.getItem(LOCATION_STORAGE_KEY)
    const wasDismissed = localStorage.getItem(LOCATION_DISMISSED_KEY)

    if (storedPreference) {
      setHasStoredPreference(true)
      setLoading(false)
      return
    }

    if (wasDismissed) {
      setDismissed(true)
      setLoading(false)
      return
    }

    // Detect location via API
    try {
      const response = await fetch('/api/geolocation/detect')
      const data = await response.json()

      if (data.detected && data.matched && data.location) {
        setDetectedLocation(data.location)
        setGeoData(data.geoData)
      }
    } catch (error) {
      console.error('Location detection failed:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleAccept() {
    if (detectedLocation) {
      localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(detectedLocation))
      setHasStoredPreference(true)
    }
  }

  function handleDismiss() {
    localStorage.setItem(LOCATION_DISMISSED_KEY, 'true')
    setDismissed(true)
  }

  // Don't render anything if loading, dismissed, has preference, or no location detected
  if (loading || dismissed || hasStoredPreference || !detectedLocation) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Navigation className="w-4 h-4" />
            </div>
            <p className="text-sm sm:text-base truncate">
              <span className="hidden sm:inline">We detected you&apos;re near </span>
              <span className="sm:hidden">Near </span>
              <strong>{detectedLocation.name}</strong>
              {geoData && (
                <span className="hidden md:inline text-primary-200"> ({geoData.city}, {geoData.region})</span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              href={`/${detectedLocation.slug}`}
              onClick={handleAccept}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-primary-600 text-sm font-semibold rounded-lg hover:bg-primary-50 transition-colors"
            >
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">View Local Businesses</span>
              <span className="sm:hidden">View</span>
            </Link>

            <button
              onClick={handleDismiss}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
