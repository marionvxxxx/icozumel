'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, Clock, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Business } from '@/lib/types';

interface BusinessCardProps {
  business: Business;
  className?: string;
}

export function BusinessCard({ business, className }: BusinessCardProps) {
  const getPriceLevel = (level: number) => {
    return '$'.repeat(level) + '·'.repeat(4 - level);
  };

  const isOpenNow = () => {
    const now = new Date();
    const day = now.toLocaleDateString('en-US', { weekday: 'long' });
    const hours = business.openingHours[day];
    
    if (!hours || hours === 'Closed') return false;
    
    // Simple check - in real app would parse hours properly
    return hours !== 'Closed';
  };

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 overflow-hidden ${className}`}>
      <Link href={`/business/${business.slug}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={business.photos[0]}
            alt={business.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {business.featured && (
            <Badge className="absolute top-3 left-3 bg-accent text-white">
              Featured
            </Badge>
          )}
          <div className="absolute top-3 right-3 flex gap-1">
            {isOpenNow() && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Open now
              </Badge>
            )}
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
              {business.name}
            </h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <DollarSign className="h-3 w-3" />
              <span>{getPriceLevel(business.priceLevel)}</span>
            </div>
          </div>
          
          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
            {business.description}
          </p>
          
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-sm">{business.rating}</span>
              <span className="text-muted-foreground text-sm">({business.reviewCount})</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{business.address}</span>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {business.categories.slice(0, 2).map((category) => (
              <Badge key={category} variant="outline" className="text-xs">
                {category}
              </Badge>
            ))}
            {business.categories.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{business.categories.length - 2}
              </Badge>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}