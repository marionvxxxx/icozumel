# Cozumel Business Marketplace - Mobile Apps & Admin

A mobile-first business marketplace for Cozumel, MX, with React Native apps for Android/iOS and an admin dashboard for business verification management.

## 🚀 Features

### Mobile Apps (React Native)
- **Business Discovery**: Map-based search and discovery
- **User Authentication**: Email/phone/OAuth with Supabase
- **Business Listings**: Browse and search local businesses
- **Bookings & Payments**: Make reservations with Stripe integration
- **Multi-language**: Full Spanish/English support
- **Offline Support**: Cached data for offline browsing

### Admin Dashboard (Next.js)
- **Business Verification**: Automated 7-9 minute verification process with tier-based access
- **Verification Queue**: Review and approve business applications
- **Content Moderation**: Automated safety checks and manual review
- **Analytics Dashboard**: Business metrics and user insights
- **Mobile App Management**: Feature flags and app configuration

## 🛠️ Tech Stack

### Mobile Apps
- **Framework**: React Native with Expo
- **Navigation**: React Navigation v6
- **State Management**: Zustand
- **Maps**: React Native Maps
- **UI**: NativeBase components

### Admin Dashboard
- **Framework**: Next.js 14 (App Router, React Server Components)
- **UI**: Tailwind CSS, shadcn/ui, Lucide React icons

### Shared Infrastructure
- **Monorepo**: pnpm workspaces
- **Database**: PostgreSQL (Supabase) + Prisma
- **Auth**: Supabase Auth (email/phone/OAuth)
- **Payments**: Stripe Connect + Stripe Identity
- **Storage**: Supabase Storage
- **Analytics**: PostHog
- **Safety**: Google Cloud Vision API

## 📦 Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp apps/admin/.env.example apps/admin/.env.local

# Generate database client
npm run db:generate

# Push database schema
npm run db:push

# Seed database with Cozumel data
npm run db:seed

# Start admin dashboard
npm run dev
```

## 🏗️ Project Structure

```
apps/
├── admin/                  # Next.js admin dashboard
├── mobile/                 # React Native mobile apps
packages/
├── ui/                     # Shared UI components (shadcn/ui)
├── database/               # Prisma schema and client
└── i18n/                   # Internationalization
```

## 🎯 Core Features

### Mobile App Features

#### For Tourists & Locals
- **Map Discovery**: Find businesses on interactive map
- **Search & Filter**: Advanced search with categories
- **Bookings**: Make reservations and appointments
- **Reviews**: Rate and review businesses
- **Favorites**: Save preferred businesses
- **Offline Mode**: Browse cached content offline

#### For Business Owners
- **Quick Registration**: Fast business setup flow
- **Verification Process**: Document upload and verification
- **Listing Management**: Create and manage business listings
- **Analytics**: View business performance metrics
- **Ad Campaigns**: Create and manage advertising

### Admin Dashboard Features

### Business Verification Tiers

- **Tier 0 (Unverified)**: Browse only
- **Tier 1 (Basic)**: 10 listings, 1 coupon, no payments/ads
- **Tier 2 (Commercial)**: Unlimited listings, bookings, ads, analytics

### Verification Management

- **Queue Management**: Review pending verifications
- **Risk Assessment**: Automated risk scoring
- **Document Review**: OCR and manual document verification
- **Compliance Monitoring**: Ongoing business compliance checks

### Content Moderation

- **Automated Checks**: Google Cloud Vision for content moderation
- **Manual Review**: Admin review for flagged content
- **Reputation System**: Business reputation scoring
- **Dispute Resolution**: Handle user complaints and disputes

## 🌐 Multi-language Support

The app supports both Spanish (primary) and English with:
- Runtime language detection
- Auto-translation for user content
- Bilingual search with synonyms
- Localized currency and date formats

## 📱 Mobile Development

### Getting Started with Mobile

```bash
# Navigate to mobile app
cd apps/mobile

# Install Expo CLI
npm install -g @expo/cli

# Start development server
npx expo start

# Run on iOS simulator
npx expo run:ios

# Run on Android emulator
npx expo run:android
```

### Mobile App Architecture

- **Authentication**: Supabase Auth with biometric support
- **Navigation**: Tab navigation with stack navigators
- **State Management**: Zustand for global state
- **Offline Support**: React Query with persistence
- **Push Notifications**: Expo Notifications
- **Maps**: React Native Maps with custom markers

## 🚀 Deployment

### Admin Dashboard (Vercel)

```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

### Mobile Apps

#### iOS App Store
1. Configure app signing in Xcode
2. Build release version with `expo build:ios`
3. Upload to App Store Connect
4. Submit for review

#### Google Play Store
1. Generate signed APK with `expo build:android`
2. Upload to Google Play Console
3. Configure store listing
4. Submit for review

## 📊 Analytics

Track key user interactions with PostHog:
- Business registrations
- Verification completions
- Ad campaign launches
- Booking conversions
- Search queries
- Mobile app usage patterns
- Admin dashboard actions

## 🔧 Admin Features

### Dashboard Overview
- **Business Statistics**: Total businesses, verifications, active users
- **Verification Queue**: Pending business applications
- **Recent Activity**: Real-time activity feed
- **Analytics Charts**: Business growth and user engagement

### Verification Management
- **Document Review**: View uploaded documents and photos
- **Risk Assessment**: Automated risk scoring with manual override
- **Approval Workflow**: Approve, reject, or request additional information
- **Tier Management**: Assign verification tiers based on compliance

### Content Moderation
- **Automated Flagging**: Google Cloud Vision API integration
- **Manual Review**: Admin interface for content review
- **User Reports**: Handle user-reported content
- **Business Monitoring**: Ongoing compliance monitoring

### Mobile App Management
- **Feature Flags**: Enable/disable features remotely
- **App Configuration**: Update app settings without deployment
- **Push Notifications**: Send targeted notifications to users
- **Version Control**: Manage app versions and force updates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.