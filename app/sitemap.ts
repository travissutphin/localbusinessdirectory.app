import { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://frontdoordirectory.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  // Static pages
  const staticPages = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/directories', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/code-of-conduct', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/register', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/login', priority: 0.5, changeFrequency: 'monthly' as const },
  ]

  for (const page of staticPages) {
    entries.push({
      url: `${BASE_URL}${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })
  }

  try {
    // Get all active locations
    const locations = await prisma.location.findMany({
      where: { isActive: true },
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    // Add location pages
    for (const location of locations) {
      entries.push({
        url: `${BASE_URL}/${location.slug}`,
        lastModified: location.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    }

    // Get all active directories with their locations
    const directories = await prisma.directory.findMany({
      where: { isActive: true },
      select: {
        slug: true,
        updatedAt: true,
        location: {
          select: {
            slug: true,
            isActive: true,
          },
        },
      },
    })

    // Add directory pages
    for (const directory of directories) {
      if (directory.location.isActive) {
        entries.push({
          url: `${BASE_URL}/${directory.location.slug}/${directory.slug}`,
          lastModified: directory.updatedAt,
          changeFrequency: 'weekly',
          priority: 0.7,
        })
      }
    }

    // Get all approved and active businesses
    const businesses = await prisma.business.findMany({
      where: {
        status: 'APPROVED',
        isActive: true,
      },
      select: {
        slug: true,
        id: true,
        updatedAt: true,
        location: {
          select: {
            slug: true,
            isActive: true,
          },
        },
        directory: {
          select: {
            slug: true,
            isActive: true,
          },
        },
      },
    })

    // Add business pages
    for (const business of businesses) {
      if (business.location.isActive && business.directory.isActive) {
        const businessSlug = business.slug || business.id
        entries.push({
          url: `${BASE_URL}/${business.location.slug}/${business.directory.slug}/${businessSlug}`,
          lastModified: business.updatedAt,
          changeFrequency: 'weekly',
          priority: 0.6,
        })
      }
    }
  } catch (error) {
    console.error('Error generating sitemap:', error)
  }

  return entries
}
