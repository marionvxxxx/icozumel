# Cozumel Mobile Apps

This directory will contain the React Native mobile applications for both Android and iOS platforms.

## Structure

```
apps/mobile/
├── android/          # Android-specific code and configuration
├── ios/              # iOS-specific code and configuration
├── src/              # Shared React Native source code
│   ├── components/   # Reusable UI components
│   ├── screens/      # App screens/pages
│   ├── navigation/   # Navigation configuration
│   ├── services/     # API services and utilities
│   ├── store/        # State management
│   └── types/        # TypeScript type definitions
├── package.json      # Dependencies and scripts
└── metro.config.js   # Metro bundler configuration
```

## Features to Implement

### Core Features
- **Business Discovery**: Map-based business search and discovery
- **User Authentication**: Email/phone/OAuth login with Supabase
- **Business Listings**: Browse and search local businesses
- **Bookings**: Make reservations and appointments
- **Reviews**: Rate and review businesses
- **Multi-language**: Spanish/English support

### Business Owner Features
- **Business Registration**: Quick business setup flow
- **Verification Process**: Document upload and verification
- **Listing Management**: Create and manage business listings
- **Analytics Dashboard**: View business performance metrics
- **Ad Management**: Create and manage advertising campaigns

### Advanced Features
- **Offline Support**: Cached data for offline browsing
- **Push Notifications**: Booking confirmations, promotions
- **Location Services**: GPS-based business discovery
- **Camera Integration**: Photo uploads for listings and reviews
- **Payment Integration**: Stripe payment processing

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation v6
- **State Management**: Zustand or Redux Toolkit
- **UI Components**: NativeBase or React Native Elements
- **Maps**: React Native Maps (Google Maps/Apple Maps)
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Push Notifications**: Expo Notifications
- **Analytics**: PostHog React Native

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Run on iOS simulator
npx expo run:ios

# Run on Android emulator
npx expo run:android
```

## Development Workflow

1. **Setup**: Configure development environment with Expo CLI
2. **Authentication**: Implement Supabase auth integration
3. **Navigation**: Set up React Navigation with tab and stack navigators
4. **UI Components**: Create reusable component library
5. **Business Features**: Implement core business functionality
6. **Testing**: Add unit and integration tests
7. **Deployment**: Configure app store deployment

## Environment Variables

Create `.env` file with:

```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

## Deployment

### iOS App Store
1. Configure app signing in Xcode
2. Build release version
3. Upload to App Store Connect
4. Submit for review

### Google Play Store
1. Generate signed APK/AAB
2. Upload to Google Play Console
3. Configure store listing
4. Submit for review

## Admin Integration

The mobile apps will integrate with the admin dashboard for:
- **Business verification status updates**
- **Content moderation decisions**
- **Feature flag management**
- **Analytics and reporting**