import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { MapPin, Phone, Mail, Globe, Clock } from 'lucide-react'

type Business = {
  id: string
  name: string
  description: string
  address: string
  phone: string
  email: string
  website: string | null
  imageUrl: string | null
  hoursJson: any | null
  status: string
}

type Directory = {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
}

type Location = {
  id: string
  name: string
  slug: string
  zipCode: string
}

type PageData = {
  location: Location
  directory: Directory
  businesses: Business[]
  total: number
}

async function getPageData(
  locationSlug: string,
  directorySlug: string,
  page: number = 1
): Promise<PageData | null> {
  try {
    // Find location
    const location = await prisma.location.findUnique({
      where: { slug: locationSlug, isActive: true },
      select: { id: true, name: true, slug: true, zipCode: true },
    })

    if (!location) return null

    // Find directory
    const directory = await prisma.directory.findUnique({
      where: {
        locationId_slug: {
          locationId: location.id,
          slug: directorySlug,
        },
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        icon: true,
      },
    })

    if (!directory) return null

    // Get businesses (only approved)
    const limit = 20
    const skip = (page - 1) * limit

    const [businesses, total] = await Promise.all([
      prisma.business.findMany({
        where: {
          locationId: location.id,
          directoryId: directory.id,
          status: 'APPROVED',
        },
        select: {
          id: true,
          name: true,
          description: true,
          address: true,
          phone: true,
          email: true,
          website: true,
          imageUrl: true,
          hoursJson: true,
          status: true,
        },
        orderBy: {
          name: 'asc',
        },
        skip,
        take: limit,
      }),
      prisma.business.count({
        where: {
          locationId: location.id,
          directoryId: directory.id,
          status: 'APPROVED',
        },
      }),
    ])

    return {
      location,
      directory,
      businesses,
      total,
    }
  } catch (error) {
    console.error('Error fetching page data:', error)
    return null
  }
}

export default async function DirectoryPage({
  params,
  searchParams,
}: {
  params: { location: string; directory: string }
  searchParams: { page?: string }
}) {
  const page = parseInt(searchParams.page || '1')
  const data = await getPageData(params.location, params.directory, page)

  if (!data) {
    notFound()
  }

  const { location, directory, businesses, total } = data
  const totalPages = Math.ceil(total / 20)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <nav className="text-sm text-slate-400 mb-2">
                <a href="/" className="hover:text-white">
                  Home
                </a>
                {' / '}
                <a href={`/${location.slug}`} className="hover:text-white">
                  {location.name}
                </a>
                {' / '}
                <span className="text-white">{directory.name}</span>
              </nav>
              <h1 className="text-3xl font-bold text-white">{directory.name}</h1>
              {directory.description && (
                <p className="mt-1 text-sm text-slate-300">{directory.description}</p>
              )}
              <p className="mt-1 text-xs text-slate-400">
                {total} {total === 1 ? 'business' : 'businesses'} in {location.name}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {businesses.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800 rounded-full mb-4">
              <MapPin className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No Businesses Yet
            </h3>
            <p className="text-slate-400">
              Be the first to add your business to this directory!
            </p>
          </div>
        )}

        {/* Business List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {businesses.map((business) => (
            <a
              key={business.id}
              href={`/${location.slug}/${directory.slug}/${business.id}`}
              className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg overflow-hidden hover:bg-slate-800/70 hover:border-orange-500/50 transition-all duration-200 hover:scale-[1.02]"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Image */}
                {business.imageUrl && (
                  <div className="sm:w-48 h-48 flex-shrink-0 bg-slate-700">
                    <img
                      src={business.imageUrl}
                      alt={business.name}
                      className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 p-6">
                  <h3 className="text-xl font-semibold text-white group-hover:text-orange-400 transition-colors mb-2">
                    {business.name}
                  </h3>

                  <p className="text-sm text-slate-300 mb-4 line-clamp-2">
                    {business.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-start text-sm text-slate-400">
                      <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-1">{business.address}</span>
                    </div>

                    <div className="flex items-center text-sm text-slate-400">
                      <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{business.phone}</span>
                    </div>

                    {business.hoursJson && (
                      <div className="flex items-start text-sm text-slate-400">
                        <Clock className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-1">
                          {typeof business.hoursJson === 'string'
                            ? business.hoursJson
                            : 'See details for hours'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <span className="text-sm font-medium text-orange-400 group-hover:text-orange-300">
                      View Details →
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center gap-2">
            {page > 1 && (
              <a
                href={`/${location.slug}/${directory.slug}?page=${page - 1}`}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                Previous
              </a>
            )}

            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pageNum = i + 1
                return (
                  <a
                    key={pageNum}
                    href={`/${location.slug}/${directory.slug}?page=${pageNum}`}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      page === pageNum
                        ? 'bg-orange-500 text-white'
                        : 'bg-slate-800 text-white hover:bg-slate-700'
                    }`}
                  >
                    {pageNum}
                  </a>
                )
              })}
            </div>

            {page < totalPages && (
              <a
                href={`/${location.slug}/${directory.slug}?page=${page + 1}`}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                Next
              </a>
            )}
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
