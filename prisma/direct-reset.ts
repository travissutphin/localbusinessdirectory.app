import { PrismaClient } from '@prisma/client'

// Direct connection to Railway production database
const DATABASE_URL = ""

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL
    }
  }
})

async function main() {
  console.log('🔗 Connecting to Railway PostgreSQL...')
  console.log('=' .repeat(60))

  try {
    // Test connection
    await prisma.$connect()
    console.log('✅ Connected successfully!')

    // Step 1: Count current state
    console.log('\n📊 Current database state:')
    const bizCount = await prisma.business.count()
    const dirCount = await prisma.directory.count()
    console.log(`   - Businesses: ${bizCount}`)
    console.log(`   - Directories: ${dirCount}`)

    // Step 2: Show current directories
    console.log('\n📂 Current directories:')
    const currentDirs = await prisma.directory.findMany({
      orderBy: { displayOrder: 'asc' },
      select: { name: true, slug: true, icon: true }
    })
    currentDirs.forEach((d, i) => {
      console.log(`   ${i + 1}. ${d.name} (${d.slug}) - Icon: ${d.icon}`)
    })

    // Step 3: Delete ALL businesses
    console.log('\n🗑️  Deleting ALL businesses...')
    const deletedBiz = await prisma.business.deleteMany({})
    console.log(`   ✓ Deleted ${deletedBiz.count} businesses`)

    // Step 4: Delete ALL directories
    console.log('\n🗑️  Deleting ALL directories...')
    const deletedDirs = await prisma.directory.deleteMany({})
    console.log(`   ✓ Deleted ${deletedDirs.count} directories`)

    // Step 5: Verify deletion
    const verifyDirs = await prisma.directory.count()
    const verifyBiz = await prisma.business.count()
    console.log(`\n✅ Verification: ${verifyDirs} directories, ${verifyBiz} businesses remaining`)

    if (verifyDirs > 0) {
      console.log('❌ ERROR: Directories still exist!')
      throw new Error('Deletion failed')
    }

    // Step 6: Get location
    console.log('\n📍 Finding location...')
    const location = await prisma.location.findFirst({
      where: { slug: 'saint-augustine-fl' }
    })

    if (!location) {
      throw new Error('Location not found!')
    }
    console.log(`   ✓ Found: ${location.name} (${location.id})`)

    // Step 7: Create new directories
    console.log('\n📂 Creating 15 new Home Business directories...')

    const newDirectories = [
      { name: 'Creative & Design Services', slug: 'creative-design-services', description: 'Graphic design, web design, branding, photography, and creative professionals', icon: 'Palette', displayOrder: 1 },
      { name: 'Digital & Tech Services', slug: 'digital-tech-services', description: 'Web development, IT support, software solutions, and technology consulting', icon: 'Monitor', displayOrder: 2 },
      { name: 'Business & Professional Services', slug: 'business-professional-services', description: 'Consulting, coaching, virtual assistance, and professional services', icon: 'Briefcase', displayOrder: 3 },
      { name: 'Marketing & Communications', slug: 'marketing-communications', description: 'Social media management, copywriting, PR, and marketing consultants', icon: 'Megaphone', displayOrder: 4 },
      { name: 'Creative Arts & Crafts', slug: 'creative-arts-crafts', description: 'Handmade goods, artisans, custom crafts, and creative makers', icon: 'Scissors', displayOrder: 5 },
      { name: 'Health & Wellness', slug: 'health-wellness', description: 'Fitness coaching, nutrition consulting, yoga, and wellness services', icon: 'Heart', displayOrder: 6 },
      { name: 'Education & Tutoring', slug: 'education-tutoring', description: 'Online tutoring, course creators, educational consultants, and coaches', icon: 'GraduationCap', displayOrder: 7 },
      { name: 'Home & Lifestyle Services', slug: 'home-lifestyle-services', description: 'Interior design, organization, home staging, and lifestyle consulting', icon: 'Home', displayOrder: 8 },
      { name: 'Beauty & Personal Care', slug: 'beauty-personal-care', description: 'Makeup artists, stylists, skincare consultants, and beauty professionals', icon: 'Sparkles', displayOrder: 9 },
      { name: 'Food & Beverage', slug: 'food-beverage', description: 'Home bakers, caterers, meal prep services, and food entrepreneurs', icon: 'UtensilsCrossed', displayOrder: 10 },
      { name: 'Legal & Financial', slug: 'legal-financial', description: 'Bookkeeping, tax preparation, financial planning, and legal services', icon: 'Scale', displayOrder: 11 },
      { name: 'Real Estate & Property', slug: 'real-estate-property', description: 'Real estate agents, property management, and real estate services', icon: 'Building', displayOrder: 12 },
      { name: 'Children & Family Services', slug: 'children-family-services', description: 'Childcare, tutoring, family photography, and family-focused services', icon: 'Baby', displayOrder: 13 },
      { name: 'E-commerce & Retail', slug: 'ecommerce-retail', description: 'Online stores, dropshipping, handmade products, and retail businesses', icon: 'ShoppingBag', displayOrder: 14 },
      { name: 'Specialized Services', slug: 'specialized-services', description: 'Unique and specialized home-based business services', icon: 'Star', displayOrder: 15 },
    ]

    for (const dir of newDirectories) {
      const created = await prisma.directory.create({
        data: {
          ...dir,
          locationId: location.id,
          isActive: true,
        },
      })
      console.log(`   ✓ ${created.displayOrder}. ${created.name} (${created.icon})`)
    }

    // Step 8: Final verification
    console.log('\n' + '=' .repeat(60))
    console.log('🎉 RESET COMPLETE!')

    const finalDirs = await prisma.directory.findMany({
      orderBy: { displayOrder: 'asc' },
      select: { name: true, icon: true, displayOrder: true }
    })

    console.log(`\n✅ Final state: ${finalDirs.length} directories`)
    console.log('\n📋 New directories:')
    finalDirs.forEach(d => {
      console.log(`   ${d.displayOrder}. ${d.name} (${d.icon})`)
    })

  } catch (error) {
    console.error('\n❌ FAILED:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    console.log('\n🔌 Disconnected from database')
  })
