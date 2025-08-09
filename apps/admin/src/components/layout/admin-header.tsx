'use client';

import { Bell, Search, User, Smartphone } from 'lucide-react';
import { Input, Button } from '@cozumel/ui';

export function AdminHeader() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search apps, businesses, or users..."
              className="pl-10 w-96"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm">
            <div className="flex items-center space-x-1">
              <Smartphone className="h-4 w-4 text-mobile-600" />
              <span className="font-medium">iOS: 4.8★</span>
            </div>
            <div className="flex items-center space-x-1">
              <Smartphone className="h-4 w-4 text-green-600" />
              <span className="font-medium">Android: 4.7★</span>
            </div>
          </div>
          
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <User className="h-4 w-4" />
            <span className="ml-2">Admin</span>
          </Button>
        </div>
      </div>
    </header>
  );
}