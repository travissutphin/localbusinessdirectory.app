import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🗑️  Deleting old directories...')

  // Old directory slugs to delete
  const oldSlugs = [
    'plumbers',
    'electricians',
    'hvac-services',
    'landscaping',
    'cleaning-services',
    'pest-control',
    'roofing',
    'painting',
    'handyman-services',
    'home-security',
    'flooring',
    'moving-services',
    'pool-services',
    'window-services',
    'garage-door-services',
  ]

  // First, delete any businesses linked to these old directories
  console.log('📋 Finding old directories...')

  const oldDirectories = await prisma.directory.findMany({
    where: {
      slug: { in: oldSlugs }
    },
    select: { id: true, name: true, slug: true }
  })

  console.log(`Found ${oldDirectories.length} old directories to delete`)

  if (oldDirectories.length === 0) {
    console.log('✅ No old directories found. Already cleaned up!')
    return
  }

  const oldDirectoryIds = oldDirectories.map(d => d.id)

  // Delete businesses linked to old directories
  console.log('🗑️  Deleting businesses linked to old directories...')
  const deletedBusinesses = await prisma.business.deleteMany({
    where: {
      directoryId: { in: oldDirectoryIds }
    }
  })
  console.log(`   ✓ Deleted ${deletedBusinesses.count} businesses`)

  // Now delete the old directories
  console.log('🗑️  Deleting old directories...')
  const deletedDirectories = await prisma.directory.deleteMany({
    where: {
      slug: { in: oldSlugs }
    }
  })
  console.log(`   ✓ Deleted ${deletedDirectories.count} directories`)

  // Verify remaining directories
  const remainingDirectories = await prisma.directory.findMany({
    select: { name: true, slug: true, icon: true },
    orderBy: { displayOrder: 'asc' }
  })

  console.log(`\n✅ Cleanup complete! Remaining ${remainingDirectories.length} directories:`)
  remainingDirectories.forEach((d, i) => {
    console.log(`   ${i + 1}. ${d.name} (${d.icon})`)
  })
}

main()
  .catch((e) => {
    console.error('❌ Cleanup failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
