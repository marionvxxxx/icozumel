import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Cozumel Mobile Admin - App & Business Management',
  description: 'Admin dashboard for managing Cozumel mobile apps (iOS/Android) and business verifications',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen bg-gray-50">
          <div className="w-64 bg-white shadow-sm border-r border-gray-200">
            <div className="p-6">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg mobile-gradient flex items-center justify-center">
                  <span className="text-white font-bold text-sm">📱</span>
                </div>
                <div>
                  <h2 className="font-bold text-lg">Cozumel Mobile</h2>
                  <p className="text-xs text-gray-500">Admin Dashboard</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
              <h1 className="text-xl font-semibold">Mobile App Management</h1>
            </header>
            <main className="flex-1 overflow-y-auto p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}