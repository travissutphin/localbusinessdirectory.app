import { notFound, redirect } from 'next/navigation'
import { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { MapPin, Phone, Mail, Globe, Clock, ArrowLeft, ExternalLink } from 'lucide-react'
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react'
import dynamic from 'next/dynamic'

import ShareButton from '@/components/ShareButton'

const BusinessMap = dynamic(() => import('@/components/BusinessMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-slate-800 rounded-xl animate-pulse flex items-center justify-center">
      <MapPin className="w-8 h-8 text-slate-600" />
    </div>
  )
})

type Business = {
  id: string
  slug: string | null
  name: string
  description: string
  city: string | null
  zipCode: string | null
  address: string
  phone: string | null
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
          city: true,
          zipCode: true,
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
        city: true,
        zipCode: true,
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

    if (business && business.slug) {
      return { business, shouldRedirect: true, redirectSlug: business.slug }
    }

    return { business, shouldRedirect: false, redirectSlug: null }
  } catch (error) {
    console.error('Error fetching business:', error)
    return { business: null, shouldRedirect: false, redirectSlug: null }
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://frontdoordirectory.com'

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
      title: 'Business Not Found | Front Door Directory',
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
      siteName: 'Front Door Directory',
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

  const locationParts = business.location.name.split(',')
  const defaultCity = locationParts[0]?.trim() || ''
  const stateRegion = locationParts[1]?.trim() || ''

  const postalAddress: Record<string, string> = {
    '@type': 'PostalAddress',
    streetAddress: business.address,
    addressLocality: business.city || defaultCity,
    addressRegion: stateRegion,
    addressCountry: 'US',
  }

  if (business.zipCode) {
    postalAddress.postalCode = business.zipCode
  }

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': businessUrl,
    name: business.name,
    description: business.description,
    url: businessUrl,
    telephone: business.phone,
    email: business.email,
    address: postalAddress,
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

function hasAddress(business: Business): boolean {
  return !!business.address
}

function SocialLink({ href, icon: Icon, label, color }: { href: string; icon: any; label: string; color: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center justify-center w-10 h-10 rounded-full ${color} text-white hover:scale-110 transition-transform`}
      title={label}
    >
      <Icon className="w-5 h-5" />
    </a>
  )
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  )
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

  if (shouldRedirect && redirectSlug) {
    redirect(`/${params.location}/${params.directory}/${redirectSlug}`)
  }

  if (!business) {
    notFound()
  }

  const localBusinessSchema = generateLocalBusinessSchema(business)
  const breadcrumbSchema = generateBreadcrumbSchema(business)
  const showMap = hasAddress(business)

  const hasSocialMedia = business.facebookUrl || business.instagramUrl || business.linkedinUrl ||
    business.twitterUrl || business.youtubeUrl || business.tiktokUrl || business.googleBusinessUrl

  const fullAddress = [
    business.address,
    business.city,
    business.location.name,
    business.zipCode
  ].filter(Boolean).join(', ')

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
        {/* Breadcrumb Navigation */}
        <nav className="bg-slate-900/60 backdrop-blur-sm border-b border-slate-800">
          <div className="max-w-6xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-slate-400 overflow-x-auto whitespace-nowrap">
                <a href="/" className="hover:text-white transition-colors">Home</a>
                <span className="mx-2 text-slate-600">/</span>
                <a href={`/${business.location.slug}`} className="hover:text-white transition-colors">
                  {business.location.name}
                </a>
                <span className="mx-2 text-slate-600">/</span>
                <a href={`/${business.location.slug}/${business.directory.slug}`} className="hover:text-white transition-colors">
                  {business.directory.name}
                </a>
                <span className="mx-2 text-slate-600">/</span>
                <span className="text-orange-400 font-medium truncate max-w-[150px] sm:max-w-none">{business.name}</span>
              </div>
              <a
                href={`/${business.location.slug}/${business.directory.slug}`}
                className="hidden sm:inline-flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors ml-4"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </a>
            </div>
          </div>
        </nav>

        {/* Hero Image */}
        {business.imageUrl && (
          <div className="relative w-full h-72 sm:h-80 md:h-96 overflow-hidden">
            <img
              src={business.imageUrl}
              alt={business.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <div className="max-w-6xl mx-auto">
                <span className="inline-block px-3 py-1 bg-orange-500/90 text-white text-xs font-semibold rounded-full mb-3">
                  {business.directory.name}
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                  {business.name}
                </h1>
                <p className="text-slate-300 text-sm sm:text-base flex items-center">
                  <MapPin className="w-4 h-4 mr-1 text-orange-400" />
                  {business.location.name}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* No Image Header */}
        {!business.imageUrl && (
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700">
            <div className="max-w-6xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
              <span className="inline-block px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full mb-3">
                {business.directory.name}
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
                {business.name}
              </h1>
              <p className="text-slate-400 flex items-center">
                <MapPin className="w-4 h-4 mr-1 text-orange-400" />
                {business.location.name}
              </p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* About Section */}
              {business.description && (
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 sm:p-8">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <span className="w-1 h-6 bg-orange-500 rounded-full mr-3"></span>
                    About Us
                  </h2>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                    {business.description}
                  </p>
                </div>
              )}

              {/* Map Section */}
              {showMap && (
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 sm:p-8">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <span className="w-1 h-6 bg-orange-500 rounded-full mr-3"></span>
                    Location
                  </h2>
                  <BusinessMap
                    address={business.address}
                    city={business.city}
                    zipCode={business.zipCode}
                    locationName={business.location.name}
                    businessName={business.name}
                  />
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Open in Google Maps
                  </a>
                </div>
              )}

              {/* Business Hours */}
              {business.hoursJson && (
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 sm:p-8">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <span className="w-1 h-6 bg-orange-500 rounded-full mr-3"></span>
                    Business Hours
                  </h2>
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-slate-300 whitespace-pre-line leading-relaxed">
                        {typeof business.hoursJson === 'string'
                          ? business.hoursJson
                          : JSON.stringify(business.hoursJson, null, 2)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Contact Sidebar */}
            <div className="space-y-6">
              {/* Quick Contact Card */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 sticky top-6">
                <h2 className="text-lg font-semibold text-white mb-5 flex items-center">
                  <span className="w-1 h-5 bg-orange-500 rounded-full mr-3"></span>
                  Contact
                </h2>

                <div className="space-y-4">
                  {/* Address */}
                  <div className="flex items-start group">
                    <div className="w-10 h-10 bg-slate-700 group-hover:bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                      <MapPin className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
                    </div>
                    <div className="ml-3">
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Address</p>
                      <p className="text-white text-sm">
                        {business.address}
                        {(business.city || business.zipCode) && (
                          <>
                            <br />
                            {business.city}{business.city && business.zipCode && ', '}{business.zipCode}
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <a href={`tel:${business.phone}`} className="flex items-start group">
                    <div className="w-10 h-10 bg-slate-700 group-hover:bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                      <Phone className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
                    </div>
                    <div className="ml-3">
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Phone</p>
                      <p className="text-white text-sm group-hover:text-orange-400 transition-colors">
                        {business.phone}
                      </p>
                    </div>
                  </a>

                  {/* Email */}
                  <a href={`mailto:${business.email}`} className="flex items-start group">
                    <div className="w-10 h-10 bg-slate-700 group-hover:bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                      <Mail className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
                    </div>
                    <div className="ml-3">
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Email</p>
                      <p className="text-white text-sm group-hover:text-orange-400 transition-colors break-all">
                        {business.email}
                      </p>
                    </div>
                  </a>

                  {/* Website */}
                  {business.website && (
                    <a href={business.website} target="_blank" rel="noopener noreferrer" className="flex items-start group">
                      <div className="w-10 h-10 bg-slate-700 group-hover:bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                        <Globe className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
                      </div>
                      <div className="ml-3">
                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Website</p>
                        <p className="text-white text-sm group-hover:text-orange-400 transition-colors break-all">
                          {business.website.replace(/^https?:\/\//, '')}
                        </p>
                      </div>
                    </a>
                  )}
                </div>

                {/* CTA Button */}
                <div className="mt-6 pt-6 border-t border-slate-700">
                  <a
                    href={`tel:${business.phone}`}
                    className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Call Now
                  </a>
                </div>

                {/* Social Media Links */}
                {hasSocialMedia && (
                  <div className="mt-6 pt-6 border-t border-slate-700">
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-4 text-center">Connect With Us</p>
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                      {business.facebookUrl && (
                        <SocialLink href={business.facebookUrl} icon={Facebook} label="Facebook" color="bg-blue-600 hover:bg-blue-700" />
                      )}
                      {business.instagramUrl && (
                        <SocialLink href={business.instagramUrl} icon={Instagram} label="Instagram" color="bg-gradient-to-br from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600" />
                      )}
                      {business.linkedinUrl && (
                        <SocialLink href={business.linkedinUrl} icon={Linkedin} label="LinkedIn" color="bg-blue-700 hover:bg-blue-800" />
                      )}
                      {business.twitterUrl && (
                        <SocialLink href={business.twitterUrl} icon={Twitter} label="Twitter" color="bg-sky-500 hover:bg-sky-600" />
                      )}
                      {business.youtubeUrl && (
                        <SocialLink href={business.youtubeUrl} icon={Youtube} label="YouTube" color="bg-red-600 hover:bg-red-700" />
                      )}
                      {business.tiktokUrl && (
                        <a
                          href={business.tiktokUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-white hover:scale-110 transition-transform"
                          title="TikTok"
                        >
                          <TikTokIcon className="w-5 h-5" />
                        </a>
                      )}
                      {business.googleBusinessUrl && (
                        <a
                          href={business.googleBusinessUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white hover:scale-110 transition-transform"
                          title="Google Business"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Share Button */}
                <div className="mt-6 pt-6 border-t border-slate-700">
                  <ShareButton businessName={business.name} />
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Mobile Back Button */}
        <div className="sm:hidden fixed bottom-6 left-6 z-50">
          <a
            href={`/${business.location.slug}/${business.directory.slug}`}
            className="flex items-center justify-center w-12 h-12 bg-slate-800 border border-slate-700 rounded-full shadow-lg hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </a>
        </div>

        {/* Footer */}
        <footer className="bg-slate-900/80 backdrop-blur-sm border-t border-slate-800 mt-16">
          <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-slate-500">
              © 2025 Front Door Directory. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}
