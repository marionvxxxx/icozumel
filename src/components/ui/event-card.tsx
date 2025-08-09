'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Event } from '@/lib/types';

interface EventCardProps {
  event: Event;
  className?: string;
}

export function EventCard({ event, className }: EventCardProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 overflow-hidden ${className}`}>
      <Link href={`/event/${event.slug}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={event.photos[0]}
            alt={event.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {event.featured && (
            <Badge className="absolute top-3 left-3 bg-accent text-white">
              Featured
            </Badge>
          )}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
            <div className="text-xs font-medium text-gray-900">{formatDate(event.start)}</div>
            <div className="text-xs text-gray-600">{formatTime(event.start)}</div>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
              {event.name}
            </h3>
            {event.price && (
              <div className="flex items-center gap-1 text-sm font-medium">
                <DollarSign className="h-3 w-3" />
                <span>{event.price}</span>
              </div>
            )}
          </div>
          
          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
            {event.description}
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(event.start)} at {formatTime(event.start)}</span>
            </div>
            
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">{event.venueName}</span>
            </div>
          </div>
          
          <div className="mt-3">
            <Badge variant="outline" className="text-xs">
              {event.category}
            </Badge>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}