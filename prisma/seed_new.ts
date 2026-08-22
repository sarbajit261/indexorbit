import { PrismaClient, BusinessType, ContentStatus, ClaimStatus, ReviewStatus, LocationType, VerificationStatus } from '@prisma/client';
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
  const events = businessTypes.find(t => t.slug === 'events-wedding')!;
  const entertainment = businessTypes.find(t => t.slug === 'entertainment-nightlife')!;
  const sports = businessTypes.find(t => t.slug === 'sports-recreation')!;
  const arts = businessTypes.find(t => t.slug === 'arts-culture')!;
  const photography = businessTypes.find(t => t.slug === 'photography-media')!;
  const printing = businessTypes.find(t => t.slug === 'printing-signage')!;
  const fashion = businessTypes.find(t => t.slug === 'fashion-apparel')!;
  const jewelry = businessTypes.find(t => t.slug === 'jewelry-luxury')!;
  const cosmetics = businessTypes.find(t => t.slug === 'beauty-products')!;
  const electronics = businessTypes.find(t => t.slug === 'electronics-appliances')!;
  const homeFurniture = businessTypes.find(t => t.slug === 'home-furniture')!;
  const grocery = businessTypes.find(t => t.slug === 'food-grocery-retail')!;
  const industrial = businessTypes.find(t => t.slug === 'industrial-manufacturing')!;
  const wholesale = businessTypes.find(t => t.slug === 'wholesale-distribution')!;
  const industrialEquip = businessTypes.find(t => t.slug === 'industrial-equipment')!;
  const buildingMaterials = businessTypes.find(t => t.slug === 'building-materials')!;
  const agriculture = businessTypes.find(t => t.slug === 'agriculture-farming')!;
  const landscaping = businessTypes.find(t => t.slug === 'gardening-landscaping')!;
  const energy = businessTypes.find(t => t.slug === 'energy-solar')!;
  const environmental = businessTypes.find(t => t.slug === 'environmental-services')!;
  const security = businessTypes.find(t => t.slug === 'security-services')!;
  const locksmith = businessTypes.find(t => t.slug === 'locksmith-access')!;
  const cleaning = businessTypes.find(t => t.slug === 'cleaning-janitorial')!;
  const repair = businessTypes.find(t => t.slug === 'repair-maintenance')!;
  const marine = businessTypes.find(t => t.slug === 'marine-boating')!;
  const aviation = businessTypes.find(t => t.slug === 'aviation-services')!;
  const funeral = businessTypes.find(t => t.slug === 'funeral-memorial')!;
  const religious = businessTypes.find(t => t.slug === 'religious-organizations')!;
  const community = businessTypes.find(t => t.slug === 'community-organizations')!;
  const nonprofit = businessTypes.find(t => t.slug === 'nonprofit-charitable')!;
  const government = businessTypes.find(t => t.slug === 'government-public')!;
  const labs = businessTypes.find(t => t.slug === 'laboratories-testing')!;
  const pharma = businessTypes.find(t => t.slug === 'pharmaceutical-medical')!;
  const chemical = businessTypes.find(t => t.slug === 'chemical-scientific')!;
  const mining = businessTypes.find(t => t.slug === 'mining-resources')!;
  const storage = businessTypes.find(t => t.slug === 'storage-warehousing')!;
  const packaging = businessTypes.find(t => t.slug === 'packaging-logistics')!;
  const translation = businessTypes.find(t => t.slug === 'translation-language')!;
  const research = businessTypes.find(t => t.slug === 'research-consulting')!;
  const publishing = businessTypes.find(t => t.slug === 'publishing-creative')!;
  const specialized = businessTypes.find(t => t.slug === 'specialized-other')!;

