import { Business, Event, Post, Review } from '../types';

export const mockBusinesses: Business[] = [
  {
    id: '1',
    name: 'Coastal Café',
    description: 'Artisan coffee and fresh pastries with ocean views. Perfect spot for morning coffee or afternoon treats.',
    category: 'Restaurant',
    address: '123 Ocean Drive, Seaside Town',
    phone: '+1 (555) 123-4567',
    website: 'https://coastalcafe.com',
    images: [
      'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1833586/pexels-photo-1833586.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4.8,
    reviewCount: 127,
    isVerified: true,
    isFeatured: true,
    coordinates: { lat: 40.7128, lng: -74.0060 },
    hours: {
      'Monday': '7:00 AM - 6:00 PM',
      'Tuesday': '7:00 AM - 6:00 PM',
      'Wednesday': '7:00 AM - 6:00 PM',
      'Thursday': '7:00 AM - 6:00 PM',
      'Friday': '7:00 AM - 8:00 PM',
      'Saturday': '8:00 AM - 8:00 PM',
      'Sunday': '8:00 AM - 6:00 PM'
    },
    amenities: ['WiFi', 'Outdoor Seating', 'Pet Friendly', 'Takeout']
  },
  {
    id: '2',
    name: 'Adventure Gear Co.',
    description: 'Your one-stop shop for outdoor adventures. Quality gear for hiking, camping, and water sports.',
    category: 'Retail',
    address: '456 Mountain View Rd, Adventure Valley',
    phone: '+1 (555) 987-6543',
    images: [
      'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4.6,
    reviewCount: 89,
    isVerified: true,
    isFeatured: false,
    coordinates: { lat: 40.7589, lng: -73.9851 },
    hours: {
      'Monday': '9:00 AM - 7:00 PM',
      'Tuesday': '9:00 AM - 7:00 PM',
      'Wednesday': '9:00 AM - 7:00 PM',
      'Thursday': '9:00 AM - 7:00 PM',
      'Friday': '9:00 AM - 8:00 PM',
      'Saturday': '9:00 AM - 8:00 PM',
      'Sunday': '10:00 AM - 6:00 PM'
    },
    amenities: ['Expert Advice', 'Gear Rental', 'Repair Service']
  },
  {
    id: '3',
    name: 'Sunset Gallery',
    description: 'Contemporary art gallery featuring local artists and rotating exhibitions.',
    category: 'Arts & Culture',
    address: '789 Arts District, Creative Quarter',
    phone: '+1 (555) 456-7890',
    website: 'https://sunsetgallery.art',
    images: [
      'https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4.9,
    reviewCount: 45,
    isVerified: true,
    isFeatured: true,
    coordinates: { lat: 40.7505, lng: -73.9934 },
    hours: {
      'Tuesday': '10:00 AM - 6:00 PM',
      'Wednesday': '10:00 AM - 6:00 PM',
      'Thursday': '10:00 AM - 8:00 PM',
      'Friday': '10:00 AM - 8:00 PM',
      'Saturday': '10:00 AM - 8:00 PM',
      'Sunday': '12:00 PM - 6:00 PM',
      'Monday': 'Closed'
    },
    amenities: ['Guided Tours', 'Art Classes', 'Private Events']
  }
];

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Summer Music Festival',
    description: 'Three days of live music featuring local and international artists across multiple stages.',
    category: 'Music',
    date: '2025-08-15',
    time: '6:00 PM',
    location: 'Central Park Amphitheater',
    coordinates: { lat: 40.7829, lng: -73.9654 },
    image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 45,
    organizer: 'City Events',
    attendees: 1250,
    maxAttendees: 2000
  },
  {
    id: '2',
    title: 'Local Farmers Market',
    description: 'Fresh produce, artisan goods, and local crafts every Saturday morning.',
    category: 'Community',
    date: '2025-08-10',
    time: '8:00 AM',
    location: 'Town Square',
    coordinates: { lat: 40.7614, lng: -73.9776 },
    image: 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=800',
    organizer: 'Farmers Association',
    attendees: 300,
    maxAttendees: 500
  },
  {
    id: '3',
    title: 'Art Walk & Gallery Night',
    description: 'Explore local galleries with special exhibitions, artist talks, and wine tastings.',
    category: 'Arts & Culture',
    date: '2025-08-12',
    time: '7:00 PM',
    location: 'Arts District',
    coordinates: { lat: 40.7505, lng: -73.9934 },
    image: 'https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 15,
    organizer: 'Arts Council',
    attendees: 180,
    maxAttendees: 250
  }
];

export const mockPosts: Post[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Sarah Chen',
    userAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
    content: 'Just discovered this amazing hidden gem! The coffee at Coastal Café is absolutely incredible, and the ocean view makes it even better. Perfect spot for remote work! ☕️🌊',
    images: ['https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800'],
    location: 'Coastal Café',
    category: 'Food & Drink',
    likes: 24,
    comments: 8,
    createdAt: '2025-08-08T10:30:00Z',
    isPromoted: false
  },
  {
    id: '2',
    userId: '2',
    userName: 'Mike Rodriguez',
    userAvatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200',
    content: 'The Summer Music Festival lineup just dropped and it looks AMAZING! Already got my tickets. Who else is going? 🎵🎸',
    location: 'Central Park Amphitheater',
    category: 'Events',
    likes: 42,
    comments: 15,
    createdAt: '2025-08-07T15:45:00Z',
    isPromoted: true
  },
  {
    id: '3',
    userId: '3',
    userName: 'Emma Thompson',
    userAvatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=200',
    content: 'Pro tip for tourists: The farmers market on Saturday mornings is the best way to experience local culture. Fresh produce, amazing food trucks, and live music! 🥕🎶',
    images: ['https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=800'],
    location: 'Town Square',
    category: 'Community',
    likes: 18,
    comments: 6,
    createdAt: '2025-08-06T09:15:00Z',
    isPromoted: false
  }
];

export const mockReviews: Review[] = [
  {
    id: '1',
    userId: '1',
    businessId: '1',
    rating: 5,
    comment: 'Absolutely love this place! The atmosphere is perfect for both work and relaxation. The baristas are incredibly friendly and knowledgeable about their coffee. Will definitely be back!',
    images: ['https://images.pexels.com/photos/1833586/pexels-photo-1833586.jpeg?auto=compress&cs=tinysrgb&w=400'],
    createdAt: '2025-08-05T14:20:00Z',
    helpful: 12,
    userName: 'Sarah Chen',
    userAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200'
  },
  {
    id: '2',
    userId: '2',
    businessId: '1',
    rating: 4,
    comment: 'Great coffee and pastries. The view is stunning, especially during sunset. Only minor complaint is that it can get quite busy during peak hours.',
    createdAt: '2025-08-03T11:30:00Z',
    helpful: 8,
    userName: 'Mike Rodriguez',
    userAvatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200'
  },
  {
    id: '3',
    userId: '3',
    businessId: '2',
    rating: 5,
    comment: 'The staff here really knows their stuff! They helped me pick the perfect gear for my hiking trip. Quality products and excellent customer service.',
    createdAt: '2025-08-01T16:45:00Z',
    helpful: 15,
    userName: 'Emma Thompson',
    userAvatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=200'
  }
];