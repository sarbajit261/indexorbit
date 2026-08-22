import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Adding amenities and facilities to businesses...');
  
  const businesses = await prisma.business.findMany({ take: 5 });
  const amenities = await prisma.amenity.findMany({ take: 8 });
  const facilities = await prisma.facility.findMany({ take: 6 });
  
  for (const business of businesses) {
    // Add random amenities (4-6 per business)
    const businessAmenities = amenities.slice(0, Math.floor(Math.random() * 3) + 4);
    for (const amenity of businessAmenities) {
      await prisma.businessAmenity.create({
        data: { businessId: business.id, amenityId: amenity.id },
      }).catch(() => {}); // Ignore if already exists
    }
    
    // Add random facilities (3-4 per business)
    const businessFacilities = facilities.slice(0, Math.floor(Math.random() * 2) + 3);
    for (const facility of businessFacilities) {
      await prisma.businessFacility.create({
        data: { businessId: business.id, facilityId: facility.id },
      }).catch(() => {}); // Ignore if already exists
    }
    
    // Add gallery images
    const galleryImages = [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800',
      'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800',
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800',
    ];
    for (let i = 0; i < galleryImages.length; i++) {
      await prisma.businessGallery.create({
        data: { businessId: business.id, url: galleryImages[i], order: i },
      }).catch(() => {});
    }
    
    console.log(`Added amenities, facilities, and gallery to: ${business.name}`);
  }
  
  console.log('Done!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
