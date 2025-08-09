import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '../components/providers';
import { AdminSidebar } from '../components/layout/admin-sidebar';
import { AdminHeader } from '../components/layout/admin-header';


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
      <body className="font-sans">
        <Providers>
          <div className="flex h-screen bg-gray-50">
            <AdminSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <AdminHeader />
              <main className="flex-1 overflow-y-auto p-6">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}