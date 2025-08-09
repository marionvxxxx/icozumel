export interface Business {
  id: string;
  name: string;
  slug: string;
  description: string;
  categories: string[];
  priceLevel: 1 | 2 | 3 | 4;
  rating: number;
  reviewCount: number;
  openingHours: {
    [key: string]: string;
  };
  address: string;
  lat: number;
  lng: number;
  photos: string[];
  website?: string;
  phone?: string;
  tags: string[];
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  id: string;
  name: string;
  slug: string;
  description: string;
  start: Date;
  end: Date;
  venueName: string;
  lat: number;
  lng: number;
  category: string;
  price?: number;
  photos: string[];
  externalUrl?: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  businessId: string;
  authorName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  body: string;
  photos: string[];
  createdAt: Date;
}

export interface SearchParams {
  q?: string;
  type?: 'business' | 'event';
  lat?: number;
  lng?: number;
  openNow?: boolean;
  price?: number[];
  category?: string[];
  page?: number;
}