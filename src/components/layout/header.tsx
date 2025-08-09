'use client';

import Link from 'next/link';
import { Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg hero-gradient flex items-center justify-center">
            <span className="text-white font-bold text-sm">LV</span>
          </div>
          <span className="font-bold text-xl">LocalVibe</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/browse" className="text-sm font-medium hover:text-primary transition-colors">
            Browse
          </Link>
          <Link href="/events" className="text-sm font-medium hover:text-primary transition-colors">
            Events
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
            About
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="hidden md:flex">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button size="sm" className="hero-gradient text-white">
            List Business
          </Button>
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}