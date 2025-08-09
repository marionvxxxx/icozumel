# Cozumel Business Marketplace - Mobile Apps (iOS/Android)

A mobile-first business marketplace for Cozumel, Mexico, with native iOS and Android apps and an admin dashboard for business verification and app management.

## 🚀 Project Overview

### Mobile Apps (React Native)
- **iOS App**: Native iOS application for iPhone/iPad
- **Android App**: Native Android application
- **Business Discovery**: Map-based search and discovery
- **User Authentication**: Email/phone/OAuth with Supabase
- **Business Listings**: Browse and search local businesses
- **Bookings & Payments**: Make reservations with Stripe integration
- **Multi-language**: Full Spanish/English support
- **Offline Support**: Cached data for offline browsing

### Admin Dashboard (Next.js)
- **Mobile App Management**: Configure iOS/Android app settings
- **Business Verification**: Automated verification process with tier-based access
- **Content Moderation**: Review and approve business content
- **Analytics Dashboard**: Mobile app usage and business metrics
- **Push Notifications**: Send notifications to mobile users
- **Feature Flags**: Enable/disable features remotely

## 🛠️ Tech Stack

### Mobile Apps
- **Framework**: React Native with Expo
- **Navigation**: React Navigation v6
- **State Management**: Zustand
- **Maps**: React Native Maps (Google Maps/Apple Maps)
- **UI**: NativeBase components
- **Authentication**: Supabase Auth
- **Payments**: Stripe React Native SDK
- **Push Notifications**: Expo Notifications
- **Analytics**: PostHog React Native

### Admin Dashboard
- **Framework**: Next.js 14 (App Router)
- **UI**: Tailwind CSS, shadcn/ui
- **Database**: PostgreSQL (Supabase) + Prisma
- **Real-time**: Supabase Realtime

### Shared Infrastructure
- **Monorepo**: pnpm workspaces
- **Database**: PostgreSQL (Supabase) + Prisma
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **Analytics**: PostHog
- **Content Moderation**: Google Cloud Vision API

## 📦 Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp apps/admin/.env.example apps/admin/.env.local
cp apps/mobile/.env.example apps/mobile/.env.local

# Generate database client
pnpm db:generate

# Push database schema
pnpm db:push

# Seed database with Cozumel data
pnpm db:seed
```

## 🏗️ Project Structure

```
apps/
├── mobile/                 # React Native mobile apps (iOS/Android)
│   ├── src/
│   │   ├── components/     # Shared UI components
│   │   ├── screens/        # App screens
│   │   ├── navigation/     # Navigation setup
│   │   ├── services/       # API services
│   │   ├── store/          # State management
│   │   └── types/          # TypeScript types
│   ├── ios/                # iOS-specific code
│   ├── android/            # Android-specific code
│   └── app.json            # Expo configuration
└── admin/                  # Admin dashboard for mobile app management
    ├── src/
    │   ├── app/            # Next.js app router
    │   ├── components/     # Admin UI components
    │   └── lib/            # Utilities
    └── package.json

packages/
├── ui/                     # Shared UI components
├── database/               # Prisma schema and client
└── i18n/                   # Internationalization
```

## 📱 Mobile App Features

### For Tourists & Locals
- **Map Discovery**: Interactive map with business markers
- **Advanced Search**: Filter by category, location, rating, price
- **Business Profiles**: Photos, reviews, hours, contact info
- **Bookings**: Make reservations for restaurants, tours, services
- **Reviews**: Rate and review businesses with photos
- **Favorites**: Save preferred businesses
- **Offline Mode**: Browse cached content without internet
- **Push Notifications**: Booking confirmations, special offers

### For Business Owners
- **Business Registration**: Quick setup with photo verification
- **Listing Management**: Add/edit business information and photos
- **Booking Management**: Accept/decline reservations
- **Analytics**: View customer insights and performance metrics
- **Promotions**: Create special offers and discounts
- **Customer Communication**: Chat with customers

## 🎯 Admin Dashboard Features

### Mobile App Management
- **App Configuration**: Update app settings without deployment
- **Feature Flags**: Enable/disable features for iOS/Android
- **Version Control**: Manage app versions and force updates
- **Push Notifications**: Send targeted notifications to users
- **A/B Testing**: Test different app features and UI

### Business Verification
- **Verification Queue**: Review business applications
- **Document Verification**: OCR and manual document review
- **Risk Assessment**: Automated risk scoring
- **Tier Management**: Assign verification levels
- **Compliance Monitoring**: Ongoing business compliance

### Content Moderation
- **Automated Flagging**: AI-powered content moderation
- **Manual Review**: Admin review interface
- **User Reports**: Handle reported content
- **Business Monitoring**: Track business compliance

### Analytics & Insights
- **Mobile App Usage**: User engagement and retention
- **Business Performance**: Registration and verification rates
- **Revenue Tracking**: Payment and booking analytics
- **Geographic Insights**: Usage by location in Cozumel

## 🚀 Development

### Mobile App Development

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

# Build for production
npx expo build:ios
npx expo build:android
```

### Admin Dashboard Development

```bash
# Start admin dashboard
pnpm dev:admin

# Build for production
pnpm build:admin
```

## 📱 Mobile App Architecture

### Authentication Flow
1. **Onboarding**: Language selection, location permissions
2. **Registration**: Email/phone with SMS verification
3. **Profile Setup**: User type (tourist/local/business owner)
4. **Biometric Setup**: Face ID/Touch ID for quick login

### Navigation Structure
- **Tab Navigation**: Map, Explore, Bookings, Profile
- **Stack Navigation**: Business details, booking flow, settings
- **Modal Navigation**: Filters, search, notifications

### State Management
- **Global State**: User auth, app settings, cached data
- **Local State**: Screen-specific data, form inputs
- **Persistent State**: Favorites, search history, offline data

### Offline Support
- **Cached Businesses**: Store business data locally
- **Offline Maps**: Download map tiles for Cozumel
- **Queue Actions**: Store actions for when online
- **Sync Strategy**: Background sync when connection restored

## 🌐 Multi-language Support

### Spanish (Primary)
- Native Spanish content and UI
- Local Mexican terminology
- Peso currency formatting
- Mexican date/time formats

### English (Secondary)
- Full English translation
- US/International terminology
- USD currency option
- International date formats

### Implementation
- **Runtime Detection**: Auto-detect device language
- **Content Translation**: Automatic translation for user content
- **Search Optimization**: Bilingual search with synonyms
- **Localized Assets**: Language-specific images and content

## 🔐 Security & Privacy

### Data Protection
- **End-to-end Encryption**: Sensitive user data
- **Biometric Authentication**: Secure app access
- **Payment Security**: PCI DSS compliant with Stripe
- **Location Privacy**: Opt-in location sharing

### Business Verification
- **Document Verification**: OCR + manual review
- **Identity Verification**: Liveness detection
- **Risk Assessment**: ML-powered fraud detection
- **Ongoing Monitoring**: Continuous compliance checks

## 📊 Analytics & Monitoring

### Mobile App Analytics
- **User Engagement**: Screen views, session duration
- **Feature Usage**: Most used features and screens
- **Performance**: App crashes, load times
- **Conversion**: Registration to booking funnel

### Business Analytics
- **Registration Funnel**: Business signup completion
- **Verification Success**: Approval rates by tier
- **Content Quality**: Review and photo metrics
- **Revenue Tracking**: Booking and payment analytics

## 🚀 Deployment

### iOS App Store
1. **Development**: Test on iOS simulator and devices
2. **TestFlight**: Beta testing with select users
3. **App Store Review**: Submit for Apple review
4. **Release**: Publish to App Store

### Google Play Store
1. **Development**: Test on Android emulator and devices
2. **Internal Testing**: Alpha testing with team
3. **Closed Testing**: Beta testing with select users
4. **Production**: Publish to Google Play Store

### Admin Dashboard
- **Vercel Deployment**: Automatic deployment from main branch
- **Environment Variables**: Secure configuration management
- **Database Migrations**: Automated schema updates
- **Monitoring**: Error tracking and performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details.

---

**Built for Cozumel, Mexico** 🇲🇽 - Connecting tourists and locals with authentic island businesses.