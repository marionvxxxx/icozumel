'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Map, Compass, Plus, MessageCircle, User } from 'lucide-react';
import { useTranslation } from '@cozumel/i18n';
import { cn } from '@cozumel/ui';

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const navItems = [
    {
      href: '/',
      icon: Map,
      label: t('nav.map'),
    },
    {
      href: '/explore',
      icon: Compass,
      label: t('nav.explore'),
    },
    {
      href: '/post',
      icon: Plus,
      label: t('nav.post'),
    },
    {
      href: '/inbox',
      icon: MessageCircle,
      label: t('nav.inbox'),
    },
    {
      href: '/profile',
      icon: User,
      label: t('nav.profile'),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-3 text-xs font-medium transition-colors",
                isActive 
                  ? "text-caribbean-600" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5 mb-1", isActive && "text-caribbean-600")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}