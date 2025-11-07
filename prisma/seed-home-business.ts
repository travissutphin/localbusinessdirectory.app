import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🏠 Seeding home-based business directories...')

  // First, ensure we have a location
  let location = await prisma.location.findFirst({
    where: { slug: 'saint-augustine-fl' }
  })

  if (!location) {
    location = await prisma.location.create({
      data: {
        name: 'Saint Augustine, FL',
        slug: 'saint-augustine-fl',
        zipCode: '32080', // Primary zip code
        region: 'Northeast Florida',
        description: 'Historic coastal city in Northeast Florida',
        isActive: true,
      }
    })
    console.log('✅ Created Saint Augustine, FL location')
  }

  // Clear existing directories for this location
  await prisma.businessDirectory.deleteMany()
  await prisma.directory.deleteMany({
    where: { locationId: location.id }
  })

  // Home-based business directories with Lucide icons
  const directories = [
    {
      locationId: location.id,
      name: 'Creative & Design Services',
      slug: 'creative-design',
      description: 'Graphic design, web design, photography, content writing, illustration, video editing, UI/UX design, and interior decorating services',
      icon: 'Palette', // Palette for creative work
      isActive: true,
    },
    {
      locationId: location.id,
      name: 'Digital & Tech Services',
      slug: 'digital-tech',
      description: 'Software development, mobile apps, IT support, virtual assistants, data management, cybersecurity, tech tutoring, and SEO services',
      icon: 'Code2', // Code2 for tech/programming
      isActive: true,
    },
    {
      locationId: location.id,
      name: 'Business & Professional Services',
      slug: 'business-professional',
      description: 'Business consulting, bookkeeping, accounting, tax preparation, HR consulting, project management, and business coaching',
      icon: 'Briefcase', // Briefcase for professional services
      isActive: true,
    },
    {
      locationId: location.id,
      name: 'Marketing & Communications',
      slug: 'marketing-communications',
      description: 'Social media management, email marketing, PR services, podcast production, influencer marketing, and brand strategy',
      icon: 'Megaphone', // Megaphone for marketing/communications
      isActive: true,
    },
    {
      locationId: location.id,
      name: 'Creative Arts & Crafts',
      slug: 'creative-arts-crafts',
      description: 'Handmade jewelry, custom art, pottery, woodworking, candle making, soap products, knitting, and custom gift baskets',
      icon: 'Scissors', // Scissors - universal crafting tool, better represents handmade/DIY
      isActive: true,
    },
    {
      locationId: location.id,
      name: 'Health & Wellness',
      slug: 'health-wellness',
      description: 'Virtual fitness training, yoga instruction, nutrition coaching, life coaching, massage therapy, and holistic wellness consulting',
      icon: 'Heart', // Heart for health/wellness
      isActive: true,
    },
    {
      locationId: location.id,
      name: 'Education & Tutoring',
      slug: 'education-tutoring',
      description: 'Academic tutoring, test prep, music lessons, language instruction, STEM education, art classes, and online course creation',
      icon: 'GraduationCap', // GraduationCap for education
      isActive: true,
    },
    {
      locationId: location.id,
      name: 'Home & Lifestyle Services',
      slug: 'home-lifestyle',
      description: 'Home organizing, personal shopping, event planning, pet sitting, house sitting, meal prep, errands, and home staging',
      icon: 'Home', // Home for home services
      isActive: true,
    },
    {
      locationId: location.id,
      name: 'Beauty & Personal Care',
      slug: 'beauty-personal-care',
      description: 'Mobile hair styling, makeup artistry, nail services, skincare consulting, lash & brow services, and image consulting',
      icon: 'Sparkles', // Sparkles for beauty
      isActive: true,
    },
    {
      locationId: location.id,
      name: 'Food & Beverage',
      slug: 'food-beverage',
      description: 'Home bakery, catering, cake decorating, personal chef services, meal prep, specialty foods, and homemade condiments',
      icon: 'ChefHat', // ChefHat for food services
      isActive: true,
    },
    {
      locationId: location.id,
      name: 'Legal & Financial',
      slug: 'legal-financial',
      description: 'Paralegal services, notary public, financial planning, insurance consulting, estate planning, and investment advising',
      icon: 'Scale', // Scale for legal/financial
      isActive: true,
    },
    {
      locationId: location.id,
      name: 'Real Estate & Property',
      slug: 'real-estate-property',
      description: 'Real estate photography, virtual staging, property management, home inspection, appraisal services, and rental consulting',
      icon: 'Building2', // Building2 for real estate
      isActive: true,
    },
    {
      locationId: location.id,
      name: 'Children & Family Services',
      slug: 'children-family',
      description: 'Childcare, newborn care, doula services, party entertainment, kids activity planning, parent coaching, and family photography',
      icon: 'Baby', // Baby for children/family services
      isActive: true,
    },
    {
      locationId: location.id,
      name: 'E-commerce & Retail',
      slug: 'ecommerce-retail',
      description: 'Print-on-demand, dropshipping, handmade products, vintage sales, resale business, subscription boxes, and digital products',
      icon: 'Store', // Store - represents both online and retail business
      isActive: true,
    },
    {
      locationId: location.id,
      name: 'Specialized Services',
      slug: 'specialized-services',
      description: 'Translation, transcription, voice over work, proofreading, genealogy research, travel planning, and grant writing',
      icon: 'Star', // Star - represents premium/specialized expertise
      isActive: true,
    },
  ]

  // Create directories
  for (const directory of directories) {
    await prisma.directory.create({
      data: directory,
    })
  }

  console.log(`✅ Created ${directories.length} home-based business directories for ${location.name}`)

  // Optionally create an admin user if it doesn't exist
  const adminUser = await prisma.user.findUnique({
    where: { email: 'admin@localbusinessdirectory.app' }
  })

  if (!adminUser) {
    await prisma.user.create({
      data: {
        email: 'admin@localbusinessdirectory.app',
        name: 'Admin User',
        role: 'ADMIN',
        emailVerified: new Date(),
      }
    })
    console.log('✅ Created admin user')
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
    console.log('🎉 Seed completed successfully!')
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })