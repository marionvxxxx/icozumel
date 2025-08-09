export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  interests: string[];
  isPremium: boolean;
  points: number;
  badges: string[];
}

export interface Business {
  id: string;
  name: string;
  description: string;
  category: string;
  address: string;
  phone?: string;
  website?: string;
  images: string[];
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isFeatured: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
  hours: {
    [key: string]: string;
  };
  amenities: string[];
}

export interface Review {
  id: string;
  userId: string;
  businessId: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: string;
  helpful: number;
  userName: string;
  userAvatar?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  image?: string;
  price?: number;
  organizer: string;
  attendees: number;
  maxAttendees?: number;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  images?: string[];
  location?: string;
  category: string;
  likes: number;
  comments: number;
  createdAt: string;
  isPromoted: boolean;
}

export interface AdCampaign {
  id: string;
  businessId: string;
  type: 'featured_listing' | 'boosted_post' | 'sponsored_event' | 'banner_ad' | 'touristic_spotlight';
  title: string;
  description: string;
  budget: number;
  duration: number;
  targetAudience: {
    location: string;
    radius: number;
    interests: string[];
    demographics: string[];
  };
  status: 'active' | 'paused' | 'completed';
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
  };
}