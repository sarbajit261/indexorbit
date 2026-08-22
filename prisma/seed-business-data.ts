import { PrismaClient, ContentStatus, ClaimStatus, ReviewStatus, VerificationStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('⏰ Adding business hours, services, and reviews...');

  // Get all businesses
  const businesses = await prisma.business.findMany({
    where: { deletedAt: null },
    take: 42,
  });

  // Standard business hours template (dayOfWeek: 0=Sun, 1=Mon, ..., 6=Sat)
  const standardHours = [
    { dayOfWeek: 1, openTime: '09:00', closeTime: '18:00', isClosed: false }, // Monday
    { dayOfWeek: 2, openTime: '09:00', closeTime: '18:00', isClosed: false }, // Tuesday
    { dayOfWeek: 3, openTime: '09:00', closeTime: '18:00', isClosed: false }, // Wednesday
    { dayOfWeek: 4, openTime: '09:00', closeTime: '18:00', isClosed: false }, // Thursday
    { dayOfWeek: 5, openTime: '09:00', closeTime: '18:00', isClosed: false }, // Friday
    { dayOfWeek: 6, openTime: '10:00', closeTime: '16:00', isClosed: false }, // Saturday
    { dayOfWeek: 0, isClosed: true }, // Sunday
  ];

  const restaurantHours = [
    { dayOfWeek: 1, openTime: '11:00', closeTime: '22:00', isClosed: false },
    { dayOfWeek: 2, openTime: '11:00', closeTime: '22:00', isClosed: false },
    { dayOfWeek: 3, openTime: '11:00', closeTime: '22:00', isClosed: false },
    { dayOfWeek: 4, openTime: '11:00', closeTime: '22:00', isClosed: false },
    { dayOfWeek: 5, openTime: '11:00', closeTime: '23:00', isClosed: false },
    { dayOfWeek: 6, openTime: '10:00', closeTime: '23:00', isClosed: false },
    { dayOfWeek: 0, openTime: '10:00', closeTime: '21:00', isClosed: false },
  ];

  const hotelHours = [
    { dayOfWeek: 1, isClosed: false }, // 24 hours
    { dayOfWeek: 2, isClosed: false },
    { dayOfWeek: 3, isClosed: false },
    { dayOfWeek: 4, isClosed: false },
    { dayOfWeek: 5, isClosed: false },
    { dayOfWeek: 6, isClosed: false },
    { dayOfWeek: 0, isClosed: false },
  ];

  // Services template
  const restaurantServices = [
    'Dine-in', 'Takeout', 'Delivery', 'Catering', 'Private Events',
  ];
  const hotelServices = [
    '24-Hour Front Desk', 'Room Service', 'Free WiFi', 'Parking',
    'Airport Shuttle', 'Fitness Center', 'Pool', 'Restaurant',
  ];
  const medicalServices = [
    'General Consultation', 'Emergency Care', 'Diagnostic Tests',
    'Vaccinations', 'Health Screenings', 'Specialist Referrals',
  ];
  const fitnessServices = [
    'Personal Training', 'Group Classes', 'Cardio Equipment',
    'Weight Training', 'Locker Rooms', 'Personalized Plans',
  ];
  const autoServices = [
    'Oil Change', 'Tire Rotation', 'Brake Service', 'Engine Repair',
    'Transmission Service', 'Battery Replacement', 'AC Repair',
  ];
  const standardServices = [
    'Consultation', 'Custom Solutions', 'Quality Assurance',
    'Customer Support', 'Follow-up Service',
  ];

  // Create hours, services for each business
  for (const business of businesses) {
    const slug = business.slug;

    // Determine hours type and services based on business type
    let hours = standardHours;
    let services = standardServices;

    if (slug.includes('restaurant') || slug.includes('cafe') || slug.includes('pizza') ||
        slug.includes('sushi') || slug.includes('taco') || slug.includes('burger') ||
        slug.includes('pho') || slug.includes('bbq') || slug.includes('bakery') ||
        slug.includes('bistro')) {
      hours = restaurantHours;
      services = restaurantServices;
    } else if (slug.includes('hotel') || slug.includes('inn') || slug.includes('resort') ||
               slug.includes('lodge') || slug.includes('motel')) {
      hours = hotelHours;
      services = hotelServices;
    } else if (slug.includes('medical') || slug.includes('dental') || slug.includes('clinic') ||
               slug.includes('hospital') || slug.includes('health')) {
      services = medicalServices;
    } else if (slug.includes('gym') || slug.includes('yoga') || slug.includes('fitness') ||
               slug.includes('crossfit') || slug.includes('spa')) {
      services = fitnessServices;
    } else if (slug.includes('auto') || slug.includes('car') || slug.includes('motor')) {
      services = autoServices;
    }

    // Insert hours (using createMany for simplicity)
    for (const hour of hours) {
      await prisma.businessHours.create({
        data: {
          businessId: business.id,
          branchId: null,
          ...hour,
        },
      });
    }

    // Create services
    for (let i = 0; i < services.length; i++) {
      const serviceName = services[i];
      await prisma.service.create({
        data: {
          businessId: business.id,
          name: serviceName,
          slug: `${business.slug}-${serviceName.toLowerCase().replace(/\s+/g, '-')}`,
          description: `${serviceName} at ${business.name}`,
          status: ContentStatus.PUBLISHED,
        },
      });
    }
  }

  console.log('✅ Added business hours and services');

  // Get admin user for reviews
  const admin = await prisma.user.findFirst({
    where: { role: 'SUPER_ADMIN' },
  });

  if (!admin) {
    console.log('⚠️ No admin user found, skipping reviews');
    return;
  }

  // Sample review names
  const reviewerNames = [
    'Sarah M.', 'John D.', 'Emily R.', 'Michael B.', 'Jessica L.',
    'David W.', 'Amanda K.', 'Chris P.', 'Rachel S.', 'Tom H.',
  ];

  // Sample review comments
  const reviewComments = [
    'Excellent service! Highly recommended.',
    'Very professional and great attention to detail.',
    'Exceeded my expectations. Will definitely come back.',
    'Great experience overall. The staff was very helpful.',
    'Quality service at a fair price. Very satisfied.',
    'Friendly staff and excellent results.',
    'Very impressed with the professionalism.',
    'Good value for money. Would recommend to friends.',
    'Smooth and efficient process from start to finish.',
    'Outstanding quality. Exceeded expectations.',
  ];

  // Sample review titles
  const reviewTitles = [
    'Excellent Service!',
    'Highly Recommended',
    'Great Experience',
    'Very Professional',
    'Above and Beyond',
    'Outstanding Quality',
    'Will Return',
    'Top Notch!',
  ];

  // Add reviews to first 15 businesses (2-3 reviews each)
  const businessesWithReviews = businesses.slice(0, 15);

  for (const business of businessesWithReviews) {
    const numReviews = Math.floor(Math.random() * 2) + 2; // 2-3 reviews

    for (let i = 0; i < numReviews; i++) {
      const rating = Math.floor(Math.random() * 2) + 4; // 4-5 stars
      const comment = reviewComments[Math.floor(Math.random() * reviewComments.length)];
      const reviewer = reviewerNames[Math.floor(Math.random() * reviewerNames.length)];

      await prisma.review.create({
        data: {
          businessId: business.id,
          userId: admin.id,
          rating: rating,
          title: reviewTitles[Math.floor(Math.random() * reviewTitles.length)],
          content: comment,
          status: ReviewStatus.APPROVED,
        },
      });
    }
  }

  console.log('✅ Added reviews for businesses');

  // Update business ratings based on reviews
  for (const business of businessesWithReviews) {
    const reviews = await prisma.review.findMany({
      where: { businessId: business.id, status: ReviewStatus.APPROVED },
    });

    if (reviews.length > 0) {
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      await prisma.business.update({
        where: { id: business.id },
        data: {
          rating: Math.round(avgRating * 10) / 10,
          reviewCount: reviews.length,
        },
      });
    }
  }

  console.log('✅ Updated business ratings');
  console.log('🎉 Business data seeding complete!');
}

main()
  .catch((e) => {
    console.error('Error seeding business data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
