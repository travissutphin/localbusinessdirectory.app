import { prisma } from '@/lib/db'
import { MapPin, Building2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Browse Local Directories | My Home Based Business',
  description: 'Find home-based businesses in your area. Browse our local business directories by location.',
}

export default async function DirectoriesPage() {
  const locations = await prisma.location.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: {
          directories: {
            where: {
              businesses: {
                some: {
                  status: 'APPROVED'
                }
              }
            }
          }
        }
      }
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary-100 px-4 py-2 rounded-full mb-6">
            <MapPin className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-semibold text-primary-700">Local Directories</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Find Home Businesses Near You
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Browse our directories by location to discover talented home-based businesses in your area.
          </p>
        </div>

        {locations.length === 0 ? (
          <div className="text-center py-16">
            <Building2 className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-neutral-700 mb-2">No Directories Yet</h2>
            <p className="text-neutral-500">Check back soon as we expand to new locations.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map((location) => (
              <Link
                key={location.id}
                href={`/${location.slug}`}
                className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-neutral-100 hover:border-primary-200"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-neutral-900 mb-1 group-hover:text-primary-600 transition-colors">
                      {location.name}
                    </h2>
                    <p className="text-sm text-neutral-500 mb-3">ZIP: {location.zipCode}</p>
                    <div className="flex items-center gap-2 text-primary-600 font-medium text-sm">
                      <span>View Directory</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 md:p-12 text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Own a Home-Based Business?
            </h2>
            <p className="text-primary-100 mb-6 max-w-xl mx-auto">
              Get discovered by local customers searching for services like yours. It&apos;s completely free.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-neutral-100 transition-colors"
            >
              List Your Business Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
