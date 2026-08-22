import prisma from '../src/lib/db/prisma';

const OFFER_DATA = [
  {
    title: '20% Off All Sushi Rolls',
    description: 'Enjoy 20% off on our entire sushi roll menu. Valid for dine-in and takeout.',
    discountType: 'PERCENTAGE' as const,
    discountValue: 20,
    couponCode: 'SUSHI20',
    terms: 'Valid Monday-Thursday. Cannot be combined with other offers.',
    daysValid: 30,
    redeemType: 'IN_STORE' as const,
    isFeatured: true,
    minPurchase: 25,
    perUserLimit: 1,
    applicableDays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY'],
    tags: ['sushi', 'japanese', 'dining'],
    redeemInstructions: '1. Visit our restaurant during Monday-Thursday lunch or dinner service.\n2. Show this offer to your server when ordering.\n3. Mention the coupon code SUSHI20 to receive 20% off your sushi roll order.\n4. The discount applies to your total sushi bill before tax and tip.\n5. Pay at the counter or to your server to complete the redemption.',
  },
  {
    title: 'Buy One Get One Free Pizza',
    description: 'Order any large pizza and get a second one of equal or lesser value absolutely free!',
    discountType: 'BUY_ONE_GET_ONE' as const,
    discountValue: null,
    couponCode: 'BOGOPIZZA',
    terms: 'Valid on weekdays only. Both pizzas must be same size or smaller.',
    daysValid: 14,
    redeemType: 'ONLINE_AND_INSTORE' as const,
    isFeatured: true,
    perUserLimit: 2,
    applicableDays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
    tags: ['pizza', 'italian', 'family'],
    redeemInstructions: '1. Order any large pizza online or in-store Monday-Friday.\n2. Apply coupon code BOGOPIZZA at checkout (online) or mention it when ordering (in-store).\n3. Get a second pizza of equal or lesser value completely free.\n4. Both pizzas will be included in a single order.\n5. Maximum 2 redemptions per customer.',
  },
  {
    title: '$15 Off Any Order Over $75',
    description: 'Save $15 when you spend $75 or more on our menu items.',
    discountType: 'FIXED' as const,
    discountValue: 15,
    originalPrice: 75,
    couponCode: 'SAVE15',
    terms: 'Minimum order of $75 required. Dine-in only.',
    daysValid: 45,
    redeemType: 'IN_STORE' as const,
    minPurchase: 75,
    tags: ['dining', 'family-meal'],
    redeemInstructions: '1. Visit our restaurant and place a dine-in order totaling $75 or more.\n2. Show this offer to your server before the bill is presented.\n3. Mention the coupon code SAVE15 when requesting the check.\n4. A $15 discount will be applied to your final bill.\n5. Tip based on the original pre-discount amount.',
  },
  {
    title: 'Free Dessert with Main Course',
    description: 'Get a complimentary dessert of your choice when you order any main course.',
    discountType: 'FREE_ITEM' as const,
    discountValue: null,
    couponCode: 'FREEDESSERT',
    terms: 'One per customer. Valid with main course purchase.',
    daysValid: 21,
    redeemType: 'IN_STORE' as const,
    perUserLimit: 1,
    tags: ['dessert', 'dining'],
    redeemInstructions: '1. Visit our restaurant and order any main course from our menu.\n2. Show this offer to your server when placing your order.\n3. Choose any dessert from our dessert menu at no additional cost.\n4. The free dessert will be added to your order.\n5. Limited to one redemption per customer.',
  },
  {
    title: '30% Off Weekend Brunch',
    description: 'Enjoy 30% off our award-winning weekend brunch menu every Saturday and Sunday.',
    discountType: 'PERCENTAGE' as const,
    discountValue: 30,
    couponCode: 'BRUNCH30',
    terms: 'Valid Saturday and Sunday until 2 PM. Reservations recommended.',
    daysValid: 60,
    redeemType: 'ONLINE' as const,
    isFeatured: true,
    isExclusive: true,
    maxRedemptions: 200,
    applicableDays: ['SATURDAY', 'SUNDAY'],
    tags: ['brunch', 'weekend', 'dining'],
    redeemInstructions: '1. Visit our website and make a reservation for Saturday or Sunday brunch.\n2. When booking online, enter coupon code BRUNCH30 in the promo code field.\n3. Arrive before 2 PM on the day of your reservation.\n4. Order from our weekend brunch menu to receive 30% off.\n5. The discount will be automatically applied to your bill at checkout.',
  },
  {
    title: '50% Off Second Coffee',
    description: 'Buy one coffee, get the second one at 50% off. Perfect for sharing with a friend.',
    discountType: 'PERCENTAGE' as const,
    discountValue: 50,
    couponCode: 'COFFEE50',
    terms: 'Second coffee must be of equal or lesser value. Available all day.',
    daysValid: 30,
    redeemType: 'IN_STORE' as const,
    perUserLimit: 1,
    tags: ['coffee', 'cafe', 'beverage'],
    redeemInstructions: '1. Visit our café location any day of the week.\n2. Order two coffee drinks at regular price.\n3. Show this offer to the barista when placing your order.\n4. Mention coupon code COFFEE50 to receive 50% off the second coffee.\n5. The lower-priced coffee will be discounted.',
  },
  {
    title: '$25 Off First Auto Service',
    description: 'New customers save $25 on their first auto service appointment with us.',
    discountType: 'FIXED' as const,
    discountValue: 25,
    couponCode: 'NEW25',
    terms: 'First-time customers only. Excludes tires and batteries.',
    daysValid: 90,
    redeemType: 'ONLINE_AND_INSTORE' as const,
    perUserLimit: 1,
    tags: ['auto', 'service', 'new-customer'],
    redeemInstructions: '1. Schedule your first service appointment online or by phone.\n2. When booking, mention the coupon code NEW25 to the service advisor.\n3. Bring your vehicle to our shop at the scheduled time.\n4. The $25 discount will be applied to your service bill.\n5. Offer applies to labor charges only (parts excluded).',
  },
  {
    title: 'Free Oil Change with Tire Purchase',
    description: 'Purchase 4 new tires and get a complimentary oil change service.',
    discountType: 'FREE_ITEM' as const,
    discountValue: null,
    couponCode: 'OILFREE',
    terms: 'Must purchase 4 tires. Free oil change up to 5 quarts conventional oil.',
    daysValid: 60,
    redeemType: 'IN_STORE' as const,
    isExclusive: true,
    minPurchase: 400,
    tags: ['auto', 'tires', 'oil-change'],
    redeemInstructions: '1. Purchase a set of 4 new tires from our shop.\n2. Schedule your tire installation appointment.\n3. Mention coupon code OILFREE when booking.\n4. Bring your vehicle in for tire installation.\n5. Receive a complimentary oil change (up to 5 quarts conventional oil) at the same visit.',
  },
  {
    title: '20% Off All Spa Services',
    description: 'Relax and save 20% on all our spa services including massages, facials, and body treatments.',
    discountType: 'PERCENTAGE' as const,
    discountValue: 20,
    couponCode: 'SPA20',
    terms: 'Valid Tuesday-Thursday. Advance booking required.',
    daysValid: 45,
    redeemType: 'ONLINE' as const,
    applicableDays: ['TUESDAY', 'WEDNESDAY', 'THURSDAY'],
    tags: ['spa', 'wellness', 'relaxation'],
    redeemInstructions: '1. Browse our spa service menu on our website.\n2. Select your desired service (massage, facial, or body treatment).\n3. Choose a Tuesday, Wednesday, or Thursday appointment.\n4. Enter coupon code SPA20 at checkout when booking online.\n5. Arrive 15 minutes early to complete intake forms.',
  },
  {
    title: 'Buy 2 Get 1 Free Yoga Classes',
    description: 'Purchase 2 yoga classes and receive a 3rd class absolutely free.',
    discountType: 'BUY_ONE_GET_ONE' as const,
    discountValue: null,
    couponCode: 'YOGA3FOR2',
    terms: 'New members only. Classes must be used within 60 days.',
    daysValid: 30,
    redeemType: 'APP_ONLY' as const,
    perUserLimit: 1,
    tags: ['yoga', 'fitness', 'wellness'],
    redeemInstructions: '1. Download our studio mobile app from the App Store or Google Play.\n2. Create a new member account.\n3. Purchase 2 yoga class credits through the app.\n4. Apply coupon code YOGA3FOR2 during checkout.\n5. A 3rd class credit will be automatically added to your account.',
  },
  {
    title: '$10 Off Hair Cut and Color',
    description: 'Save $10 on any haircut and color service package.',
    discountType: 'FIXED' as const,
    discountValue: 10,
    couponCode: 'HAIR10',
    terms: 'New clients only. Cannot be combined with other offers.',
    daysValid: 60,
    redeemType: 'PHONE' as const,
    perUserLimit: 1,
    minPurchase: 40,
    tags: ['salon', 'hair', 'beauty'],
    redeemInstructions: '1. Call our salon at the phone number listed on our profile.\n2. Mention this offer and coupon code HAIR10 when booking.\n3. Schedule your haircut and color appointment.\n4. Mention you are a new client when arriving.\n5. The $10 discount will be applied to your service total at checkout.',
  },
  {
    title: 'Free Manicure with Pedicure',
    description: 'Book a pedicure service and receive a complimentary manicure.',
    discountType: 'FREE_ITEM' as const,
    discountValue: null,
    couponCode: 'MANIFREE',
    terms: 'Valid with select technicians. One per customer.',
    daysValid: 30,
    redeemType: 'IN_STORE' as const,
    perUserLimit: 1,
    tags: ['salon', 'nails', 'beauty'],
    redeemInstructions: '1. Walk into our salon during business hours.\n2. Request a pedicure service at the front desk.\n3. Show this offer and mention coupon code MANIFREE.\n4. Select your preferred nail color and style.\n5. A complimentary manicure will be added to your service at no extra charge.',
  },
  {
    title: '40% Off Plumber Services',
    description: 'Save 40% on all plumbing services for residential customers.',
    discountType: 'PERCENTAGE' as const,
    discountValue: 40,
    couponCode: 'PLUMBER40',
    terms: 'Valid for first-time customers. Service call fee waived.',
    daysValid: 45,
    redeemType: 'PHONE' as const,
    isFeatured: true,
    perUserLimit: 1,
    tags: ['plumbing', 'home-services', 'new-customer'],
    redeemInstructions: '1. Call our plumbing service line to schedule an appointment.\n2. Mention you are a new customer and reference coupon code PLUMBER40.\n3. Describe your plumbing issue to our representative.\n4. Our licensed plumber will arrive at your home at the scheduled time.\n5. The 40% discount and waived service call fee will be reflected on your invoice.',
  },
  {
    title: 'Buy One Get One Free Dry Cleaning',
    description: 'Get one dry cleaning item free when you pay for one at regular price.',
    discountType: 'BUY_ONE_GET_ONE' as const,
    discountValue: null,
    couponCode: 'DCBOGO',
    terms: 'Equal or lesser value item. Garment restrictions apply.',
    daysValid: 21,
    redeemType: 'IN_STORE' as const,
    perUserLimit: 2,
    tags: ['dry-cleaning', 'clothing'],
    redeemInstructions: '1. Bring two garments to any of our dry-cleaning locations.\n2. Pay full price for one garment at the counter.\n3. Present this offer and mention coupon code DCBOGO.\n4. The second garment (equal or lesser value) will be processed for free.\n5. Pick up both garments at the standard turnaround time (typically 2-3 days).',
  },
  {
    title: '$50 Off Any HVAC Repair',
    description: 'Save $50 on any HVAC repair service over $200.',
    discountType: 'FIXED' as const,
    discountValue: 50,
    originalPrice: 200,
    couponCode: 'HVAC50',
    terms: 'Minimum repair cost of $200. Service area restrictions may apply.',
    daysValid: 30,
    redeemType: 'PHONE' as const,
    minPurchase: 200,
    tags: ['hvac', 'home-services', 'repair'],
    redeemInstructions: '1. Call our HVAC service line to schedule a diagnostic appointment.\n2. Mention coupon code HVAC50 when booking.\n3. Our technician will assess your repair needs on-site.\n4. If repair cost exceeds $200, the $50 discount will be applied.\n5. Pay the remaining balance after the repair is completed.',
  },
  {
    title: 'Free Consultation with Any Legal Service',
    description: 'Get a free 30-minute consultation when you book any legal service.',
    discountType: 'FREE_ITEM' as const,
    discountValue: null,
    couponCode: 'LEGALCONSULT',
    terms: 'New clients only. Cannot be combined with other offers.',
    daysValid: 60,
    redeemType: 'EMAIL' as const,
    isExclusive: true,
    perUserLimit: 1,
    tags: ['legal', 'consultation', 'new-customer'],
    redeemInstructions: '1. Send an email to our office requesting a consultation.\n2. Reference coupon code LEGALCONSULT in your email subject line.\n3. Briefly describe your legal matter in the email body.\n4. Our team will schedule your free 30-minute consultation within 1-2 business days.\n5. Bring relevant documents to your scheduled consultation.',
  },
  {
    title: '25% Off Pet Grooming',
    description: 'Save 25% on full-service pet grooming for dogs and cats.',
    discountType: 'PERCENTAGE' as const,
    discountValue: 25,
    couponCode: 'PAWS25',
    terms: 'All breeds welcome. Advance booking required.',
    daysValid: 45,
    redeemType: 'ONLINE' as const,
    tags: ['pet', 'grooming'],
    redeemInstructions: '1. Visit our website and select the full-service grooming package.\n2. Choose your pet (dog or cat) and preferred grooming style.\n3. Select a date and time for the grooming appointment.\n4. Enter coupon code PAWS25 at checkout for 25% off.\n5. Drop off your pet at the scheduled time. Pickup is typically 2-3 hours later.',
  },
  {
    title: 'Buy 3 Get 1 Free Dog Walking',
    description: 'Purchase 3 dog walking sessions and get a 4th session free.',
    discountType: 'BUY_ONE_GET_ONE' as const,
    discountValue: null,
    couponCode: 'WALK4FOR3',
    terms: 'Must be used within 30 days. One dog per session.',
    daysValid: 30,
    redeemType: 'APP_ONLY' as const,
    perUserLimit: 1,
    tags: ['pet', 'dog-walking', 'service'],
    redeemInstructions: '1. Download our dog walking mobile app.\n2. Sign up and create a profile for your dog.\n3. Purchase 3 dog walking sessions through the app.\n4. Apply coupon code WALK4FOR3 during checkout.\n5. A 4th session credit will be added automatically. Schedule walks as needed within 30 days.',
  },
  {
    title: '$20 Off First Veterinary Visit',
    description: 'New pet patients save $20 on their first comprehensive veterinary exam.',
    discountType: 'FIXED' as const,
    discountValue: 20,
    couponCode: 'VET20',
    terms: 'First visit only. Includes full physical exam.',
    daysValid: 90,
    redeemType: 'ONLINE_AND_INSTORE' as const,
    isFeatured: true,
    perUserLimit: 1,
    tags: ['veterinary', 'pet', 'new-customer'],
    redeemInstructions: '1. Schedule your pet\'s first appointment online or by phone.\n2. Mention coupon code VET20 and that your pet is a new patient.\n3. Complete the new patient registration form sent via email.\n4. Arrive 10 minutes early with your pet\'s medical records.\n5. The $20 discount applies to your first comprehensive exam fee.',
  },
  {
    title: 'Free Eye Exam with Glasses Purchase',
    description: 'Get a complimentary eye exam when you purchase any prescription glasses.',
    discountType: 'FREE_ITEM' as const,
    discountValue: null,
    couponCode: 'EYEFREE',
    terms: 'With purchase of frames and lenses. Some restrictions apply.',
    daysValid: 60,
    redeemType: 'IN_STORE' as const,
    minPurchase: 100,
    tags: ['eye-care', 'glasses', 'health'],
    redeemInstructions: '1. Visit our optical store location.\n2. Browse our selection of frames and select a pair with prescription lenses.\n3. Show this offer and mention coupon code EYEFREE to the optician.\n4. Schedule your complimentary eye exam at the same visit.\n5. The free eye exam is performed by a licensed optometrist before lens fitting.',
  },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 60);
}

async function main() {
  console.log('🌱 Seeding offers with enhanced schema...');

  const businesses = await prisma.business.findMany({
    select: { id: true, name: true, slug: true, website: true },
    orderBy: { name: 'asc' },
  });

  if (businesses.length === 0) {
    console.error('❌ No businesses found. Please run business seed first.');
    process.exit(1);
  }

  console.log(`📦 Found ${businesses.length} businesses`);

  await prisma.offer.deleteMany({});
  console.log('🗑️  Cleared existing offers');

  for (let i = 0; i < OFFER_DATA.length; i++) {
    const offerData = OFFER_DATA[i];
    const business = businesses[i % businesses.length];
    const slug = `${slugify(offerData.title)}-${i + 1}`;
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + offerData.daysValid);

    // Auto-generate redeem link based on redeem type for online offers
    let redeemLink: string | null = null;
    const onlineTypes = ['ONLINE', 'ONLINE_AND_INSTORE', 'COUPON_CODE', 'APP_ONLY'];
    if (onlineTypes.includes(offerData.redeemType)) {
      // Use the business's website if available, otherwise construct a default
      redeemLink = business.website || `https://${business.slug}.com/offers/${slug}`;
    }

    await prisma.offer.create({
      data: {
        businessId: business.id,
        title: offerData.title,
        slug,
        description: offerData.description,
        discountType: offerData.discountType,
        discountValue: offerData.discountValue,
        originalPrice: (offerData as any).originalPrice,
        couponCode: offerData.couponCode,
        terms: offerData.terms,
        startDate,
        endDate,
        status: 'PUBLISHED',
        redeemType: offerData.redeemType,
        redeemLink,
        redeemInstructions: (offerData as any).redeemInstructions || null,
        isFeatured: (offerData as any).isFeatured || false,
        isExclusive: (offerData as any).isExclusive || false,
        minPurchase: (offerData as any).minPurchase,
        maxRedemptions: (offerData as any).maxRedemptions,
        perUserLimit: (offerData as any).perUserLimit,
        applicableDays: (offerData as any).applicableDays || [],
        tags: offerData.tags,
      },
    });

    console.log(`✓ ${offerData.title} → ${business.name} [${offerData.redeemType}]`);
  }

  console.log(`\n✅ Successfully seeded ${OFFER_DATA.length} enhanced offers!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });