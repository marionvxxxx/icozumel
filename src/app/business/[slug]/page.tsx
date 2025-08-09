import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Star, MapPin, Clock, Phone, Globe, Share2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockBusinesses, mockReviews } from '@/lib/data';
import type { Metadata } from 'next';

interface BusinessPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BusinessPageProps): Promise<Metadata> {
  const business = mockBusinesses.find(b => b.slug === params.slug);
  
  if (!business) {
    return {
      title: 'Business Not Found',
    };
  }

  return {
    title: `${business.name} - LocalVibe`,
    description: business.description,
    openGraph: {
      title: business.name,
      description: business.description,
      images: [business.photos[0]],
    },
  };
}

export default function BusinessPage({ params }: BusinessPageProps) {
  const business = mockBusinesses.find(b => b.slug === params.slug);
  const reviews = mockReviews.filter(r => r.businessId === business?.id);

  if (!business) {
    notFound();
  }

  const getPriceLevel = (level: number) => {
    return '$'.repeat(level);
  };

  const isOpenNow = () => {
    const now = new Date();
    const day = now.toLocaleDateString('en-US', { weekday: 'long' });
    const hours = business.openingHours[day];
    return hours && hours !== 'Closed';
  };

  return (
    <div className="container py-8">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {business.featured && (
              <Badge className="bg-accent text-white">Featured</Badge>
            )}
            <Badge variant="outline">{business.categories[0]}</Badge>
          </div>
          
          <h1 className="text-4xl font-bold">{business.name}</h1>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{business.rating}</span>
              <span className="text-muted-foreground">({business.reviewCount} reviews)</span>
            </div>
            <span className="text-muted-foreground">•</span>
            <span className="font-medium">{getPriceLevel(business.priceLevel)}</span>
            <span className="text-muted-foreground">•</span>
            {isOpenNow() ? (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Open now
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                Closed
              </Badge>
            )}
          </div>
          
          <p className="text-lg text-muted-foreground">{business.description}</p>
          
          <div className="flex gap-2">
            <Button className="hero-gradient text-white">
              Save Business
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
        
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
          <Image
            src={business.photos[0]}
            alt={business.name}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Photo Gallery */}
          {business.photos.length > 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Photos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {business.photos.slice(1).map((photo, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                      <Image
                        src={photo}
                        alt={`${business.name} photo ${index + 2}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reviews */}
          <Card>
            <CardHeader>
              <CardTitle>Reviews ({reviews.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-6 last:border-b-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium">{review.authorName}</span>
                    <span className="text-muted-foreground text-sm">
                      {review.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-medium mb-2">{review.title}</h4>
                  <p className="text-muted-foreground">{review.body}</p>
                </div>
              ))}
              
              <Button variant="outline" className="w-full">
                Write a Review
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle>Contact & Hours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span>{business.address}</span>
              </div>
              
              {business.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <span>{business.phone}</span>
                </div>
              )}
              
              {business.website && (
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <a href={business.website} className="text-primary hover:underline">
                    Visit Website
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Hours */}
          <Card>
            <CardHeader>
              <CardTitle>Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(business.openingHours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between">
                    <span className="font-medium">{day}</span>
                    <span className="text-muted-foreground">{hours}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card>
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {business.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}