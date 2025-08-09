'use client';

import Link from 'next/link';
import { Search, Menu, Globe } from 'lucide-react';
import { Button } from '@cozumel/ui';
import { useTranslation } from '@cozumel/i18n';

export function Header() {
  const { t, locale, setLocale } = useTranslation();

  const toggleLanguage = () => {
    setLocale(locale === 'en' ? 'es' : 'en');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg caribbean-gradient flex items-center justify-center">
            <span className="text-white font-bold text-sm">CM</span>
          </div>
          <span className="font-bold text-xl">Cozumel</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/explore" className="text-sm font-medium hover:text-primary transition-colors">
            {t('nav.explore')}
          </Link>
          <Link href="/businesses" className="text-sm font-medium hover:text-primary transition-colors">
            Negocios
          </Link>
          <Link href="/guides" className="text-sm font-medium hover:text-primary transition-colors">
            Guías
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={toggleLanguage}>
            <Globe className="h-4 w-4 mr-2" />
            {locale.toUpperCase()}
          </Button>
          <Button variant="ghost" size="sm" className="hidden md:flex">
            <Search className="h-4 w-4 mr-2" />
            {t('common.search')}
          </Button>
          <Button size="sm" variant="caribbean">
            {t('business.list_business')}
          </Button>
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}