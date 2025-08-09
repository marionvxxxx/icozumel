'use client';

import { useState } from 'react';
import { Search, MapPin, Filter } from 'lucide-react';
import { Button, Input } from '@cozumel/ui';
import { useTranslation } from '@cozumel/i18n';

interface SearchBarProps {
  onSearch?: (params: { query: string; location: string }) => void;
  className?: string;
}

export function SearchBar({ onSearch, className }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.({ query, location });
  };

  return (
    <form onSubmit={handleSubmit} className={`w-full max-w-4xl mx-auto ${className}`}>
      <div className="flex flex-col md:flex-row gap-2 p-2 bg-white rounded-2xl shadow-lg border">
        <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-50">
          <Search className="h-5 w-5 text-gray-400" />
          <Input
            placeholder={locale === 'es' ? "¿Qué buscas?" : "What are you looking for?"}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 bg-transparent p-0 text-base placeholder:text-gray-500 focus-visible:ring-0"
          />
        </div>
        
        <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-50">
          <MapPin className="h-5 w-5 text-gray-400" />
          <Input
            placeholder={locale === 'es' ? "¿Dónde?" : "Where?"}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border-0 bg-transparent p-0 text-base placeholder:text-gray-500 focus-visible:ring-0"
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="lg" className="rounded-xl">
            <Filter className="h-4 w-4" />
          </Button>
          <Button type="submit" size="lg" variant="caribbean" className="font-semibold px-8 py-3 rounded-xl">
            {t('common.search')}
          </Button>
        </div>
      </div>
    </form>
  );
}