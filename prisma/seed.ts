import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Seed Locations
  console.log('📍 Seeding locations...')

  const location = await prisma.location.upsert({
    where: { zipCode: '32080' },
    update: {},
    create: {
      name: 'Saint Augustine, FL',
      zipCode: '32080',
      slug: 'saint-augustine-fl',
      region: 'Northeast Florida',
      description: 'America\'s oldest city, known for historic charm and coastal beauty',
      isActive: true,
    },
  })

  console.log(`✅ Location created: ${location.name}`)

  // Seed Directories (Service Categories)
  console.log('📂 Seeding service directories...')

  const directories = [
    {
      name: 'Plumbers',
      slug: 'plumbers',
      description: 'Professional plumbing services for residential and commercial properties',
      icon: 'Wrench',
      displayOrder: 1,
    },
    {
      name: 'Electricians',
      slug: 'electricians',
      description: 'Licensed electrical contractors for installations, repairs, and maintenance',
      icon: 'Zap',
      displayOrder: 2,
    },
    {
      name: 'HVAC Services',
      slug: 'hvac-services',
      description: 'Heating, ventilation, and air conditioning experts',
      icon: 'Wind',
      displayOrder: 3,
    },
    {
      name: 'Landscaping',
      slug: 'landscaping',
      description: 'Lawn care, landscape design, and outdoor maintenance',
      icon: 'Trees',
      displayOrder: 4,
    },
    {
      name: 'Cleaning Services',
      slug: 'cleaning-services',
      description: 'Residential and commercial cleaning professionals',
      icon: 'Sparkles',
      displayOrder: 5,
    },
    {
      name: 'Pest Control',
      slug: 'pest-control',
      description: 'Pest management and extermination services',
      icon: 'Bug',
      displayOrder: 6,
    },
    {
      name: 'Roofing',
      slug: 'roofing',
      description: 'Roof installation, repair, and replacement specialists',
      icon: 'Home',
      displayOrder: 7,
    },
    {
      name: 'Painting',
      slug: 'painting',
      description: 'Interior and exterior painting contractors',
      icon: 'Paintbrush',
      displayOrder: 8,
    },
    {
      name: 'Handyman Services',
      slug: 'handyman-services',
      description: 'General home repair and maintenance services',
      icon: 'Hammer',
      displayOrder: 9,
    },
    {
      name: 'Home Security',
      slug: 'home-security',
      description: 'Security system installation and monitoring services',
      icon: 'Shield',
      displayOrder: 10,
    },
    {
      name: 'Flooring',
      slug: 'flooring',
      description: 'Flooring installation and refinishing services',
      icon: 'Layers',
      displayOrder: 11,
    },
    {
      name: 'Moving Services',
      slug: 'moving-services',
      description: 'Professional moving and storage companies',
      icon: 'Truck',
      displayOrder: 12,
    },
    {
      name: 'Pool Services',
      slug: 'pool-services',
      description: 'Pool cleaning, maintenance, and repair',
      icon: 'Droplets',
      displayOrder: 13,
    },
    {
      name: 'Window Services',
      slug: 'window-services',
      description: 'Window cleaning, repair, and installation',
      icon: 'Square',
      displayOrder: 14,
    },
    {
      name: 'Garage Door Services',
      slug: 'garage-door-services',
      description: 'Garage door installation, repair, and maintenance',
      icon: 'DoorOpen',
      displayOrder: 15,
    },
  ]

  let createdCount = 0
  for (const dir of directories) {
    const directory = await prisma.directory.upsert({
      where: {
        locationId_slug: {
          locationId: location.id,
          slug: dir.slug,
        },
      },
      update: {},
      create: {
        ...dir,
        locationId: location.id,
        isActive: true,
      },
    })
    createdCount++
    console.log(`  ✓ ${directory.name}`)
  }

  console.log(`✅ Created ${createdCount} service directories`)

  // Create Admin User (for testing)
  console.log('👤 Creating admin user...')

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@localbusinessdirectory.app' },
    update: {},
    create: {
      email: 'admin@localbusinessdirectory.app',
      name: 'Admin User',
      role: 'ADMIN',
      authProvider: 'email',
      emailVerified: new Date(),
      locationPreference: location.id,
    },
  })

  console.log(`✅ Admin user created: ${adminUser.email}`)
  console.log(`   (Use NextAuth to set password via registration)`)

  console.log('\n🎉 Database seed completed successfully!')
  console.log('\n📊 Summary:')
  console.log(`   - Locations: 1`)
  console.log(`   - Directories: ${createdCount}`)
  console.log(`   - Users: 1 (admin)`)
  console.log('\n🚀 Your database is ready!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
