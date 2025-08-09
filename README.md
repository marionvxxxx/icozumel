# Cozumel Business Marketplace

A full-stack, self-serve business marketplace web app for Cozumel, MX, targeting local businesses and tourists with English/Spanish support.

## 🚀 Features

- **Business Verification**: Automated 7-9 minute verification process with tier-based access
- **Feature Locks**: Progressive feature unlocking based on verification status
- **Ad Studio**: Self-serve advertising platform with multiple ad formats
- **Multi-language**: Full Spanish/English support with auto-translation
- **Map-first Discovery**: Interactive map with business locations
- **Automated Safety**: Content moderation and compliance checks
- **Payments & Bookings**: Stripe integration for transactions

## 🛠️ Tech Stack

- **Monorepo**: Turborepo + pnpm workspaces
- **Web**: Next.js 14 (App Router, React Server Components)
- **UI**: Tailwind CSS, shadcn/ui, Lucide React icons
- **APIs**: tRPC with Zod validation
- **Database**: PostgreSQL (Supabase) + Prisma
- **Auth**: Supabase Auth (email/phone/OAuth)
- **Payments**: Stripe Connect + Stripe Identity
- **Storage**: Supabase Storage
- **Search**: Typesense (bilingual)
- **Maps**: Mapbox GL
- **Analytics**: PostHog
- **Safety**: Google Cloud Vision API

## 📦 Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp apps/web/.env.example apps/web/.env.local

# Generate database client
pnpm db:generate

# Push database schema
pnpm db:push

# Seed database with Cozumel data
pnpm db:seed

# Start development server
pnpm dev
```

## 🏗️ Project Structure

```
apps/
├── web/                    # Next.js web application
packages/
├── ui/                     # Shared UI components (shadcn/ui)
├── database/               # Prisma schema and client
└── i18n/                   # Internationalization
```

## 🎯 Core Features

### Business Verification Tiers

- **Tier 0 (Unverified)**: Browse only
- **Tier 1 (Basic)**: 10 listings, 1 coupon, no payments/ads
- **Tier 2 (Commercial)**: Unlimited listings, bookings, ads, analytics

### Ad Studio Modules

- Sponsored Map Pin
- Top Search Slot
- Drops (limited-time promos)
- Moment Ads (weather/cruise-triggered)
- Guide Sponsorship
- Coupon Boost

### Feature Locks

Features are progressively unlocked based on verification tier:
- 🔒 Ads — Verify your business
- 🔒 Payments — Verify your business
- 🔒 Bookings — Verify your business
- 🔒 Analytics — Upgrade to Tier 2

## 🌐 Multi-language Support

The app supports both Spanish (primary) and English with:
- Runtime language detection
- Auto-translation for user content
- Bilingual search with synonyms
- Localized currency and date formats

## 🗺️ Map Integration

- Interactive Mapbox GL map
- Business location pins
- Geo-based search and filtering
- Location verification for businesses

## 🔒 Safety & Compliance

- Automated content moderation using Google Cloud Vision
- Duplicate detection and spam prevention
- Price and hours validation
- Reputation-based reach adjustment

## 📱 Mobile-First Design

- Responsive design with Tailwind CSS
- Bottom navigation for mobile
- Touch-friendly interactions
- Progressive Web App features

## 🚀 Deployment

The application is optimized for Vercel deployment:

```bash
# Build for production
pnpm build

# Deploy to Vercel
vercel --prod
```

## 📊 Analytics

Track key user interactions with PostHog:
- Business registrations
- Verification completions
- Ad campaign launches
- Booking conversions
- Search queries

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.