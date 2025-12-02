'use client'

import { useState, useEffect } from 'react'
import { MapPin, X, Navigation, ChevronDown } from 'lucide-react'
import Link from 'next/link'

type DetectedLocation = {
  id: string
  name: string
  slug: string
  zipCode: string
}

type AvailableLocation = {
  id: string
  name: string
  slug: string
}

type GeoData = {
  city: string
  region: string
  zip: string
}

const LOCATION_STORAGE_KEY = 'frontdoor_location_preference'
const LOCATION_DISMISSED_KEY = 'frontdoor_location_dismissed'

export default function LocationDetectionBanner() {
  const [loading, setLoading] = useState(true)
  const [detectedLocation, setDetectedLocation] = useState<DetectedLocation | null>(null)
  const [availableLocations, setAvailableLocations] = useState<AvailableLocation[]>([])
  const [geoData, setGeoData] = useState<GeoData | null>(null)
  const [dismissed, setDismissed] = useState(false)
  const [hasStoredPreference, setHasStoredPreference] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [noMatch, setNoMatch] = useState(false)

  useEffect(() => {
    checkAndDetectLocation()
  }, [])

  async function checkAndDetectLocation() {
    // Check if user already has a stored preference
    const storedPreference = localStorage.getItem(LOCATION_STORAGE_KEY)

    if (storedPreference) {
      setHasStoredPreference(true)
      setLoading(false)
      return
    }

    // Check if user dismissed banner (only applies to matched locations)
    const wasDismissed = localStorage.getItem(LOCATION_DISMISSED_KEY)

    // Detect location via API
    try {
      const response = await fetch('/api/geolocation/detect')
      const data = await response.json()

      if (data.detected && data.matched && data.location) {
        setDetectedLocation(data.location)
        setGeoData(data.geoData)
        // Only honor dismiss for matched locations
        if (wasDismissed) {
          setDismissed(true)
        }
      } else if (data.detected && !data.matched) {
        // Location detected but not in our directory
        setNoMatch(true)
        setGeoData(data.geoData)
        if (data.availableLocations) {
          setAvailableLocations(data.availableLocations)
        }
      } else if (data.availableLocations) {
        // Fallback case - show available locations
        setNoMatch(true)
        setAvailableLocations(data.availableLocations)
      }
    } catch (error) {
      console.error('Location detection failed:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleAccept(location?: DetectedLocation | AvailableLocation) {
    const loc = location || detectedLocation
    if (loc) {
      localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(loc))
      setHasStoredPreference(true)
    }
  }

  function handleDismiss() {
    localStorage.setItem(LOCATION_DISMISSED_KEY, 'true')
    setDismissed(true)
  }

  // Don't render anything if loading, dismissed, or has preference
  if (loading || dismissed || hasStoredPreference) {
    return null
  }

  // No detected location and no available locations
  if (!detectedLocation && !noMatch) {
    return null
  }

  // Location matched - show "We detected you're near X" banner
  if (detectedLocation) {
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
                onClick={() => handleAccept()}
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

  // No match but have available locations - show selection banner
  if (noMatch && availableLocations.length > 0) {
    return (
      <div className="bg-gradient-to-r from-secondary-600 to-secondary-700 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <p className="text-sm sm:text-base truncate">
                {geoData ? (
                  <>
                    <span className="hidden sm:inline">We don&apos;t have listings for {geoData.city} yet. </span>
                    <span className="sm:hidden">Not available in {geoData.city} </span>
                  </>
                ) : (
                  <span>Select your area to browse local businesses</span>
                )}
              </p>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-secondary-600 text-sm font-semibold rounded-lg hover:bg-secondary-50 transition-colors"
              >
                <MapPin className="w-4 h-4" />
                <span className="hidden sm:inline">Browse Available Areas</span>
                <span className="sm:hidden">Browse</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showDropdown && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-neutral-200 py-2 z-50">
                  {availableLocations.map((loc) => (
                    <Link
                      key={loc.id}
                      href={`/${loc.slug}`}
                      onClick={() => handleAccept(loc)}
                      className="flex items-center gap-3 px-4 py-2 text-neutral-700 hover:bg-neutral-100 transition-colors"
                    >
                      <MapPin className="w-4 h-4 text-secondary-500" />
                      <span>{loc.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
