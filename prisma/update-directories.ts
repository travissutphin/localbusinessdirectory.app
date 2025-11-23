import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Updating directories to new Home Business categories...')

  // Get the location
  const location = await prisma.location.findFirst({
    where: { slug: 'saint-augustine-fl' }
  })

  if (!location) {
    throw new Error('Location not found. Please run the initial seed first.')
  }

  console.log(`📍 Found location: ${location.name}`)

  // Delete existing directories (this will fail if businesses are linked)
  console.log('🗑️  Removing existing directories...')

  // Check for linked businesses first
  const linkedBusinesses = await prisma.business.count({
    where: { locationId: location.id }
  })

  if (linkedBusinesses > 0) {
    console.log(`⚠️  Found ${linkedBusinesses} businesses linked to directories.`)
    console.log('   Deleting businesses first...')
    await prisma.business.deleteMany({
      where: { locationId: location.id }
    })
    console.log('   ✓ Businesses deleted')
  }

  await prisma.directory.deleteMany({
    where: { locationId: location.id }
  })
  console.log('   ✓ Existing directories removed')

  // New Home Business Directory categories with appropriate Lucide icons
  const newDirectories = [
    {
      name: 'Creative & Design Services',
      slug: 'creative-design-services',
      description: 'Graphic design, web design, branding, photography, and creative professionals',
      icon: 'Palette',
      displayOrder: 1,
    },
    {
      name: 'Digital & Tech Services',
      slug: 'digital-tech-services',
      description: 'Web development, IT support, software solutions, and technology consulting',
      icon: 'Monitor',
      displayOrder: 2,
    },
    {
      name: 'Business & Professional Services',
      slug: 'business-professional-services',
      description: 'Consulting, coaching, virtual assistance, and professional services',
      icon: 'Briefcase',
      displayOrder: 3,
    },
    {
      name: 'Marketing & Communications',
      slug: 'marketing-communications',
      description: 'Social media management, copywriting, PR, and marketing consultants',
      icon: 'Megaphone',
      displayOrder: 4,
    },
    {
      name: 'Creative Arts & Crafts',
      slug: 'creative-arts-crafts',
      description: 'Handmade goods, artisans, custom crafts, and creative makers',
      icon: 'Scissors',
      displayOrder: 5,
    },
    {
      name: 'Health & Wellness',
      slug: 'health-wellness',
      description: 'Fitness coaching, nutrition consulting, yoga, and wellness services',
      icon: 'Heart',
      displayOrder: 6,
    },
    {
      name: 'Education & Tutoring',
      slug: 'education-tutoring',
      description: 'Online tutoring, course creators, educational consultants, and coaches',
      icon: 'GraduationCap',
      displayOrder: 7,
    },
    {
      name: 'Home & Lifestyle Services',
      slug: 'home-lifestyle-services',
      description: 'Interior design, organization, home staging, and lifestyle consulting',
      icon: 'Home',
      displayOrder: 8,
    },
    {
      name: 'Beauty & Personal Care',
      slug: 'beauty-personal-care',
      description: 'Makeup artists, stylists, skincare consultants, and beauty professionals',
      icon: 'Sparkles',
      displayOrder: 9,
    },
    {
      name: 'Food & Beverage',
      slug: 'food-beverage',
      description: 'Home bakers, caterers, meal prep services, and food entrepreneurs',
      icon: 'UtensilsCrossed',
      displayOrder: 10,
    },
    {
      name: 'Legal & Financial',
      slug: 'legal-financial',
      description: 'Bookkeeping, tax preparation, financial planning, and legal services',
      icon: 'Scale',
      displayOrder: 11,
    },
    {
      name: 'Real Estate & Property',
      slug: 'real-estate-property',
      description: 'Real estate agents, property management, and real estate services',
      icon: 'Building',
      displayOrder: 12,
    },
    {
      name: 'Children & Family Services',
      slug: 'children-family-services',
      description: 'Childcare, tutoring, family photography, and family-focused services',
      icon: 'Baby',
      displayOrder: 13,
    },
    {
      name: 'E-commerce & Retail',
      slug: 'ecommerce-retail',
      description: 'Online stores, dropshipping, handmade products, and retail businesses',
      icon: 'ShoppingBag',
      displayOrder: 14,
    },
    {
      name: 'Specialized Services',
      slug: 'specialized-services',
      description: 'Unique and specialized home-based business services',
      icon: 'Star',
      displayOrder: 15,
    },
  ]

  console.log('📂 Creating new directories...')

  let createdCount = 0
  for (const dir of newDirectories) {
    const directory = await prisma.directory.create({
      data: {
        ...dir,
        locationId: location.id,
        isActive: true,
      },
    })
    createdCount++
    console.log(`  ✓ ${directory.name} (${directory.icon})`)
  }

  console.log(`\n✅ Created ${createdCount} new directories`)
  console.log('\n🎉 Directory update completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Update failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
