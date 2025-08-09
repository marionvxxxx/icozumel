import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Header } from '@/components/layout/header';
import { BottomNav } from '@/components/layout/bottom-nav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Cozumel Marketplace - Discover Local Businesses',
  description: 'The ultimate marketplace for Cozumel businesses and tourists. Discover, book, and connect with local services.',
  keywords: 'Cozumel, Mexico, marketplace, business, tourism, local services',
  authors: [{ name: 'Cozumel Marketplace Team' }],
  creator: 'Cozumel Marketplace',
  publisher: 'Cozumel Marketplace',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://cozumel-marketplace.vercel.app'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en',
      'es-MX': '/es',
    },
  },
  openGraph: {
    title: 'Cozumel Marketplace - Discover Local Businesses',
    description: 'The ultimate marketplace for Cozumel businesses and tourists.',
    url: 'https://cozumel-marketplace.vercel.app',
    siteName: 'Cozumel Marketplace',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Cozumel Marketplace',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cozumel Marketplace - Discover Local Businesses',
    description: 'The ultimate marketplace for Cozumel businesses and tourists.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 pb-16 md:pb-0">
              {children}
            </main>
            <BottomNav />
          </div>
        </Providers>
      </body>
    </html>
  );
}