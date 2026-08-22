import { PrismaClient, ReviewStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('⭐ Adding reviews to businesses...');

  // Get or create reviewer users
  const reviewerEmails = [
    'reviewer1@example.com',
    'reviewer2@example.com',
    'reviewer3@example.com',
    'reviewer4@example.com',
    'reviewer5@example.com',
    'reviewer6@example.com',
    'reviewer7@example.com',
    'reviewer8@example.com',
  ];

  const reviewers = await Promise.all(
    reviewerEmails.map(async (email) => {
      const password = await bcrypt.hash('password123', 10);
      return prisma.user.upsert({
        where: { email },
        update: {},
        create: {
          email,
          name: `Reviewer ${email.split('@')[0].replace('reviewer', '')}`,
          passwordHash: password,
          role: 'USER',
          emailVerified: new Date(),
        },
      });
    })
  );

  // Get businesses
  const businesses = await prisma.business.findMany({
    where: { deletedAt: null },
    take: 15,
  });

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

  let reviewCount = 0;
  for (let i = 0; i < businesses.length; i++) {
    const business = businesses[i];
    // Use different reviewers for different businesses
    const numReviews = Math.floor(Math.random() * 2) + 2; // 2-3 reviews
    const usedReviewers = new Set<number>();

    for (let j = 0; j < numReviews; j++) {
      // Find an unused reviewer
      let reviewerIdx = (i * 2 + j) % reviewers.length;
      while (usedReviewers.has(reviewerIdx) && usedReviewers.size < reviewers.length) {
        reviewerIdx = (reviewerIdx + 1) % reviewers.length;
      }
      usedReviewers.add(reviewerIdx);

      const rating = Math.floor(Math.random() * 2) + 4;
      const comment = reviewComments[Math.floor(Math.random() * reviewComments.length)];
      const title = reviewTitles[Math.floor(Math.random() * reviewTitles.length)];

      try {
        await prisma.review.create({
          data: {
            businessId: business.id,
            userId: reviewers[reviewerIdx].id,
            rating,
            title,
            content: comment,
            status: ReviewStatus.APPROVED,
          },
        });
        reviewCount++;
      } catch (e: any) {
        // Skip if already exists
        if (e.code !== 'P2002') console.log('Error:', e.message);
      }
    }
  }

  console.log(`✅ Added ${reviewCount} reviews`);

  // Update business ratings
  for (const business of businesses) {
    const reviews = await prisma.review.findMany({
      where: { businessId: business.id, status: ReviewStatus.APPROVED },
    });

    if (reviews.length > 0) {
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      await prisma.business.update({
        where: { id: business.id },
        data: { rating: avgRating, reviewCount: reviews.length },
      });
    }
  }

  console.log('✅ Updated business ratings');
  console.log('🎉 Reviews seeded successfully!');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
