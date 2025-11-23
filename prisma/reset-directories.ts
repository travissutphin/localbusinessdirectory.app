import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 RESET: Deleting ALL directories and recreating new ones...')
  console.log('=' .repeat(60))

  // Get the location
  const location = await prisma.location.findFirst({
    where: { slug: 'saint-augustine-fl' }
  })

  if (!location) {
    throw new Error('Location not found!')
  }

  console.log(`📍 Location: ${location.name} (${location.id})`)

  // Step 1: Count what we have
  const businessCount = await prisma.business.count()
  const directoryCount = await prisma.directory.count()

  console.log(`\n📊 Current state:`)
  console.log(`   - Businesses: ${businessCount}`)
  console.log(`   - Directories: ${directoryCount}`)

  // Step 2: Delete ALL businesses first (foreign key constraint)
  console.log(`\n🗑️  Step 1: Deleting ALL businesses...`)
  const deletedBusinesses = await prisma.business.deleteMany({})
  console.log(`   ✓ Deleted ${deletedBusinesses.count} businesses`)

  // Step 3: Delete ALL directories
  console.log(`\n🗑️  Step 2: Deleting ALL directories...`)
  const deletedDirectories = await prisma.directory.deleteMany({})
  console.log(`   ✓ Deleted ${deletedDirectories.count} directories`)

  // Step 4: Verify deletion
  const remainingDirs = await prisma.directory.count()
  const remainingBiz = await prisma.business.count()
  console.log(`\n✅ Verification: ${remainingDirs} directories, ${remainingBiz} businesses remaining`)

  if (remainingDirs > 0) {
    console.log('❌ ERROR: Directories still exist! Aborting.')
    return
  }

  // Step 5: Create new Home Business directories
  console.log(`\n📂 Step 3: Creating new Home Business directories...`)

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

  for (const dir of newDirectories) {
    const created = await prisma.directory.create({
      data: {
        ...dir,
        locationId: location.id,
        isActive: true,
      },
    })
    console.log(`   ✓ ${created.name} (${created.icon})`)
  }

  // Step 6: Final verification
  const finalCount = await prisma.directory.count()
  console.log(`\n` + '=' .repeat(60))
  console.log(`🎉 COMPLETE! Created ${finalCount} new directories.`)
  console.log(`\n📋 Final directory list:`)

  const allDirs = await prisma.directory.findMany({
    orderBy: { displayOrder: 'asc' },
    select: { name: true, icon: true, displayOrder: true }
  })

  allDirs.forEach(d => {
    console.log(`   ${d.displayOrder}. ${d.name} (${d.icon})`)
  })
}

main()
  .catch((e) => {
    console.error('❌ RESET FAILED:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
