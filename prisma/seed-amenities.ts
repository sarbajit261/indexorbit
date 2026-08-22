import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding amenities and facilities...');
  const amenities = [
    { name: 'Free Wi-Fi', icon: 'wifi', category: 'general', order: 1 },
    { name: 'Parking Available', icon: 'car', category: 'general', order: 2 },
    { name: 'Wheelchair Accessible', icon: 'accessibility', category: 'general', order: 3 },
    { name: 'Air Conditioning', icon: 'wind', category: 'general', order: 4 },
    { name: 'Pet Friendly', icon: 'paw-print', category: 'general', order: 5 },
    { name: 'Family Friendly', icon: 'users', category: 'general', order: 6 },
    { name: 'Outdoor Seating', icon: 'sun', category: 'general', order: 7 },
    { name: 'Indoor Seating', icon: 'home', category: 'general', order: 8 },
    { name: 'Room Service', icon: 'concierge-bell', category: 'room', order: 9 },
    { name: 'Ocean View', icon: 'waves', category: 'room', order: 10 },
    { name: 'Balcony', icon: 'door-open', category: 'room', order: 11 },
    { name: 'Coffee Maker', icon: 'coffee', category: 'room', order: 12 },
  ];
  const facilities = [
    { name: 'Restaurant', icon: 'utensils', category: 'dining', order: 1 },
    { name: 'Bar/Lounge', icon: 'wine', category: 'dining', order: 2 },
    { name: 'Cafe', icon: 'coffee', category: 'dining', order: 3 },
    { name: 'Pool', icon: 'waves', category: 'wellness', order: 4 },
    { name: 'Gym/Fitness Center', icon: 'dumbbell', category: 'wellness', order: 5 },
    { name: 'Spa', icon: 'sparkles', category: 'wellness', order: 6 },
    { name: 'Business Center', icon: 'briefcase', category: 'business', order: 7 },
    { name: 'Conference Room', icon: 'presentation', category: 'business', order: 8 },
    { name: 'Free Breakfast', icon: 'sandwich', category: 'dining', order: 9 },
    { name: 'Kids Club', icon: 'baby', category: 'recreation', order: 10 },
  ];
  for (const a of amenities) {
    await prisma.amenity.upsert({ where: { name: a.name }, update: a, create: a });
  }
  for (const f of facilities) {
    await prisma.facility.upsert({ where: { name: f.name }, update: f, create: f });
  }
  
  // Assign random amenities and facilities to businesses
  const businesses = await prisma.business.findMany({ where: { deletedAt: null }, take: 5 });
  const allAmenities = await prisma.amenity.findMany();
  const allFacilities = await prisma.facility.findMany();
  
  for (const business of businesses) {
    const numAmenities = Math.floor(Math.random() * 6) + 3;
    const shuffledAmenities = allAmenities.sort(() => 0.5 - Math.random()).slice(0, numAmenities);
    for (const amenity of shuffledAmenities) {
      await prisma.businessAmenity.upsert({
        where: { businessId_amenityId: { businessId: business.id, amenityId: amenity.id } },
        update: {},
        create: { businessId: business.id, amenityId: amenity.id },
      });
    }
    const numFacilities = Math.floor(Math.random() * 4) + 2;
    const shuffledFacilities = allFacilities.sort(() => 0.5 - Math.random()).slice(0, numFacilities);
    for (const facility of shuffledFacilities) {
      await prisma.businessFacility.upsert({
        where: { businessId_facilityId: { businessId: business.id, facilityId: facility.id } },
        update: {},
        create: { businessId: business.id, facilityId: facility.id },
      });
    }
  }
  console.log('Done seeding amenities and facilities');
}
main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
