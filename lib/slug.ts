import { prisma } from './db'

const MAX_SLUG_LENGTH = 50

export function generateSlugBase(name: string, address?: string): string {
  let slug = name
    .toLowerCase()
    .trim()
    .replace(/['']/g, '')
    .replace(/[&]/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  if (slug.length > MAX_SLUG_LENGTH) {
    slug = slug.substring(0, MAX_SLUG_LENGTH).replace(/-$/, '')
  }

  return slug
}

function extractStreetName(address: string): string {
  const streetMatch = address.match(/^\d+\s+(.+?)(?:,|$)/i)
  if (streetMatch && streetMatch[1]) {
    return streetMatch[1]
      .toLowerCase()
      .replace(/\b(st|street|ave|avenue|rd|road|blvd|boulevard|dr|drive|ln|lane|ct|court|way|pl|place)\b\.?$/i, '')
      .trim()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }
  return ''
}

export async function generateUniqueSlug(
  name: string,
  address: string,
  locationId: string,
  directoryId: string,
  excludeBusinessId?: string
): Promise<string> {
  const baseSlug = generateSlugBase(name)

  const existingWhere: any = {
    locationId,
    directoryId,
    slug: baseSlug,
  }

  if (excludeBusinessId) {
    existingWhere.id = { not: excludeBusinessId }
  }

  const existing = await prisma.business.findFirst({ where: existingWhere })

  if (!existing) {
    return baseSlug
  }

  const streetName = extractStreetName(address)
  if (streetName) {
    let slugWithStreet = `${baseSlug}-${streetName}`
    if (slugWithStreet.length > MAX_SLUG_LENGTH) {
      slugWithStreet = slugWithStreet.substring(0, MAX_SLUG_LENGTH).replace(/-$/, '')
    }

    const existingWithStreet = await prisma.business.findFirst({
      where: {
        locationId,
        directoryId,
        slug: slugWithStreet,
        ...(excludeBusinessId ? { id: { not: excludeBusinessId } } : {}),
      },
    })

    if (!existingWithStreet) {
      return slugWithStreet
    }
  }

  let counter = 2
  let candidateSlug = `${baseSlug}-${counter}`

  while (candidateSlug.length <= MAX_SLUG_LENGTH) {
    const existingNumbered = await prisma.business.findFirst({
      where: {
        locationId,
        directoryId,
        slug: candidateSlug,
        ...(excludeBusinessId ? { id: { not: excludeBusinessId } } : {}),
      },
    })

    if (!existingNumbered) {
      return candidateSlug
    }

    counter++
    candidateSlug = `${baseSlug}-${counter}`
  }

  return `${baseSlug.substring(0, MAX_SLUG_LENGTH - 4)}-${counter}`
}
