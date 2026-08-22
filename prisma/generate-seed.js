const fs = require('fs');

const businessTypeSlugs = [
  'food-dining',
  'accommodation-hospitality',
  'retail-shopping',
  'home-property-services',
  'construction-contractors',
  'real-estate-property',
  'automotive',
  'transportation-logistics',
  'car-rental-transport',
  'travel-tourism',
  'health-medical',
  'dental-oral-health',
  'pharmacy-medical-retail',
  'beauty-personal-care',
  'fitness-wellness',
  'pets-animals',
  'professional-services',
  'legal-services',
  'accounting-tax-services',
  'financial-services',
  'insurance-services',
  'business-services',
  'recruitment-employment',
  'marketing-advertising',
  'technology-it',
  'telecommunications',
  'education-training',
  'childcare-family-services',
  'senior-home-care',
  'events-wedding-services',
  'entertainment-nightlife',
  'sports-recreation',
  'arts-culture',
  'photography-media',
  'printing-signage',
  'fashion-apparel',
  'jewelry-luxury',
  'beauty-products-cosmetics',
  'electronics-appliances',
  'home-furniture',
  'food-grocery-retail',
  'industrial-manufacturing',
  'wholesale-distribution',
  'industrial-equipment-supplies',
  'building-materials-supplies',
  'agriculture-farming',
  'gardening-landscaping',
  'energy-solar',
  'environmental-services',
  'security-services',
  'locksmith-access-services',
  'cleaning-janitorial',
  'repair-maintenance',
  'marine-boating',
  'aviation-services',
  'funeral-memorial-services',
  'religious-organizations',
  'community-organizations',
  'nonprofit-charitable',
  'government-public-services',
  'laboratories-testing',
  'pharmaceutical-medical-suppliers',
  'chemical-scientific-services',
  'mining-natural-resources',
  'storage-warehousing',
  'packaging-logistics-supplies',
  'translation-language-services',
  'research-consulting',
  'publishing-creative-services',
  'specialized-other-businesses',
];

const varNames = [
  'foodDining', 'accommodation', 'retail', 'homeProperty', 'construction',
  'realEstate', 'automotive', 'transportation', 'carRental', 'travel',
  'health', 'dental', 'pharmacy', 'beauty', 'fitness',
  'pets', 'professionalSvcs', 'legal', 'accounting', 'financial',
  'insurance', 'businessSvcs', 'recruitment', 'marketing', 'technology',
  'telecom', 'education', 'childcare', 'seniorCare', 'events',
  'entertainment', 'sports', 'arts', 'photography', 'printing',
  'fashion', 'jewelry', 'cosmetics', 'electronics', 'homeFurniture',
  'grocery', 'industrial', 'wholesale', 'industrialEquip', 'buildingMaterials',
  'agriculture', 'landscaping', 'energy', 'environmental', 'security',
  'locksmith', 'cleaning', 'repair', 'marine', 'aviation',
  'funeral', 'religious', 'community', 'nonprofit', 'government',
  'labs', 'pharma', 'chemical', 'mining', 'storage',
  'packaging', 'translation', 'research', 'publishing', 'specialized',
];

const categories = {
  'food-dining': [
    'Restaurants', 'Fast Food', 'Cafes & Coffee Shops', 'Bars & Pubs', 'Food Trucks',
    'Bakeries', 'Ice Cream Parlors', 'Pizza Places', 'Seafood Restaurants', 'Asian Restaurants',
    'Mexican Restaurants', 'Indian Restaurants', 'Italian Restaurants', 'Food Delivery Services', 'Catering Services', 'Food Courts'
  ],
  'accommodation-hospitality': [
    'Hotels & Motels', 'Luxury Resorts', 'Boutique Hotels', 'Budget Accommodations',
    'Vacation Rentals', 'Bed & Breakfast', 'Hostels', 'Inn & Suites', 'Guest Houses', 'Serviced Apartments'
  ],
  'retail-shopping': [
    'Department Stores', 'Shopping Malls', 'Boutique Shops', 'Outlet Stores',
    'Convenience Stores', 'Discount Stores', 'Thrift Stores', 'Flea Markets'
  ],
  'home-property-services': [
    'Plumbing Services', 'Electrical Services', 'HVAC Services', 'Pest Control',
    'Home Cleaning', 'Moving Services', 'Handyman Services', 'Appliance Repair',
    'Locksmith Services', 'Window Cleaning'
  ],
  'construction-contractors': [
    'General Contractors', 'Residential Builders', 'Commercial Builders',
    'Renovation Contractors', 'Roofing Contractors', 'Foundation Contractors',
    'Demolition Services', 'Excavation Services'
  ],
  'real-estate-property': [
    'Real Estate Agents', 'Real Estate Agencies', 'Property Management',
    'Mortgage Brokers', 'Title Companies', 'Home Inspectors', 'Appraisers', 'Commercial Real Estate'
  ],
  'automotive': [
    'Car Dealers', 'Auto Repair', 'Auto Parts', 'Car Wash', 'Tire Shops',
    'Gas Stations', 'Auto Body Shops', 'Oil Change Services', 'Auto Glass', 'Motorcycle Dealers'
  ],
  'transportation-logistics': [
    'Trucking Companies', 'Freight Services', 'Courier Services', 'Shipping Companies',
    'Taxi Services', 'Rideshare Services', 'Public Transit', 'Bus Companies'
  ],
  'car-rental-transport': [
    'Car Rental Agencies', 'Limousine Services', 'Chauffeur Services',
    'RV Rentals', 'Van Rentals', 'Luxury Car Rentals'
  ],
  'travel-tourism': [
    'Travel Agencies', 'Tour Operators', 'Tourist Attractions', 'Museums',
    'Guided Tours', 'Vacation Packages'
  ],
  'health-medical': [
    'Hospitals', 'Medical Clinics', 'Doctors & Physicians', 'Medical Specialists',
    'Urgent Care', 'Emergency Rooms', 'Pediatricians', 'Cardiologists',
    'Dermatologists', 'Orthopedists', 'Physical Therapy', 'Mental Health Services', 'Chiropractors'
  ],
  'dental-oral-health': [
    'Dentists', 'Orthodontists', 'Oral Surgeons', 'Dental Hygienists',
    'Pediatric Dentists', 'Dental Labs'
  ],
  'pharmacy-medical-retail': [
    'Pharmacies', 'Drug Stores', 'Medical Supply Stores',
    'Vitamin & Supplement Stores', 'Home Medical Equipment'
  ],
  'beauty-personal-care': [
    'Hair Salons', 'Nail Salons', 'Barbershops', 'Spas', 'Beauty Salons',
    'Makeup Artists', 'Skincare Clinics', 'Eyelash Extensions', 'Tanning Salons',
    'Waxing Services', 'Massage Therapy'
  ],
  'fitness-wellness': [
    'Gyms & Fitness Centers', 'Yoga Studios', 'Pilates Studios', 'Swimming Pools',
    'Martial Arts Schools', 'Personal Trainers', 'Crossfit Gyms', 'Nutritionists', 'Health Clubs'
  ],
  'pets-animals': [
    'Veterinarians', 'Pet Stores', 'Pet Grooming', 'Pet Boarding & Daycare',
    'Dog Trainers', 'Dog Walkers', 'Pet Supplies', 'Animal Shelters',
    'Horse Boarding', 'Aquarium Services'
  ],
  'professional-services': [
    'Consulting Firms', 'Management Consulting', 'HR Consulting', 'IT Consulting',
    'Management Training', 'Executive Search', 'Professional Associations'
  ],
  'legal-services': [
    'Lawyers & Attorneys', 'Law Firms', 'Notaries Public', 'Legal Aid',
    'Paralegal Services', 'Mediators'
  ],
  'accounting-tax-services': [
    'Accountants', 'Tax Preparation', 'Bookkeeping Services', 'Auditing Services',
    'Payroll Services', 'Financial Advisors'
  ],
  'financial-services': [
    'Banks', 'Credit Unions', 'Investment Firms', 'Stockbrokers',
    'Loan Services', 'Currency Exchange'
  ],
  'insurance-services': [
    'Insurance Agencies', 'Auto Insurance', 'Home Insurance', 'Life Insurance',
    'Health Insurance', 'Business Insurance'
  ],
  'business-services': [
    'Business Consultants', 'Office Supplies', 'Virtual Offices', 'Coworking Spaces',
    'Conference Rooms', 'Mailing Services'
  ],
  'recruitment-employment': [
    'Employment Agencies', 'Staffing Agencies', 'Headhunters', 'Job Training',
    'Career Counseling', 'Resume Services'
  ],
  'marketing-advertising': [
    'Advertising Agencies', 'Digital Marketing', 'SEO Services', 'Social Media Marketing',
    'Public Relations', 'Graphic Design', 'Branding Agencies'
  ],
  'technology-it': [
    'Software Development', 'Web Development', 'App Development', 'IT Consulting',
    'Computer Repair', 'Phone & Tablet Repair', 'Data Recovery', 'Cloud Services',
    'Cybersecurity', 'Tech Retail'
  ],
  'telecommunications': [
    'Telecom Companies', 'Internet Service Providers', 'Mobile Phone Stores',
    'Cable TV Providers', 'VoIP Services'
  ],
  'education-training': [
    'Schools', 'Colleges & Universities', 'Tutoring Centers', 'Driving Schools',
    'Language Schools', 'Music Schools', 'Dance Schools', 'Art Schools',
    'Online Courses', 'Test Prep', 'Vocational Training'
  ],
  'childcare-family-services': [
    'Daycare Centers', 'Preschools', 'After School Programs', 'Nanny Services',
    'Babysitting Services', "Children's Activities", 'Adoption Services', 'Family Counseling'
  ],
  'senior-home-care': [
    'Senior Care', 'Nursing Homes', 'Assisted Living', 'Home Health Care',
    'Companion Services', 'Hospice Care', 'Elder Law'
  ],
  'events-wedding-services': [
    'Event Planners', 'Wedding Planners', 'Catering Services', 'Venue Rentals',
    'DJ Services', 'Live Bands', 'Event Rentals', 'Party Supplies',
    'Balloons & Decorations', 'Tents & Event Equipment'
  ],
  'entertainment-nightlife': [
    'Nightclubs', 'Bars & Lounges', 'Movie Theaters', 'Live Music Venues',
    'Comedy Clubs', 'Arcades & Game Rooms', 'Escape Rooms', 'Laser Tag', 'Karaoke'
  ],
  'sports-recreation': [
    'Sports Clubs', 'Golf Courses', 'Tennis Courts', 'Bowling Alleys',
    'Ice Skating Rinks', 'Mini Golf', 'Amusement Parks', 'Water Parks',
    'Ski Resorts', 'Fishing Charters', 'Boat Rentals', 'Sports Equipment Rental'
  ],
  'arts-culture': [
    'Art Galleries', 'Museums', 'Theaters', 'Concert Halls', 'Opera Houses',
    'Art Classes', 'Pottery Studios', 'Craft Stores'
  ],
  'photography-media': [
    'Photographers', 'Wedding Photographers', 'Portrait Photographers',
    'Videographers', 'Photo Studios', 'Photo Booths', 'Drone Photography', 'Photo Editing Services'
  ],
  'printing-signage': [
    'Printing Services', 'Sign Shops', 'Business Cards', 'Brochures & Flyers',
    'Banners & Posters', 'Custom Merchandise', 'Promotional Products'
  ],
  'fashion-apparel': [
    'Clothing Stores', "Men's Clothing", "Women's Clothing", "Children's Clothing",
    'Sportswear', 'Shoe Stores', 'Vintage Clothing', 'Custom Tailoring',
    'Bridal Shops', 'Maternity Clothing'
  ],
  'jewelry-luxury': [
    'Jewelry Stores', 'Watches', 'Diamond Jewelry', 'Gold & Silver',
    'Engagement Rings', 'Jewelry Repair', 'Luxury Goods', 'Art & Antiques'
  ],
  'beauty-products-cosmetics': [
    'Cosmetics Stores', 'Skincare Products', 'Haircare Products',
    'Fragrances & Perfumes', 'Makeup Products', 'Nail Products', 'Organic Beauty'
  ],
  'electronics-appliances': [
    'Electronics Stores', 'Computer Stores', 'Appliance Stores', 'Smartphone Stores',
    'Gaming Stores', 'Camera Stores', 'Home Theater', 'Audio Equipment'
  ],
  'home-furniture': [
    'Furniture Stores', 'Mattress Stores', 'Office Furniture', 'Outdoor Furniture',
    'Antique Furniture', 'Custom Furniture', 'Home Decor', 'Lighting Stores',
    'Rugs & Carpet', 'Window Treatments'
  ],
  'food-grocery-retail': [
    'Supermarkets', 'Organic Foods', 'Farmers Markets', 'Specialty Foods',
    'Wine & Spirits', 'Bakeries', 'Butcher Shops', 'Seafood Markets',
    'Cheese Shops', 'Coffee & Tea Shops'
  ],
  'industrial-manufacturing': [
    'Manufacturing Plants', 'Metal Fabrication', 'Textile Manufacturing',
    'Food Processing', 'Electronics Manufacturing', 'Plastics Manufacturing',
    'Woodworking', 'Machining'
  ],
  'wholesale-distribution': [
    'Wholesale Distributors', 'Food Wholesale', 'Electronics Wholesale',
    'Clothing Wholesale', 'Auto Parts Wholesale', 'Janitorial Supplies',
    'Office Supplies Wholesale'
  ],
  'industrial-equipment-supplies': [
    'Industrial Equipment', 'Heavy Machinery', 'Safety Equipment',
    'Hydraulic Equipment', 'Welding Equipment', 'Electrical Supplies'
  ],
  'building-materials-supplies': [
    'Lumberyards', 'Hardware Stores', 'Cement & Concrete', 'Roofing Supplies',
    'Flooring Supplies', 'Paint Stores', 'Plumbing Supplies', 'Electrical Supplies'
  ],
  'agriculture-farming': [
    'Farms', 'Nurseries', 'Farm Equipment', 'Feed & Seed', 'Livestock',
    'Dairy Farms', 'Vineyards & Wineries', 'Organic Farming'
  ],
  'gardening-landscaping': [
    'Landscaping Services', 'Lawn Care', 'Tree Services', 'Garden Centers',
    'Irrigation Services', 'Landscape Design', 'Fence Contractors', 'Outdoor Living'
  ],
  'energy-solar': [
    'Solar Panel Installation', 'Solar Equipment', 'Wind Energy',
    'Energy Audits', 'Electricians', 'Energy Storage'
  ],
  'environmental-services': [
    'Waste Management', 'Recycling Services', 'Hazardous Waste',
    'Environmental Consulting', 'Water Treatment', 'Air Quality'
  ],
  'security-services': [
    'Security Companies', 'Security Guards', 'Alarm Systems', 'Surveillance Systems',
    'Access Control', 'Cyber Security'
  ],
  'locksmith-access-services': [
    'Locksmiths', 'Lock Repair', 'Key Duplication', 'Safe Services',
    'Automotive Locksmith', 'Access Control Systems'
  ],
  'cleaning-janitorial': [
    'Janitorial Services', 'Commercial Cleaning', 'Residential Cleaning',
    'Carpet Cleaning', 'Window Cleaning', 'Pressure Washing', 'Deep Cleaning',
    'Move-In/Out Cleaning'
  ],
  'repair-maintenance': [
    'Appliance Repair', 'Electronics Repair', 'Furniture Repair',
    'Watch & Clock Repair', 'Shoe Repair', 'Leather Repair', 'Tool Repair',
    'Maintenance Contracts'
  ],
  'marine-boating': [
    'Marinas', 'Boat Dealers', 'Boat Repair', 'Boat Rentals', 'Fishing Charters',
    'Sailing Schools', 'Marine Supplies', 'Dive Shops'
  ],
  'aviation-services': [
    'Airports', 'Airlines', 'Flight Schools', 'Aircraft Maintenance',
    'Helicopter Services', 'Private Jet Services', 'Air Cargo'
  ],
  'funeral-memorial-services': [
    'Funeral Homes', 'Crematoriums', 'Memorial Parks', 'Florists (Funeral)',
    'Caskets & Monuments', 'Pre-Planning Services'
  ],
  'religious-organizations': [
    'Churches', 'Temples', 'Mosques', 'Synagogues', 'Religious Education',
    'Spiritual Counseling'
  ],
  'community-organizations': [
    'Community Centers', 'Social Services', 'Youth Programs', 'Senior Programs',
    'Volunteer Organizations', 'Support Groups'
  ],
  'nonprofit-charitable': [
    'Charities', 'Foundations', 'Homeless Shelters', 'Food Banks',
    'Animal Rescue', 'Environmental Groups', 'International Aid'
  ],
  'government-public-services': [
    'Government Offices', 'Police Departments', 'Fire Departments', 'Post Offices',
    'Courts', 'DMV', 'Libraries', 'Public Utilities'
  ],
  'laboratories-testing': [
    'Testing Labs', 'Medical Labs', 'Research Labs', 'Environmental Labs',
    'Calibration Services', 'DNA Testing'
  ],
  'pharmaceutical-medical-suppliers': [
    'Pharmaceutical Wholesale', 'Medical Device Companies', 'Biotech Companies',
    'Medical Gas Suppliers', 'Lab Supplies'
  ],
  'chemical-scientific-services': [
    'Chemical Companies', 'Laboratory Chemicals', 'Industrial Chemicals',
    'Cleaning Chemicals', 'Adhesives & Sealants', 'Paints & Coatings'
  ],
  'mining-natural-resources': [
    'Mining Companies', 'Quarrying', 'Oil & Gas Companies', 'Renewable Energy',
    'Forestry', 'Water Resources'
  ],
  'storage-warehousing': [
    'Warehouses', 'Self Storage', 'Cold Storage', 'Fulfillment Centers',
    'Record Storage', 'Vehicle Storage'
  ],
  'packaging-logistics-supplies': [
    'Packaging Supplies', 'Box Manufacturers', 'Pallet Suppliers',
    'Shipping Supplies', 'Labeling Systems', 'Wrapping Materials'
  ],
  'translation-language-services': [
    'Translation Services', 'Interpreters', 'Language Schools', 'Transcription Services',
    'Localization Services'
  ],
  'research-consulting': [
    'Market Research', 'Business Consulting', 'Management Consulting',
    'Strategy Consulting', 'Scientific Research', 'Data Analysis'
  ],
  'publishing-creative-services': [
    'Publishing Houses', 'Bookstores', 'Graphic Design Services', 'Copywriting',
    'Video Production', 'Animation Studios', 'Music Studios', 'Voice Over'
  ],
  'specialized-other-businesses': [
    'Miscellaneous Services', 'Import/Export', 'Business Brokers',
    'Franchise Opportunities', 'Auction Houses', 'Pawn Shops',
    'Check Cashing', 'Private Investigators'
  ],
};

function toSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// Generate variable declarations
let varDeclarations = `  // Create categories
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

  const categories = await Promise.all([`;

// Generate category upserts
const typeToVarMap = {
  'food-dining': 'foodDining',
  'accommodation-hospitality': 'accommodation',
  'retail-shopping': 'retail',
  'home-property-services': 'homeProperty',
  'construction-contractors': 'construction',
  'real-estate-property': 'realEstate',
  'automotive': 'automotive',
  'transportation-logistics': 'transportation',
  'car-rental-transport': 'carRental',
  'travel-tourism': 'travel',
  'health-medical': 'health',
  'dental-oral-health': 'dental',
  'pharmacy-medical-retail': 'pharmacy',
  'beauty-personal-care': 'beauty',
  'fitness-wellness': 'fitness',
  'pets-animals': 'pets',
  'professional-services': 'professionalSvcs',
  'legal-services': 'legal',
  'accounting-tax-services': 'accounting',
  'financial-services': 'financial',
  'insurance-services': 'insurance',
  'business-services': 'businessSvcs',
  'recruitment-employment': 'recruitment',
  'marketing-advertising': 'marketing',
  'technology-it': 'technology',
  'telecommunications': 'telecom',
  'education-training': 'education',
  'childcare-family-services': 'childcare',
  'senior-home-care': 'seniorCare',
  'events-wedding-services': 'events',
  'entertainment-nightlife': 'entertainment',
  'sports-recreation': 'sports',
  'arts-culture': 'arts',
  'photography-media': 'photography',
  'printing-signage': 'printing',
  'fashion-apparel': 'fashion',
  'jewelry-luxury': 'jewelry',
  'beauty-products-cosmetics': 'cosmetics',
  'electronics-appliances': 'electronics',
  'home-furniture': 'homeFurniture',
  'food-grocery-retail': 'grocery',
  'industrial-manufacturing': 'industrial',
  'wholesale-distribution': 'wholesale',
  'industrial-equipment-supplies': 'industrialEquip',
  'building-materials-supplies': 'buildingMaterials',
  'agriculture-farming': 'agriculture',
  'gardening-landscaping': 'landscaping',
  'energy-solar': 'energy',
  'environmental-services': 'environmental',
  'security-services': 'security',
  'locksmith-access-services': 'locksmith',
  'cleaning-janitorial': 'cleaning',
  'repair-maintenance': 'repair',
  'marine-boating': 'marine',
  'aviation-services': 'aviation',
  'funeral-memorial-services': 'funeral',
  'religious-organizations': 'religious',
  'community-organizations': 'community',
  'nonprofit-charitable': 'nonprofit',
  'government-public-services': 'government',
  'laboratories-testing': 'labs',
  'pharmaceutical-medical-suppliers': 'pharma',
  'chemical-scientific-services': 'chemical',
  'mining-natural-resources': 'mining',
  'storage-warehousing': 'storage',
  'packaging-logistics-supplies': 'packaging',
  'translation-language-services': 'translation',
  'research-consulting': 'research',
  'publishing-creative-services': 'publishing',
  'specialized-other-businesses': 'specialized',
};

const typeSlugToVarName = {
  'food-dining': 'foodDining',
  'accommodation-hospitality': 'accommodation',
  'retail-shopping': 'retail',
  'home-property-services': 'homeProperty',
  'construction-contractors': 'construction',
  'real-estate-property': 'realEstate',
  'automotive': 'automotive',
  'transportation-logistics': 'transportation',
  'car-rental-transport': 'carRental',
  'travel-tourism': 'travel',
  'health-medical': 'health',
  'dental-oral-health': 'dental',
  'pharmacy-medical-retail': 'pharmacy',
  'beauty-personal-care': 'beauty',
  'fitness-wellness': 'fitness',
  'pets-animals': 'pets',
  'professional-services': 'professionalSvcs',
  'legal-services': 'legal',
  'accounting-tax-services': 'accounting',
  'financial-services': 'financial',
  'insurance-services': 'insurance',
  'business-services': 'businessSvcs',
  'recruitment-employment': 'recruitment',
  'marketing-advertising': 'marketing',
  'technology-it': 'technology',
  'telecommunications': 'telecom',
  'education-training': 'education',
  'childcare-family-services': 'childcare',
  'senior-home-care': 'seniorCare',
  'events-wedding-services': 'events',
  'entertainment-nightlife': 'entertainment',
  'sports-recreation': 'sports',
  'arts-culture': 'arts',
  'photography-media': 'photography',
  'printing-signage': 'printing',
  'fashion-apparel': 'fashion',
  'jewelry-luxury': 'jewelry',
  'beauty-products-cosmetics': 'cosmetics',
  'electronics-appliances': 'electronics',
  'home-furniture': 'homeFurniture',
  'food-grocery-retail': 'grocery',
  'industrial-manufacturing': 'industrial',
  'wholesale-distribution': 'wholesale',
  'industrial-equipment-supplies': 'industrialEquip',
  'building-materials-supplies': 'buildingMaterials',
  'agriculture-farming': 'agriculture',
  'gardening-landscaping': 'landscaping',
  'energy-solar': 'energy',
  'environmental-services': 'environmental',
  'security-services': 'security',
  'locksmith-access-services': 'locksmith',
  'cleaning-janitorial': 'cleaning',
  'repair-maintenance': 'repair',
  'marine-boating': 'marine',
  'aviation-services': 'aviation',
  'funeral-memorial-services': 'funeral',
  'religious-organizations': 'religious',
  'community-organizations': 'community',
  'nonprofit-charitable': 'nonprofit',
  'government-public-services': 'government',
  'laboratories-testing': 'labs',
  'pharmaceutical-medical-suppliers': 'pharma',
  'chemical-scientific-services': 'chemical',
  'mining-natural-resources': 'mining',
  'storage-warehousing': 'storage',
  'packaging-logistics-supplies': 'packaging',
  'translation-language-services': 'translation',
  'research-consulting': 'research',
  'publishing-creative-services': 'publishing',
  'specialized-other-businesses': 'specialized',
};

let categoryUpserts = [];
let order = 1;

for (const [typeSlug, catNames] of Object.entries(categories)) {
  const typeVar = typeSlugToVarName[typeSlug];
  if (!typeVar) {
    console.log(`Missing var for ${typeSlug}`);
    continue;
  }

  catNames.forEach((catName, idx) => {
    const slug = toSlug(catName);
    categoryUpserts.push(
      `    prisma.category.upsert({ where: { slug_businessTypeId: { slug: '${slug}', businessTypeId: ${typeVar}.id } }, update: {}, create: { name: '${catName.replace(/'/g, "\\'")}', slug: '${slug}', businessTypeId: ${typeVar}.id, order: ${idx + 1}, status: ContentStatus.PUBLISHED } })`
    );
  });
}

const fullCategories = varDeclarations + '\n' + categoryUpserts.join(',\n') + '\n  ]);\n  console.log(\'✅ Created categories\');';

console.log('Total categories: ' + categoryUpserts.length);
fs.writeFileSync('categories-output.ts', fullCategories);
console.log('Written to categories-output.ts');
