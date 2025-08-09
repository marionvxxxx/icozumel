'use client';

import { Card, CardContent, Badge } from '@cozumel/ui';
import { Star, MapPin, Clock } from 'lucide-react';

// Mock data for featured businesses
const featuredBusinesses = [
  {
    id: '1',
    name: 'Restaurant El Moro',
    description: 'Auténtica cocina mexicana con vista al mar. Especialidades en mariscos frescos y platillos tradicionales.',
    category: 'Restaurante',
    rating: 4.8,
    reviewCount: 127,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
    verified: true,
    openNow: true,
    address: 'Av. Rafael E. Melgar 123, Centro',
  },
  {
    id: '2',
    name: 'Dive Shop Cozumel',
    description: 'Centro de buceo certificado PADI. Excursiones a los mejores arrecifes de Cozumel.',
    category: 'Actividades',
    rating: 4.9,
    reviewCount: 89,
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
    verified: true,
    openNow: true,
    address: 'Calle 5 Sur 201, Centro',
  },
  {
    id: '3',
    name: 'Beach Club Paradise',
    description: 'Club de playa exclusivo con alberca, restaurante y actividades acuáticas.',
    category: 'Entretenimiento',
    rating: 4.7,
    reviewCount: 203,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop',
    verified: true,
    openNow: false,
    address: 'Carretera Costera Sur Km 8.5',
  },
];

export function FeaturedBusinesses() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {featuredBusinesses.map((business) => (
        <Card key={business.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer">
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={business.image}
              alt={business.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-3 left-3 flex gap-2">
              {business.verified && (
                <Badge variant="verified">
                  Verificado
                </Badge>
              )}
              <Badge variant="outline" className="bg-white/90">
                {business.category}
              </Badge>
            </div>
            {business.openNow && (
              <div className="absolute top-3 right-3">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <Clock className="h-3 w-3 mr-1" />
                  Abierto
                </Badge>
              </div>
            )}
          </div>
          
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-caribbean-600 transition-colors">
                {business.name}
              </h3>
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
            
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">{business.address}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}