import { notFound, redirect } from 'next/navigation'
import { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { MapPin, Phone, Mail, Globe, Clock, ArrowLeft, MessageSquare } from 'lucide-react'

type Business = {
  id: string
  slug: string | null
  name: string
  description: string
  address: string
  phone: string
  email: string
  website: string | null
  imageUrl: string | null
  hoursJson: any | null
  status: string
  facebookUrl: string | null
  instagramUrl: string | null
  linkedinUrl: string | null
  twitterUrl: string | null
  youtubeUrl: string | null
  googleBusinessUrl: string | null
  tiktokUrl: string | null
  location: {
    name: string
    slug: string
  }
  directory: {
    name: string
    slug: string
  }
}

function isUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(str)
}

async function getBusinessData(
  businessParam: string,
  locationSlug: string,
  directorySlug: string
): Promise<{ business: Business | null; shouldRedirect: boolean; redirectSlug: string | null }> {
  try {
    // First, get location and directory IDs
    const location = await prisma.location.findUnique({
      where: { slug: locationSlug },
      select: { id: true },
    })

    if (!location) {
      return { business: null, shouldRedirect: false, redirectSlug: null }
    }

    const directory = await prisma.directory.findFirst({
      where: { locationId: location.id, slug: directorySlug },
      select: { id: true },
    })

    if (!directory) {
      return { business: null, shouldRedirect: false, redirectSlug: null }
    }

    let business: Business | null = null

    // Try to find by slug first (preferred)
    if (!isUUID(businessParam)) {
      business = await prisma.business.findFirst({
        where: {
          slug: businessParam,
          locationId: location.id,
          directoryId: directory.id,
          status: 'APPROVED',
        },
        select: {
          id: true,
          slug: true,
          name: true,
          description: true,
          address: true,
          phone: true,
          email: true,
          website: true,
          imageUrl: true,
          hoursJson: true,
          status: true,
          facebookUrl: true,
          instagramUrl: true,
          linkedinUrl: true,
          twitterUrl: true,
          youtubeUrl: true,
          googleBusinessUrl: true,
          tiktokUrl: true,
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

      return { business, shouldRedirect: false, redirectSlug: null }
    }

    // If it's a UUID, find by ID and check if we should redirect to slug
    business = await prisma.business.findUnique({
      where: {
        id: businessParam,
        status: 'APPROVED',
      },
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        address: true,
        phone: true,
        email: true,
        website: true,
        imageUrl: true,
        hoursJson: true,
        status: true,
        facebookUrl: true,
        instagramUrl: true,
        linkedinUrl: true,
        twitterUrl: true,
        youtubeUrl: true,
        googleBusinessUrl: true,
        tiktokUrl: true,
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

    // If business has a slug, redirect to SEO-friendly URL
    if (business && business.slug) {
      return { business, shouldRedirect: true, redirectSlug: business.slug }
    }

    return { business, shouldRedirect: false, redirectSlug: null }
  } catch (error) {
    console.error('Error fetching business:', error)
    return { business: null, shouldRedirect: false, redirectSlug: null }
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://myhbb.app'

export async function generateMetadata({
  params,
}: {
  params: { location: string; directory: string; business: string }
}): Promise<Metadata> {
  const { business } = await getBusinessData(
    params.business,
    params.location,
    params.directory
  )

  if (!business) {
    return {
      title: 'Business Not Found | My Home Based Business',
      description: 'The business listing you are looking for could not be found.',
    }
  }

  const businessUrl = `${BASE_URL}/${business.location.slug}/${business.directory.slug}/${business.slug || params.business}`
  const truncatedDescription = business.description
    ? business.description.length > 155
      ? business.description.substring(0, 155) + '...'
      : business.description
    : `${business.name} - ${business.directory.name} in ${business.location.name}. Contact us for quality home-based business services.`

  return {
    title: `${business.name} | ${business.directory.name} in ${business.location.name}`,
    description: truncatedDescription,
    keywords: [
      business.name,
      business.directory.name,
      business.location.name,
      'home-based business',
      'local business',
      'small business',
    ].join(', '),
    alternates: {
      canonical: businessUrl,
    },
    openGraph: {
      title: `${business.name} | ${business.directory.name}`,
      description: truncatedDescription,
      url: businessUrl,
      siteName: 'My Home Based Business',
      type: 'website',
      locale: 'en_US',
      images: business.imageUrl
        ? [
            {
              url: business.imageUrl,
              width: 1200,
              height: 630,
              alt: business.name,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${business.name} | ${business.directory.name}`,
      description: truncatedDescription,
      images: business.imageUrl ? [business.imageUrl] : undefined,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

function generateLocalBusinessSchema(business: Business) {
  const businessUrl = `${BASE_URL}/${business.location.slug}/${business.directory.slug}/${business.slug}`

  const sameAs: string[] = []
  if (business.facebookUrl) sameAs.push(business.facebookUrl)
  if (business.instagramUrl) sameAs.push(business.instagramUrl)
  if (business.linkedinUrl) sameAs.push(business.linkedinUrl)
  if (business.twitterUrl) sameAs.push(business.twitterUrl)
  if (business.youtubeUrl) sameAs.push(business.youtubeUrl)
  if (business.tiktokUrl) sameAs.push(business.tiktokUrl)

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': businessUrl,
    name: business.name,
    description: business.description,
    url: businessUrl,
    telephone: business.phone,
    email: business.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address,
      addressLocality: business.location.name.split(',')[0]?.trim(),
      addressRegion: business.location.name.split(',')[1]?.trim() || '',
      addressCountry: 'US',
    },
  }

  if (business.imageUrl) {
    schema.image = business.imageUrl
  }

  if (business.website) {
    schema.sameAs = [business.website, ...sameAs]
  } else if (sameAs.length > 0) {
    schema.sameAs = sameAs
  }

  if (business.hoursJson) {
    const hoursText = typeof business.hoursJson === 'string'
      ? business.hoursJson
      : JSON.stringify(business.hoursJson)
    schema.openingHours = hoursText
  }

  return schema
}

function generateBreadcrumbSchema(business: Business) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: business.location.name,
        item: `${BASE_URL}/${business.location.slug}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: business.directory.name,
        item: `${BASE_URL}/${business.location.slug}/${business.directory.slug}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: business.name,
        item: `${BASE_URL}/${business.location.slug}/${business.directory.slug}/${business.slug}`,
      },
    ],
  }
}

export default async function BusinessDetailPage({
  params,
}: {
  params: { location: string; directory: string; business: string }
}) {
  const { business, shouldRedirect, redirectSlug } = await getBusinessData(
    params.business,
    params.location,
    params.directory
  )

  // 301 redirect from UUID to SEO-friendly slug URL
  if (shouldRedirect && redirectSlug) {
    redirect(`/${params.location}/${params.directory}/${redirectSlug}`)
  }

  if (!business) {
    notFound()
  }

  const localBusinessSchema = generateLocalBusinessSchema(business)
  const breadcrumbSchema = generateBreadcrumbSchema(business)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
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
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-400 mb-1">
                      Address
                    </p>
                    <p className="text-white whitespace-pre-line">
                      {business.address}
                    </p>
                  </div>
                </div>

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
            {business.hoursJson && (
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
                      {typeof business.hoursJson === 'string'
                        ? business.hoursJson
                        : JSON.stringify(business.hoursJson, null, 2)}
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
    </>
  )
}
