import { prisma } from '@/lib/db'
import { MapPin, Phone, Globe, ArrowRight, Building2, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = {
  title: 'Home Business Directory | Front Door Directory',
  description: 'Discover local home-based businesses in your area. Browse our directory of verified home businesses offering services near you.',
}

async function getRandomBusinesses() {
  const businesses = await prisma.business.findMany({
    where: {
      status: 'APPROVED'
    },
    include: {
      location: true,
      directory: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  // Shuffle the array for random order on each load
  for (let i = businesses.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [businesses[i], businesses[j]] = [businesses[j], businesses[i]]
  }

  return businesses.slice(0, 12) // Return up to 12 random businesses
}

export default async function HomePage() {
  const businesses = await getRandomBusinesses()

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Discover Local Home Businesses
          </h1>
          <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto mb-8">
            Find talented home-based businesses in your area. Fresh listings shown on every visit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/directories"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-white text-primary-600 rounded-lg hover:bg-neutral-100 transition-all shadow-lg"
            >
              <MapPin className="mr-2 w-5 h-5" />
              Browse by Location
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all shadow-lg"
            >
              List Your Business Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Random Businesses Section */}
      <section className="py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">
                Featured Home Businesses
              </h2>
              <p className="text-neutral-600 mt-1">
                Refresh the page for new listings
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm text-neutral-500">
              <RefreshCw className="w-4 h-4" />
              <span>Randomized on refresh</span>
            </div>
          </div>

          {businesses.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-neutral-100">
              <Building2 className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-neutral-700 mb-2">No Businesses Yet</h3>
              <p className="text-neutral-500 mb-6">Be the first to list your home business!</p>
              <Link
                href="/register"
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
              >
                List Your Business Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((business) => (
                <Link
                  key={business.id}
                  href={`/${business.location.slug}/${business.directory.slug}/${business.id}`}
                  className="group bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden hover:shadow-lg hover:border-primary-200 transition-all duration-300"
                >
                  {/* Business Image or Placeholder */}
                  {business.imageUrl ? (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={business.imageUrl}
                        alt={business.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <span className="absolute bottom-3 left-3 px-2 py-1 bg-orange-500 text-white text-xs font-semibold rounded">
                        {business.directory.name}
                      </span>
                    </div>
                  ) : (
                    <div className="relative h-48 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                      <Building2 className="w-16 h-16 text-primary-300" />
                      <span className="absolute bottom-3 left-3 px-2 py-1 bg-orange-500 text-white text-xs font-semibold rounded">
                        {business.directory.name}
                      </span>
                    </div>
                  )}

                  {/* Business Info */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-1">
                      {business.name}
                    </h3>
                    <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                      {business.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">
                          {business.city ? `${business.city}, ` : ''}{business.location.name}
                        </span>
                      </div>
                      {business.phone && (
                        <div className="flex items-center gap-2 text-sm text-neutral-500">
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          <span>{business.phone}</span>
                        </div>
                      )}
                      {business.website && (
                        <div className="flex items-center gap-2 text-sm text-neutral-500">
                          <Globe className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">Website Available</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* View All CTA */}
          {businesses.length > 0 && (
            <div className="text-center mt-12">
              <Link
                href="/directories"
                className="inline-flex items-center px-8 py-4 bg-neutral-900 text-white font-semibold rounded-lg hover:bg-neutral-800 transition-colors"
              >
                View All Directories
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Quick Info Section */}
      <section className="py-12 bg-neutral-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">100% Free</div>
              <p className="text-neutral-600">List your business at no cost</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">SEO Optimized</div>
              <p className="text-neutral-600">Get found by local customers</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">3 Minutes</div>
              <p className="text-neutral-600">Quick and easy setup</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Own a Home-Based Business?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Join our directory and get discovered by local customers today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-white text-orange-600 rounded-lg hover:bg-neutral-100 transition-all"
            >
              List Your Business Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold border-2 border-white text-white rounded-lg hover:bg-white/10 transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Spacer for Mobile Nav */}
      <div className="h-20 md:h-0"></div>
    </div>
  )
}
