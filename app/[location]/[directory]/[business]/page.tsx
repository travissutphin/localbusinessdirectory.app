import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { MapPin, Phone, Mail, Globe, Clock, ArrowLeft, MessageSquare } from 'lucide-react'

type Business = {
  id: string
  name: string
  description: string | null
  address: string | null
  city: string | null
  state: string | null
  zipCode: string | null
  phone: string | null
  email: string | null
  website: string | null
  imageUrl: string | null
  hours: string | null
  status: string
  location: {
    name: string
    slug: string
  }
  directory: {
    name: string
    slug: string
  }
}

async function getBusinessData(businessId: string): Promise<Business | null> {
  try {
    const business = await prisma.business.findUnique({
      where: {
        id: businessId,
        status: 'APPROVED', // Only show approved businesses
      },
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
        phone: true,
        email: true,
        website: true,
        imageUrl: true,
        hours: true,
        status: true,
        location: {
          select: {
            name: true,
            slug: true,
          },
        },
        directory: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    })

    return business
  } catch (error) {
    console.error('Error fetching business:', error)
    return null
  }
}

export default async function BusinessDetailPage({
  params,
}: {
  params: { location: string; directory: string; business: string }
}) {
  const business = await getBusinessData(params.business)

  if (!business) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <nav className="text-sm text-slate-400 mb-4">
            <a href="/" className="hover:text-white">
              Home
            </a>
            {' / '}
            <a href={`/${business.location.slug}`} className="hover:text-white">
              {business.location.name}
            </a>
            {' / '}
            <a
              href={`/${business.location.slug}/${business.directory.slug}`}
              className="hover:text-white"
            >
              {business.directory.name}
            </a>
            {' / '}
            <span className="text-white">{business.name}</span>
          </nav>

          <a
            href={`/${business.location.slug}/${business.directory.slug}`}
            className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to {business.directory.name}
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg overflow-hidden">
          {/* Hero Image */}
          {business.imageUrl && (
            <div className="w-full h-64 sm:h-96 bg-slate-700">
              <img
                src={business.imageUrl}
                alt={business.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Business Info */}
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">
                {business.name}
              </h1>
              <p className="text-orange-400 text-sm font-medium">
                {business.directory.name} • {business.location.name}
              </p>
            </div>

            {/* Description */}
            {business.description && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-3">About</h2>
                <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                  {business.description}
                </p>
              </div>
            )}

            {/* Contact Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">
                Contact Information
              </h2>
              <div className="space-y-4">
                {business.address && (
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-400 mb-1">
                        Address
                      </p>
                      <p className="text-white">
                        {business.address}
                        <br />
                        {business.city && business.state
                          ? `${business.city}, ${business.state}`
                          : business.city || business.state}
                        {business.zipCode && ` ${business.zipCode}`}
                      </p>
                    </div>
                  </div>
                )}

                {business.phone && (
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-400 mb-1">
                        Phone
                      </p>
                      <a
                        href={`tel:${business.phone}`}
                        className="text-white hover:text-orange-400 transition-colors"
                      >
                        {business.phone}
                      </a>
                    </div>
                  </div>
                )}

                {business.email && (
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-400 mb-1">
                        Email
                      </p>
                      <a
                        href={`mailto:${business.email}`}
                        className="text-white hover:text-orange-400 transition-colors"
                      >
                        {business.email}
                      </a>
                    </div>
                  </div>
                )}

                {business.website && (
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-400 mb-1">
                        Website
                      </p>
                      <a
                        href={business.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-orange-400 transition-colors"
                      >
                        {business.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Business Hours */}
            {business.hours && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Business Hours
                </h2>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-white whitespace-pre-line leading-relaxed">
                      {business.hours}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Button (Phase 2 placeholder) */}
            <div className="pt-6 border-t border-slate-700">
              <button
                disabled
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg opacity-50 cursor-not-allowed flex items-center justify-center"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Contact Business (Coming Soon)
              </button>
              <p className="text-xs text-slate-400 mt-2">
                Direct messaging feature coming in Phase 2
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/80 backdrop-blur-sm border-t border-slate-700 mt-16">
        <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-slate-400">
            © 2025 Local Business Directory. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
