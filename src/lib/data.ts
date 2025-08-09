import { Business, Event, Review } from './types';

export const mockBusinesses: Business[] = [
  {
    id: '1',
    name: 'Coastal Café',
    slug: 'coastal-cafe',
    description: 'Artisan coffee and fresh pastries with stunning ocean views. Perfect spot for morning coffee or afternoon treats with friends.',
    categories: ['Coffee', 'Bakery', 'Breakfast'],
    priceLevel: 2,
    rating: 4.8,
    reviewCount: 127,
    openingHours: {
      'Monday': '7:00 AM - 6:00 PM',
      'Tuesday': '7:00 AM - 6:00 PM',
      'Wednesday': '7:00 AM - 6:00 PM',
      'Thursday': '7:00 AM - 6:00 PM',
      'Friday': '7:00 AM - 8:00 PM',
      'Saturday': '8:00 AM - 8:00 PM',
      'Sunday': '8:00 AM - 6:00 PM'
    },
    address: '123 Ocean Drive, Seaside Town, CA 90210',
    lat: 40.7128,
    lng: -74.0060,
    photos: [
      'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1833586/pexels-photo-1833586.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    website: 'https://coastalcafe.com',
    phone: '+1 (555) 123-4567',
    tags: ['WiFi', 'Outdoor Seating', 'Pet Friendly', 'Takeout'],
    featured: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-12-01')
  },
  {
    id: '2',
    name: 'Adventure Gear Co.',
    slug: 'adventure-gear-co',
    description: 'Your one-stop shop for outdoor adventures. Quality gear for hiking, camping, and water sports with expert advice.',
    categories: ['Retail', 'Outdoor', 'Sports'],
    priceLevel: 3,
    rating: 4.6,
    reviewCount: 89,
    openingHours: {
      'Monday': '9:00 AM - 7:00 PM',
      'Tuesday': '9:00 AM - 7:00 PM',
      'Wednesday': '9:00 AM - 7:00 PM',
      'Thursday': '9:00 AM - 7:00 PM',
      'Friday': '9:00 AM - 8:00 PM',
      'Saturday': '9:00 AM - 8:00 PM',
      'Sunday': '10:00 AM - 6:00 PM'
    },
    address: '456 Mountain View Rd, Adventure Valley, CA 90211',
    lat: 40.7589,
    lng: -73.9851,
    photos: [
      'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    website: 'https://adventuregear.com',
    phone: '+1 (555) 987-6543',
    tags: ['Expert Advice', 'Gear Rental', 'Repair Service'],
    featured: false,
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-11-15')
  },
  {
    id: '3',
    name: 'Sunset Gallery',
    slug: 'sunset-gallery',
    description: 'Contemporary art gallery featuring local artists and rotating exhibitions. A cultural hub for art enthusiasts.',
    categories: ['Arts & Culture', 'Gallery', 'Events'],
    priceLevel: 2,
    rating: 4.9,
    reviewCount: 45,
    openingHours: {
      'Tuesday': '10:00 AM - 6:00 PM',
      'Wednesday': '10:00 AM - 6:00 PM',
      'Thursday': '10:00 AM - 8:00 PM',
      'Friday': '10:00 AM - 8:00 PM',
      'Saturday': '10:00 AM - 8:00 PM',
      'Sunday': '12:00 PM - 6:00 PM',
      'Monday': 'Closed'
    },
    address: '789 Arts District, Creative Quarter, CA 90212',
    lat: 40.7505,
    lng: -73.9934,
    photos: [
      'https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    website: 'https://sunsetgallery.art',
    phone: '+1 (555) 456-7890',
    tags: ['Guided Tours', 'Art Classes', 'Private Events'],
    featured: true,
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-12-05')
  }
];

export const mockEvents: Event[] = [
  {
    id: '1',
    name: 'Summer Music Festival',
    slug: 'summer-music-festival',
    description: 'Three days of live music featuring local and international artists across multiple stages. Food trucks, craft vendors, and family activities.',
    start: new Date('2025-08-15T18:00:00'),
    end: new Date('2025-08-17T23:00:00'),
    venueName: 'Central Park Amphitheater',
    lat: 40.7829,
    lng: -73.9654,
    category: 'Music',
    price: 45,
    photos: [
      'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    externalUrl: 'https://summermusicfest.com',
    featured: true,
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-12-01')
  },
  {
    id: '2',
    name: 'Local Farmers Market',
    slug: 'local-farmers-market',
    description: 'Fresh produce, artisan goods, and local crafts every Saturday morning. Support local farmers and makers.',
    start: new Date('2025-01-11T08:00:00'),
    end: new Date('2025-01-11T14:00:00'),
    venueName: 'Town Square',
    lat: 40.7614,
    lng: -73.9776,
    category: 'Community',
    photos: [
      'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    featured: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01')
  }
];

export const mockReviews: Review[] = [
  {
    id: '1',
    businessId: '1',
    authorName: 'Sarah Chen',
    rating: 5,
    title: 'Perfect morning spot!',
    body: 'Absolutely love this place! The atmosphere is perfect for both work and relaxation. The baristas are incredibly friendly and knowledgeable about their coffee. Will definitely be back!',
    photos: ['https://images.pexels.com/photos/1833586/pexels-photo-1833586.jpeg?auto=compress&cs=tinysrgb&w=400'],
    createdAt: new Date('2024-12-05T14:20:00')
  },
  {
    id: '2',
    businessId: '1',
    authorName: 'Mike Rodriguez',
    rating: 4,
    title: 'Great coffee, amazing view',
    body: 'Great coffee and pastries. The view is stunning, especially during sunset. Only minor complaint is that it can get quite busy during peak hours.',
    photos: [],
    createdAt: new Date('2024-12-03T11:30:00')
  }
];