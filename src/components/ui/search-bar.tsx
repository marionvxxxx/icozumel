'use client';

import { useState } from 'react';
import { Search, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SearchBarProps {
  onSearch?: (params: { what: string; where: string; when?: string }) => void;
  className?: string;
}

export function SearchBar({ onSearch, className }: SearchBarProps) {
  const [what, setWhat] = useState('');
  const [where, setWhere] = useState('');
  const [when, setWhen] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.({ what, where, when });
  };

  return (
    <form onSubmit={handleSubmit} className={`w-full max-w-4xl mx-auto ${className}`}>
      <div className="flex flex-col md:flex-row gap-2 p-2 bg-white rounded-2xl shadow-lg border">
        <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-50">
          <Search className="h-5 w-5 text-gray-400" />
          <Input
            placeholder="What are you looking for?"
            value={what}
            onChange={(e) => setWhat(e.target.value)}
            className="border-0 bg-transparent p-0 text-base placeholder:text-gray-500 focus-visible:ring-0"
          />
        </div>
        
        <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-50">
          <MapPin className="h-5 w-5 text-gray-400" />
          <Input
            placeholder="Where?"
            value={where}
            onChange={(e) => setWhere(e.target.value)}
            className="border-0 bg-transparent p-0 text-base placeholder:text-gray-500 focus-visible:ring-0"
          />
        </div>
        
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-50 min-w-[140px]">
          <Calendar className="h-5 w-5 text-gray-400" />
          <Select value={when} onValueChange={setWhen}>
            <SelectTrigger className="border-0 bg-transparent p-0 text-base focus:ring-0">
              <SelectValue placeholder="When?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="tomorrow">Tomorrow</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-weekend">This Weekend</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button type="submit" size="lg" className="hero-gradient text-white font-semibold px-8 py-3 rounded-xl">
          Search
        </Button>
      </div>
    </form>
  );
}