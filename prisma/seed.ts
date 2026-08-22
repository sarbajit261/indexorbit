import { PrismaClient, ContentStatus, ClaimStatus, ReviewStatus, LocationType, VerificationStatus } from '@prisma/client';
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
    // 1. Food & Dining
    prisma.businessType.upsert({
      where: { slug: 'food-dining' },
      update: {},
      create: { name: 'Food & Dining', slug: 'food-dining', description: 'Restaurants, cafes, and food establishments', icon: 'utensils', color: '#FF6B6B', order: 1, status: ContentStatus.PUBLISHED },
    }),
    // 2. Accommodation & Hospitality
    prisma.businessType.upsert({
      where: { slug: 'accommodation-hospitality' },
      update: {},
      create: { name: 'Accommodation & Hospitality', slug: 'accommodation-hospitality', description: 'Hotels, motels, and lodging', icon: 'home', color: '#4ECDC4', order: 2, status: ContentStatus.PUBLISHED },
    }),
    // 3. Retail & Shopping
    prisma.businessType.upsert({
      where: { slug: 'retail-shopping' },
      update: {},
      create: { name: 'Retail & Shopping', slug: 'retail-shopping', description: 'Retail stores and shops', icon: 'shopping-bag', color: '#96CEB4', order: 3, status: ContentStatus.PUBLISHED },
    }),
    // 4. Home & Property Services
    prisma.businessType.upsert({
      where: { slug: 'home-property-services' },
      update: {},
      create: { name: 'Home & Property Services', slug: 'home-property-services', description: 'Home services and maintenance', icon: 'wrench', color: '#45B7D1', order: 4, status: ContentStatus.PUBLISHED },
    }),
    // 5. Construction & Contractors
    prisma.businessType.upsert({
      where: { slug: 'construction-contractors' },
      update: {},
      create: { name: 'Construction & Contractors', slug: 'construction-contractors', description: 'Construction companies and contractors', icon: 'hard-hat', color: '#F39C12', order: 5, status: ContentStatus.PUBLISHED },
    }),
    // 6. Real Estate & Property
    prisma.businessType.upsert({
      where: { slug: 'real-estate-property' },
      update: {},
      create: { name: 'Real Estate & Property', slug: 'real-estate-property', description: 'Real estate agents and agencies', icon: 'building', color: '#E67E22', order: 6, status: ContentStatus.PUBLISHED },
    }),
    // 7. Automotive
    prisma.businessType.upsert({
      where: { slug: 'automotive' },
      update: {},
      create: { name: 'Automotive', slug: 'automotive', description: 'Car dealers, repairs, and services', icon: 'car', color: '#3498DB', order: 7, status: ContentStatus.PUBLISHED },
    }),
    // 8. Transportation & Logistics
    prisma.businessType.upsert({
      where: { slug: 'transportation-logistics' },
      update: {},
      create: { name: 'Transportation & Logistics', slug: 'transportation-logistics', description: 'Transportation and logistics services', icon: 'truck', color: '#9B59B6', order: 8, status: ContentStatus.PUBLISHED },
    }),
    // 9. Car Rental & Transport Services
    prisma.businessType.upsert({
      where: { slug: 'car-rental-transport' },
      update: {},
      create: { name: 'Car Rental & Transport Services', slug: 'car-rental-transport', description: 'Car rental and transport services', icon: 'car-front', color: '#1ABC9C', order: 9, status: ContentStatus.PUBLISHED },
    }),
    // 10. Travel & Tourism
    prisma.businessType.upsert({
      where: { slug: 'travel-tourism' },
      update: {},
      create: { name: 'Travel & Tourism', slug: 'travel-tourism', description: 'Travel agencies and tourism', icon: 'plane', color: '#00BCD4', order: 10, status: ContentStatus.PUBLISHED },
    }),
    // 11. Health & Medical
    prisma.businessType.upsert({
      where: { slug: 'health-medical' },
      update: {},
      create: { name: 'Health & Medical', slug: 'health-medical', description: 'Medical and health services', icon: 'stethoscope', color: '#E74C3C', order: 11, status: ContentStatus.PUBLISHED },
    }),
    // 12. Dental & Oral Health
    prisma.businessType.upsert({
      where: { slug: 'dental-oral-health' },
      update: {},
      create: { name: 'Dental & Oral Health', slug: 'dental-oral-health', description: 'Dental services and oral health', icon: 'smile', color: '#E91E63', order: 12, status: ContentStatus.PUBLISHED },
    }),
    // 13. Pharmacy & Medical Retail
    prisma.businessType.upsert({
      where: { slug: 'pharmacy-medical-retail' },
      update: {},
      create: { name: 'Pharmacy & Medical Retail', slug: 'pharmacy-medical-retail', description: 'Pharmacies and medical supply stores', icon: 'pill', color: '#8B4513', order: 13, status: ContentStatus.PUBLISHED },
    }),
    // 14. Beauty & Personal Care
    prisma.businessType.upsert({
      where: { slug: 'beauty-personal-care' },
      update: {},
      create: { name: 'Beauty & Personal Care', slug: 'beauty-personal-care', description: 'Beauty salons and personal care', icon: 'heart', color: '#DDA0DD', order: 14, status: ContentStatus.PUBLISHED },
    }),
    // 15. Fitness & Wellness
    prisma.businessType.upsert({
      where: { slug: 'fitness-wellness' },
      update: {},
      create: { name: 'Fitness & Wellness', slug: 'fitness-wellness', description: 'Gyms, fitness centers, and wellness', icon: 'dumbbell', color: '#E91E63', order: 15, status: ContentStatus.PUBLISHED },
    }),
    // 16. Pets & Animals
    prisma.businessType.upsert({
      where: { slug: 'pets-animals' },
      update: {},
      create: { name: 'Pets & Animals', slug: 'pets-animals', description: 'Pet stores, vets, and pet services', icon: 'paw-print', color: '#8B4513', order: 16, status: ContentStatus.PUBLISHED },
    }),
    // 17. Professional Services
    prisma.businessType.upsert({
      where: { slug: 'professional-services' },
      update: {},
      create: { name: 'Professional Services', slug: 'professional-services', description: 'Professional business services', icon: 'briefcase', color: '#607D8B', order: 17, status: ContentStatus.PUBLISHED },
    }),
    // 18. Legal Services
    prisma.businessType.upsert({
      where: { slug: 'legal-services' },
      update: {},
      create: { name: 'Legal Services', slug: 'legal-services', description: 'Lawyers and legal services', icon: 'scale', color: '#2C3E50', order: 18, status: ContentStatus.PUBLISHED },
    }),
    // 19. Accounting & Tax Services
    prisma.businessType.upsert({
      where: { slug: 'accounting-tax-services' },
      update: {},
      create: { name: 'Accounting & Tax Services', slug: 'accounting-tax-services', description: 'Accountants and tax services', icon: 'calculator', color: '#27AE60', order: 19, status: ContentStatus.PUBLISHED },
    }),
    // 20. Financial Services
    prisma.businessType.upsert({
      where: { slug: 'financial-services' },
      update: {},
      create: { name: 'Financial Services', slug: 'financial-services', description: 'Banks and financial institutions', icon: 'dollar-sign', color: '#2ECC71', order: 20, status: ContentStatus.PUBLISHED },
    }),
    // 21. Insurance Services
    prisma.businessType.upsert({
      where: { slug: 'insurance-services' },
      update: {},
      create: { name: 'Insurance Services', slug: 'insurance-services', description: 'Insurance companies and agents', icon: 'shield', color: '#34495E', order: 21, status: ContentStatus.PUBLISHED },
    }),
    // 22. Business Services
    prisma.businessType.upsert({
      where: { slug: 'business-services' },
      update: {},
      create: { name: 'Business Services', slug: 'business-services', description: 'General business services', icon: 'building-2', color: '#7F8C8D', order: 22, status: ContentStatus.PUBLISHED },
    }),
    // 23. Recruitment & Employment
    prisma.businessType.upsert({
      where: { slug: 'recruitment-employment' },
      update: {},
      create: { name: 'Recruitment & Employment', slug: 'recruitment-employment', description: 'Staffing and recruitment agencies', icon: 'users', color: '#16A085', order: 23, status: ContentStatus.PUBLISHED },
    }),
    // 24. Marketing & Advertising
    prisma.businessType.upsert({
      where: { slug: 'marketing-advertising' },
      update: {},
      create: { name: 'Marketing & Advertising', slug: 'marketing-advertising', description: 'Marketing and advertising agencies', icon: 'megaphone', color: '#F1C40F', order: 24, status: ContentStatus.PUBLISHED },
    }),
    // 25. Technology & IT
    prisma.businessType.upsert({
      where: { slug: 'technology-it' },
      update: {},
      create: { name: 'Technology & IT', slug: 'technology-it', description: 'IT services and technology', icon: 'laptop', color: '#673AB7', order: 25, status: ContentStatus.PUBLISHED },
    }),
    // 26. Telecommunications
    prisma.businessType.upsert({
      where: { slug: 'telecommunications' },
      update: {},
      create: { name: 'Telecommunications', slug: 'telecommunications', description: 'Telecom services and providers', icon: 'signal', color: '#3498DB', order: 26, status: ContentStatus.PUBLISHED },
    }),
    // 27. Education & Training
    prisma.businessType.upsert({
      where: { slug: 'education-training' },
      update: {},
      create: { name: 'Education & Training', slug: 'education-training', description: 'Schools, tutoring, and training', icon: 'book', color: '#1ABC9C', order: 27, status: ContentStatus.PUBLISHED },
    }),
    // 28. Childcare & Family Services
    prisma.businessType.upsert({
      where: { slug: 'childcare-family-services' },
      update: {},
      create: { name: 'Childcare & Family Services', slug: 'childcare-family-services', description: 'Childcare and family services', icon: 'baby', color: '#FF69B4', order: 28, status: ContentStatus.PUBLISHED },
    }),
    // 29. Senior & Home Care
    prisma.businessType.upsert({
      where: { slug: 'senior-home-care' },
      update: {},
      create: { name: 'Senior & Home Care', slug: 'senior-home-care', description: 'Senior care and home healthcare', icon: 'heart-handshake', color: '#9C27B0', order: 29, status: ContentStatus.PUBLISHED },
    }),
    // 30. Events & Wedding Services
    prisma.businessType.upsert({
      where: { slug: 'events-wedding-services' },
      update: {},
      create: { name: 'Events & Wedding Services', slug: 'events-wedding-services', description: 'Event planners and wedding services', icon: 'calendar', color: '#FF5722', order: 30, status: ContentStatus.PUBLISHED },
    }),
    // 31. Entertainment & Nightlife
    prisma.businessType.upsert({
      where: { slug: 'entertainment-nightlife' },
      update: {},
      create: { name: 'Entertainment & Nightlife', slug: 'entertainment-nightlife', description: 'Entertainment and nightlife venues', icon: 'music', color: '#FF9800', order: 31, status: ContentStatus.PUBLISHED },
    }),
    // 32. Sports & Recreation
    prisma.businessType.upsert({
      where: { slug: 'sports-recreation' },
      update: {},
      create: { name: 'Sports & Recreation', slug: 'sports-recreation', description: 'Sports facilities and recreation', icon: 'trophy', color: '#4CAF50', order: 32, status: ContentStatus.PUBLISHED },
    }),
    // 33. Arts & Culture
    prisma.businessType.upsert({
      where: { slug: 'arts-culture' },
      update: {},
      create: { name: 'Arts & Culture', slug: 'arts-culture', description: 'Art galleries and cultural venues', icon: 'palette', color: '#E91E63', order: 33, status: ContentStatus.PUBLISHED },
    }),
    // 34. Photography & Media
    prisma.businessType.upsert({
      where: { slug: 'photography-media' },
      update: {},
      create: { name: 'Photography & Media', slug: 'photography-media', description: 'Photography and media production', icon: 'camera', color: '#795548', order: 34, status: ContentStatus.PUBLISHED },
    }),
    // 35. Printing & Signage
    prisma.businessType.upsert({
      where: { slug: 'printing-signage' },
      update: {},
      create: { name: 'Printing & Signage', slug: 'printing-signage', description: 'Printing and signage services', icon: 'printer', color: '#607D8B', order: 35, status: ContentStatus.PUBLISHED },
    }),
    // 36. Fashion & Apparel
    prisma.businessType.upsert({
      where: { slug: 'fashion-apparel' },
      update: {},
      create: { name: 'Fashion & Apparel', slug: 'fashion-apparel', description: 'Clothing and fashion retail', icon: 'shirt', color: '#9C27B0', order: 36, status: ContentStatus.PUBLISHED },
    }),
    // 37. Jewelry & Luxury
    prisma.businessType.upsert({
      where: { slug: 'jewelry-luxury' },
      update: {},
      create: { name: 'Jewelry & Luxury', slug: 'jewelry-luxury', description: 'Jewelry and luxury goods', icon: 'gem', color: '#FFD700', order: 37, status: ContentStatus.PUBLISHED },
    }),
    // 38. Beauty Products & Cosmetics
    prisma.businessType.upsert({
      where: { slug: 'beauty-products-cosmetics' },
      update: {},
      create: { name: 'Beauty Products & Cosmetics', slug: 'beauty-products-cosmetics', description: 'Cosmetics and beauty products', icon: 'sparkles', color: '#FF69B4', order: 38, status: ContentStatus.PUBLISHED },
    }),
    // 39. Electronics & Appliances
    prisma.businessType.upsert({
      where: { slug: 'electronics-appliances' },
      update: {},
      create: { name: 'Electronics & Appliances', slug: 'electronics-appliances', description: 'Electronics and appliance stores', icon: 'tv', color: '#2196F3', order: 39, status: ContentStatus.PUBLISHED },
    }),
    // 40. Home & Furniture
    prisma.businessType.upsert({
      where: { slug: 'home-furniture' },
      update: {},
      create: { name: 'Home & Furniture', slug: 'home-furniture', description: 'Furniture and home goods', icon: 'sofa', color: '#8D6E63', order: 40, status: ContentStatus.PUBLISHED },
    }),
    // 41. Food & Grocery Retail
    prisma.businessType.upsert({
      where: { slug: 'food-grocery-retail' },
      update: {},
      create: { name: 'Food & Grocery Retail', slug: 'food-grocery-retail', description: 'Grocery stores and food retail', icon: 'shopping-cart', color: '#4CAF50', order: 41, status: ContentStatus.PUBLISHED },
    }),
    // 42. Industrial & Manufacturing
    prisma.businessType.upsert({
      where: { slug: 'industrial-manufacturing' },
      update: {},
      create: { name: 'Industrial & Manufacturing', slug: 'industrial-manufacturing', description: 'Manufacturing and industrial', icon: 'factory', color: '#455A64', order: 42, status: ContentStatus.PUBLISHED },
    }),
    // 43. Wholesale & Distribution
    prisma.businessType.upsert({
      where: { slug: 'wholesale-distribution' },
      update: {},
      create: { name: 'Wholesale & Distribution', slug: 'wholesale-distribution', description: 'Wholesale and distribution', icon: 'package', color: '#FF9800', order: 43, status: ContentStatus.PUBLISHED },
    }),
    // 44. Industrial Equipment & Supplies
    prisma.businessType.upsert({
      where: { slug: 'industrial-equipment-supplies' },
      update: {},
      create: { name: 'Industrial Equipment & Supplies', slug: 'industrial-equipment-supplies', description: 'Industrial equipment suppliers', icon: 'settings', color: '#607D8B', order: 44, status: ContentStatus.PUBLISHED },
    }),
    // 45. Building Materials & Supplies
    prisma.businessType.upsert({
      where: { slug: 'building-materials-supplies' },
      update: {},
      create: { name: 'Building Materials & Supplies', slug: 'building-materials-supplies', description: 'Building materials suppliers', icon: 'brick-wall', color: '#795548', order: 45, status: ContentStatus.PUBLISHED },
    }),
    // 46. Agriculture & Farming
    prisma.businessType.upsert({
      where: { slug: 'agriculture-farming' },
      update: {},
      create: { name: 'Agriculture & Farming', slug: 'agriculture-farming', description: 'Agriculture and farming', icon: 'wheat', color: '#8BC34A', order: 46, status: ContentStatus.PUBLISHED },
    }),
    // 47. Gardening & Landscaping
    prisma.businessType.upsert({
      where: { slug: 'gardening-landscaping' },
      update: {},
      create: { name: 'Gardening & Landscaping', slug: 'gardening-landscaping', description: 'Gardening and landscaping services', icon: 'flower', color: '#4CAF50', order: 47, status: ContentStatus.PUBLISHED },
    }),
    // 48. Energy & Solar
    prisma.businessType.upsert({
      where: { slug: 'energy-solar' },
      update: {},
      create: { name: 'Energy & Solar', slug: 'energy-solar', description: 'Energy and solar services', icon: 'sun', color: '#FFC107', order: 48, status: ContentStatus.PUBLISHED },
    }),
    // 49. Environmental Services
    prisma.businessType.upsert({
      where: { slug: 'environmental-services' },
      update: {},
      create: { name: 'Environmental Services', slug: 'environmental-services', description: 'Environmental and waste services', icon: 'leaf', color: '#00BCD4', order: 49, status: ContentStatus.PUBLISHED },
    }),
    // 50. Security Services
    prisma.businessType.upsert({
      where: { slug: 'security-services' },
      update: {},
      create: { name: 'Security Services', slug: 'security-services', description: 'Security and surveillance services', icon: 'shield-check', color: '#37474F', order: 50, status: ContentStatus.PUBLISHED },
    }),
    // 51. Locksmith & Access Services
    prisma.businessType.upsert({
      where: { slug: 'locksmith-access-services' },
      update: {},
      create: { name: 'Locksmith & Access Services', slug: 'locksmith-access-services', description: 'Locksmith and access control', icon: 'key', color: '#FF9800', order: 51, status: ContentStatus.PUBLISHED },
    }),
    // 52. Cleaning & Janitorial
    prisma.businessType.upsert({
      where: { slug: 'cleaning-janitorial' },
      update: {},
      create: { name: 'Cleaning & Janitorial', slug: 'cleaning-janitorial', description: 'Cleaning and janitorial services', icon: 'spray-can', color: '#03A9F4', order: 52, status: ContentStatus.PUBLISHED },
    }),
    // 53. Repair & Maintenance
    prisma.businessType.upsert({
      where: { slug: 'repair-maintenance' },
      update: {},
      create: { name: 'Repair & Maintenance', slug: 'repair-maintenance', description: 'Repair and maintenance services', icon: 'wrench', color: '#9E9E9E', order: 53, status: ContentStatus.PUBLISHED },
    }),
    // 54. Marine & Boating
    prisma.businessType.upsert({
      where: { slug: 'marine-boating' },
      update: {},
      create: { name: 'Marine & Boating', slug: 'marine-boating', description: 'Marine and boating services', icon: 'anchor', color: '#006064', order: 54, status: ContentStatus.PUBLISHED },
    }),
    // 55. Aviation Services
    prisma.businessType.upsert({
      where: { slug: 'aviation-services' },
      update: {},
      create: { name: 'Aviation Services', slug: 'aviation-services', description: 'Aviation and flight services', icon: 'plane-takeoff', color: '#5C6BC0', order: 55, status: ContentStatus.PUBLISHED },
    }),
    // 56. Funeral & Memorial Services
    prisma.businessType.upsert({
      where: { slug: 'funeral-memorial-services' },
      update: {},
      create: { name: 'Funeral & Memorial Services', slug: 'funeral-memorial-services', description: 'Funeral and memorial services', icon: 'candlestick-chart', color: '#424242', order: 56, status: ContentStatus.PUBLISHED },
    }),
    // 57. Religious Organizations
    prisma.businessType.upsert({
      where: { slug: 'religious-organizations' },
      update: {},
      create: { name: 'Religious Organizations', slug: 'religious-organizations', description: 'Churches and religious organizations', icon: 'church', color: '#795548', order: 57, status: ContentStatus.PUBLISHED },
    }),
    // 58. Community Organizations
    prisma.businessType.upsert({
      where: { slug: 'community-organizations' },
      update: {},
      create: { name: 'Community Organizations', slug: 'community-organizations', description: 'Community and civic organizations', icon: 'users-2', color: '#26A69A', order: 58, status: ContentStatus.PUBLISHED },
    }),
    // 59. Nonprofit & Charitable Organizations
    prisma.businessType.upsert({
      where: { slug: 'nonprofit-charitable' },
      update: {},
      create: { name: 'Nonprofit & Charitable Organizations', slug: 'nonprofit-charitable', description: 'Nonprofit and charitable organizations', icon: 'heart', color: '#E53935', order: 59, status: ContentStatus.PUBLISHED },
    }),
    // 60. Government & Public Services
    prisma.businessType.upsert({
      where: { slug: 'government-public-services' },
      update: {},
      create: { name: 'Government & Public Services', slug: 'government-public-services', description: 'Government and public services', icon: 'landmark', color: '#546E7A', order: 60, status: ContentStatus.PUBLISHED },
    }),
    // 61. Laboratories & Testing
    prisma.businessType.upsert({
      where: { slug: 'laboratories-testing' },
      update: {},
      create: { name: 'Laboratories & Testing', slug: 'laboratories-testing', description: 'Testing and laboratory services', icon: 'flask-conical', color: '#00ACC1', order: 61, status: ContentStatus.PUBLISHED },
    }),
    // 62. Pharmaceutical & Medical Suppliers
    prisma.businessType.upsert({
      where: { slug: 'pharmaceutical-medical-suppliers' },
      update: {},
      create: { name: 'Pharmaceutical & Medical Suppliers', slug: 'pharmaceutical-medical-suppliers', description: 'Pharmaceutical and medical suppliers', icon: 'pills', color: '#7CB342', order: 62, status: ContentStatus.PUBLISHED },
    }),
    // 63. Chemical & Scientific Services
    prisma.businessType.upsert({
      where: { slug: 'chemical-scientific-services' },
      update: {},
      create: { name: 'Chemical & Scientific Services', slug: 'chemical-scientific-services', description: 'Chemical and scientific services', icon: 'flask-round', color: '#8E24AA', order: 63, status: ContentStatus.PUBLISHED },
    }),
    // 64. Mining & Natural Resources
    prisma.businessType.upsert({
      where: { slug: 'mining-natural-resources' },
      update: {},
      create: { name: 'Mining & Natural Resources', slug: 'mining-natural-resources', description: 'Mining and natural resources', icon: 'mountain', color: '#5D4037', order: 64, status: ContentStatus.PUBLISHED },
    }),
    // 65. Storage & Warehousing
    prisma.businessType.upsert({
      where: { slug: 'storage-warehousing' },
      update: {},
      create: { name: 'Storage & Warehousing', slug: 'storage-warehousing', description: 'Storage and warehousing services', icon: 'warehouse', color: '#78909C', order: 65, status: ContentStatus.PUBLISHED },
    }),
    // 66. Packaging & Logistics Supplies
    prisma.businessType.upsert({
      where: { slug: 'packaging-logistics-supplies' },
      update: {},
      create: { name: 'Packaging & Logistics Supplies', slug: 'packaging-logistics-supplies', description: 'Packaging and logistics supplies', icon: 'box', color: '#FF7043', order: 66, status: ContentStatus.PUBLISHED },
    }),
    // 67. Translation & Language Services
    prisma.businessType.upsert({
      where: { slug: 'translation-language-services' },
      update: {},
      create: { name: 'Translation & Language Services', slug: 'translation-language-services', description: 'Translation and language services', icon: 'languages', color: '#26C6DA', order: 67, status: ContentStatus.PUBLISHED },
    }),
    // 68. Research & Consulting
    prisma.businessType.upsert({
      where: { slug: 'research-consulting' },
      update: {},
      create: { name: 'Research & Consulting', slug: 'research-consulting', description: 'Research and consulting services', icon: 'file-search', color: '#6D4C41', order: 68, status: ContentStatus.PUBLISHED },
    }),
    // 69. Publishing & Creative Services
    prisma.businessType.upsert({
      where: { slug: 'publishing-creative-services' },
      update: {},
      create: { name: 'Publishing & Creative Services', slug: 'publishing-creative-services', description: 'Publishing and creative services', icon: 'newspaper', color: '#AB47BC', order: 69, status: ContentStatus.PUBLISHED },
    }),
    // 70. Specialized & Other Businesses
    prisma.businessType.upsert({
      where: { slug: 'specialized-other-businesses' },
      update: {},
      create: { name: 'Specialized & Other Businesses', slug: 'specialized-other-businesses', description: 'Other specialized businesses', icon: 'grid-3x3', color: '#78909C', order: 70, status: ContentStatus.PUBLISHED },
    }),
  ]);
  console.log('✅ Created business types');

  // Create locations
  const us = await prisma.location.upsert({
    where: { slug_parentId: { slug: 'united-states', parentId: '' } },
    update: {},
    create: { name: 'United States', slug: 'united-states', type: LocationType.COUNTRY },
  });

  const states = await Promise.all([
    prisma.location.upsert({
      where: { slug_parentId: { slug: 'new-york', parentId: us.id } },
      update: {},
      create: { name: 'New York', slug: 'new-york', type: LocationType.STATE, parentId: us.id, latitude: 40.7128, longitude: -74.006 },
    }),
    prisma.location.upsert({
      where: { slug_parentId: { slug: 'texas', parentId: us.id } },
      update: {},
      create: { name: 'Texas', slug: 'texas', type: LocationType.STATE, parentId: us.id },
    }),
    prisma.location.upsert({
      where: { slug_parentId: { slug: 'california', parentId: us.id } },
      update: {},
      create: { name: 'California', slug: 'california', type: LocationType.STATE, parentId: us.id },
    }),
    prisma.location.upsert({
      where: { slug_parentId: { slug: 'florida', parentId: us.id } },
      update: {},
      create: { name: 'Florida', slug: 'florida', type: LocationType.STATE, parentId: us.id },
    }),
  ]);

  const cities = await Promise.all([
    prisma.location.upsert({
      where: { slug_parentId: { slug: 'new-york-city', parentId: states[0].id } },
      update: {},
      create: { name: 'New York City', slug: 'new-york-city', type: LocationType.CITY, parentId: states[0].id, latitude: 40.7128, longitude: -74.006, population: 8336817 },
    }),
    prisma.location.upsert({
      where: { slug_parentId: { slug: 'austin', parentId: states[1].id } },
      update: {},
      create: { name: 'Austin', slug: 'austin', type: LocationType.CITY, parentId: states[1].id, latitude: 30.2672, longitude: -97.7431, population: 974000 },
    }),
    prisma.location.upsert({
      where: { slug_parentId: { slug: 'los-angeles', parentId: states[2].id } },
      update: {},
      create: { name: 'Los Angeles', slug: 'los-angeles', type: LocationType.CITY, parentId: states[2].id, latitude: 34.0522, longitude: -118.2437, population: 3979576 },
    }),
    prisma.location.upsert({
      where: { slug_parentId: { slug: 'miami', parentId: states[3].id } },
      update: {},
      create: { name: 'Miami', slug: 'miami', type: LocationType.CITY, parentId: states[3].id, latitude: 25.7617, longitude: -80.1918, population: 467963 },
    }),
  ]);
  console.log('✅ Created locations');

  // Create categories
  const foodDining = businessTypes.find(t => t.slug === 'food-dining')!;
  const accommodation = businessTypes.find(t => t.slug === 'accommodation-hospitality')!;
  const retail = businessTypes.find(t => t.slug === 'retail-shopping')!;
  const homeProperty = businessTypes.find(t => t.slug === 'home-property-services')!;
  const construction = businessTypes.find(t => t.slug === 'construction-contractors')!;
  const realEstate = businessTypes.find(t => t.slug === 'real-estate-property')!;
  const automotive = businessTypes.find(t => t.slug === 'automotive')!;
  const transportation = businessTypes.find(t => t.slug === 'transportation-logistics')!;
  const carRental = businessTypes.find(t => t.slug === 'car-rental-transport')!;
  const travel = businessTypes.find(t => t.slug === 'travel-tourism')!;
  const health = businessTypes.find(t => t.slug === 'health-medical')!;
  const dental = businessTypes.find(t => t.slug === 'dental-oral-health')!;
  const pharmacy = businessTypes.find(t => t.slug === 'pharmacy-medical-retail')!;
  const beauty = businessTypes.find(t => t.slug === 'beauty-personal-care')!;
  const fitness = businessTypes.find(t => t.slug === 'fitness-wellness')!;
  const pets = businessTypes.find(t => t.slug === 'pets-animals')!;
  const professionalSvcs = businessTypes.find(t => t.slug === 'professional-services')!;
  const legal = businessTypes.find(t => t.slug === 'legal-services')!;
  const accounting = businessTypes.find(t => t.slug === 'accounting-tax-services')!;
  const financial = businessTypes.find(t => t.slug === 'financial-services')!;
  const insurance = businessTypes.find(t => t.slug === 'insurance-services')!;
  const businessSvcs = businessTypes.find(t => t.slug === 'business-services')!;
  const recruitment = businessTypes.find(t => t.slug === 'recruitment-employment')!;
  const marketing = businessTypes.find(t => t.slug === 'marketing-advertising')!;
  const technology = businessTypes.find(t => t.slug === 'technology-it')!;
  const telecom = businessTypes.find(t => t.slug === 'telecommunications')!;
  const education = businessTypes.find(t => t.slug === 'education-training')!;
  const childcare = businessTypes.find(t => t.slug === 'childcare-family-services')!;
  const seniorCare = businessTypes.find(t => t.slug === 'senior-home-care')!;
  const events = businessTypes.find(t => t.slug === 'events-wedding-services')!;
  const entertainment = businessTypes.find(t => t.slug === 'entertainment-nightlife')!;
  const sports = businessTypes.find(t => t.slug === 'sports-recreation')!;
  const arts = businessTypes.find(t => t.slug === 'arts-culture')!;
  const photography = businessTypes.find(t => t.slug === 'photography-media')!;
  const printing = businessTypes.find(t => t.slug === 'printing-signage')!;
  const fashion = businessTypes.find(t => t.slug === 'fashion-apparel')!;
  const jewelry = businessTypes.find(t => t.slug === 'jewelry-luxury')!;
  const cosmetics = businessTypes.find(t => t.slug === 'beauty-products-cosmetics')!;
  const electronics = businessTypes.find(t => t.slug === 'electronics-appliances')!;
  const homeFurniture = businessTypes.find(t => t.slug === 'home-furniture')!;
  const grocery = businessTypes.find(t => t.slug === 'food-grocery-retail')!;
  const industrial = businessTypes.find(t => t.slug === 'industrial-manufacturing')!;
  const wholesale = businessTypes.find(t => t.slug === 'wholesale-distribution')!;
  const industrialEquip = businessTypes.find(t => t.slug === 'industrial-equipment-supplies')!;
  const buildingMaterials = businessTypes.find(t => t.slug === 'building-materials-supplies')!;
  const agriculture = businessTypes.find(t => t.slug === 'agriculture-farming')!;
  const landscaping = businessTypes.find(t => t.slug === 'gardening-landscaping')!;
  const energy = businessTypes.find(t => t.slug === 'energy-solar')!;
  const environmental = businessTypes.find(t => t.slug === 'environmental-services')!;
  const security = businessTypes.find(t => t.slug === 'security-services')!;
  const locksmith = businessTypes.find(t => t.slug === 'locksmith-access-services')!;
  const cleaning = businessTypes.find(t => t.slug === 'cleaning-janitorial')!;
  const repair = businessTypes.find(t => t.slug === 'repair-maintenance')!;
  const marine = businessTypes.find(t => t.slug === 'marine-boating')!;
  const aviation = businessTypes.find(t => t.slug === 'aviation-services')!;
  const funeral = businessTypes.find(t => t.slug === 'funeral-memorial-services')!;
  const religious = businessTypes.find(t => t.slug === 'religious-organizations')!;
  const community = businessTypes.find(t => t.slug === 'community-organizations')!;
  const nonprofit = businessTypes.find(t => t.slug === 'nonprofit-charitable')!;
  const government = businessTypes.find(t => t.slug === 'government-public-services')!;
  const labs = businessTypes.find(t => t.slug === 'laboratories-testing')!;
  const pharma = businessTypes.find(t => t.slug === 'pharmaceutical-medical-suppliers')!;
  const chemical = businessTypes.find(t => t.slug === 'chemical-scientific-services')!;
  const mining = businessTypes.find(t => t.slug === 'mining-natural-resources')!;
  const storage = businessTypes.find(t => t.slug === 'storage-warehousing')!;
  const packaging = businessTypes.find(t => t.slug === 'packaging-logistics-supplies')!;
  const translation = businessTypes.find(t => t.slug === 'translation-language-services')!;
  const research = businessTypes.find(t => t.slug === 'research-consulting')!;
  const publishing = businessTypes.find(t => t.slug === 'publishing-creative-services')!;
  const specialized = businessTypes.find(t => t.slug === 'specialized-other-businesses')!;

  const categories = await Promise.all([
    // Food & Dining categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'restaurants', businessTypeId: foodDining.id } }, update: {}, create: { name: 'Restaurants', slug: 'restaurants', businessTypeId: foodDining.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'fast-food', businessTypeId: foodDining.id } }, update: {}, create: { name: 'Fast Food', slug: 'fast-food', businessTypeId: foodDining.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'cafes-coffee-shops', businessTypeId: foodDining.id } }, update: {}, create: { name: 'Cafes & Coffee Shops', slug: 'cafes-coffee-shops', businessTypeId: foodDining.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'bars-pubs', businessTypeId: foodDining.id } }, update: {}, create: { name: 'Bars & Pubs', slug: 'bars-pubs', businessTypeId: foodDining.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'food-trucks', businessTypeId: foodDining.id } }, update: {}, create: { name: 'Food Trucks', slug: 'food-trucks', businessTypeId: foodDining.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'bakeries', businessTypeId: foodDining.id } }, update: {}, create: { name: 'Bakeries', slug: 'bakeries', businessTypeId: foodDining.id, order: 6, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'ice-cream-parlors', businessTypeId: foodDining.id } }, update: {}, create: { name: 'Ice Cream Parlors', slug: 'ice-cream-parlors', businessTypeId: foodDining.id, order: 7, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'pizza-places', businessTypeId: foodDining.id } }, update: {}, create: { name: 'Pizza Places', slug: 'pizza-places', businessTypeId: foodDining.id, order: 8, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'seafood-restaurants', businessTypeId: foodDining.id } }, update: {}, create: { name: 'Seafood Restaurants', slug: 'seafood-restaurants', businessTypeId: foodDining.id, order: 9, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'asian-restaurants', businessTypeId: foodDining.id } }, update: {}, create: { name: 'Asian Restaurants', slug: 'asian-restaurants', businessTypeId: foodDining.id, order: 10, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'mexican-restaurants', businessTypeId: foodDining.id } }, update: {}, create: { name: 'Mexican Restaurants', slug: 'mexican-restaurants', businessTypeId: foodDining.id, order: 11, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'indian-restaurants', businessTypeId: foodDining.id } }, update: {}, create: { name: 'Indian Restaurants', slug: 'indian-restaurants', businessTypeId: foodDining.id, order: 12, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'italian-restaurants', businessTypeId: foodDining.id } }, update: {}, create: { name: 'Italian Restaurants', slug: 'italian-restaurants', businessTypeId: foodDining.id, order: 13, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'food-delivery-services', businessTypeId: foodDining.id } }, update: {}, create: { name: 'Food Delivery Services', slug: 'food-delivery-services', businessTypeId: foodDining.id, order: 14, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'catering-services', businessTypeId: foodDining.id } }, update: {}, create: { name: 'Catering Services', slug: 'catering-services', businessTypeId: foodDining.id, order: 15, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'food-courts', businessTypeId: foodDining.id } }, update: {}, create: { name: 'Food Courts', slug: 'food-courts', businessTypeId: foodDining.id, order: 16, status: ContentStatus.PUBLISHED } }),
    // Accommodation & Hospitality categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'hotels-motels', businessTypeId: accommodation.id } }, update: {}, create: { name: 'Hotels & Motels', slug: 'hotels-motels', businessTypeId: accommodation.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'luxury-resorts', businessTypeId: accommodation.id } }, update: {}, create: { name: 'Luxury Resorts', slug: 'luxury-resorts', businessTypeId: accommodation.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'boutique-hotels', businessTypeId: accommodation.id } }, update: {}, create: { name: 'Boutique Hotels', slug: 'boutique-hotels', businessTypeId: accommodation.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'budget-accommodations', businessTypeId: accommodation.id } }, update: {}, create: { name: 'Budget Accommodations', slug: 'budget-accommodations', businessTypeId: accommodation.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'vacation-rentals', businessTypeId: accommodation.id } }, update: {}, create: { name: 'Vacation Rentals', slug: 'vacation-rentals', businessTypeId: accommodation.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'bed-breakfast', businessTypeId: accommodation.id } }, update: {}, create: { name: 'Bed & Breakfast', slug: 'bed-breakfast', businessTypeId: accommodation.id, order: 6, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'hostels', businessTypeId: accommodation.id } }, update: {}, create: { name: 'Hostels', slug: 'hostels', businessTypeId: accommodation.id, order: 7, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'inn-suites', businessTypeId: accommodation.id } }, update: {}, create: { name: 'Inn & Suites', slug: 'inn-suites', businessTypeId: accommodation.id, order: 8, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'guest-houses', businessTypeId: accommodation.id } }, update: {}, create: { name: 'Guest Houses', slug: 'guest-houses', businessTypeId: accommodation.id, order: 9, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'serviced-apartments', businessTypeId: accommodation.id } }, update: {}, create: { name: 'Serviced Apartments', slug: 'serviced-apartments', businessTypeId: accommodation.id, order: 10, status: ContentStatus.PUBLISHED } }),
    // Retail & Shopping categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'department-stores', businessTypeId: retail.id } }, update: {}, create: { name: 'Department Stores', slug: 'department-stores', businessTypeId: retail.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'shopping-malls', businessTypeId: retail.id } }, update: {}, create: { name: 'Shopping Malls', slug: 'shopping-malls', businessTypeId: retail.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'boutique-shops', businessTypeId: retail.id } }, update: {}, create: { name: 'Boutique Shops', slug: 'boutique-shops', businessTypeId: retail.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'outlet-stores', businessTypeId: retail.id } }, update: {}, create: { name: 'Outlet Stores', slug: 'outlet-stores', businessTypeId: retail.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'convenience-stores', businessTypeId: retail.id } }, update: {}, create: { name: 'Convenience Stores', slug: 'convenience-stores', businessTypeId: retail.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'discount-stores', businessTypeId: retail.id } }, update: {}, create: { name: 'Discount Stores', slug: 'discount-stores', businessTypeId: retail.id, order: 6, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'thrift-stores', businessTypeId: retail.id } }, update: {}, create: { name: 'Thrift Stores', slug: 'thrift-stores', businessTypeId: retail.id, order: 7, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'flea-markets', businessTypeId: retail.id } }, update: {}, create: { name: 'Flea Markets', slug: 'flea-markets', businessTypeId: retail.id, order: 8, status: ContentStatus.PUBLISHED } }),
    // Home & Property Services categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'plumbing-services', businessTypeId: homeProperty.id } }, update: {}, create: { name: 'Plumbing Services', slug: 'plumbing-services', businessTypeId: homeProperty.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'electrical-services', businessTypeId: homeProperty.id } }, update: {}, create: { name: 'Electrical Services', slug: 'electrical-services', businessTypeId: homeProperty.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'hvac-services', businessTypeId: homeProperty.id } }, update: {}, create: { name: 'HVAC Services', slug: 'hvac-services', businessTypeId: homeProperty.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'pest-control', businessTypeId: homeProperty.id } }, update: {}, create: { name: 'Pest Control', slug: 'pest-control', businessTypeId: homeProperty.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'home-cleaning', businessTypeId: homeProperty.id } }, update: {}, create: { name: 'Home Cleaning', slug: 'home-cleaning', businessTypeId: homeProperty.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'moving-services', businessTypeId: homeProperty.id } }, update: {}, create: { name: 'Moving Services', slug: 'moving-services', businessTypeId: homeProperty.id, order: 6, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'handyman-services', businessTypeId: homeProperty.id } }, update: {}, create: { name: 'Handyman Services', slug: 'handyman-services', businessTypeId: homeProperty.id, order: 7, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'appliance-repair', businessTypeId: homeProperty.id } }, update: {}, create: { name: 'Appliance Repair', slug: 'appliance-repair', businessTypeId: homeProperty.id, order: 8, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'locksmith-services', businessTypeId: homeProperty.id } }, update: {}, create: { name: 'Locksmith Services', slug: 'locksmith-services', businessTypeId: homeProperty.id, order: 9, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'window-cleaning', businessTypeId: homeProperty.id } }, update: {}, create: { name: 'Window Cleaning', slug: 'window-cleaning', businessTypeId: homeProperty.id, order: 10, status: ContentStatus.PUBLISHED } }),
    // Construction & Contractors categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'general-contractors', businessTypeId: construction.id } }, update: {}, create: { name: 'General Contractors', slug: 'general-contractors', businessTypeId: construction.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'residential-builders', businessTypeId: construction.id } }, update: {}, create: { name: 'Residential Builders', slug: 'residential-builders', businessTypeId: construction.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'commercial-builders', businessTypeId: construction.id } }, update: {}, create: { name: 'Commercial Builders', slug: 'commercial-builders', businessTypeId: construction.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'renovation-contractors', businessTypeId: construction.id } }, update: {}, create: { name: 'Renovation Contractors', slug: 'renovation-contractors', businessTypeId: construction.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'roofing-contractors', businessTypeId: construction.id } }, update: {}, create: { name: 'Roofing Contractors', slug: 'roofing-contractors', businessTypeId: construction.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'foundation-contractors', businessTypeId: construction.id } }, update: {}, create: { name: 'Foundation Contractors', slug: 'foundation-contractors', businessTypeId: construction.id, order: 6, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'demolition-services', businessTypeId: construction.id } }, update: {}, create: { name: 'Demolition Services', slug: 'demolition-services', businessTypeId: construction.id, order: 7, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'excavation-services', businessTypeId: construction.id } }, update: {}, create: { name: 'Excavation Services', slug: 'excavation-services', businessTypeId: construction.id, order: 8, status: ContentStatus.PUBLISHED } }),
    // Real Estate & Property categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'real-estate-agents', businessTypeId: realEstate.id } }, update: {}, create: { name: 'Real Estate Agents', slug: 'real-estate-agents', businessTypeId: realEstate.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'real-estate-agencies', businessTypeId: realEstate.id } }, update: {}, create: { name: 'Real Estate Agencies', slug: 'real-estate-agencies', businessTypeId: realEstate.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'property-management', businessTypeId: realEstate.id } }, update: {}, create: { name: 'Property Management', slug: 'property-management', businessTypeId: realEstate.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'mortgage-brokers', businessTypeId: realEstate.id } }, update: {}, create: { name: 'Mortgage Brokers', slug: 'mortgage-brokers', businessTypeId: realEstate.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'title-companies', businessTypeId: realEstate.id } }, update: {}, create: { name: 'Title Companies', slug: 'title-companies', businessTypeId: realEstate.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'home-inspectors', businessTypeId: realEstate.id } }, update: {}, create: { name: 'Home Inspectors', slug: 'home-inspectors', businessTypeId: realEstate.id, order: 6, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'appraisers', businessTypeId: realEstate.id } }, update: {}, create: { name: 'Appraisers', slug: 'appraisers', businessTypeId: realEstate.id, order: 7, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'commercial-real-estate', businessTypeId: realEstate.id } }, update: {}, create: { name: 'Commercial Real Estate', slug: 'commercial-real-estate', businessTypeId: realEstate.id, order: 8, status: ContentStatus.PUBLISHED } }),
    // Automotive categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'car-dealers', businessTypeId: automotive.id } }, update: {}, create: { name: 'Car Dealers', slug: 'car-dealers', businessTypeId: automotive.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'auto-repair', businessTypeId: automotive.id } }, update: {}, create: { name: 'Auto Repair', slug: 'auto-repair', businessTypeId: automotive.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'auto-parts', businessTypeId: automotive.id } }, update: {}, create: { name: 'Auto Parts', slug: 'auto-parts', businessTypeId: automotive.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'car-wash', businessTypeId: automotive.id } }, update: {}, create: { name: 'Car Wash', slug: 'car-wash', businessTypeId: automotive.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'tire-shops', businessTypeId: automotive.id } }, update: {}, create: { name: 'Tire Shops', slug: 'tire-shops', businessTypeId: automotive.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'gas-stations', businessTypeId: automotive.id } }, update: {}, create: { name: 'Gas Stations', slug: 'gas-stations', businessTypeId: automotive.id, order: 6, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'auto-body-shops', businessTypeId: automotive.id } }, update: {}, create: { name: 'Auto Body Shops', slug: 'auto-body-shops', businessTypeId: automotive.id, order: 7, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'oil-change', businessTypeId: automotive.id } }, update: {}, create: { name: 'Oil Change Services', slug: 'oil-change', businessTypeId: automotive.id, order: 8, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'auto-glass', businessTypeId: automotive.id } }, update: {}, create: { name: 'Auto Glass', slug: 'auto-glass', businessTypeId: automotive.id, order: 9, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'motorcycle-dealers', businessTypeId: automotive.id } }, update: {}, create: { name: 'Motorcycle Dealers', slug: 'motorcycle-dealers', businessTypeId: automotive.id, order: 10, status: ContentStatus.PUBLISHED } }),
    // Transportation & Logistics categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'trucking-companies', businessTypeId: transportation.id } }, update: {}, create: { name: 'Trucking Companies', slug: 'trucking-companies', businessTypeId: transportation.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'freight-services', businessTypeId: transportation.id } }, update: {}, create: { name: 'Freight Services', slug: 'freight-services', businessTypeId: transportation.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'courier-services', businessTypeId: transportation.id } }, update: {}, create: { name: 'Courier Services', slug: 'courier-services', businessTypeId: transportation.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'shipping-companies', businessTypeId: transportation.id } }, update: {}, create: { name: 'Shipping Companies', slug: 'shipping-companies', businessTypeId: transportation.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'taxi-services', businessTypeId: transportation.id } }, update: {}, create: { name: 'Taxi Services', slug: 'taxi-services', businessTypeId: transportation.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'rideshare-services', businessTypeId: transportation.id } }, update: {}, create: { name: 'Rideshare Services', slug: 'rideshare-services', businessTypeId: transportation.id, order: 6, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'public-transit', businessTypeId: transportation.id } }, update: {}, create: { name: 'Public Transit', slug: 'public-transit', businessTypeId: transportation.id, order: 7, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'bus-companies', businessTypeId: transportation.id } }, update: {}, create: { name: 'Bus Companies', slug: 'bus-companies', businessTypeId: transportation.id, order: 8, status: ContentStatus.PUBLISHED } }),
    // Car Rental & Transport Services categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'car-rental-agencies', businessTypeId: carRental.id } }, update: {}, create: { name: 'Car Rental Agencies', slug: 'car-rental-agencies', businessTypeId: carRental.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'limousine-services', businessTypeId: carRental.id } }, update: {}, create: { name: 'Limousine Services', slug: 'limousine-services', businessTypeId: carRental.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'chauffeur-services', businessTypeId: carRental.id } }, update: {}, create: { name: 'Chauffeur Services', slug: 'chauffeur-services', businessTypeId: carRental.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'rv-rentals', businessTypeId: carRental.id } }, update: {}, create: { name: 'RV Rentals', slug: 'rv-rentals', businessTypeId: carRental.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'van-rentals', businessTypeId: carRental.id } }, update: {}, create: { name: 'Van Rentals', slug: 'van-rentals', businessTypeId: carRental.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'luxury-car-rentals', businessTypeId: carRental.id } }, update: {}, create: { name: 'Luxury Car Rentals', slug: 'luxury-car-rentals', businessTypeId: carRental.id, order: 6, status: ContentStatus.PUBLISHED } }),
    // Travel & Tourism categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'travel-agencies', businessTypeId: travel.id } }, update: {}, create: { name: 'Travel Agencies', slug: 'travel-agencies', businessTypeId: travel.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'tour-operators', businessTypeId: travel.id } }, update: {}, create: { name: 'Tour Operators', slug: 'tour-operators', businessTypeId: travel.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'tourist-attractions', businessTypeId: travel.id } }, update: {}, create: { name: 'Tourist Attractions', slug: 'tourist-attractions', businessTypeId: travel.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'museums', businessTypeId: travel.id } }, update: {}, create: { name: 'Museums', slug: 'museums', businessTypeId: travel.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'guided-tours', businessTypeId: travel.id } }, update: {}, create: { name: 'Guided Tours', slug: 'guided-tours', businessTypeId: travel.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'vacation-packages', businessTypeId: travel.id } }, update: {}, create: { name: 'Vacation Packages', slug: 'vacation-packages', businessTypeId: travel.id, order: 6, status: ContentStatus.PUBLISHED } }),
    // Health & Medical categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'hospitals', businessTypeId: health.id } }, update: {}, create: { name: 'Hospitals', slug: 'hospitals', businessTypeId: health.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'medical-clinics', businessTypeId: health.id } }, update: {}, create: { name: 'Medical Clinics', slug: 'medical-clinics', businessTypeId: health.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'doctors-physicians', businessTypeId: health.id } }, update: {}, create: { name: 'Doctors & Physicians', slug: 'doctors-physicians', businessTypeId: health.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'medical-specialists', businessTypeId: health.id } }, update: {}, create: { name: 'Medical Specialists', slug: 'medical-specialists', businessTypeId: health.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'urgent-care', businessTypeId: health.id } }, update: {}, create: { name: 'Urgent Care', slug: 'urgent-care', businessTypeId: health.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'emergency-rooms', businessTypeId: health.id } }, update: {}, create: { name: 'Emergency Rooms', slug: 'emergency-rooms', businessTypeId: health.id, order: 6, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'pediatricians', businessTypeId: health.id } }, update: {}, create: { name: 'Pediatricians', slug: 'pediatricians', businessTypeId: health.id, order: 7, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'cardiologists', businessTypeId: health.id } }, update: {}, create: { name: 'Cardiologists', slug: 'cardiologists', businessTypeId: health.id, order: 8, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'dermatologists', businessTypeId: health.id } }, update: {}, create: { name: 'Dermatologists', slug: 'dermatologists', businessTypeId: health.id, order: 9, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'orthopedists', businessTypeId: health.id } }, update: {}, create: { name: 'Orthopedists', slug: 'orthopedists', businessTypeId: health.id, order: 10, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'physical-therapy', businessTypeId: health.id } }, update: {}, create: { name: 'Physical Therapy', slug: 'physical-therapy', businessTypeId: health.id, order: 11, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'mental-health-services', businessTypeId: health.id } }, update: {}, create: { name: 'Mental Health Services', slug: 'mental-health-services', businessTypeId: health.id, order: 12, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'chiropractors', businessTypeId: health.id } }, update: {}, create: { name: 'Chiropractors', slug: 'chiropractors', businessTypeId: health.id, order: 13, status: ContentStatus.PUBLISHED } }),
    // Dental & Oral Health categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'dentists', businessTypeId: dental.id } }, update: {}, create: { name: 'Dentists', slug: 'dentists', businessTypeId: dental.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'orthodontists', businessTypeId: dental.id } }, update: {}, create: { name: 'Orthodontists', slug: 'orthodontists', businessTypeId: dental.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'oral-surgeons', businessTypeId: dental.id } }, update: {}, create: { name: 'Oral Surgeons', slug: 'oral-surgeons', businessTypeId: dental.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'dental-hygienists', businessTypeId: dental.id } }, update: {}, create: { name: 'Dental Hygienists', slug: 'dental-hygienists', businessTypeId: dental.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'pediatric-dentists', businessTypeId: dental.id } }, update: {}, create: { name: 'Pediatric Dentists', slug: 'pediatric-dentists', businessTypeId: dental.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'dental-labs', businessTypeId: dental.id } }, update: {}, create: { name: 'Dental Labs', slug: 'dental-labs', businessTypeId: dental.id, order: 6, status: ContentStatus.PUBLISHED } }),
    // Pharmacy & Medical Retail categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'pharmacies', businessTypeId: pharmacy.id } }, update: {}, create: { name: 'Pharmacies', slug: 'pharmacies', businessTypeId: pharmacy.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'drug-stores', businessTypeId: pharmacy.id } }, update: {}, create: { name: 'Drug Stores', slug: 'drug-stores', businessTypeId: pharmacy.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'medical-supply-stores', businessTypeId: pharmacy.id } }, update: {}, create: { name: 'Medical Supply Stores', slug: 'medical-supply-stores', businessTypeId: pharmacy.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'vitamin-supplement-stores', businessTypeId: pharmacy.id } }, update: {}, create: { name: 'Vitamin & Supplement Stores', slug: 'vitamin-supplement-stores', businessTypeId: pharmacy.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'home-medical-equipment', businessTypeId: pharmacy.id } }, update: {}, create: { name: 'Home Medical Equipment', slug: 'home-medical-equipment', businessTypeId: pharmacy.id, order: 5, status: ContentStatus.PUBLISHED } }),
    // Beauty & Personal Care categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'hair-salons', businessTypeId: beauty.id } }, update: {}, create: { name: 'Hair Salons', slug: 'hair-salons', businessTypeId: beauty.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'nail-salons', businessTypeId: beauty.id } }, update: {}, create: { name: 'Nail Salons', slug: 'nail-salons', businessTypeId: beauty.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'barbershops', businessTypeId: beauty.id } }, update: {}, create: { name: 'Barbershops', slug: 'barbershops', businessTypeId: beauty.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'spas', businessTypeId: beauty.id } }, update: {}, create: { name: 'Spas', slug: 'spas', businessTypeId: beauty.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'beauty-salons', businessTypeId: beauty.id } }, update: {}, create: { name: 'Beauty Salons', slug: 'beauty-salons', businessTypeId: beauty.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'makeup-artists', businessTypeId: beauty.id } }, update: {}, create: { name: 'Makeup Artists', slug: 'makeup-artists', businessTypeId: beauty.id, order: 6, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'skincare-clinics', businessTypeId: beauty.id } }, update: {}, create: { name: 'Skincare Clinics', slug: 'skincare-clinics', businessTypeId: beauty.id, order: 7, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'eyelash-extensions', businessTypeId: beauty.id } }, update: {}, create: { name: 'Eyelash Extensions', slug: 'eyelash-extensions', businessTypeId: beauty.id, order: 8, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'tanning-salons', businessTypeId: beauty.id } }, update: {}, create: { name: 'Tanning Salons', slug: 'tanning-salons', businessTypeId: beauty.id, order: 9, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'waxing-services', businessTypeId: beauty.id } }, update: {}, create: { name: 'Waxing Services', slug: 'waxing-services', businessTypeId: beauty.id, order: 10, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'massage-therapy', businessTypeId: beauty.id } }, update: {}, create: { name: 'Massage Therapy', slug: 'massage-therapy', businessTypeId: beauty.id, order: 11, status: ContentStatus.PUBLISHED } }),
    // Fitness & Wellness categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'gyms-fitness-centers', businessTypeId: fitness.id } }, update: {}, create: { name: 'Gyms & Fitness Centers', slug: 'gyms-fitness-centers', businessTypeId: fitness.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'yoga-studios', businessTypeId: fitness.id } }, update: {}, create: { name: 'Yoga Studios', slug: 'yoga-studios', businessTypeId: fitness.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'pilates-studios', businessTypeId: fitness.id } }, update: {}, create: { name: 'Pilates Studios', slug: 'pilates-studios', businessTypeId: fitness.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'swimming-pools', businessTypeId: fitness.id } }, update: {}, create: { name: 'Swimming Pools', slug: 'swimming-pools', businessTypeId: fitness.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'martial-arts-schools', businessTypeId: fitness.id } }, update: {}, create: { name: 'Martial Arts Schools', slug: 'martial-arts-schools', businessTypeId: fitness.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'personal-trainers', businessTypeId: fitness.id } }, update: {}, create: { name: 'Personal Trainers', slug: 'personal-trainers', businessTypeId: fitness.id, order: 6, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'crossfit-gyms', businessTypeId: fitness.id } }, update: {}, create: { name: 'Crossfit Gyms', slug: 'crossfit-gyms', businessTypeId: fitness.id, order: 7, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'nutritionists', businessTypeId: fitness.id } }, update: {}, create: { name: 'Nutritionists', slug: 'nutritionists', businessTypeId: fitness.id, order: 8, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'health-clubs', businessTypeId: fitness.id } }, update: {}, create: { name: 'Health Clubs', slug: 'health-clubs', businessTypeId: fitness.id, order: 9, status: ContentStatus.PUBLISHED } }),
    // Pets & Animals categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'veterinarians', businessTypeId: pets.id } }, update: {}, create: { name: 'Veterinarians', slug: 'veterinarians', businessTypeId: pets.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'pet-stores', businessTypeId: pets.id } }, update: {}, create: { name: 'Pet Stores', slug: 'pet-stores', businessTypeId: pets.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'pet-grooming', businessTypeId: pets.id } }, update: {}, create: { name: 'Pet Grooming', slug: 'pet-grooming', businessTypeId: pets.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'pet-boarding-daycare', businessTypeId: pets.id } }, update: {}, create: { name: 'Pet Boarding & Daycare', slug: 'pet-boarding-daycare', businessTypeId: pets.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'dog-trainers', businessTypeId: pets.id } }, update: {}, create: { name: 'Dog Trainers', slug: 'dog-trainers', businessTypeId: pets.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'dog-walkers', businessTypeId: pets.id } }, update: {}, create: { name: 'Dog Walkers', slug: 'dog-walkers', businessTypeId: pets.id, order: 6, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'pet-supplies', businessTypeId: pets.id } }, update: {}, create: { name: 'Pet Supplies', slug: 'pet-supplies', businessTypeId: pets.id, order: 7, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'animal-shelters', businessTypeId: pets.id } }, update: {}, create: { name: 'Animal Shelters', slug: 'animal-shelters', businessTypeId: pets.id, order: 8, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'horse-boarding', businessTypeId: pets.id } }, update: {}, create: { name: 'Horse Boarding', slug: 'horse-boarding', businessTypeId: pets.id, order: 9, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'aquarium-services', businessTypeId: pets.id } }, update: {}, create: { name: 'Aquarium Services', slug: 'aquarium-services', businessTypeId: pets.id, order: 10, status: ContentStatus.PUBLISHED } }),
    // Professional Services categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'consulting-firms', businessTypeId: professionalSvcs.id } }, update: {}, create: { name: 'Consulting Firms', slug: 'consulting-firms', businessTypeId: professionalSvcs.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'management-consulting', businessTypeId: professionalSvcs.id } }, update: {}, create: { name: 'Management Consulting', slug: 'management-consulting', businessTypeId: professionalSvcs.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'hr-consulting', businessTypeId: professionalSvcs.id } }, update: {}, create: { name: 'HR Consulting', slug: 'hr-consulting', businessTypeId: professionalSvcs.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'it-consulting', businessTypeId: professionalSvcs.id } }, update: {}, create: { name: 'IT Consulting', slug: 'it-consulting', businessTypeId: professionalSvcs.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'management-training', businessTypeId: professionalSvcs.id } }, update: {}, create: { name: 'Management Training', slug: 'management-training', businessTypeId: professionalSvcs.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'executive-search', businessTypeId: professionalSvcs.id } }, update: {}, create: { name: 'Executive Search', slug: 'executive-search', businessTypeId: professionalSvcs.id, order: 6, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'professional-associations', businessTypeId: professionalSvcs.id } }, update: {}, create: { name: 'Professional Associations', slug: 'professional-associations', businessTypeId: professionalSvcs.id, order: 7, status: ContentStatus.PUBLISHED } }),
    // Legal Services categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'lawyers-attorneys', businessTypeId: legal.id } }, update: {}, create: { name: 'Lawyers & Attorneys', slug: 'lawyers-attorneys', businessTypeId: legal.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'law-firms', businessTypeId: legal.id } }, update: {}, create: { name: 'Law Firms', slug: 'law-firms', businessTypeId: legal.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'notaries-public', businessTypeId: legal.id } }, update: {}, create: { name: 'Notaries Public', slug: 'notaries-public', businessTypeId: legal.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'legal-aid', businessTypeId: legal.id } }, update: {}, create: { name: 'Legal Aid', slug: 'legal-aid', businessTypeId: legal.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'paralegal-services', businessTypeId: legal.id } }, update: {}, create: { name: 'Paralegal Services', slug: 'paralegal-services', businessTypeId: legal.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'mediators', businessTypeId: legal.id } }, update: {}, create: { name: 'Mediators', slug: 'mediators', businessTypeId: legal.id, order: 6, status: ContentStatus.PUBLISHED } }),
    // Accounting & Tax Services categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'accountants', businessTypeId: accounting.id } }, update: {}, create: { name: 'Accountants', slug: 'accountants', businessTypeId: accounting.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'tax-preparation', businessTypeId: accounting.id } }, update: {}, create: { name: 'Tax Preparation', slug: 'tax-preparation', businessTypeId: accounting.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'bookkeeping-services', businessTypeId: accounting.id } }, update: {}, create: { name: 'Bookkeeping Services', slug: 'bookkeeping-services', businessTypeId: accounting.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'auditing-services', businessTypeId: accounting.id } }, update: {}, create: { name: 'Auditing Services', slug: 'auditing-services', businessTypeId: accounting.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'payroll-services', businessTypeId: accounting.id } }, update: {}, create: { name: 'Payroll Services', slug: 'payroll-services', businessTypeId: accounting.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'financial-advisors', businessTypeId: accounting.id } }, update: {}, create: { name: 'Financial Advisors', slug: 'financial-advisors', businessTypeId: accounting.id, order: 6, status: ContentStatus.PUBLISHED } }),
    // Financial Services categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'banks', businessTypeId: financial.id } }, update: {}, create: { name: 'Banks', slug: 'banks', businessTypeId: financial.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'credit-unions', businessTypeId: financial.id } }, update: {}, create: { name: 'Credit Unions', slug: 'credit-unions', businessTypeId: financial.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'investment-firms', businessTypeId: financial.id } }, update: {}, create: { name: 'Investment Firms', slug: 'investment-firms', businessTypeId: financial.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'stockbrokers', businessTypeId: financial.id } }, update: {}, create: { name: 'Stockbrokers', slug: 'stockbrokers', businessTypeId: financial.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'loan-services', businessTypeId: financial.id } }, update: {}, create: { name: 'Loan Services', slug: 'loan-services', businessTypeId: financial.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'currency-exchange', businessTypeId: financial.id } }, update: {}, create: { name: 'Currency Exchange', slug: 'currency-exchange', businessTypeId: financial.id, order: 6, status: ContentStatus.PUBLISHED } }),
    // Insurance Services categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'insurance-agencies', businessTypeId: insurance.id } }, update: {}, create: { name: 'Insurance Agencies', slug: 'insurance-agencies', businessTypeId: insurance.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'auto-insurance', businessTypeId: insurance.id } }, update: {}, create: { name: 'Auto Insurance', slug: 'auto-insurance', businessTypeId: insurance.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'home-insurance', businessTypeId: insurance.id } }, update: {}, create: { name: 'Home Insurance', slug: 'home-insurance', businessTypeId: insurance.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'life-insurance', businessTypeId: insurance.id } }, update: {}, create: { name: 'Life Insurance', slug: 'life-insurance', businessTypeId: insurance.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'health-insurance', businessTypeId: insurance.id } }, update: {}, create: { name: 'Health Insurance', slug: 'health-insurance', businessTypeId: insurance.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'business-insurance', businessTypeId: insurance.id } }, update: {}, create: { name: 'Business Insurance', slug: 'business-insurance', businessTypeId: insurance.id, order: 6, status: ContentStatus.PUBLISHED } }),
    // Business Services categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'business-consultants', businessTypeId: businessSvcs.id } }, update: {}, create: { name: 'Business Consultants', slug: 'business-consultants', businessTypeId: businessSvcs.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'office-supplies', businessTypeId: businessSvcs.id } }, update: {}, create: { name: 'Office Supplies', slug: 'office-supplies', businessTypeId: businessSvcs.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'virtual-offices', businessTypeId: businessSvcs.id } }, update: {}, create: { name: 'Virtual Offices', slug: 'virtual-offices', businessTypeId: businessSvcs.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'coworking-spaces', businessTypeId: businessSvcs.id } }, update: {}, create: { name: 'Coworking Spaces', slug: 'coworking-spaces', businessTypeId: businessSvcs.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'conference-rooms', businessTypeId: businessSvcs.id } }, update: {}, create: { name: 'Conference Rooms', slug: 'conference-rooms', businessTypeId: businessSvcs.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'mailing-services', businessTypeId: businessSvcs.id } }, update: {}, create: { name: 'Mailing Services', slug: 'mailing-services', businessTypeId: businessSvcs.id, order: 6, status: ContentStatus.PUBLISHED } }),
    // Recruitment & Employment categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'employment-agencies', businessTypeId: recruitment.id } }, update: {}, create: { name: 'Employment Agencies', slug: 'employment-agencies', businessTypeId: recruitment.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'staffing-agencies', businessTypeId: recruitment.id } }, update: {}, create: { name: 'Staffing Agencies', slug: 'staffing-agencies', businessTypeId: recruitment.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'headhunters', businessTypeId: recruitment.id } }, update: {}, create: { name: 'Headhunters', slug: 'headhunters', businessTypeId: recruitment.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'job-training', businessTypeId: recruitment.id } }, update: {}, create: { name: 'Job Training', slug: 'job-training', businessTypeId: recruitment.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'career-counseling', businessTypeId: recruitment.id } }, update: {}, create: { name: 'Career Counseling', slug: 'career-counseling', businessTypeId: recruitment.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'resume-services', businessTypeId: recruitment.id } }, update: {}, create: { name: 'Resume Services', slug: 'resume-services', businessTypeId: recruitment.id, order: 6, status: ContentStatus.PUBLISHED } }),
    // Marketing & Advertising categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'advertising-agencies', businessTypeId: marketing.id } }, update: {}, create: { name: 'Advertising Agencies', slug: 'advertising-agencies', businessTypeId: marketing.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'digital-marketing', businessTypeId: marketing.id } }, update: {}, create: { name: 'Digital Marketing', slug: 'digital-marketing', businessTypeId: marketing.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'seo-services', businessTypeId: marketing.id } }, update: {}, create: { name: 'SEO Services', slug: 'seo-services', businessTypeId: marketing.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'social-media-marketing', businessTypeId: marketing.id } }, update: {}, create: { name: 'Social Media Marketing', slug: 'social-media-marketing', businessTypeId: marketing.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'public-relations', businessTypeId: marketing.id } }, update: {}, create: { name: 'Public Relations', slug: 'public-relations', businessTypeId: marketing.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'graphic-design', businessTypeId: marketing.id } }, update: {}, create: { name: 'Graphic Design', slug: 'graphic-design', businessTypeId: marketing.id, order: 6, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'branding-agencies', businessTypeId: marketing.id } }, update: {}, create: { name: 'Branding Agencies', slug: 'branding-agencies', businessTypeId: marketing.id, order: 7, status: ContentStatus.PUBLISHED } }),
    // Technology & IT categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'software-development', businessTypeId: technology.id } }, update: {}, create: { name: 'Software Development', slug: 'software-development', businessTypeId: technology.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'web-development', businessTypeId: technology.id } }, update: {}, create: { name: 'Web Development', slug: 'web-development', businessTypeId: technology.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'app-development', businessTypeId: technology.id } }, update: {}, create: { name: 'App Development', slug: 'app-development', businessTypeId: technology.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'it-consulting-tech', businessTypeId: technology.id } }, update: {}, create: { name: 'IT Consulting', slug: 'it-consulting-tech', businessTypeId: technology.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'computer-repair', businessTypeId: technology.id } }, update: {}, create: { name: 'Computer Repair', slug: 'computer-repair', businessTypeId: technology.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'phone-tablet-repair', businessTypeId: technology.id } }, update: {}, create: { name: 'Phone & Tablet Repair', slug: 'phone-tablet-repair', businessTypeId: technology.id, order: 6, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'data-recovery', businessTypeId: technology.id } }, update: {}, create: { name: 'Data Recovery', slug: 'data-recovery', businessTypeId: technology.id, order: 7, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'cloud-services', businessTypeId: technology.id } }, update: {}, create: { name: 'Cloud Services', slug: 'cloud-services', businessTypeId: technology.id, order: 8, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'cybersecurity', businessTypeId: technology.id } }, update: {}, create: { name: 'Cybersecurity', slug: 'cybersecurity', businessTypeId: technology.id, order: 9, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'tech-retail', businessTypeId: technology.id } }, update: {}, create: { name: 'Tech Retail', slug: 'tech-retail', businessTypeId: technology.id, order: 10, status: ContentStatus.PUBLISHED } }),
    // Telecommunications categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'telecom-companies', businessTypeId: telecom.id } }, update: {}, create: { name: 'Telecom Companies', slug: 'telecom-companies', businessTypeId: telecom.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'internet-service-providers', businessTypeId: telecom.id } }, update: {}, create: { name: 'Internet Service Providers', slug: 'internet-service-providers', businessTypeId: telecom.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'mobile-phone-stores', businessTypeId: telecom.id } }, update: {}, create: { name: 'Mobile Phone Stores', slug: 'mobile-phone-stores', businessTypeId: telecom.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'cable-tv-providers', businessTypeId: telecom.id } }, update: {}, create: { name: 'Cable TV Providers', slug: 'cable-tv-providers', businessTypeId: telecom.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'voip-services', businessTypeId: telecom.id } }, update: {}, create: { name: 'VoIP Services', slug: 'voip-services', businessTypeId: telecom.id, order: 5, status: ContentStatus.PUBLISHED } }),
    // Education & Training categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'schools', businessTypeId: education.id } }, update: {}, create: { name: 'Schools', slug: 'schools', businessTypeId: education.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'colleges-universities', businessTypeId: education.id } }, update: {}, create: { name: 'Colleges & Universities', slug: 'colleges-universities', businessTypeId: education.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'tutoring-centers', businessTypeId: education.id } }, update: {}, create: { name: 'Tutoring Centers', slug: 'tutoring-centers', businessTypeId: education.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'driving-schools', businessTypeId: education.id } }, update: {}, create: { name: 'Driving Schools', slug: 'driving-schools', businessTypeId: education.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'language-schools', businessTypeId: education.id } }, update: {}, create: { name: 'Language Schools', slug: 'language-schools', businessTypeId: education.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'music-schools', businessTypeId: education.id } }, update: {}, create: { name: 'Music Schools', slug: 'music-schools', businessTypeId: education.id, order: 6, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'dance-schools', businessTypeId: education.id } }, update: {}, create: { name: 'Dance Schools', slug: 'dance-schools', businessTypeId: education.id, order: 7, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'art-schools', businessTypeId: education.id } }, update: {}, create: { name: 'Art Schools', slug: 'art-schools', businessTypeId: education.id, order: 8, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'online-courses', businessTypeId: education.id } }, update: {}, create: { name: 'Online Courses', slug: 'online-courses', businessTypeId: education.id, order: 9, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'test-prep', businessTypeId: education.id } }, update: {}, create: { name: 'Test Prep', slug: 'test-prep', businessTypeId: education.id, order: 10, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'vocational-training', businessTypeId: education.id } }, update: {}, create: { name: 'Vocational Training', slug: 'vocational-training', businessTypeId: education.id, order: 11, status: ContentStatus.PUBLISHED } }),
    // Childcare & Family Services categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'daycare-centers', businessTypeId: childcare.id } }, update: {}, create: { name: 'Daycare Centers', slug: 'daycare-centers', businessTypeId: childcare.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'preschools', businessTypeId: childcare.id } }, update: {}, create: { name: 'Preschools', slug: 'preschools', businessTypeId: childcare.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'after-school-programs', businessTypeId: childcare.id } }, update: {}, create: { name: 'After School Programs', slug: 'after-school-programs', businessTypeId: childcare.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'nanny-services', businessTypeId: childcare.id } }, update: {}, create: { name: 'Nanny Services', slug: 'nanny-services', businessTypeId: childcare.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'babysitting-services', businessTypeId: childcare.id } }, update: {}, create: { name: 'Babysitting Services', slug: 'babysitting-services', businessTypeId: childcare.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'childrens-activities', businessTypeId: childcare.id } }, update: {}, create: { name: "Children's Activities", slug: 'childrens-activities', businessTypeId: childcare.id, order: 6, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'adoption-services', businessTypeId: childcare.id } }, update: {}, create: { name: 'Adoption Services', slug: 'adoption-services', businessTypeId: childcare.id, order: 7, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'family-counseling', businessTypeId: childcare.id } }, update: {}, create: { name: 'Family Counseling', slug: 'family-counseling', businessTypeId: childcare.id, order: 8, status: ContentStatus.PUBLISHED } }),
    // Senior & Home Care categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'senior-care', businessTypeId: seniorCare.id } }, update: {}, create: { name: 'Senior Care', slug: 'senior-care', businessTypeId: seniorCare.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'nursing-homes', businessTypeId: seniorCare.id } }, update: {}, create: { name: 'Nursing Homes', slug: 'nursing-homes', businessTypeId: seniorCare.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'assisted-living', businessTypeId: seniorCare.id } }, update: {}, create: { name: 'Assisted Living', slug: 'assisted-living', businessTypeId: seniorCare.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'home-health-care', businessTypeId: seniorCare.id } }, update: {}, create: { name: 'Home Health Care', slug: 'home-health-care', businessTypeId: seniorCare.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'companion-services', businessTypeId: seniorCare.id } }, update: {}, create: { name: 'Companion Services', slug: 'companion-services', businessTypeId: seniorCare.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'hospice-care', businessTypeId: seniorCare.id } }, update: {}, create: { name: 'Hospice Care', slug: 'hospice-care', businessTypeId: seniorCare.id, order: 6, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'elder-law', businessTypeId: seniorCare.id } }, update: {}, create: { name: 'Elder Law', slug: 'elder-law', businessTypeId: seniorCare.id, order: 7, status: ContentStatus.PUBLISHED } }),
    // Events & Wedding Services categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'event-planners', businessTypeId: events.id } }, update: {}, create: { name: 'Event Planners', slug: 'event-planners', businessTypeId: events.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'wedding-planners', businessTypeId: events.id } }, update: {}, create: { name: 'Wedding Planners', slug: 'wedding-planners', businessTypeId: events.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'catering-events', businessTypeId: events.id } }, update: {}, create: { name: 'Catering Services', slug: 'catering-events', businessTypeId: events.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'venue-rentals', businessTypeId: events.id } }, update: {}, create: { name: 'Venue Rentals', slug: 'venue-rentals', businessTypeId: events.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'dj-services', businessTypeId: events.id } }, update: {}, create: { name: 'DJ Services', slug: 'dj-services', businessTypeId: events.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'live-bands', businessTypeId: events.id } }, update: {}, create: { name: 'Live Bands', slug: 'live-bands', businessTypeId: events.id, order: 6, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'event-rentals', businessTypeId: events.id } }, update: {}, create: { name: 'Event Rentals', slug: 'event-rentals', businessTypeId: events.id, order: 7, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'party-supplies', businessTypeId: events.id } }, update: {}, create: { name: 'Party Supplies', slug: 'party-supplies', businessTypeId: events.id, order: 8, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'balloons-decorations', businessTypeId: events.id } }, update: {}, create: { name: 'Balloons & Decorations', slug: 'balloons-decorations', businessTypeId: events.id, order: 9, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'tents-event-equipment', businessTypeId: events.id } }, update: {}, create: { name: 'Tents & Event Equipment', slug: 'tents-event-equipment', businessTypeId: events.id, order: 10, status: ContentStatus.PUBLISHED } }),
    // Entertainment & Nightlife categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'nightclubs', businessTypeId: entertainment.id } }, update: {}, create: { name: 'Nightclubs', slug: 'nightclubs', businessTypeId: entertainment.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'bars-lounges', businessTypeId: entertainment.id } }, update: {}, create: { name: 'Bars & Lounges', slug: 'bars-lounges', businessTypeId: entertainment.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'movie-theaters', businessTypeId: entertainment.id } }, update: {}, create: { name: 'Movie Theaters', slug: 'movie-theaters', businessTypeId: entertainment.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'live-music-venues', businessTypeId: entertainment.id } }, update: {}, create: { name: 'Live Music Venues', slug: 'live-music-venues', businessTypeId: entertainment.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'comedy-clubs', businessTypeId: entertainment.id } }, update: {}, create: { name: 'Comedy Clubs', slug: 'comedy-clubs', businessTypeId: entertainment.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'arcades-game-rooms', businessTypeId: entertainment.id } }, update: {}, create: { name: 'Arcades & Game Rooms', slug: 'arcades-game-rooms', businessTypeId: entertainment.id, order: 6, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'escape-rooms', businessTypeId: entertainment.id } }, update: {}, create: { name: 'Escape Rooms', slug: 'escape-rooms', businessTypeId: entertainment.id, order: 7, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'laser-tag', businessTypeId: entertainment.id } }, update: {}, create: { name: 'Laser Tag', slug: 'laser-tag', businessTypeId: entertainment.id, order: 8, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'karaoke', businessTypeId: entertainment.id } }, update: {}, create: { name: 'Karaoke', slug: 'karaoke', businessTypeId: entertainment.id, order: 9, status: ContentStatus.PUBLISHED } }),
    // Sports & Recreation categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'sports-clubs', businessTypeId: sports.id } }, update: {}, create: { name: 'Sports Clubs', slug: 'sports-clubs', businessTypeId: sports.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'golf-courses', businessTypeId: sports.id } }, update: {}, create: { name: 'Golf Courses', slug: 'golf-courses', businessTypeId: sports.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'tennis-courts', businessTypeId: sports.id } }, update: {}, create: { name: 'Tennis Courts', slug: 'tennis-courts', businessTypeId: sports.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'bowling-alleys', businessTypeId: sports.id } }, update: {}, create: { name: 'Bowling Alleys', slug: 'bowling-alleys', businessTypeId: sports.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'ice-skating-rinks', businessTypeId: sports.id } }, update: {}, create: { name: 'Ice Skating Rinks', slug: 'ice-skating-rinks', businessTypeId: sports.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'mini-golf', businessTypeId: sports.id } }, update: {}, create: { name: 'Mini Golf', slug: 'mini-golf', businessTypeId: sports.id, order: 6, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'amusement-parks', businessTypeId: sports.id } }, update: {}, create: { name: 'Amusement Parks', slug: 'amusement-parks', businessTypeId: sports.id, order: 7, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'water-parks', businessTypeId: sports.id } }, update: {}, create: { name: 'Water Parks', slug: 'water-parks', businessTypeId: sports.id, order: 8, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'ski-resorts', businessTypeId: sports.id } }, update: {}, create: { name: 'Ski Resorts', slug: 'ski-resorts', businessTypeId: sports.id, order: 9, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'fishing-charters', businessTypeId: sports.id } }, update: {}, create: { name: 'Fishing Charters', slug: 'fishing-charters', businessTypeId: sports.id, order: 10, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'boat-rentals', businessTypeId: sports.id } }, update: {}, create: { name: 'Boat Rentals', slug: 'boat-rentals', businessTypeId: sports.id, order: 11, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'sports-equipment-rental', businessTypeId: sports.id } }, update: {}, create: { name: 'Sports Equipment Rental', slug: 'sports-equipment-rental', businessTypeId: sports.id, order: 12, status: ContentStatus.PUBLISHED } }),
    // Arts & Culture categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'art-galleries', businessTypeId: arts.id } }, update: {}, create: { name: 'Art Galleries', slug: 'art-galleries', businessTypeId: arts.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'museums-arts', businessTypeId: arts.id } }, update: {}, create: { name: 'Museums', slug: 'museums-arts', businessTypeId: arts.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'theaters', businessTypeId: arts.id } }, update: {}, create: { name: 'Theaters', slug: 'theaters', businessTypeId: arts.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'concert-halls', businessTypeId: arts.id } }, update: {}, create: { name: 'Concert Halls', slug: 'concert-halls', businessTypeId: arts.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'opera-houses', businessTypeId: arts.id } }, update: {}, create: { name: 'Opera Houses', slug: 'opera-houses', businessTypeId: arts.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'art-classes', businessTypeId: arts.id } }, update: {}, create: { name: 'Art Classes', slug: 'art-classes', businessTypeId: arts.id, order: 6, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'pottery-studios', businessTypeId: arts.id } }, update: {}, create: { name: 'Pottery Studios', slug: 'pottery-studios', businessTypeId: arts.id, order: 7, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'craft-stores', businessTypeId: arts.id } }, update: {}, create: { name: 'Craft Stores', slug: 'craft-stores', businessTypeId: arts.id, order: 8, status: ContentStatus.PUBLISHED } }),
    // Photography & Media categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'photographers', businessTypeId: photography.id } }, update: {}, create: { name: 'Photographers', slug: 'photographers', businessTypeId: photography.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'wedding-photographers', businessTypeId: photography.id } }, update: {}, create: { name: 'Wedding Photographers', slug: 'wedding-photographers', businessTypeId: photography.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'portrait-photographers', businessTypeId: photography.id } }, update: {}, create: { name: 'Portrait Photographers', slug: 'portrait-photographers', businessTypeId: photography.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'videographers', businessTypeId: photography.id } }, update: {}, create: { name: 'Videographers', slug: 'videographers', businessTypeId: photography.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'photo-studios', businessTypeId: photography.id } }, update: {}, create: { name: 'Photo Studios', slug: 'photo-studios', businessTypeId: photography.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'photo-booths', businessTypeId: photography.id } }, update: {}, create: { name: 'Photo Booths', slug: 'photo-booths', businessTypeId: photography.id, order: 6, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'drone-photography', businessTypeId: photography.id } }, update: {}, create: { name: 'Drone Photography', slug: 'drone-photography', businessTypeId: photography.id, order: 7, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'photo-editing', businessTypeId: photography.id } }, update: {}, create: { name: 'Photo Editing Services', slug: 'photo-editing', businessTypeId: photography.id, order: 8, status: ContentStatus.PUBLISHED } }),
    // Printing & Signage categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'printing-services', businessTypeId: printing.id } }, update: {}, create: { name: 'Printing Services', slug: 'printing-services', businessTypeId: printing.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'sign-shops', businessTypeId: printing.id } }, update: {}, create: { name: 'Sign Shops', slug: 'sign-shops', businessTypeId: printing.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'business-cards', businessTypeId: printing.id } }, update: {}, create: { name: 'Business Cards', slug: 'business-cards', businessTypeId: printing.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'brochures-flyers', businessTypeId: printing.id } }, update: {}, create: { name: 'Brochures & Flyers', slug: 'brochures-flyers', businessTypeId: printing.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'banners-posters', businessTypeId: printing.id } }, update: {}, create: { name: 'Banners & Posters', slug: 'banners-posters', businessTypeId: printing.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'custom-merchandise', businessTypeId: printing.id } }, update: {}, create: { name: 'Custom Merchandise', slug: 'custom-merchandise', businessTypeId: printing.id, order: 6, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'promotional-products', businessTypeId: printing.id } }, update: {}, create: { name: 'Promotional Products', slug: 'promotional-products', businessTypeId: printing.id, order: 7, status: ContentStatus.PUBLISHED } }),
    // Fashion & Apparel categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'clothing-stores', businessTypeId: fashion.id } }, update: {}, create: { name: 'Clothing Stores', slug: 'clothing-stores', businessTypeId: fashion.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'mens-clothing', businessTypeId: fashion.id } }, update: {}, create: { name: "Men's Clothing", slug: 'mens-clothing', businessTypeId: fashion.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'womens-clothing', businessTypeId: fashion.id } }, update: {}, create: { name: "Women's Clothing", slug: 'womens-clothing', businessTypeId: fashion.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'childrens-clothing', businessTypeId: fashion.id } }, update: {}, create: { name: "Children's Clothing", slug: 'childrens-clothing', businessTypeId: fashion.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'sportswear', businessTypeId: fashion.id } }, update: {}, create: { name: 'Sportswear', slug: 'sportswear', businessTypeId: fashion.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'shoe-stores', businessTypeId: fashion.id } }, update: {}, create: { name: 'Shoe Stores', slug: 'shoe-stores', businessTypeId: fashion.id, order: 6, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'vintage-clothing', businessTypeId: fashion.id } }, update: {}, create: { name: 'Vintage Clothing', slug: 'vintage-clothing', businessTypeId: fashion.id, order: 7, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'custom-tailoring', businessTypeId: fashion.id } }, update: {}, create: { name: 'Custom Tailoring', slug: 'custom-tailoring', businessTypeId: fashion.id, order: 8, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'bridal-shops', businessTypeId: fashion.id } }, update: {}, create: { name: 'Bridal Shops', slug: 'bridal-shops', businessTypeId: fashion.id, order: 9, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'maternity-clothing', businessTypeId: fashion.id } }, update: {}, create: { name: 'Maternity Clothing', slug: 'maternity-clothing', businessTypeId: fashion.id, order: 10, status: ContentStatus.PUBLISHED } }),
    // Jewelry & Luxury categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'jewelry-stores', businessTypeId: jewelry.id } }, update: {}, create: { name: 'Jewelry Stores', slug: 'jewelry-stores', businessTypeId: jewelry.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'watches', businessTypeId: jewelry.id } }, update: {}, create: { name: 'Watches', slug: 'watches', businessTypeId: jewelry.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'diamond-jewelry', businessTypeId: jewelry.id } }, update: {}, create: { name: 'Diamond Jewelry', slug: 'diamond-jewelry', businessTypeId: jewelry.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'gold-silver', businessTypeId: jewelry.id } }, update: {}, create: { name: 'Gold & Silver', slug: 'gold-silver', businessTypeId: jewelry.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'engagement-rings', businessTypeId: jewelry.id } }, update: {}, create: { name: 'Engagement Rings', slug: 'engagement-rings', businessTypeId: jewelry.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'jewelry-repair', businessTypeId: jewelry.id } }, update: {}, create: { name: 'Jewelry Repair', slug: 'jewelry-repair', businessTypeId: jewelry.id, order: 6, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'luxury-goods', businessTypeId: jewelry.id } }, update: {}, create: { name: 'Luxury Goods', slug: 'luxury-goods', businessTypeId: jewelry.id, order: 7, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'art-antiques', businessTypeId: jewelry.id } }, update: {}, create: { name: 'Art & Antiques', slug: 'art-antiques', businessTypeId: jewelry.id, order: 8, status: ContentStatus.PUBLISHED } }),
    // Beauty Products & Cosmetics categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'cosmetics-stores', businessTypeId: cosmetics.id } }, update: {}, create: { name: 'Cosmetics Stores', slug: 'cosmetics-stores', businessTypeId: cosmetics.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'skincare-products', businessTypeId: cosmetics.id } }, update: {}, create: { name: 'Skincare Products', slug: 'skincare-products', businessTypeId: cosmetics.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'haircare-products', businessTypeId: cosmetics.id } }, update: {}, create: { name: 'Haircare Products', slug: 'haircare-products', businessTypeId: cosmetics.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'fragrances-perfumes', businessTypeId: cosmetics.id } }, update: {}, create: { name: 'Fragrances & Perfumes', slug: 'fragrances-perfumes', businessTypeId: cosmetics.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'makeup-products', businessTypeId: cosmetics.id } }, update: {}, create: { name: 'Makeup Products', slug: 'makeup-products', businessTypeId: cosmetics.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'nail-products', businessTypeId: cosmetics.id } }, update: {}, create: { name: 'Nail Products', slug: 'nail-products', businessTypeId: cosmetics.id, order: 6, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'organic-beauty', businessTypeId: cosmetics.id } }, update: {}, create: { name: 'Organic Beauty', slug: 'organic-beauty', businessTypeId: cosmetics.id, order: 7, status: ContentStatus.PUBLISHED } }),
    // Electronics & Appliances categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'electronics-stores', businessTypeId: electronics.id } }, update: {}, create: { name: 'Electronics Stores', slug: 'electronics-stores', businessTypeId: electronics.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'computer-stores', businessTypeId: electronics.id } }, update: {}, create: { name: 'Computer Stores', slug: 'computer-stores', businessTypeId: electronics.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'appliance-stores', businessTypeId: electronics.id } }, update: {}, create: { name: 'Appliance Stores', slug: 'appliance-stores', businessTypeId: electronics.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'smartphone-stores', businessTypeId: electronics.id } }, update: {}, create: { name: 'Smartphone Stores', slug: 'smartphone-stores', businessTypeId: electronics.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'gaming-stores', businessTypeId: electronics.id } }, update: {}, create: { name: 'Gaming Stores', slug: 'gaming-stores', businessTypeId: electronics.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'camera-stores', businessTypeId: electronics.id } }, update: {}, create: { name: 'Camera Stores', slug: 'camera-stores', businessTypeId: electronics.id, order: 6, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'home-theater', businessTypeId: electronics.id } }, update: {}, create: { name: 'Home Theater', slug: 'home-theater', businessTypeId: electronics.id, order: 7, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'audio-equipment', businessTypeId: electronics.id } }, update: {}, create: { name: 'Audio Equipment', slug: 'audio-equipment', businessTypeId: electronics.id, order: 8, status: ContentStatus.PUBLISHED } }),
    // Home & Furniture categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'furniture-stores', businessTypeId: homeFurniture.id } }, update: {}, create: { name: 'Furniture Stores', slug: 'furniture-stores', businessTypeId: homeFurniture.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'mattress-stores', businessTypeId: homeFurniture.id } }, update: {}, create: { name: 'Mattress Stores', slug: 'mattress-stores', businessTypeId: homeFurniture.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'office-furniture', businessTypeId: homeFurniture.id } }, update: {}, create: { name: 'Office Furniture', slug: 'office-furniture', businessTypeId: homeFurniture.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'outdoor-furniture', businessTypeId: homeFurniture.id } }, update: {}, create: { name: 'Outdoor Furniture', slug: 'outdoor-furniture', businessTypeId: homeFurniture.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'antique-furniture', businessTypeId: homeFurniture.id } }, update: {}, create: { name: 'Antique Furniture', slug: 'antique-furniture', businessTypeId: homeFurniture.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'custom-furniture', businessTypeId: homeFurniture.id } }, update: {}, create: { name: 'Custom Furniture', slug: 'custom-furniture', businessTypeId: homeFurniture.id, order: 6, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'home-decor', businessTypeId: homeFurniture.id } }, update: {}, create: { name: 'Home Decor', slug: 'home-decor', businessTypeId: homeFurniture.id, order: 7, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'lighting-stores', businessTypeId: homeFurniture.id } }, update: {}, create: { name: 'Lighting Stores', slug: 'lighting-stores', businessTypeId: homeFurniture.id, order: 8, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'rugs-carpet', businessTypeId: homeFurniture.id } }, update: {}, create: { name: 'Rugs & Carpet', slug: 'rugs-carpet', businessTypeId: homeFurniture.id, order: 9, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'window-treatments', businessTypeId: homeFurniture.id } }, update: {}, create: { name: 'Window Treatments', slug: 'window-treatments', businessTypeId: homeFurniture.id, order: 10, status: ContentStatus.PUBLISHED } }),
    // Food & Grocery Retail categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'supermarkets', businessTypeId: grocery.id } }, update: {}, create: { name: 'Supermarkets', slug: 'supermarkets', businessTypeId: grocery.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'organic-foods', businessTypeId: grocery.id } }, update: {}, create: { name: 'Organic Foods', slug: 'organic-foods', businessTypeId: grocery.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'farmers-markets', businessTypeId: grocery.id } }, update: {}, create: { name: 'Farmers Markets', slug: 'farmers-markets', businessTypeId: grocery.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'specialty-foods', businessTypeId: grocery.id } }, update: {}, create: { name: 'Specialty Foods', slug: 'specialty-foods', businessTypeId: grocery.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'wine-spirits', businessTypeId: grocery.id } }, update: {}, create: { name: 'Wine & Spirits', slug: 'wine-spirits', businessTypeId: grocery.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'bakeries-grocery', businessTypeId: grocery.id } }, update: {}, create: { name: 'Bakeries', slug: 'bakeries-grocery', businessTypeId: grocery.id, order: 6, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'butcher-shops', businessTypeId: grocery.id } }, update: {}, create: { name: 'Butcher Shops', slug: 'butcher-shops', businessTypeId: grocery.id, order: 7, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'seafood-markets', businessTypeId: grocery.id } }, update: {}, create: { name: 'Seafood Markets', slug: 'seafood-markets', businessTypeId: grocery.id, order: 8, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'cheese-shops', businessTypeId: grocery.id } }, update: {}, create: { name: 'Cheese Shops', slug: 'cheese-shops', businessTypeId: grocery.id, order: 9, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'coffee-tea-shops', businessTypeId: grocery.id } }, update: {}, create: { name: 'Coffee & Tea Shops', slug: 'coffee-tea-shops', businessTypeId: grocery.id, order: 10, status: ContentStatus.PUBLISHED } }),
    // Industrial & Manufacturing categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'manufacturing-plants', businessTypeId: industrial.id } }, update: {}, create: { name: 'Manufacturing Plants', slug: 'manufacturing-plants', businessTypeId: industrial.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'metal-fabrication', businessTypeId: industrial.id } }, update: {}, create: { name: 'Metal Fabrication', slug: 'metal-fabrication', businessTypeId: industrial.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'textile-manufacturing', businessTypeId: industrial.id } }, update: {}, create: { name: 'Textile Manufacturing', slug: 'textile-manufacturing', businessTypeId: industrial.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'food-processing', businessTypeId: industrial.id } }, update: {}, create: { name: 'Food Processing', slug: 'food-processing', businessTypeId: industrial.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'electronics-manufacturing', businessTypeId: industrial.id } }, update: {}, create: { name: 'Electronics Manufacturing', slug: 'electronics-manufacturing', businessTypeId: industrial.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'plastics-manufacturing', businessTypeId: industrial.id } }, update: {}, create: { name: 'Plastics Manufacturing', slug: 'plastics-manufacturing', businessTypeId: industrial.id, order: 6, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'woodworking', businessTypeId: industrial.id } }, update: {}, create: { name: 'Woodworking', slug: 'woodworking', businessTypeId: industrial.id, order: 7, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'machining', businessTypeId: industrial.id } }, update: {}, create: { name: 'Machining', slug: 'machining', businessTypeId: industrial.id, order: 8, status: ContentStatus.PUBLISHED } }),
    // Wholesale & Distribution categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'wholesale-distributors', businessTypeId: wholesale.id } }, update: {}, create: { name: 'Wholesale Distributors', slug: 'wholesale-distributors', businessTypeId: wholesale.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'food-wholesale', businessTypeId: wholesale.id } }, update: {}, create: { name: 'Food Wholesale', slug: 'food-wholesale', businessTypeId: wholesale.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'electronics-wholesale', businessTypeId: wholesale.id } }, update: {}, create: { name: 'Electronics Wholesale', slug: 'electronics-wholesale', businessTypeId: wholesale.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'clothing-wholesale', businessTypeId: wholesale.id } }, update: {}, create: { name: 'Clothing Wholesale', slug: 'clothing-wholesale', businessTypeId: wholesale.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'auto-parts-wholesale', businessTypeId: wholesale.id } }, update: {}, create: { name: 'Auto Parts Wholesale', slug: 'auto-parts-wholesale', businessTypeId: wholesale.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'janitorial-supplies', businessTypeId: wholesale.id } }, update: {}, create: { name: 'Janitorial Supplies', slug: 'janitorial-supplies', businessTypeId: wholesale.id, order: 6, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'office-supplies-wholesale', businessTypeId: wholesale.id } }, update: {}, create: { name: 'Office Supplies Wholesale', slug: 'office-supplies-wholesale', businessTypeId: wholesale.id, order: 7, status: ContentStatus.PUBLISHED } }),
    // Industrial Equipment & Supplies categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'industrial-equipment', businessTypeId: industrialEquip.id } }, update: {}, create: { name: 'Industrial Equipment', slug: 'industrial-equipment', businessTypeId: industrialEquip.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'heavy-machinery', businessTypeId: industrialEquip.id } }, update: {}, create: { name: 'Heavy Machinery', slug: 'heavy-machinery', businessTypeId: industrialEquip.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'safety-equipment', businessTypeId: industrialEquip.id } }, update: {}, create: { name: 'Safety Equipment', slug: 'safety-equipment', businessTypeId: industrialEquip.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'hydraulic-equipment', businessTypeId: industrialEquip.id } }, update: {}, create: { name: 'Hydraulic Equipment', slug: 'hydraulic-equipment', businessTypeId: industrialEquip.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'welding-equipment', businessTypeId: industrialEquip.id } }, update: {}, create: { name: 'Welding Equipment', slug: 'welding-equipment', businessTypeId: industrialEquip.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'electrical-supplies-industrial', businessTypeId: industrialEquip.id } }, update: {}, create: { name: 'Electrical Supplies', slug: 'electrical-supplies-industrial', businessTypeId: industrialEquip.id, order: 6, status: ContentStatus.PUBLISHED } }),
    // Building Materials & Supplies categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'lumberyards', businessTypeId: buildingMaterials.id } }, update: {}, create: { name: 'Lumberyards', slug: 'lumberyards', businessTypeId: buildingMaterials.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'hardware-stores', businessTypeId: buildingMaterials.id } }, update: {}, create: { name: 'Hardware Stores', slug: 'hardware-stores', businessTypeId: buildingMaterials.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'cement-concrete', businessTypeId: buildingMaterials.id } }, update: {}, create: { name: 'Cement & Concrete', slug: 'cement-concrete', businessTypeId: buildingMaterials.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'roofing-supplies', businessTypeId: buildingMaterials.id } }, update: {}, create: { name: 'Roofing Supplies', slug: 'roofing-supplies', businessTypeId: buildingMaterials.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'flooring-supplies', businessTypeId: buildingMaterials.id } }, update: {}, create: { name: 'Flooring Supplies', slug: 'flooring-supplies', businessTypeId: buildingMaterials.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'paint-stores', businessTypeId: buildingMaterials.id } }, update: {}, create: { name: 'Paint Stores', slug: 'paint-stores', businessTypeId: buildingMaterials.id, order: 6, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'plumbing-supplies', businessTypeId: buildingMaterials.id } }, update: {}, create: { name: 'Plumbing Supplies', slug: 'plumbing-supplies', businessTypeId: buildingMaterials.id, order: 7, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'electrical-supplies-building', businessTypeId: buildingMaterials.id } }, update: {}, create: { name: 'Electrical Supplies', slug: 'electrical-supplies-building', businessTypeId: buildingMaterials.id, order: 8, status: ContentStatus.PUBLISHED } }),
    // Agriculture & Farming categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'farms', businessTypeId: agriculture.id } }, update: {}, create: { name: 'Farms', slug: 'farms', businessTypeId: agriculture.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'nurseries', businessTypeId: agriculture.id } }, update: {}, create: { name: 'Nurseries', slug: 'nurseries', businessTypeId: agriculture.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'farm-equipment', businessTypeId: agriculture.id } }, update: {}, create: { name: 'Farm Equipment', slug: 'farm-equipment', businessTypeId: agriculture.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'feed-seed', businessTypeId: agriculture.id } }, update: {}, create: { name: 'Feed & Seed', slug: 'feed-seed', businessTypeId: agriculture.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'livestock', businessTypeId: agriculture.id } }, update: {}, create: { name: 'Livestock', slug: 'livestock', businessTypeId: agriculture.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'dairy-farms', businessTypeId: agriculture.id } }, update: {}, create: { name: 'Dairy Farms', slug: 'dairy-farms', businessTypeId: agriculture.id, order: 6, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'vineyards-wineries', businessTypeId: agriculture.id } }, update: {}, create: { name: 'Vineyards & Wineries', slug: 'vineyards-wineries', businessTypeId: agriculture.id, order: 7, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'organic-farming', businessTypeId: agriculture.id } }, update: {}, create: { name: 'Organic Farming', slug: 'organic-farming', businessTypeId: agriculture.id, order: 8, status: ContentStatus.PUBLISHED } }),
    // Gardening & Landscaping categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'landscaping-services', businessTypeId: landscaping.id } }, update: {}, create: { name: 'Landscaping Services', slug: 'landscaping-services', businessTypeId: landscaping.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'lawn-care', businessTypeId: landscaping.id } }, update: {}, create: { name: 'Lawn Care', slug: 'lawn-care', businessTypeId: landscaping.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'tree-services', businessTypeId: landscaping.id } }, update: {}, create: { name: 'Tree Services', slug: 'tree-services', businessTypeId: landscaping.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'garden-centers', businessTypeId: landscaping.id } }, update: {}, create: { name: 'Garden Centers', slug: 'garden-centers', businessTypeId: landscaping.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'irrigation-services', businessTypeId: landscaping.id } }, update: {}, create: { name: 'Irrigation Services', slug: 'irrigation-services', businessTypeId: landscaping.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'landscape-design', businessTypeId: landscaping.id } }, update: {}, create: { name: 'Landscape Design', slug: 'landscape-design', businessTypeId: landscaping.id, order: 6, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'fence-contractors', businessTypeId: landscaping.id } }, update: {}, create: { name: 'Fence Contractors', slug: 'fence-contractors', businessTypeId: landscaping.id, order: 7, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'outdoor-living', businessTypeId: landscaping.id } }, update: {}, create: { name: 'Outdoor Living', slug: 'outdoor-living', businessTypeId: landscaping.id, order: 8, status: ContentStatus.PUBLISHED } }),
    // Energy & Solar categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'solar-panel-installation', businessTypeId: energy.id } }, update: {}, create: { name: 'Solar Panel Installation', slug: 'solar-panel-installation', businessTypeId: energy.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'solar-equipment', businessTypeId: energy.id } }, update: {}, create: { name: 'Solar Equipment', slug: 'solar-equipment', businessTypeId: energy.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'wind-energy', businessTypeId: energy.id } }, update: {}, create: { name: 'Wind Energy', slug: 'wind-energy', businessTypeId: energy.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'energy-audits', businessTypeId: energy.id } }, update: {}, create: { name: 'Energy Audits', slug: 'energy-audits', businessTypeId: energy.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'electricians-energy', businessTypeId: energy.id } }, update: {}, create: { name: 'Electricians', slug: 'electricians-energy', businessTypeId: energy.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'energy-storage', businessTypeId: energy.id } }, update: {}, create: { name: 'Energy Storage', slug: 'energy-storage', businessTypeId: energy.id, order: 6, status: ContentStatus.PUBLISHED } }),
    // Environmental Services categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'waste-management', businessTypeId: environmental.id } }, update: {}, create: { name: 'Waste Management', slug: 'waste-management', businessTypeId: environmental.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'recycling-services', businessTypeId: environmental.id } }, update: {}, create: { name: 'Recycling Services', slug: 'recycling-services', businessTypeId: environmental.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'hazardous-waste', businessTypeId: environmental.id } }, update: {}, create: { name: 'Hazardous Waste', slug: 'hazardous-waste', businessTypeId: environmental.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'environmental-consulting', businessTypeId: environmental.id } }, update: {}, create: { name: 'Environmental Consulting', slug: 'environmental-consulting', businessTypeId: environmental.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'water-treatment', businessTypeId: environmental.id } }, update: {}, create: { name: 'Water Treatment', slug: 'water-treatment', businessTypeId: environmental.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'air-quality', businessTypeId: environmental.id } }, update: {}, create: { name: 'Air Quality', slug: 'air-quality', businessTypeId: environmental.id, order: 6, status: ContentStatus.PUBLISHED } }),
    // Security Services categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'security-companies', businessTypeId: security.id } }, update: {}, create: { name: 'Security Companies', slug: 'security-companies', businessTypeId: security.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'security-guards', businessTypeId: security.id } }, update: {}, create: { name: 'Security Guards', slug: 'security-guards', businessTypeId: security.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'alarm-systems', businessTypeId: security.id } }, update: {}, create: { name: 'Alarm Systems', slug: 'alarm-systems', businessTypeId: security.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'surveillance-systems', businessTypeId: security.id } }, update: {}, create: { name: 'Surveillance Systems', slug: 'surveillance-systems', businessTypeId: security.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'access-control', businessTypeId: security.id } }, update: {}, create: { name: 'Access Control', slug: 'access-control', businessTypeId: security.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'cyber-security', businessTypeId: security.id } }, update: {}, create: { name: 'Cyber Security', slug: 'cyber-security', businessTypeId: security.id, order: 6, status: ContentStatus.PUBLISHED } }),
    // Locksmith & Access Services categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'locksmiths', businessTypeId: locksmith.id } }, update: {}, create: { name: 'Locksmiths', slug: 'locksmiths', businessTypeId: locksmith.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'lock-repair', businessTypeId: locksmith.id } }, update: {}, create: { name: 'Lock Repair', slug: 'lock-repair', businessTypeId: locksmith.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'key-duplication', businessTypeId: locksmith.id } }, update: {}, create: { name: 'Key Duplication', slug: 'key-duplication', businessTypeId: locksmith.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'safe-services', businessTypeId: locksmith.id } }, update: {}, create: { name: 'Safe Services', slug: 'safe-services', businessTypeId: locksmith.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'automotive-locksmith', businessTypeId: locksmith.id } }, update: {}, create: { name: 'Automotive Locksmith', slug: 'automotive-locksmith', businessTypeId: locksmith.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'access-control-systems', businessTypeId: locksmith.id } }, update: {}, create: { name: 'Access Control Systems', slug: 'access-control-systems', businessTypeId: locksmith.id, order: 6, status: ContentStatus.PUBLISHED } }),
    // Cleaning & Janitorial categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'janitorial-services', businessTypeId: cleaning.id } }, update: {}, create: { name: 'Janitorial Services', slug: 'janitorial-services', businessTypeId: cleaning.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'commercial-cleaning', businessTypeId: cleaning.id } }, update: {}, create: { name: 'Commercial Cleaning', slug: 'commercial-cleaning', businessTypeId: cleaning.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'residential-cleaning', businessTypeId: cleaning.id } }, update: {}, create: { name: 'Residential Cleaning', slug: 'residential-cleaning', businessTypeId: cleaning.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'carpet-cleaning', businessTypeId: cleaning.id } }, update: {}, create: { name: 'Carpet Cleaning', slug: 'carpet-cleaning', businessTypeId: cleaning.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'window-cleaning-service', businessTypeId: cleaning.id } }, update: {}, create: { name: 'Window Cleaning', slug: 'window-cleaning-service', businessTypeId: cleaning.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'pressure-washing', businessTypeId: cleaning.id } }, update: {}, create: { name: 'Pressure Washing', slug: 'pressure-washing', businessTypeId: cleaning.id, order: 6, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'deep-cleaning', businessTypeId: cleaning.id } }, update: {}, create: { name: 'Deep Cleaning', slug: 'deep-cleaning', businessTypeId: cleaning.id, order: 7, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'move-in-out-cleaning', businessTypeId: cleaning.id } }, update: {}, create: { name: 'Move-In/Out Cleaning', slug: 'move-in-out-cleaning', businessTypeId: cleaning.id, order: 8, status: ContentStatus.PUBLISHED } }),
    // Repair & Maintenance categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'appliance-repair-service', businessTypeId: repair.id } }, update: {}, create: { name: 'Appliance Repair', slug: 'appliance-repair-service', businessTypeId: repair.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'electronics-repair', businessTypeId: repair.id } }, update: {}, create: { name: 'Electronics Repair', slug: 'electronics-repair', businessTypeId: repair.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'furniture-repair', businessTypeId: repair.id } }, update: {}, create: { name: 'Furniture Repair', slug: 'furniture-repair', businessTypeId: repair.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'watch-repair', businessTypeId: repair.id } }, update: {}, create: { name: 'Watch & Clock Repair', slug: 'watch-repair', businessTypeId: repair.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'shoe-repair', businessTypeId: repair.id } }, update: {}, create: { name: 'Shoe Repair', slug: 'shoe-repair', businessTypeId: repair.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'leather-repair', businessTypeId: repair.id } }, update: {}, create: { name: 'Leather Repair', slug: 'leather-repair', businessTypeId: repair.id, order: 6, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'tool-repair', businessTypeId: repair.id } }, update: {}, create: { name: 'Tool Repair', slug: 'tool-repair', businessTypeId: repair.id, order: 7, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'maintenance-contracts', businessTypeId: repair.id } }, update: {}, create: { name: 'Maintenance Contracts', slug: 'maintenance-contracts', businessTypeId: repair.id, order: 8, status: ContentStatus.PUBLISHED } }),
    // Marine & Boating categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'marinas', businessTypeId: marine.id } }, update: {}, create: { name: 'Marinas', slug: 'marinas', businessTypeId: marine.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'boat-dealers', businessTypeId: marine.id } }, update: {}, create: { name: 'Boat Dealers', slug: 'boat-dealers', businessTypeId: marine.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'boat-repair', businessTypeId: marine.id } }, update: {}, create: { name: 'Boat Repair', slug: 'boat-repair', businessTypeId: marine.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'boat-rentals-marine', businessTypeId: marine.id } }, update: {}, create: { name: 'Boat Rentals', slug: 'boat-rentals-marine', businessTypeId: marine.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'fishing-charters-marine', businessTypeId: marine.id } }, update: {}, create: { name: 'Fishing Charters', slug: 'fishing-charters-marine', businessTypeId: marine.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'sailing-schools', businessTypeId: marine.id } }, update: {}, create: { name: 'Sailing Schools', slug: 'sailing-schools', businessTypeId: marine.id, order: 6, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'marine-supplies', businessTypeId: marine.id } }, update: {}, create: { name: 'Marine Supplies', slug: 'marine-supplies', businessTypeId: marine.id, order: 7, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'dive-shops', businessTypeId: marine.id } }, update: {}, create: { name: 'Dive Shops', slug: 'dive-shops', businessTypeId: marine.id, order: 8, status: ContentStatus.PUBLISHED } }),
    // Aviation Services categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'airports', businessTypeId: aviation.id } }, update: {}, create: { name: 'Airports', slug: 'airports', businessTypeId: aviation.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'airlines', businessTypeId: aviation.id } }, update: {}, create: { name: 'Airlines', slug: 'airlines', businessTypeId: aviation.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'flight-schools', businessTypeId: aviation.id } }, update: {}, create: { name: 'Flight Schools', slug: 'flight-schools', businessTypeId: aviation.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'aircraft-maintenance', businessTypeId: aviation.id } }, update: {}, create: { name: 'Aircraft Maintenance', slug: 'aircraft-maintenance', businessTypeId: aviation.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'helicopter-services', businessTypeId: aviation.id } }, update: {}, create: { name: 'Helicopter Services', slug: 'helicopter-services', businessTypeId: aviation.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'private-jet-services', businessTypeId: aviation.id } }, update: {}, create: { name: 'Private Jet Services', slug: 'private-jet-services', businessTypeId: aviation.id, order: 6, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'air-cargo', businessTypeId: aviation.id } }, update: {}, create: { name: 'Air Cargo', slug: 'air-cargo', businessTypeId: aviation.id, order: 7, status: ContentStatus.PUBLISHED } }),
    // Funeral & Memorial Services categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'funeral-homes', businessTypeId: funeral.id } }, update: {}, create: { name: 'Funeral Homes', slug: 'funeral-homes', businessTypeId: funeral.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'crematoriums', businessTypeId: funeral.id } }, update: {}, create: { name: 'Crematoriums', slug: 'crematoriums', businessTypeId: funeral.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'memorial-parks', businessTypeId: funeral.id } }, update: {}, create: { name: 'Memorial Parks', slug: 'memorial-parks', businessTypeId: funeral.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'florists-funeral', businessTypeId: funeral.id } }, update: {}, create: { name: 'Florists (Funeral)', slug: 'florists-funeral', businessTypeId: funeral.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'caskets-monuments', businessTypeId: funeral.id } }, update: {}, create: { name: 'Caskets & Monuments', slug: 'caskets-monuments', businessTypeId: funeral.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'pre-planning', businessTypeId: funeral.id } }, update: {}, create: { name: 'Pre-Planning Services', slug: 'pre-planning', businessTypeId: funeral.id, order: 6, status: ContentStatus.PUBLISHED } }),
    // Religious Organizations categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'churches', businessTypeId: religious.id } }, update: {}, create: { name: 'Churches', slug: 'churches', businessTypeId: religious.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'temples', businessTypeId: religious.id } }, update: {}, create: { name: 'Temples', slug: 'temples', businessTypeId: religious.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'mosques', businessTypeId: religious.id } }, update: {}, create: { name: 'Mosques', slug: 'mosques', businessTypeId: religious.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'synagogues', businessTypeId: religious.id } }, update: {}, create: { name: 'Synagogues', slug: 'synagogues', businessTypeId: religious.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'religious-education', businessTypeId: religious.id } }, update: {}, create: { name: 'Religious Education', slug: 'religious-education', businessTypeId: religious.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'spiritual-counseling', businessTypeId: religious.id } }, update: {}, create: { name: 'Spiritual Counseling', slug: 'spiritual-counseling', businessTypeId: religious.id, order: 6, status: ContentStatus.PUBLISHED } }),
    // Community Organizations categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'community-centers', businessTypeId: community.id } }, update: {}, create: { name: 'Community Centers', slug: 'community-centers', businessTypeId: community.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'social-services', businessTypeId: community.id } }, update: {}, create: { name: 'Social Services', slug: 'social-services', businessTypeId: community.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'youth-programs', businessTypeId: community.id } }, update: {}, create: { name: 'Youth Programs', slug: 'youth-programs', businessTypeId: community.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'senior-programs', businessTypeId: community.id } }, update: {}, create: { name: 'Senior Programs', slug: 'senior-programs', businessTypeId: community.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'volunteer-organizations', businessTypeId: community.id } }, update: {}, create: { name: 'Volunteer Organizations', slug: 'volunteer-organizations', businessTypeId: community.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'support-groups', businessTypeId: community.id } }, update: {}, create: { name: 'Support Groups', slug: 'support-groups', businessTypeId: community.id, order: 6, status: ContentStatus.PUBLISHED } }),
    // Nonprofit & Charitable Organizations categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'charities', businessTypeId: nonprofit.id } }, update: {}, create: { name: 'Charities', slug: 'charities', businessTypeId: nonprofit.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'foundations', businessTypeId: nonprofit.id } }, update: {}, create: { name: 'Foundations', slug: 'foundations', businessTypeId: nonprofit.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'homeless-shelters', businessTypeId: nonprofit.id } }, update: {}, create: { name: 'Homeless Shelters', slug: 'homeless-shelters', businessTypeId: nonprofit.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'food-banks', businessTypeId: nonprofit.id } }, update: {}, create: { name: 'Food Banks', slug: 'food-banks', businessTypeId: nonprofit.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'animal-rescue', businessTypeId: nonprofit.id } }, update: {}, create: { name: 'Animal Rescue', slug: 'animal-rescue', businessTypeId: nonprofit.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'environmental-groups', businessTypeId: nonprofit.id } }, update: {}, create: { name: 'Environmental Groups', slug: 'environmental-groups', businessTypeId: nonprofit.id, order: 6, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'international-aid', businessTypeId: nonprofit.id } }, update: {}, create: { name: 'International Aid', slug: 'international-aid', businessTypeId: nonprofit.id, order: 7, status: ContentStatus.PUBLISHED } }),
    // Government & Public Services categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'government-offices', businessTypeId: government.id } }, update: {}, create: { name: 'Government Offices', slug: 'government-offices', businessTypeId: government.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'police-departments', businessTypeId: government.id } }, update: {}, create: { name: 'Police Departments', slug: 'police-departments', businessTypeId: government.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'fire-departments', businessTypeId: government.id } }, update: {}, create: { name: 'Fire Departments', slug: 'fire-departments', businessTypeId: government.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'post-offices', businessTypeId: government.id } }, update: {}, create: { name: 'Post Offices', slug: 'post-offices', businessTypeId: government.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'courts', businessTypeId: government.id } }, update: {}, create: { name: 'Courts', slug: 'courts', businessTypeId: government.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'dmv', businessTypeId: government.id } }, update: {}, create: { name: 'DMV', slug: 'dmv', businessTypeId: government.id, order: 6, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'libraries', businessTypeId: government.id } }, update: {}, create: { name: 'Libraries', slug: 'libraries', businessTypeId: government.id, order: 7, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'public-utilities', businessTypeId: government.id } }, update: {}, create: { name: 'Public Utilities', slug: 'public-utilities', businessTypeId: government.id, order: 8, status: ContentStatus.PUBLISHED } }),
    // Laboratories & Testing categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'testing-labs', businessTypeId: labs.id } }, update: {}, create: { name: 'Testing Labs', slug: 'testing-labs', businessTypeId: labs.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'medical-labs', businessTypeId: labs.id } }, update: {}, create: { name: 'Medical Labs', slug: 'medical-labs', businessTypeId: labs.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'research-labs', businessTypeId: labs.id } }, update: {}, create: { name: 'Research Labs', slug: 'research-labs', businessTypeId: labs.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'environmental-labs', businessTypeId: labs.id } }, update: {}, create: { name: 'Environmental Labs', slug: 'environmental-labs', businessTypeId: labs.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'calibration-services', businessTypeId: labs.id } }, update: {}, create: { name: 'Calibration Services', slug: 'calibration-services', businessTypeId: labs.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'dna-testing', businessTypeId: labs.id } }, update: {}, create: { name: 'DNA Testing', slug: 'dna-testing', businessTypeId: labs.id, order: 6, status: ContentStatus.PUBLISHED } }),
    // Pharmaceutical & Medical Suppliers categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'pharmaceutical-wholesale', businessTypeId: pharma.id } }, update: {}, create: { name: 'Pharmaceutical Wholesale', slug: 'pharmaceutical-wholesale', businessTypeId: pharma.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'medical-device-companies', businessTypeId: pharma.id } }, update: {}, create: { name: 'Medical Device Companies', slug: 'medical-device-companies', businessTypeId: pharma.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'biotech-companies', businessTypeId: pharma.id } }, update: {}, create: { name: 'Biotech Companies', slug: 'biotech-companies', businessTypeId: pharma.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'medical-gas-suppliers', businessTypeId: pharma.id } }, update: {}, create: { name: 'Medical Gas Suppliers', slug: 'medical-gas-suppliers', businessTypeId: pharma.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'lab-supplies', businessTypeId: pharma.id } }, update: {}, create: { name: 'Lab Supplies', slug: 'lab-supplies', businessTypeId: pharma.id, order: 5, status: ContentStatus.PUBLISHED } }),
    // Chemical & Scientific Services categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'chemical-companies', businessTypeId: chemical.id } }, update: {}, create: { name: 'Chemical Companies', slug: 'chemical-companies', businessTypeId: chemical.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'laboratory-chemicals', businessTypeId: chemical.id } }, update: {}, create: { name: 'Laboratory Chemicals', slug: 'laboratory-chemicals', businessTypeId: chemical.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'industrial-chemicals', businessTypeId: chemical.id } }, update: {}, create: { name: 'Industrial Chemicals', slug: 'industrial-chemicals', businessTypeId: chemical.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'cleaning-chemicals', businessTypeId: chemical.id } }, update: {}, create: { name: 'Cleaning Chemicals', slug: 'cleaning-chemicals', businessTypeId: chemical.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'adhesives-sealants', businessTypeId: chemical.id } }, update: {}, create: { name: 'Adhesives & Sealants', slug: 'adhesives-sealants', businessTypeId: chemical.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'paints-coatings', businessTypeId: chemical.id } }, update: {}, create: { name: 'Paints & Coatings', slug: 'paints-coatings', businessTypeId: chemical.id, order: 6, status: ContentStatus.PUBLISHED } }),
    // Mining & Natural Resources categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'mining-companies', businessTypeId: mining.id } }, update: {}, create: { name: 'Mining Companies', slug: 'mining-companies', businessTypeId: mining.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'quarrying', businessTypeId: mining.id } }, update: {}, create: { name: 'Quarrying', slug: 'quarrying', businessTypeId: mining.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'oil-gas-companies', businessTypeId: mining.id } }, update: {}, create: { name: 'Oil & Gas Companies', slug: 'oil-gas-companies', businessTypeId: mining.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'renewable-energy', businessTypeId: mining.id } }, update: {}, create: { name: 'Renewable Energy', slug: 'renewable-energy', businessTypeId: mining.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'forestry', businessTypeId: mining.id } }, update: {}, create: { name: 'Forestry', slug: 'forestry', businessTypeId: mining.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'water-resources', businessTypeId: mining.id } }, update: {}, create: { name: 'Water Resources', slug: 'water-resources', businessTypeId: mining.id, order: 6, status: ContentStatus.PUBLISHED } }),
    // Storage & Warehousing categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'warehouses', businessTypeId: storage.id } }, update: {}, create: { name: 'Warehouses', slug: 'warehouses', businessTypeId: storage.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'self-storage', businessTypeId: storage.id } }, update: {}, create: { name: 'Self Storage', slug: 'self-storage', businessTypeId: storage.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'cold-storage', businessTypeId: storage.id } }, update: {}, create: { name: 'Cold Storage', slug: 'cold-storage', businessTypeId: storage.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'fulfillment-centers', businessTypeId: storage.id } }, update: {}, create: { name: 'Fulfillment Centers', slug: 'fulfillment-centers', businessTypeId: storage.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'record-storage', businessTypeId: storage.id } }, update: {}, create: { name: 'Record Storage', slug: 'record-storage', businessTypeId: storage.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'vehicle-storage', businessTypeId: storage.id } }, update: {}, create: { name: 'Vehicle Storage', slug: 'vehicle-storage', businessTypeId: storage.id, order: 6, status: ContentStatus.PUBLISHED } }),
    // Packaging & Logistics Supplies categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'packaging-supplies', businessTypeId: packaging.id } }, update: {}, create: { name: 'Packaging Supplies', slug: 'packaging-supplies', businessTypeId: packaging.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'box-manufacturers', businessTypeId: packaging.id } }, update: {}, create: { name: 'Box Manufacturers', slug: 'box-manufacturers', businessTypeId: packaging.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'pallet-suppliers', businessTypeId: packaging.id } }, update: {}, create: { name: 'Pallet Suppliers', slug: 'pallet-suppliers', businessTypeId: packaging.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'shipping-supplies', businessTypeId: packaging.id } }, update: {}, create: { name: 'Shipping Supplies', slug: 'shipping-supplies', businessTypeId: packaging.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'labeling-systems', businessTypeId: packaging.id } }, update: {}, create: { name: 'Labeling Systems', slug: 'labeling-systems', businessTypeId: packaging.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'wrapping-materials', businessTypeId: packaging.id } }, update: {}, create: { name: 'Wrapping Materials', slug: 'wrapping-materials', businessTypeId: packaging.id, order: 6, status: ContentStatus.PUBLISHED } }),
    // Translation & Language Services categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'translation-services', businessTypeId: translation.id } }, update: {}, create: { name: 'Translation Services', slug: 'translation-services', businessTypeId: translation.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'interpreters', businessTypeId: translation.id } }, update: {}, create: { name: 'Interpreters', slug: 'interpreters', businessTypeId: translation.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'language-schools-trans', businessTypeId: translation.id } }, update: {}, create: { name: 'Language Schools', slug: 'language-schools-trans', businessTypeId: translation.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'transcription-services', businessTypeId: translation.id } }, update: {}, create: { name: 'Transcription Services', slug: 'transcription-services', businessTypeId: translation.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'localization-services', businessTypeId: translation.id } }, update: {}, create: { name: 'Localization Services', slug: 'localization-services', businessTypeId: translation.id, order: 5, status: ContentStatus.PUBLISHED } }),
    // Research & Consulting categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'market-research', businessTypeId: research.id } }, update: {}, create: { name: 'Market Research', slug: 'market-research', businessTypeId: research.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'business-consulting-res', businessTypeId: research.id } }, update: {}, create: { name: 'Business Consulting', slug: 'business-consulting-res', businessTypeId: research.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'management-consulting-res', businessTypeId: research.id } }, update: {}, create: { name: 'Management Consulting', slug: 'management-consulting-res', businessTypeId: research.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'strategy-consulting', businessTypeId: research.id } }, update: {}, create: { name: 'Strategy Consulting', slug: 'strategy-consulting', businessTypeId: research.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'scientific-research', businessTypeId: research.id } }, update: {}, create: { name: 'Scientific Research', slug: 'scientific-research', businessTypeId: research.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'data-analysis', businessTypeId: research.id } }, update: {}, create: { name: 'Data Analysis', slug: 'data-analysis', businessTypeId: research.id, order: 6, status: ContentStatus.PUBLISHED } }),
    // Publishing & Creative Services categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'publishing-houses', businessTypeId: publishing.id } }, update: {}, create: { name: 'Publishing Houses', slug: 'publishing-houses', businessTypeId: publishing.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'bookstores', businessTypeId: publishing.id } }, update: {}, create: { name: 'Bookstores', slug: 'bookstores', businessTypeId: publishing.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'graphic-design-services', businessTypeId: publishing.id } }, update: {}, create: { name: 'Graphic Design Services', slug: 'graphic-design-services', businessTypeId: publishing.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'copywriting', businessTypeId: publishing.id } }, update: {}, create: { name: 'Copywriting', slug: 'copywriting', businessTypeId: publishing.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'video-production', businessTypeId: publishing.id } }, update: {}, create: { name: 'Video Production', slug: 'video-production', businessTypeId: publishing.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'animation-studios', businessTypeId: publishing.id } }, update: {}, create: { name: 'Animation Studios', slug: 'animation-studios', businessTypeId: publishing.id, order: 6, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'music-studios', businessTypeId: publishing.id } }, update: {}, create: { name: 'Music Studios', slug: 'music-studios', businessTypeId: publishing.id, order: 7, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'voice-over', businessTypeId: publishing.id } }, update: {}, create: { name: 'Voice Over', slug: 'voice-over', businessTypeId: publishing.id, order: 8, status: ContentStatus.PUBLISHED } }),
    // Specialized & Other Businesses categories
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'miscellaneous-services', businessTypeId: specialized.id } }, update: {}, create: { name: 'Miscellaneous Services', slug: 'miscellaneous-services', businessTypeId: specialized.id, order: 1, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'import-export', businessTypeId: specialized.id } }, update: {}, create: { name: 'Import/Export', slug: 'import-export', businessTypeId: specialized.id, order: 2, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'business-brokers', businessTypeId: specialized.id } }, update: {}, create: { name: 'Business Brokers', slug: 'business-brokers', businessTypeId: specialized.id, order: 3, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'franchise-opportunities', businessTypeId: specialized.id } }, update: {}, create: { name: 'Franchise Opportunities', slug: 'franchise-opportunities', businessTypeId: specialized.id, order: 4, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'auction-houses', businessTypeId: specialized.id } }, update: {}, create: { name: 'Auction Houses', slug: 'auction-houses', businessTypeId: specialized.id, order: 5, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'pawn-shops', businessTypeId: specialized.id } }, update: {}, create: { name: 'Pawn Shops', slug: 'pawn-shops', businessTypeId: specialized.id, order: 6, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'check-cashing', businessTypeId: specialized.id } }, update: {}, create: { name: 'Check Cashing', slug: 'check-cashing', businessTypeId: specialized.id, order: 7, status: ContentStatus.PUBLISHED } }),
    prisma.category.upsert({ where: { slug_businessTypeId: { slug: 'private-investigators', businessTypeId: specialized.id } }, update: {}, create: { name: 'Private Investigators', slug: 'private-investigators', businessTypeId: specialized.id, order: 8, status: ContentStatus.PUBLISHED } }),
  ]);
  console.log('✅ Created categories');

  console.log('🎉 Database seeded successfully!');
  console.log('\n���� Demo Accounts:');
  console.log('   Admin: admin@indexorbit.com / admin123');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
