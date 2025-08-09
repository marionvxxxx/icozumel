# LocalVibe - Local Discovery Platform

A modern, high-performance local discovery platform built with Next.js 14, TypeScript, and TailwindCSS.

## 🚀 Features

- **Modern Tech Stack**: Next.js 14 with App Router, TypeScript, TailwindCSS
- **Component Library**: Built with Shadcn/ui for consistent, accessible components
- **Performance Optimized**: Core Web Vitals optimized, image optimization, code splitting
- **SEO Ready**: Structured data, meta tags, sitemaps, OpenGraph support
- **Responsive Design**: Mobile-first approach with beautiful animations
- **Accessibility**: WCAG AA compliant with proper ARIA labels and keyboard navigation

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Components**: Shadcn/ui + Radix UI
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Database**: Prisma + SQLite (demo) / PostgreSQL (production)
- **Maps**: Mapbox GL JS
- **Analytics**: Vercel Analytics
- **Testing**: Playwright (E2E) + Vitest (Unit)
- **Deployment**: Vercel

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd localvibe

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── business/[slug]/   # Dynamic business pages
│   ├── events/            # Events pages
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # Base UI components (Shadcn)
│   └── layout/           # Layout components
├── lib/                  # Utilities and configurations
│   ├── types.ts          # TypeScript types
│   └── data.ts           # Mock data
└── styles/               # Global styles
```

## 🎨 Design System

### Colors
- **Primary**: Blue (#0ea5e9)
- **Accent**: Orange (#f97316)
- **Background**: White/Dark mode support
- **Text**: Semantic color tokens

### Typography
- **Font**: Inter (Google Fonts)
- **Scale**: Tailwind's default scale
- **Weights**: 300-900

### Components
All components follow the Shadcn/ui design system with custom LocalVibe branding.

## 📱 Pages

### Home (`/`)
- Hero section with search bar
- Featured businesses and events
- Category navigation
- Social proof and statistics

### Business Detail (`/business/[slug]`)
- Business information and photos
- Reviews and ratings
- Contact details and hours
- Map integration
- Similar businesses

### Browse (`/browse`)
- Search and filter interface
- Map/list view toggle
- Pagination/infinite scroll
- Advanced filtering

### Events (`/events` & `/event/[slug]`)
- Event listings and details
- Calendar integration
- Venue information
- Ticket purchasing

## 🔍 SEO Features

- **Meta Tags**: Dynamic title, description, and OpenGraph tags
- **Structured Data**: LocalBusiness and Event JSON-LD
- **Sitemaps**: Dynamic XML sitemaps
- **Performance**: Lighthouse score >90
- **Core Web Vitals**: LCP <2.5s, CLS <0.1, INP <200ms

## ♿ Accessibility

- **Semantic HTML**: Proper landmarks and headings
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: WCAG AA compliant
- **Focus Management**: Visible focus indicators

## 📊 Analytics

Track key user interactions:
- `search_submitted`
- `result_click`
- `filter_applied`
- `save_business`
- `review_submitted`
- `cta_signup`

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Lighthouse CI
npm run lighthouse
```

## 🚀 Deployment

The application is optimized for Vercel deployment:

```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

## 📈 Performance

- **Image Optimization**: Next.js Image component with WebP support
- **Code Splitting**: Automatic route-based splitting
- **Caching**: Aggressive caching strategies
- **Bundle Analysis**: Webpack Bundle Analyzer integration

## 🔧 Configuration

### Environment Variables

```env
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
DATABASE_URL=your_database_url
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

### Database Schema

The application uses Prisma with the following main entities:
- **Business**: Local businesses with location, hours, photos
- **Event**: Community events with venue and timing
- **Review**: User reviews with ratings and photos

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For support, email support@localvibe.com or create an issue on GitHub.