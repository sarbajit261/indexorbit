import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Adding amenities, facilities, gallery, and FAQs to businesses...');

  const businesses = await prisma.business.findMany({ take: 5 });
  const amenities = await prisma.amenity.findMany({ take: 8 });
  const facilities = await prisma.facility.findMany({ take: 6 });

  for (const business of businesses) {
    // Add random amenities (4-6 per business)
    const businessAmenities = amenities.slice(0, Math.floor(Math.random() * 3) + 4);
    for (const amenity of businessAmenities) {
      await prisma.businessAmenity.create({
        data: { businessId: business.id, amenityId: amenity.id },
      }).catch(() => {});
    }

    // Add random facilities (3-4 per business)
    const businessFacilities = facilities.slice(0, Math.floor(Math.random() * 2) + 3);
    for (const facility of businessFacilities) {
      await prisma.businessFacility.create({
        data: { businessId: business.id, facilityId: facility.id },
      }).catch(() => {});
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

    // Add FAQ
    const faqs = [
      { question: 'What are your operating hours?', answer: 'We are open Monday through Friday from 9:00 AM to 6:00 PM, and Saturday from 10:00 AM to 4:00 PM. We are closed on Sundays.' },
      { question: 'Do you offer delivery services?', answer: 'Yes, we offer delivery within a 10-mile radius. Delivery fees vary based on location and order size.' },
      { question: 'What payment methods do you accept?', answer: 'We accept cash, all major credit cards (Visa, MasterCard, Amex), Apple Pay, Google Pay, and PayPal.' },
      { question: 'Do you offer parking?', answer: 'Yes, we have free parking available for our customers. There are also street parking options nearby.' },
    ];
    for (let i = 0; i < faqs.length; i++) {
      await prisma.businessFaq.create({
        data: { businessId: business.id, ...faqs[i], order: i },
      }).catch(() => {});
    }

    console.log(`Added amenities, facilities, gallery, and FAQs to: ${business.name}`);
  }

  console.log('Done!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
