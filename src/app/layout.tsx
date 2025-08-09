import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LocalVibe - Discover Local Gems',
  description: 'Find restaurants, events, and hidden spots near you—fast. Trusted by 1,200+ local businesses.',
  keywords: 'local business, restaurants, events, discover, community',
  authors: [{ name: 'LocalVibe Team' }],
  creator: 'LocalVibe',
  publisher: 'LocalVibe',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://localvibe.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'LocalVibe - Discover Local Gems',
    description: 'Find restaurants, events, and hidden spots near you—fast.',
    url: 'https://localvibe.com',
    siteName: 'LocalVibe',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'LocalVibe - Discover Local Gems',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LocalVibe - Discover Local Gems',
    description: 'Find restaurants, events, and hidden spots near you—fast.',
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
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}