import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import {
  Wrench, Zap, Wind, Trees, Sparkles, Bug, Home,
  Paintbrush, Hammer, Shield, Layers, Truck, Droplets,
  Square, DoorOpen, LucideIcon
} from 'lucide-react'

// Icon mapping for directories
const iconMap: Record<string, LucideIcon> = {
  Wrench,
  Zap,
  Wind,
  Trees,
  Sparkles,
  Bug,
  Home,
  Paintbrush,
  Hammer,
  Shield,
  Layers,
  Truck,
  Droplets,
  Square,
  DoorOpen,
}

type Directory = {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  displayOrder: number | null
}

type LocationData = {
  id: string
  name: string
  slug: string
  zipCode: string
  region: string | null
  description: string | null
}

type PageData = {
  location: LocationData
  directories: Directory[]
  count: number
}

async function getLocationData(locationSlug: string): Promise<PageData | null> {
  try {
    // Find location by slug
    const location = await prisma.location.findUnique({
      where: {
        slug: locationSlug,
        isActive: true,
      },
    })

    if (!location) {
      return null
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

    return {
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
    }
  } catch (error) {
    console.error('Error fetching location data:', error)
    return null
  }
}

export default async function LocationPage({
  params,
}: {
  params: { location: string }
}) {
  const data = await getLocationData(params.location)

  if (!data) {
    notFound()
  }

  const { location, directories } = data

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                {location.name}
              </h1>
              {location.description && (
                <p className="mt-1 text-sm text-slate-300">
                  {location.description}
                </p>
              )}
              {location.region && (
                <p className="mt-1 text-xs text-slate-400">
                  {location.region} • ZIP: {location.zipCode}
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            Service Directories
          </h2>
          <p className="text-slate-300">
            Find local businesses and services in {location.name}
          </p>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {directories.map((directory) => {
            const IconComponent = directory.icon && iconMap[directory.icon] ? iconMap[directory.icon] : Home

            return (
              <a
                key={directory.id}
                href={`/${location.slug}/${directory.slug}`}
                className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:bg-slate-800/70 hover:border-orange-500/50 transition-all duration-200 hover:scale-105"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-orange-500/50 transition-shadow">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white group-hover:text-orange-400 transition-colors">
                      {directory.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-400 line-clamp-2">
                      {directory.description || 'Service directory'}
                    </p>
                  </div>
                </div>
              </a>
            )
          })}
        </div>

        {directories.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800 rounded-full mb-4">
              <Home className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No Directories Available
            </h3>
            <p className="text-slate-400">
              We&apos;re currently setting up service directories for this location.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/80 backdrop-blur-sm border-t border-slate-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-slate-400">
            © 2025 Local Business Directory. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
