import { PrismaClient, ContentStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@indexorbit.com' },
    update: {},
    create: {
      email: 'admin@indexorbit.com',
      name: 'Admin User',
      passwordHash: adminPassword,
      role: 'SUPER_ADMIN',
      emailVerified: new Date(),
    },
  });
  console.log('✅ Created admin user');

  // Create business types
  const businessTypes = await Promise.all([
    prisma.businessType.upsert({ where: { slug: 'food-dining' }, update: {}, create: { name: 'Food & Dining', slug: 'food-dining', description: 'Restaurants, cafes, and food establishments', icon: 'utensils', color: '#FF6B6B', order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.businessType.upsert({ where: { slug: 'accommodation-hospitality' }, update: {}, create: { name: 'Accommodation & Hospitality', slug: 'accommodation-hospitality', description: 'Hotels, motels, and lodging', icon: 'home', color: '#4ECDC4', order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.businessType.upsert({ where: { slug: 'retail-shopping' }, update: {}, create: { name: 'Retail & Shopping', slug: 'retail-shopping', description: 'Retail stores and shops', icon: 'shopping-bag', color: '#96CEB4', order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.businessType.upsert({ where: { slug: 'home-property-services' }, update: {}, create: { name: 'Home & Property Services', slug: 'home-property-services', description: 'Home services and maintenance', icon: 'wrench', color: '#45B7D1', order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.businessType.upsert({ where: { slug: 'construction-contractors' }, update: {}, create: { name: 'Construction & Contractors', slug: 'construction-contractors', description: 'Construction companies and contractors', icon: 'hard-hat', color: '#F39C12', order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.businessType.upsert({ where: { slug: 'real-estate-property' }, update: {}, create: { name: 'Real Estate & Property', slug: 'real-estate-property', description: 'Real estate agents and agencies', icon: 'building', color: '#E67E22', order: 6, status: ContentStatus.PUBLISHED } }),
    prisma.businessType.upsert({ where: { slug: 'automotive' }, update: {}, create: { name: 'Automotive', slug: 'automotive', description: 'Car dealers, repairs, and services', icon: 'car', color: '#3498DB', order: 7, status: ContentStatus.PUBLISHED } }),
    prisma.businessType.upsert({ where: { slug: 'transportation-logistics' }, update: {}, create: { name: 'Transportation & Logistics', slug: 'transportation-logistics', description: 'Transportation and logistics services', icon: 'truck', color: '#9B59B6', order: 8, status: ContentStatus.PUBLISHED } }),
    prisma.businessType.upsert({ where: { slug: 'car-rental-transport' }, update: {}, create: { name: 'Car Rental & Transport Services', slug: 'car-rental-transport', description: 'Car rental and transport services', icon: 'car-front', color: '#1ABC9C', order: 9, status: ContentStatus.PUBLISHED } }),
    prisma.businessType.upsert({ where: { slug: 'travel-tourism' }, update: {}, create: { name: 'Travel & Tourism', slug: 'travel-tourism', description: 'Travel agencies and tourism', icon: 'plane', color: '#00BCD4', order: 10, status: ContentStatus.PUBLISHED } }),
    prisma.businessType.upsert({ where: { slug: 'health-medical' }, update: {}, create: { name: 'Health & Medical', slug: 'health-medical', description: 'Medical and health services', icon: 'stethoscope', color: '#E74C3C', order: 11, status: ContentStatus.PUBLISHED } }),
    prisma.businessType.upsert({ where: { slug: 'dental-oral-health' }, update: {}, create: { name: 'Dental & Oral Health', slug: 'dental-oral-health', description: 'Dental services and oral health', icon: 'smile', color: '#E91E63', order: 12, status: ContentStatus.PUBLISHED } }),
    prisma.businessType.upsert({ where: { slug: 'pharmacy-medical-retail' }, update: {}, create: { name: 'Pharmacy & Medical Retail', slug: 'pharmacy-medical-retail', description: 'Pharmacies and medical supply stores', icon: 'pill', color: '#8B4513', order: 13, status: ContentStatus.PUBLISHED } }),
    prisma.businessType.upsert({ where: { slug: 'beauty-personal-care' }, update: {}, create: { name: 'Beauty & Personal Care', slug: 'beauty-personal-care', description: 'Beauty salons and personal care', icon: 'heart', color: '#DDA0DD', order: 14, status: ContentStatus.PUBLISHED } }),
    prisma.businessType.upsert({ where: { slug: 'fitness-wellness' }, update: {}, create: { name: 'Fitness & Wellness', slug: 'fitness-wellness', description: 'Gyms, fitness centers, and wellness', icon: 'dumbbell', color: '#E91E63', order: 15, status: ContentStatus.PUBLISHED } }),
    prisma.businessType.upsert({ where: { slug: 'pets-animals' }, update: {}, create: { name: 'Pets & Animals', slug: 'pets-animals', description: 'Pet stores, vets, and pet services', icon: 'paw-print', color: '#8B4513', order: 16, status: ContentStatus.PUBLISHED } }),
    prisma.businessType.upsert({ where: { slug: 'professional-services' }, update: {}, create: { name: 'Professional Services', slug: 'professional-services', description: 'Professional business services', icon: 'briefcase', color: '#607D8B', order: 17, status: ContentStatus.PUBLISHED } }),
    prisma.businessType.upsert({ where: { slug: 'legal-services' }, update: {}, create: { name: 'Legal Services', slug: 'legal-services', description: 'Lawyers and legal services', icon: 'scale', color: '#2C3E50', order: 18, status: ContentStatus.PUBLISHED } }),
    prisma.businessType.upsert({ where: { slug: 'accounting-tax-services' }, update: {}, create: { name: 'Accounting & Tax Services', slug: 'accounting-tax-services', description: 'Accountants and tax services', icon: 'calculator', color: '#27AE60', order: 19, status: ContentStatus.PUBLISHED } }),
    prisma.businessType.upsert({ where: { slug: 'financial-services' }, update: {}, create: { name: 'Financial Services', slug: 'financial-services', description: 'Banks and financial institutions', icon: 'dollar-sign', color: '#2ECC71', order: 20, status: ContentStatus.PUBLISHED } }),
    prisma.businessType.upsert({ where: { slug: 'insurance-services' }, update: {}, create: { name: 'Insurance Services', slug: 'insurance-services', description: 'Insurance companies and agents', icon: 'shield', color: '#34495E', order: 21, status: ContentStatus.PUBLISHED } }),
    prisma.businessType.upsert({ where: { slug: 'business-services' }, update: {}, create: { name: 'Business Services', slug: 'business-services', description: 'General business services', icon: 'building-2', color: '#7F8C8D', order: 22, status: ContentStatus.PUBLISHED } }),
    prisma.businessType.upsert({ where: { slug: 'recruitment-employment' }, update: {}, create: { name: 'Recruitment & Employment', slug: 'recruitment-employment', description: 'Staffing and recruitment agencies', icon: 'users', color: '#16A085', order: 23, status: ContentStatus.PUBLISHED } }),
    prisma.businessType.upsert({ where: { slug: 'marketing-advertising' }, update: {}, create: { name: 'Marketing & Advertising', slug: 'marketing-advertising', description: 'Marketing and advertising agencies', icon: 'megaphone', color: '#F1C40F', order: 24, status: ContentStatus.PUBLISHED } }),
    prisma.businessType.upsert({ where: { slug: 'technology-it' }, update: {}, create: { name: 'Technology & IT', slug: 'technology-it', description: 'IT services and technology', icon: 'laptop', color: '#673AB7', order: 25, status: ContentStatus.PUBLISHED } }),
    prisma.businessType.upsert({ where: { slug: 'telecommunications' }, update: {}, create: { name: 'Telecommunications', slug: 'telecommunications', description: 'Telecom services and providers', icon: 'signal', color: '#3498DB', order: 26, status: ContentStatus.PUBLISHED } }),
    prisma.businessType.upsert({ where: { slug: 'education-training' }, update: {}, create: { name: 'Education & Training', slug: 'education-training', description: 'Schools, tutoring, and training', icon: 'book', color: '#1ABC9C', order: 27, status: ContentStatus.PUBLISHED } }),
    prisma.businessType.upsert({ where: { slug: 'childcare-family-services' }, update: {}, create: { name: 'Childcare & Family Services', slug: 'childcare-family-services', description: 'Childcare and family services', icon: 'baby', color: '#FF69B4', order: 28, status: ContentStatus.PUBLISHED } }),
    prisma.businessType.upsert({ where: { slug: 'senior-home-care' }, update: {}, create: { name: 'Senior & Home Care', slug: 'senior-home-care', description: 'Senior care and home healthcare', icon: 'heart-handshake', color: '#9C27B0', order: 29, status: ContentStatus.PUBLISHED } }),
  ]);
  console.log('✅ Created business types');

  // Helper function to batch upserts
  async function batchUpserts(operations: any[], batchSize = 10) {
    for (let i = 0; i < operations.length; i += batchSize) {
      const batch = operations.slice(i, i + batchSize);
      await Promise.all(batch);
      console.log(`   Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(operations.length / batchSize)}`);
    }
  }

  // Create locations
  const us = await prisma.location.upsert({
    where: { slug_parentId: { slug: 'usa', parentId: null } },
    update: {},
    create: { name: 'United States', slug: 'usa', type: 'COUNTRY', parentId: null },
  });
  console.log('✅ Created locations');

  const states = await Promise.all([
    prisma.location.upsert({ where: { slug_parentId: { slug: 'new-york', parentId: us.id } }, update: {}, create: { name: 'New York', slug: 'new-york', type: 'STATE', parentId: us.id, latitude: 40.7128, longitude: -74.006 } }),
    prisma.location.upsert({ where: { slug_parentId: { slug: 'texas', parentId: us.id } }, update: {}, create: { name: 'Texas', slug: 'texas', type: 'STATE', parentId: us.id } }),
    prisma.location.upsert({ where: { slug_parentId: { slug: 'california', parentId: us.id } }, update: {}, create: { name: 'California', slug: 'california', type: 'STATE', parentId: us.id } }),
    prisma.location.upsert({ where: { slug_parentId: { slug: 'florida', parentId: us.id } }, update: {}, create: { name: 'Florida', slug: 'florida', type: 'STATE', parentId: us.id } }),
    prisma.location.upsert({ where: { slug_parentId: { slug: 'illinois', parentId: us.id } }, update: {}, create: { name: 'Illinois', slug: 'illinois', type: 'STATE', parentId: us.id } }),
    prisma.location.upsert({ where: { slug_parentId: { slug: 'washington', parentId: us.id } }, update: {}, create: { name: 'Washington', slug: 'washington', type: 'STATE', parentId: us.id } }),
  ]);

  const newYork = states.find(s => s.slug === 'new-york')!;
  const texas = states.find(s => s.slug === 'texas')!;
  const california = states.find(s => s.slug === 'california')!;
  const florida = states.find(s => s.slug === 'florida')!;
  const illinois = states.find(s => s.slug === 'illinois')!;
  const washington = states.find(s => s.slug === 'washington')!;

  const cities = await Promise.all([
    prisma.location.upsert({ where: { slug_parentId: { slug: 'new-york-city', parentId: newYork.id } }, update: {}, create: { name: 'New York City', slug: 'new-york-city', type: 'CITY', parentId: newYork.id, latitude: 40.7128, longitude: -74.006 } }),
    prisma.location.upsert({ where: { slug_parentId: { slug: 'buffalo', parentId: newYork.id } }, update: {}, create: { name: 'Buffalo', slug: 'buffalo', type: 'CITY', parentId: newYork.id } }),
    prisma.location.upsert({ where: { slug_parentId: { slug: 'los-angeles', parentId: california.id } }, update: {}, create: { name: 'Los Angeles', slug: 'los-angeles', type: 'CITY', parentId: california.id } }),
    prisma.location.upsert({ where: { slug_parentId: { slug: 'san-francisco', parentId: california.id } }, update: {}, create: { name: 'San Francisco', slug: 'san-francisco', type: 'CITY', parentId: california.id } }),
    prisma.location.upsert({ where: { slug_parentId: { slug: 'chicago', parentId: illinois.id } }, update: {}, create: { name: 'Chicago', slug: 'chicago', type: 'CITY', parentId: illinois.id } }),
    prisma.location.upsert({ where: { slug_parentId: { slug: 'miami', parentId: florida.id } }, update: {}, create: { name: 'Miami', slug: 'miami', type: 'CITY', parentId: florida.id } }),
    prisma.location.upsert({ where: { slug_parentId: { slug: 'seattle', parentId: washington.id } }, update: {}, create: { name: 'Seattle', slug: 'seattle', type: 'CITY', parentId: washington.id } }),
    prisma.location.upsert({ where: { slug_parentId: { slug: 'houston', parentId: texas.id } }, update: {}, create: { name: 'Houston', slug: 'houston', type: 'CITY', parentId: texas.id } }),
    prisma.location.upsert({ where: { slug_parentId: { slug: 'austin', parentId: texas.id } }, update: {}, create: { name: 'Austin', slug: 'austin', type: 'CITY', parentId: texas.id } }),
    prisma.location.upsert({ where: { slug_parentId: { slug: 'dallas', parentId: texas.id } }, update: {}, create: { name: 'Dallas', slug: 'dallas', type: 'CITY', parentId: texas.id } }),
  ]);

  const nyc = cities.find(c => c.slug === 'new-york-city')!;
  const la = cities.find(c => c.slug === 'los-angeles')!;
  const chicago = cities.find(c => c.slug === 'chicago')!;
  const miami = cities.find(c => c.slug === 'miami')!;
  const seattle = cities.find(c => c.slug === 'seattle')!;
  const houston = cities.find(c => c.slug === 'houston')!;
  const sf = cities.find(c => c.slug === 'san-francisco')!;

  // Get all business types
  const allTypes = await prisma.businessType.findMany({ where: { status: ContentStatus.PUBLISHED } });
  const typeMap: Record<string, any> = {};
  for (const t of allTypes) typeMap[t.slug] = t;

  const foodDining = typeMap['food-dining'];
  const accommodation = typeMap['accommodation-hospitality'];
  const retail = typeMap['retail-shopping'];
  const homeServices = typeMap['home-property-services'];
  const construction = typeMap['construction-contractors'];
  const realEstate = typeMap['real-estate-property'];
  const automotive = typeMap['automotive'];
  const health = typeMap['health-medical'];
  const beauty = typeMap['beauty-personal-care'];
  const education = typeMap['education-training'];
  const tech = typeMap['technology-it'];
  const professional = typeMap['professional-services'];
  const legal = typeMap['legal-services'];
  const accounting = typeMap['accounting-tax-services'];
  const fitness = typeMap['fitness-wellness'];

  console.log('✅ Created locations');

  // Helper to batch category upserts
  const categoryOps: any[] = [];

  // Food & Dining categories
  const foodCats = [
    { name: 'Restaurants', slug: 'restaurants', businessTypeId: foodDining!.id, order: 1 },
    { name: 'Fast Food', slug: 'fast-food', businessTypeId: foodDining!.id, order: 2 },
    { name: 'Cafes & Coffee Shops', slug: 'cafes-coffee-shops', businessTypeId: foodDining!.id, order: 3 },
    { name: 'Bars & Pubs', slug: 'bars-pubs', businessTypeId: foodDining!.id, order: 4 },
    { name: 'Food Trucks', slug: 'food-trucks', businessTypeId: foodDining!.id, order: 5 },
    { name: 'Bakeries', slug: 'bakeries', businessTypeId: foodDining!.id, order: 6 },
    { name: 'Pizza Places', slug: 'pizza-places', businessTypeId: foodDining!.id, order: 7 },
    { name: 'Asian Restaurants', slug: 'asian-restaurants', businessTypeId: foodDining!.id, order: 8 },
    { name: 'Mexican Restaurants', slug: 'mexican-restaurants', businessTypeId: foodDining!.id, order: 9 },
    { name: 'Italian Restaurants', slug: 'italian-restaurants', businessTypeId: foodDining!.id, order: 10 },
  ];
  for (const c of foodCats) {
    categoryOps.push(prisma.category.upsert({ where: { slug_businessTypeId: { slug: c.slug, businessTypeId: c.businessTypeId } }, update: {}, create: { ...c, status: ContentStatus.PUBLISHED } }));
  }

  // Accommodation categories
  const accCats = [
    { name: 'Hotels & Motels', slug: 'hotels-motels', businessTypeId: accommodation!.id, order: 1 },
    { name: 'Luxury Resorts', slug: 'luxury-resorts', businessTypeId: accommodation!.id, order: 2 },
    { name: 'Boutique Hotels', slug: 'boutique-hotels', businessTypeId: accommodation!.id, order: 3 },
    { name: 'Vacation Rentals', slug: 'vacation-rentals', businessTypeId: accommodation!.id, order: 4 },
    { name: 'Bed & Breakfast', slug: 'bed-breakfast', businessTypeId: accommodation!.id, order: 5 },
    { name: 'Hostels', slug: 'hostels', businessTypeId: accommodation!.id, order: 6 },
  ];
  for (const c of accCats) {
    categoryOps.push(prisma.category.upsert({ where: { slug_businessTypeId: { slug: c.slug, businessTypeId: c.businessTypeId } }, update: {}, create: { ...c, status: ContentStatus.PUBLISHED } }));
  }

  // Retail categories
  const retailCats = [
    { name: 'Department Stores', slug: 'department-stores', businessTypeId: retail!.id, order: 1 },
    { name: 'Shopping Malls', slug: 'shopping-malls', businessTypeId: retail!.id, order: 2 },
    { name: 'Boutique Shops', slug: 'boutique-shops', businessTypeId: retail!.id, order: 3 },
    { name: 'Outlet Stores', slug: 'outlet-stores', businessTypeId: retail!.id, order: 4 },
    { name: 'Grocery Stores', slug: 'grocery-stores', businessTypeId: retail!.id, order: 5 },
    { name: 'Electronics Stores', slug: 'electronics-stores', businessTypeId: retail!.id, order: 6 },
  ];
  for (const c of retailCats) {
    categoryOps.push(prisma.category.upsert({ where: { slug_businessTypeId: { slug: c.slug, businessTypeId: c.businessTypeId } }, update: {}, create: { ...c, status: ContentStatus.PUBLISHED } }));
  }

  // Home Services categories
  const homeCats = [
    { name: 'Plumbers', slug: 'plumbers', businessTypeId: homeServices!.id, order: 1 },
    { name: 'Electricians', slug: 'electricians', businessTypeId: homeServices!.id, order: 2 },
    { name: 'HVAC Services', slug: 'hvac-services', businessTypeId: homeServices!.id, order: 3 },
    { name: 'Cleaning Services', slug: 'cleaning-services', businessTypeId: homeServices!.id, order: 4 },
    { name: 'Pest Control', slug: 'pest-control', businessTypeId: homeServices!.id, order: 5 },
    { name: 'Landscaping', slug: 'landscaping', businessTypeId: homeServices!.id, order: 6 },
  ];
  for (const c of homeCats) {
    categoryOps.push(prisma.category.upsert({ where: { slug_businessTypeId: { slug: c.slug, businessTypeId: c.businessTypeId } }, update: {}, create: { ...c, status: ContentStatus.PUBLISHED } }));
  }

  // Construction categories
  const constCats = [
    { name: 'General Contractors', slug: 'general-contractors', businessTypeId: construction!.id, order: 1 },
    { name: 'Roofing', slug: 'roofing', businessTypeId: construction!.id, order: 2 },
    { name: 'Plumbing Contractors', slug: 'plumbing-contractors', businessTypeId: construction!.id, order: 3 },
    { name: 'Electrical Contractors', slug: 'electrical-contractors', businessTypeId: construction!.id, order: 4 },
    { name: 'Masonry', slug: 'masonry', businessTypeId: construction!.id, order: 5 },
  ];
  for (const c of constCats) {
    categoryOps.push(prisma.category.upsert({ where: { slug_businessTypeId: { slug: c.slug, businessTypeId: c.businessTypeId } }, update: {}, create: { ...c, status: ContentStatus.PUBLISHED } }));
  }

  // Real Estate categories
  const reCats = [
    { name: 'Residential Real Estate', slug: 'residential-real-estate', businessTypeId: realEstate!.id, order: 1 },
    { name: 'Commercial Real Estate', slug: 'commercial-real-estate', businessTypeId: realEstate!.id, order: 2 },
    { name: 'Property Management', slug: 'property-management', businessTypeId: realEstate!.id, order: 3 },
    { name: 'Real Estate Agents', slug: 'real-estate-agents', businessTypeId: realEstate!.id, order: 4 },
  ];
  for (const c of reCats) {
    categoryOps.push(prisma.category.upsert({ where: { slug_businessTypeId: { slug: c.slug, businessTypeId: c.businessTypeId } }, update: {}, create: { ...c, status: ContentStatus.PUBLISHED } }));
  }

  // Automotive categories
  const autoCats = [
    { name: 'Car Dealers', slug: 'car-dealers', businessTypeId: automotive!.id, order: 1 },
    { name: 'Auto Repair', slug: 'auto-repair', businessTypeId: automotive!.id, order: 2 },
    { name: 'Car Wash', slug: 'car-wash', businessTypeId: automotive!.id, order: 3 },
    { name: 'Auto Parts', slug: 'auto-parts', businessTypeId: automotive!.id, order: 4 },
    { name: 'Tire Shops', slug: 'tire-shops', businessTypeId: automotive!.id, order: 5 },
  ];
  for (const c of autoCats) {
    categoryOps.push(prisma.category.upsert({ where: { slug_businessTypeId: { slug: c.slug, businessTypeId: c.businessTypeId } }, update: {}, create: { ...c, status: ContentStatus.PUBLISHED } }));
  }

  // Health & Medical categories
  const healthCats = [
    { name: 'Hospitals', slug: 'hospitals', businessTypeId: health!.id, order: 1 },
    { name: 'Doctors', slug: 'doctors', businessTypeId: health!.id, order: 2 },
    { name: 'Urgent Care', slug: 'urgent-care', businessTypeId: health!.id, order: 3 },
    { name: 'Physical Therapy', slug: 'physical-therapy', businessTypeId: health!.id, order: 4 },
    { name: 'Chiropractors', slug: 'chiropractors', businessTypeId: health!.id, order: 5 },
  ];
  for (const c of healthCats) {
    categoryOps.push(prisma.category.upsert({ where: { slug_businessTypeId: { slug: c.slug, businessTypeId: c.businessTypeId } }, update: {}, create: { ...c, status: ContentStatus.PUBLISHED } }));
  }

  // Beauty categories
  const beautyCats = [
    { name: 'Hair Salons', slug: 'hair-salons', businessTypeId: beauty!.id, order: 1 },
    { name: 'Nail Salons', slug: 'nail-salons', businessTypeId: beauty!.id, order: 2 },
    { name: 'Spas', slug: 'spas', businessTypeId: beauty!.id, order: 3 },
    { name: 'Barbershops', slug: 'barbershops', businessTypeId: beauty!.id, order: 4 },
  ];
  for (const c of beautyCats) {
    categoryOps.push(prisma.category.upsert({ where: { slug_businessTypeId: { slug: c.slug, businessTypeId: c.businessTypeId } }, update: {}, create: { ...c, status: ContentStatus.PUBLISHED } }));
  }

  // Fitness categories
  const fitnessCats = [
    { name: 'Gyms & Fitness Centers', slug: 'gyms-fitness', businessTypeId: fitness!.id, order: 1 },
    { name: 'Yoga Studios', slug: 'yoga-studios', businessTypeId: fitness!.id, order: 2 },
    { name: 'Personal Trainers', slug: 'personal-trainers', businessTypeId: fitness!.id, order: 3 },
    { name: 'CrossFit', slug: 'crossfit', businessTypeId: fitness!.id, order: 4 },
  ];
  for (const c of fitnessCats) {
    categoryOps.push(prisma.category.upsert({ where: { slug_businessTypeId: { slug: c.slug, businessTypeId: c.businessTypeId } }, update: {}, create: { ...c, status: ContentStatus.PUBLISHED } }));
  }

  // Education categories
  const eduCats = [
    { name: 'K-12 Schools', slug: 'k12-schools', businessTypeId: education!.id, order: 1 },
    { name: 'Colleges & Universities', slug: 'colleges-universities', businessTypeId: education!.id, order: 2 },
    { name: 'Online Courses', slug: 'online-courses', businessTypeId: education!.id, order: 3 },
    { name: 'Tutoring', slug: 'tutoring', businessTypeId: education!.id, order: 4 },
  ];
  for (const c of eduCats) {
    categoryOps.push(prisma.category.upsert({ where: { slug_businessTypeId: { slug: c.slug, businessTypeId: c.businessTypeId } }, update: {}, create: { ...c, status: ContentStatus.PUBLISHED } }));
  }

  // Tech categories
  const techCats = [
    { name: 'Software Development', slug: 'software-development', businessTypeId: tech!.id, order: 1 },
    { name: 'Web Design', slug: 'web-design', businessTypeId: tech!.id, order: 2 },
    { name: 'IT Support', slug: 'it-support', businessTypeId: tech!.id, order: 3 },
    { name: 'Cybersecurity', slug: 'cybersecurity', businessTypeId: tech!.id, order: 4 },
  ];
  for (const c of techCats) {
    categoryOps.push(prisma.category.upsert({ where: { slug_businessTypeId: { slug: c.slug, businessTypeId: c.businessTypeId } }, update: {}, create: { ...c, status: ContentStatus.PUBLISHED } }));
  }

  // Professional services
  const profCats = [
    { name: 'Consulting', slug: 'consulting', businessTypeId: professional!.id, order: 1 },
    { name: 'Marketing Agencies', slug: 'marketing-agencies', businessTypeId: professional!.id, order: 2 },
    { name: 'Architects', slug: 'architects', businessTypeId: professional!.id, order: 3 },
  ];
  for (const c of profCats) {
    categoryOps.push(prisma.category.upsert({ where: { slug_businessTypeId: { slug: c.slug, businessTypeId: c.businessTypeId } }, update: {}, create: { ...c, status: ContentStatus.PUBLISHED } }));
  }

  // Legal categories
  const legalCats = [
    { name: 'Family Law', slug: 'family-law', businessTypeId: legal!.id, order: 1 },
    { name: 'Corporate Law', slug: 'corporate-law', businessTypeId: legal!.id, order: 2 },
    { name: 'Criminal Defense', slug: 'criminal-defense', businessTypeId: legal!.id, order: 3 },
    { name: 'Immigration Law', slug: 'immigration-law', businessTypeId: legal!.id, order: 4 },
  ];
  for (const c of legalCats) {
    categoryOps.push(prisma.category.upsert({ where: { slug_businessTypeId: { slug: c.slug, businessTypeId: c.businessTypeId } }, update: {}, create: { ...c, status: ContentStatus.PUBLISHED } }));
  }

  // Accounting categories
  const acctCats = [
    { name: 'Tax Preparation', slug: 'tax-preparation', businessTypeId: accounting!.id, order: 1 },
    { name: 'Bookkeeping', slug: 'bookkeeping', businessTypeId: accounting!.id, order: 2 },
    { name: 'Payroll Services', slug: 'payroll-services', businessTypeId: accounting!.id, order: 3 },
  ];
  for (const c of acctCats) {
    categoryOps.push(prisma.category.upsert({ where: { slug_businessTypeId: { slug: c.slug, businessTypeId: c.businessTypeId } }, update: {}, create: { ...c, status: ContentStatus.PUBLISHED } }));
  }

  // Process categories in batches of 10
  console.log('📁 Creating categories...');
  await batchUpserts(categoryOps, 10);
  console.log('✅ Created categories');

  // Get categories for businesses
  const allCategories = await prisma.category.findMany();
  const catMap: Record<string, any> = {};
  for (const c of allCategories) catMap[c.slug] = c;

  // Create businesses with batching
  console.log('🏢 Creating businesses...');
  const businessOps = [
    // Food & Dining
    prisma.business.upsert({ where: { slug: 'golden-dragon-restaurant' }, update: {}, create: { name: 'Golden Dragon Restaurant', slug: 'golden-dragon-restaurant', description: 'Authentic Chinese cuisine with a modern twist. Family-owned since 1985, serving the best dim sum and Peking duck in the city.', categoryId: catMap['restaurants']!.id, typeId: foodDining!.id, locationId: nyc.id, address: '123 Chinatown St, New York, NY', phone: '(212) 555-0101', email: 'info@goldendragon.com', website: 'https://goldendragon.com', featured: true, status: ContentStatus.PUBLISHED, hours: { monday: '11:00-22:00', tuesday: '11:00-22:00', wednesday: '11:00-22:00', thursday: '11:00-22:00', friday: '11:00-23:00', saturday: '10:00-23:00', sunday: '10:00-22:00' } } }),
    prisma.business.upsert({ where: { slug: 'marios-pizza' }, update: {}, create: { name: "Mario's Pizza", slug: 'marios-pizza', description: 'Wood-fired Neapolitan pizza made with imported Italian ingredients. Winner of Best Pizza 2024.', categoryId: catMap['pizza-places']!.id, typeId: foodDining!.id, locationId: nyc.id, address: '456 Mulberry St, New York, NY', phone: '(212) 555-0102', email: 'info@mariospizza.com', website: 'https://mariospizza.com', featured: true, status: ContentStatus.PUBLISHED, hours: { monday: '12:00-22:00', tuesday: '12:00-22:00', wednesday: '12:00-22:00', thursday: '12:00-22:00', friday: '12:00-23:00', saturday: '12:00-23:00', sunday: '12:00-21:00' } } }),
    prisma.business.upsert({ where: { slug: 'sunrise-cafe' }, update: {}, create: { name: 'Sunrise Cafe', slug: 'sunrise-cafe', description: 'Artisan coffee and freshly baked pastries. The perfect spot for your morning coffee or afternoon tea.', categoryId: catMap['cafes-coffee-shops']!.id, typeId: foodDining!.id, locationId: sf.id, address: '789 Market St, San Francisco, CA', phone: '(415) 555-0103', email: 'hello@sunrisecafe.com', website: 'https://sunrisecafe.com', featured: false, status: ContentStatus.PUBLISHED, hours: { monday: '06:30-18:00', tuesday: '06:30-18:00', wednesday: '06:30-18:00', thursday: '06:30-18:00', friday: '06:30-19:00', saturday: '07:00-19:00', sunday: '07:00-17:00' } } }),
    prisma.business.upsert({ where: { slug: 'taco-fiesta' }, update: {}, create: { name: 'Taco Fiesta', slug: 'taco-fiesta', description: 'Authentic Mexican street tacos with fresh salsas and handmade tortillas.', categoryId: catMap['mexican-restaurants']!.id, typeId: foodDining!.id, locationId: la.id, address: '321 Sunset Blvd, Los Angeles, CA', phone: '(323) 555-0104', email: 'hola@tacofiesta.com', website: 'https://tacofiesta.com', featured: false, status: ContentStatus.PUBLISHED, hours: { monday: '10:00-21:00', tuesday: '10:00-21:00', wednesday: '10:00-21:00', thursday: '10:00-21:00', friday: '10:00-22:00', saturday: '10:00-22:00', sunday: '11:00-20:00' } } }),
    prisma.business.upsert({ where: { slug: 'the-coastal-kitchen' }, update: {}, create: { name: 'The Coastal Kitchen', slug: 'the-coastal-kitchen', description: 'Fresh seafood with ocean views. Specializing in locally sourced fish and shellfish.', categoryId: catMap['restaurants']!.id, typeId: foodDining!.id, locationId: seattle.id, address: '555 Pier 57, Seattle, WA', phone: '(206) 555-0105', email: 'info@coastalkitchen.com', website: 'https://coastalkitchen.com', featured: true, status: ContentStatus.PUBLISHED, hours: { monday: '11:00-21:00', tuesday: '11:00-21:00', wednesday: '11:00-21:00', thursday: '11:00-22:00', friday: '11:00-22:00', saturday: '10:00-22:00', sunday: '10:00-21:00' } } }),

    // Accommodation
    prisma.business.upsert({ where: { slug: 'manhattan-grand-hotel' }, update: {}, create: { name: 'Manhattan Grand Hotel', slug: 'manhattan-grand-hotel', description: 'Luxury hotel in the heart of Manhattan with stunning skyline views and world-class amenities.', categoryId: catMap['hotels-motels']!.id, typeId: accommodation!.id, locationId: nyc.id, address: '100 5th Ave, New York, NY', phone: '(212) 555-0201', email: 'reservations@manhattangrand.com', website: 'https://manhattangrand.com', featured: true, status: ContentStatus.PUBLISHED } }),
    prisma.business.upsert({ where: { slug: 'beachside-boutique-hotel' }, update: {}, create: { name: 'Beachside Boutique Hotel', slug: 'beachside-boutique-hotel', description: 'Intimate boutique hotel steps from the beach with individually designed rooms.', categoryId: catMap['boutique-hotels']!.id, typeId: accommodation!.id, locationId: miami.id, address: '200 Ocean Dr, Miami, FL', phone: '(305) 555-0202', email: 'stay@beachside.com', website: 'https://beachside.com', featured: false, status: ContentStatus.PUBLISHED } }),
    prisma.business.upsert({ where: { slug: 'chicago-urban-stay' }, update: {}, create: { name: 'Chicago Urban Stay', slug: 'chicago-urban-stay', description: 'Modern serviced apartments in downtown Chicago. Perfect for extended stays and business travelers.', categoryId: catMap['serviced-apartments']!.id, typeId: accommodation!.id, locationId: chicago.id, address: '300 Michigan Ave, Chicago, IL', phone: '(312) 555-0203', email: 'info@chicagourbanstay.com', website: 'https://chicagourbanstay.com', featured: false, status: ContentStatus.PUBLISHED } }),

    // Retail
    prisma.business.upsert({ where: { slug: 'tech-haven-electronics' }, update: {}, create: { name: 'Tech Haven Electronics', slug: 'tech-haven-electronics', description: 'Premium electronics and gadgets. Authorized dealer for top brands with expert installation services.', categoryId: catMap['electronics-stores']!.id, typeId: retail!.id, locationId: la.id, address: '700 Wilshire Blvd, Los Angeles, CA', phone: '(323) 555-0301', email: 'sales@techhaven.com', website: 'https://techhaven.com', featured: true, status: ContentStatus.PUBLISHED } }),
    prisma.business.upsert({ where: { slug: 'fresh-market-grocery' }, update: {}, create: { name: 'Fresh Market Grocery', slug: 'fresh-market-grocery', description: 'Organic and locally sourced groceries. Farm-to-table philosophy with daily deliveries.', categoryId: catMap['grocery-stores']!.id, typeId: retail!.id, locationId: sf.id, address: '400 Haight St, San Francisco, CA', phone: '(415) 555-0302', email: 'hello@freshmarket.com', website: 'https://freshmarket.com', featured: false, status: ContentStatus.PUBLISHED } }),
    prisma.business.upsert({ where: { slug: 'fashion-forward-boutique' }, update: {}, create: { name: 'Fashion Forward Boutique', slug: 'fashion-forward-boutique', description: 'Curated collection of contemporary fashion from emerging designers worldwide.', categoryId: catMap['boutique-shops']!.id, typeId: retail!.id, locationId: nyc.id, address: '88 Mercer St, New York, NY', phone: '(212) 555-0303', email: 'shop@fashionforward.com', website: 'https://fashionforward.com', featured: false, status: ContentStatus.PUBLISHED } }),

    // Home Services
    prisma.business.upsert({ where: { slug: 'bright-star-electric' }, update: {}, create: { name: 'Bright Star Electric', slug: 'bright-star-electric', description: 'Licensed electricians for residential and commercial projects. 24/7 emergency service available.', categoryId: catMap['electricians']!.id, typeId: homeServices!.id, locationId: houston.id, address: '900 Main St, Houston, TX', phone: '(713) 555-0401', email: 'service@brightstarelectric.com', website: 'https://brightstarelectric.com', featured: false, status: ContentStatus.PUBLISHED } }),
    prisma.business.upsert({ where: { slug: 'aquaflow-plumbing' }, update: {}, create: { name: 'AquaFlow Plumbing', slug: 'aquaflow-plumbing', description: 'Expert plumbing services for homes and businesses. Water heaters, drains, and pipe repairs.', categoryId: catMap['plumbers']!.id, typeId: homeServices!.id, locationId: chicago.id, address: '500 W Madison St, Chicago, IL', phone: '(312) 555-0402', email: 'info@aquaflow.com', website: 'https://aquaflow.com', featured: false, status: ContentStatus.PUBLISHED } }),
    prisma.business.upsert({ where: { slug: 'green-thumb-landscaping' }, update: {}, create: { name: 'Green Thumb Landscaping', slug: 'green-thumb-landscaping', description: 'Full-service landscaping design and maintenance. Creating beautiful outdoor spaces since 2005.', categoryId: catMap['landscaping']!.id, typeId: homeServices!.id, locationId: miami.id, address: '1500 Coral Way, Miami, FL', phone: '(305) 555-0403', email: 'info@greenthumb.com', website: 'https://greenthumb.com', featured: false, status: ContentStatus.PUBLISHED } }),
    prisma.business.upsert({ where: { slug: 'sparkle-clean-services' }, update: {}, create: { name: 'Sparkle Clean Services', slug: 'sparkle-clean-services', description: 'Professional residential and commercial cleaning. Eco-friendly products and thorough background-checked staff.', categoryId: catMap['cleaning-services']!.id, typeId: homeServices!.id, locationId: la.id, address: '800 Hollywood Blvd, Los Angeles, CA', phone: '(323) 555-0404', email: 'book@sparkleclean.com', website: 'https://sparkleclean.com', featured: false, status: ContentStatus.PUBLISHED } }),

    // Health & Medical
    prisma.business.upsert({ where: { slug: 'city-medical-center' }, update: {}, create: { name: 'City Medical Center', slug: 'city-medical-center', description: 'Full-service hospital with 24/7 emergency care, advanced diagnostics, and specialized treatment centers.', categoryId: catMap['hospitals']!.id, typeId: health!.id, locationId: nyc.id, address: '555 Madison Ave, New York, NY', phone: '(212) 555-0501', email: 'info@citymedical.com', website: 'https://citymedical.com', featured: true, status: ContentStatus.PUBLISHED } }),
    prisma.business.upsert({ where: { slug: 'family-health-clinic' }, update: {}, create: { name: 'Family Health Clinic', slug: 'family-health-clinic', description: 'Comprehensive family medicine including pediatrics, internal medicine, and preventive care.', categoryId: catMap['doctors']!.id, typeId: health!.id, locationId: seattle.id, address: '300 Pine St, Seattle, WA', phone: '(206) 555-0502', email: 'appointments@familyhealth.com', website: 'https://familyhealth.com', featured: false, status: ContentStatus.PUBLISHED } }),
    prisma.business.upsert({ where: { slug: 'peak-performance-physical-therapy' }, update: {}, create: { name: 'Peak Performance Physical Therapy', slug: 'peak-performance-physical-therapy', description: 'Specialized physical therapy for sports injuries, post-surgery rehabilitation, and chronic pain management.', categoryId: catMap['physical-therapy']!.id, typeId: health!.id, locationId: la.id, address: '600 Wilshire Blvd, Los Angeles, CA', phone: '(323) 555-0503', email: 'info@peakpt.com', website: 'https://peakpt.com', featured: false, status: ContentStatus.PUBLISHED } }),

    // Tech
    prisma.business.upsert({ where: { slug: 'cloudnine-software' }, update: {}, create: { name: 'CloudNine Software', slug: 'cloudnine-software', description: 'Custom software development and cloud solutions. Building scalable applications for modern businesses.', categoryId: catMap['software-development']!.id, typeId: tech!.id, locationId: sf.id, address: '100 Market St, San Francisco, CA', phone: '(415) 555-0601', email: 'hello@cloudninesoftware.com', website: 'https://cloudninesoftware.com', featured: true, status: ContentStatus.PUBLISHED } }),
    prisma.business.upsert({ where: { slug: 'pixel-perfect-design' }, update: {}, create: { name: 'Pixel Perfect Design', slug: 'pixel-perfect-design', description: 'Award-winning web design and branding agency. Creating digital experiences that convert.', categoryId: catMap['web-design']!.id, typeId: tech!.id, locationId: nyc.id, address: '250 Broadway, New York, NY', phone: '(212) 555-0602', email: 'hello@pixelperfect.com', website: 'https://pixelperfect.com', featured: false, status: ContentStatus.PUBLISHED } }),
    prisma.business.upsert({ where: { slug: 'securetech-it' }, update: {}, create: { name: 'SecureTech IT', slug: 'securetech-it', description: 'Cybersecurity and IT infrastructure consulting. Protecting your business from digital threats.', categoryId: catMap['cybersecurity']!.id, typeId: tech!.id, locationId: austin.id, address: '400 Congress Ave, Austin, TX', phone: '(512) 555-0603', email: 'info@securetechit.com', website: 'https://securetechit.com', featured: false, status: ContentStatus.PUBLISHED } }),

    // Automotive
    prisma.business.upsert({ where: { slug: 'prestige-auto-sales' }, update: {}, create: { name: 'Prestige Auto Sales', slug: 'prestige-auto-sales', description: 'Premium certified pre-owned vehicles. Luxury brands at competitive prices with financing available.', categoryId: catMap['car-dealers']!.id, typeId: automotive!.id, locationId: miami.id, address: '1200 Biscayne Blvd, Miami, FL', phone: '(305) 555-0701', email: 'sales@prestigeauto.com', website: 'https://prestigeauto.com', featured: false, status: ContentStatus.PUBLISHED } }),
    prisma.business.upsert({ where: { slug: 'quick-fix-auto-repair' }, update: {}, create: { name: 'Quick Fix Auto Repair', slug: 'quick-fix-auto-repair', description: 'Trustworthy auto repair and maintenance. ASE-certified mechanics with transparent pricing.', categoryId: catMap['auto-repair']!.id, typeId: automotive!.id, locationId: chicago.id, address: '750 N Wells St, Chicago, IL', phone: '(312) 555-0702', email: 'service@quickfixauto.com', website: 'https://quickfixauto.com', featured: false, status: ContentStatus.PUBLISHED } }),

    // Legal
    prisma.business.upsert({ where: { slug: 'justice-legal-group' }, update: {}, create: { name: 'Justice Legal Group', slug: 'justice-legal-group', description: 'Experienced attorneys specializing in corporate law, mergers, and business formation.', categoryId: catMap['corporate-law']!.id, typeId: legal!.id, locationId: nyc.id, address: '350 Park Ave, New York, NY', phone: '(212) 555-0801', email: 'info@justicelegal.com', website: 'https://justicelegal.com', featured: true, status: ContentStatus.PUBLISHED } }),
    prisma.business.upsert({ where: { slug: 'family-first-law' }, update: {}, create: { name: 'Family First Law', slug: 'family-first-law', description: 'Compassionate family law practice handling divorce, custody, and adoption cases.', categoryId: catMap['family-law']!.id, typeId: legal!.id, locationId: la.id, address: '500 Wilshire Blvd, Los Angeles, CA', phone: '(323) 555-0802', email: 'info@familyfirstlaw.com', website: 'https://familyfirstlaw.com', featured: false, status: ContentStatus.PUBLISHED } }),

    // Beauty
    prisma.business.upsert({ where: { slug: 'glow-beauty-salon' }, update: {}, create: { name: 'Glow Beauty Salon', slug: 'glow-beauty-salon', description: 'Full-service beauty salon offering hair styling, coloring, and spa treatments in a relaxing environment.', categoryId: catMap['hair-salons']!.id, typeId: beauty!.id, locationId: miami.id, address: '900 Collins Ave, Miami Beach, FL', phone: '(305) 555-0901', email: 'book@glowsalon.com', website: 'https://glowsalon.com', featured: false, status: ContentStatus.PUBLISHED } }),
    prisma.business.upsert({ where: { slug: 'zen-spa-wellness' }, update: {}, create: { name: 'Zen Spa & Wellness', slug: 'zen-spa-wellness', description: 'Luxury spa offering massages, facials, and holistic wellness treatments. Your sanctuary in the city.', categoryId: catMap['spas']!.id, typeId: beauty!.id, locationId: sf.id, address: '200 Post St, San Francisco, CA', phone: '(415) 555-0902', email: 'relax@zenspa.com', website: 'https://zenspa.com', featured: true, status: ContentStatus.PUBLISHED } }),

    // Fitness
    prisma.business.upsert({ where: { slug: 'iron-pumping-gym' }, update: {}, create: { name: 'Iron Pumping Gym', slug: 'iron-pumping-gym', description: 'State-of-the-art fitness center with personal trainers, group classes, and 24/7 access.', categoryId: catMap['gyms-fitness']!.id, typeId: fitness!.id, locationId: nyc.id, address: '450 W 33rd St, New York, NY', phone: '(212) 555-1001', email: 'info@ironpumping.com', website: 'https://ironpumping.com', featured: false, status: ContentStatus.PUBLISHED } }),
    prisma.business.upsert({ where: { slug: 'serenity-yoga-studio' }, update: {}, create: { name: 'Serenity Yoga Studio', slug: 'serenity-yoga-studio', description: 'Peaceful yoga studio offering all levels of classes, meditation, and wellness workshops.', categoryId: catMap['yoga-studios']!.id, typeId: fitness!.id, locationId: la.id, address: '750 Melrose Ave, Los Angeles, CA', phone: '(323) 555-1002', email: 'namaste@serenityyoga.com', website: 'https://serenityyoga.com', featured: false, status: ContentStatus.PUBLISHED } }),

    // Education
    prisma.business.upsert({ where: { slug: 'bright-minds-learning' }, update: {}, create: { name: 'Bright Minds Learning Center', slug: 'bright-minds-learning', description: 'After-school tutoring and enrichment programs for K-12 students. Expert educators, proven results.', categoryId: catMap['tutoring']!.id, typeId: education!.id, locationId: chicago.id, address: '200 N Michigan Ave, Chicago, IL', phone: '(312) 555-1101', email: 'info@brightminds.com', website: 'https://brightminds.com', featured: false, status: ContentStatus.PUBLISHED } }),

    // Professional Services
    prisma.business.upsert({ where: { slug: 'alpha-consulting-group' }, update: {}, create: { name: 'Alpha Consulting Group', slug: 'alpha-consulting-group', description: 'Management consulting firm helping businesses optimize operations and drive growth.', categoryId: catMap['consulting']!.id, typeId: professional!.id, locationId: nyc.id, address: '600 Lexington Ave, New York, NY', phone: '(212) 555-1201', email: 'info@alphaconsulting.com', website: 'https://alphaconsulting.com', featured: false, status: ContentStatus.PUBLISHED } }),
  ];

  await batchUpserts(businessOps, 5);
  console.log('✅ Created businesses');

  // Create reviews for businesses
  console.log('⭐ Creating reviews...');
  const allBusinesses = await prisma.business.findMany();
  const reviewOps = [];

  for (const business of allBusinesses) {
    const numReviews = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numReviews; i++) {
      const rating = Math.floor(Math.random() * 2) + 4;
      const comments = [
        'Great service and excellent quality! Highly recommended.',
        'Amazing experience. Will definitely come back.',
        'Good value for money. Staff was very friendly.',
        'Exceeded my expectations. Five stars!',
        'Solid choice. Clean, professional, and reliable.',
        'Wonderful atmosphere and top-notch service.',
      ];
      reviewOps.push(
        prisma.review.create({
          data: {
            businessId: business.id,
            rating,
            comment: comments[Math.floor(Math.random() * comments.length)],
            status: 'APPROVED',
          },
        })
      );
    }
  }

  await batchUpserts(reviewOps, 10);
  console.log('✅ Created reviews');

  // Create amenities for businesses
  console.log('🏪 Creating amenities...');
  const amenityOps = [];
  for (const business of allBusinesses) {
    const numAmenities = Math.floor(Math.random() * 4) + 1;
    const allAmenities = ['WiFi', 'Parking', 'Wheelchair Accessible', 'Outdoor Seating', 'Delivery', 'Takeout', 'Reservations', 'Pet Friendly', 'Accepts Credit Cards', 'Free Wi-Fi'];
    const selected = allAmenities.sort(() => 0.5 - Math.random()).slice(0, numAmenities);
    for (const amenity of selected) {
      amenityOps.push(
        prisma.amenity.create({
          data: {
            businessId: business.id,
            name: amenity,
            icon: 'check-circle',
          },
        })
      );
    }
  }
  await batchUpserts(amenityOps, 10);
  console.log('✅ Created amenities');

  // Create offers for featured businesses
  console.log('🎁 Creating offers...');
  const featuredBusinesses = allBusinesses.filter(b => b.featured);
  const offerOps = [];
  for (const business of featuredBusinesses) {
    offerOps.push(
      prisma.offer.create({
        data: {
          businessId: business.id,
          title: 'Welcome Offer',
          description: 'Get 15% off your first visit! Use code WELCOME15 at checkout.',
          discountType: 'PERCENTAGE',
          discountValue: 15,
          validFrom: new Date(),
          validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          status: ContentStatus.PUBLISHED,
        },
      })
    );
  }
  await batchUpserts(offerOps, 5);
  console.log('✅ Created offers');

  console.log('🎉 Database seeded successfully!');
  console.log('👤 Admin login: admin@indexorbit.com / admin123');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
