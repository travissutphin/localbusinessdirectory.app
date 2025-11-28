import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Seed Locations
  console.log('📍 Seeding locations...')

  const location = await prisma.location.upsert({
    where: { slug: 'saint-augustine-fl' },
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

  // Home Business Directory Categories
  const directories = [
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

  // Hash password for admin user
  const adminPassword = await bcrypt.hash('admin123', 10)

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@localbusinessdirectory.app' },
    update: {
      passwordHash: adminPassword,
    },
    create: {
      email: 'admin@localbusinessdirectory.app',
      name: 'Admin User',
      role: 'ADMIN',
      authProvider: 'email',
      passwordHash: adminPassword,
      emailVerified: new Date(),
      locationPreference: location.id,
    },
  })

  console.log(`✅ Admin user created: ${adminUser.email}`)
  console.log(`   Password: admin123 (for testing only)`)

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
