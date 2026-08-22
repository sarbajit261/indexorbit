# IndexOrbit - AI-Powered Business Directory Platform

A production-ready, scalable business directory platform with AI-powered search, comprehensive business profiles, and an admin dashboard.

![IndexOrbit](https://via.placeholder.com/1200x400?text=IndexOrbit+-+Business+Directory)

## Features

### For Visitors
- **AI-Powered Search** - Natural language queries translated to structured searches
- **Smart Filters** - Filter by rating, price, location, amenities, and more
- **Business Comparisons** - Side-by-side comparison of multiple businesses
- **Favorites & Collections** - Save businesses for later
- **Reviews & Ratings** - Read and write authentic reviews
- **Maps Integration** - Find businesses near you

### For Business Owners
- **Business Dashboard** - Manage your business profile
- **Services & Products** - Showcase what you offer
- **Offers & Deals** - Promote special offers
- **News & Updates** - Keep customers informed
- **Lead Management** - Track customer inquiries
- **Analytics** - Understand your audience

### For Administrators
- **AI Admin Assistant** - Natural language database queries
- **Content Moderation** - Review and approve submissions
- **Business Management** - Full CRUD operations
- **Search Analytics** - Understand what users search for
- **Duplicate Detection** - Identify potential duplicates
- **Quality Scoring** - Monitor data quality

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5
- **Styling**: Tailwind CSS + shadcn/ui
- **AI**: OpenAI / Anthropic (configurable)
- **Maps**: Mapbox / Google Maps (abstraction layer)
- **Storage**: S3-compatible object storage
- **Automation**: n8n (Phase 3)

## Project Structure

```
/app                      # Next.js App Router pages
  /(public)              # Public-facing pages
    /businesses          # Business listings
    /business/[slug]     # Individual business pages
    /ai                  # AI search interface
    /categories          # Category browsing
    /locations            # Location browsing
  /(auth)                # Authentication pages
    /login               # Login page
    /register            # Registration page
  /(dashboard)           # Business owner dashboard
  /(admin)               # Admin dashboard
/components
  /ui                    # shadcn/ui components
  /layout                # Layout components (Header, Footer)
/lib
  /ai                    # AI configuration and search
  /auth                  # Authentication config
  /db                    # Database client
  /services              # Business logic services
/features                # Feature-specific components
/prisma
  schema.prisma          # Database schema
  seed.ts                # Demo data seeder
/types                   # TypeScript types
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or pnpm

### Installation

1. **Clone and install dependencies**

```bash
git clone <repository-url>
cd indexorbit
npm install
```

2. **Set up environment variables**

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/indexorbit"
AUTH_SECRET="generate-with-openssl-rand-base64-32"
OPENAI_API_KEY="your-openai-key"
ANTHROPIC_API_KEY="your-anthropic-key"
```

3. **Set up the database**

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed demo data
npm run db:seed
```

4. **Run the development server**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@indexorbit.com | admin123 |
| Business | business@demo.com | demo123 |
| User | user@demo.com | demo123 |

## Configuration

### AI Providers

IndexOrbit supports both OpenAI and Anthropic:

```env
# Use OpenAI
AI_PROVIDER="openai"
OPENAI_API_KEY="sk-..."

# Use Anthropic
AI_PROVIDER="anthropic"
ANTHROPIC_API_KEY="sk-ant-..."
```

### Maps

Configure either Mapbox or Google Maps:

```env
# Mapbox (recommended)
MAP_PROVIDER="mapbox"
NEXT_PUBLIC_MAPBOX_TOKEN="pk.your-token"

# Google Maps
MAP_PROVIDER="google"
NEXT_PUBLIC_GOOGLE_MAPS_KEY="your-key"
```

## API Endpoints

### Public API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/businesses` | List/search businesses |
| GET | `/api/v1/businesses/[slug]` | Get business details |
| GET | `/api/v1/search` | Search with analytics |
| GET | `/api/v1/categories` | List categories |
| GET | `/api/v1/locations` | List locations |
| POST | `/api/ai/search` | AI-powered search |

### Admin API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/businesses` | Create business |
| PUT | `/api/admin/businesses/[id]` | Update business |
| DELETE | `/api/admin/businesses/[id]` | Delete business |
| POST | `/api/admin/ai` | Admin AI commands |

## Development

### Code Quality

```bash
# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

### Database Operations

```bash
# Open Prisma Studio
npm run db:studio

# Create migration
npm run db:migrate

# Reset database
npm run db:push -- --force-reset
```

## Deployment

### Docker (Recommended)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables

Required for production:

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="..."
OPENAI_API_KEY="..."
# Or
ANTHROPIC_API_KEY="..."
```

## License

MIT License - see LICENSE file for details.

## Contributing

Contributions welcome! Please read the contributing guidelines first.

---

Built with ❤️ by IndexOrbit
