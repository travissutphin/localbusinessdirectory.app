'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Search } from 'lucide-react'

interface Location {
  id: string
  name: string
  slug: string
  zipCode: string
}

export default function Home() {
  const router = useRouter()
  const [locations, setLocations] = useState<Location[]>([])
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    // Check for saved location preference
    const savedLocation = localStorage.getItem('selectedLocation')

    if (savedLocation) {
      // Redirect to saved location
      router.push(`/${savedLocation}`)
    } else {
      // Show location selector modal
      setShowModal(true)
      fetchLocations()
    }
  }, [router])

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/locations')
      if (response.ok) {
        const data = await response.json()
        setLocations(data.locations || [])
      }
    } catch (error) {
      console.error('Failed to fetch locations:', error)
      // Set default location for development
      setLocations([
        {
          id: '1',
          name: 'Saint Augustine, FL',
          slug: 'saint-augustine-fl',
          zipCode: '32080'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleLocationSelect = (slug: string) => {
    // Save to localStorage
    localStorage.setItem('selectedLocation', slug)

    // Redirect to location page
    router.push(`/${slug}`)
  }

  if (!showModal) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Location Selector Modal */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 md:p-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <MapPin className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">
            Welcome to Local Business Directory
          </h1>
          <p className="text-lg text-neutral-600">
            Select your location to discover local businesses and services
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-neutral-600">Loading locations...</p>
          </div>
        )}

        {/* Location Selection */}
        {!loading && locations.length > 0 && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Choose Your Location
            </label>

            <div className="grid gap-3 md:gap-4">
              {locations.map((location) => (
                <button
                  key={location.id}
                  onClick={() => handleLocationSelect(location.slug)}
                  className="group relative flex items-center gap-4 p-4 md:p-6 rounded-xl border-2 border-neutral-200 hover:border-primary hover:bg-primary/5 transition-all duration-200 text-left"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-primary transition-colors">
                      {location.name}
                    </h3>
                    <p className="text-sm text-neutral-600">
                      ZIP: {location.zipCode}
                    </p>
                  </div>

                  <div className="flex-shrink-0">
                    <Search className="w-5 h-5 text-neutral-400 group-hover:text-primary transition-colors" />
                  </div>
                </button>
              ))}
            </div>

            {/* Info Text */}
            <p className="text-center text-sm text-neutral-500 mt-6">
              Your location preference will be saved for future visits
            </p>
          </div>
        )}

        {/* No Locations State */}
        {!loading && locations.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 mb-4">
              <MapPin className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              No Locations Available
            </h3>
            <p className="text-neutral-600">
              We're currently setting up service areas. Please check back soon!
            </p>
          </div>
        )}
      </div>

      {/* Footer Note */}
      <p className="mt-8 text-sm text-neutral-500 text-center max-w-md">
        Find trusted local businesses, read reviews, and connect with services in your community
      </p>
    </main>
  )
}
