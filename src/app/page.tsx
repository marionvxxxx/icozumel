import { Suspense } from 'react';
import { SearchBar } from '@/components/ui/search-bar';
import { BusinessCard } from '@/components/ui/business-card';
import { EventCard } from '@/components/ui/event-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { mockBusinesses, mockEvents } from '@/lib/data';
import { Star, TrendingUp, Calendar, MapPin } from 'lucide-react';

function BusinessCardSkeleton() {
  return (
    <Card>
      <Skeleton className="aspect-[4/3] w-full" />
      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
    </Card>
  );
}

export default function HomePage() {
  const featuredBusinesses = mockBusinesses.filter(b => b.featured);
  const featuredEvents = mockEvents.filter(e => e.featured);
  
  const categories = [
    'Restaurants',
    'Coffee & Tea',
    'Shopping',
    'Entertainment',
    'Health & Beauty',
    'Services'
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-10"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Discover local gems
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Find restaurants, events, and hidden spots near you—fast.
          </p>
          
          <SearchBar className="mb-8" />
          
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Badge key={category} variant="outline" className="hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors">
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-8 bg-muted/30">
        <div className="container text-center">
          <p className="text-muted-foreground">
            Trusted by <span className="font-semibold text-foreground">1,200+ local businesses</span> • 
            <span className="font-semibold text-foreground"> 8,500+ reviews</span>
          </p>
        </div>
      </section>

      {/* Featured Businesses */}
      <section className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-primary" />
              Trending Places
            </h2>
            <p className="text-muted-foreground">Popular spots in your area</p>
          </div>
          <Button variant="outline">View All</Button>
        </div>
        
        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <BusinessCardSkeleton key={i} />
            ))}
          </div>
        }>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBusinesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        </Suspense>
      </section>

      {/* Featured Events */}
      <section className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <Calendar className="h-8 w-8 text-accent" />
              Upcoming Events
            </h2>
            <p className="text-muted-foreground">Don't miss what's happening</p>
          </div>
          <Button variant="outline">View All Events</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="container">
        <h2 className="text-3xl font-bold mb-8 text-center">Explore by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Card key={category} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium group-hover:text-primary transition-colors">{category}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Location Stats */}
      <section className="bg-muted/30 py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Your Local Community</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of locals discovering amazing places and experiences in their neighborhood.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">1,200+</div>
              <div className="text-muted-foreground">Local Businesses</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">8,500+</div>
              <div className="text-muted-foreground">Customer Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">450+</div>
              <div className="text-muted-foreground">Monthly Events</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}