'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Smartphone, 
  CheckCircle, 
  Users, 
  BarChart3, 
  Settings,
  Shield,
  MessageSquare,
  FileText,
  Bell,
  Flag
} from 'lucide-react';

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Mobile Apps', href: '/mobile-apps', icon: Smartphone },
  { name: 'Verifications', href: '/verifications', icon: CheckCircle },
  { name: 'Businesses', href: '/businesses', icon: Users },
  { name: 'Push Notifications', href: '/notifications', icon: Bell },
  { name: 'Feature Flags', href: '/feature-flags', icon: Flag },
  { name: 'Content Moderation', href: '/moderation', icon: Shield },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Support', href: '/support', icon: MessageSquare },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg mobile-gradient flex items-center justify-center">
            <Smartphone className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Cozumel Mobile</h2>
            <p className="text-xs text-gray-500">Admin Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="px-4 pb-4">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-mobile-50 text-mobile-700 border-r-2 border-mobile-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <Icon className={cn("mr-3 h-5 w-5", isActive ? "text-mobile-700" : "text-gray-400")} />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}