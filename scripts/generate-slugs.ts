import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const MAX_SLUG_LENGTH = 50

function generateSlugBase(name: string): string {
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

async function generateUniqueSlug(
  name: string,
  address: string,
  locationId: string,
  directoryId: string,
  excludeBusinessId: string
): Promise<string> {
  const baseSlug = generateSlugBase(name)

  const existing = await prisma.business.findFirst({
    where: {
      locationId,
      directoryId,
      slug: baseSlug,
      id: { not: excludeBusinessId },
    },
  })

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
        id: { not: excludeBusinessId },
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
        id: { not: excludeBusinessId },
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

async function main() {
  console.log('Starting slug generation for existing businesses...\n')

  const businesses = await prisma.business.findMany({
    where: {
      OR: [{ slug: null }, { slug: '' }],
    },
    select: {
      id: true,
      name: true,
      address: true,
      locationId: true,
      directoryId: true,
    },
  })

  console.log(`Found ${businesses.length} businesses without slugs.\n`)

  let updated = 0
  let failed = 0

  for (const business of businesses) {
    try {
      const slug = await generateUniqueSlug(
        business.name,
        business.address,
        business.locationId,
        business.directoryId,
        business.id
      )

      await prisma.business.update({
        where: { id: business.id },
        data: { slug },
      })

      console.log(`[OK] ${business.name} -> ${slug}`)
      updated++
    } catch (error) {
      console.error(`[FAIL] ${business.name}: ${error}`)
      failed++
    }
  }

  console.log(`\nComplete! Updated: ${updated}, Failed: ${failed}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
