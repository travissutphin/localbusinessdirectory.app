import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function migrateZipCodes() {
  console.log('Starting ZIP code migration...')

  // Get all locations with legacy zipCode field
  const locations = await prisma.location.findMany({
    where: {
      zipCode: {
        not: null,
      },
    },
  })

  console.log(`Found ${locations.length} locations with ZIP codes to migrate`)

  for (const location of locations) {
    if (!location.zipCode) continue

    // Check if this ZIP already exists in the new table
    const existingZip = await prisma.zipCode.findUnique({
      where: { code: location.zipCode },
    })

    if (existingZip) {
      console.log(`ZIP ${location.zipCode} already exists, skipping`)
      continue
    }

    // Create new ZipCode entry
    await prisma.zipCode.create({
      data: {
        code: location.zipCode,
        locationId: location.id,
        city: location.name.split(',')[0]?.trim() || null,
        state: location.region || location.name.split(',')[1]?.trim() || null,
        isPrimary: true,
      },
    })

    console.log(`Migrated ZIP ${location.zipCode} for ${location.name}`)
  }

  console.log('ZIP code migration complete!')
}

migrateZipCodes()
  .catch((e) => {
    console.error('Migration failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
