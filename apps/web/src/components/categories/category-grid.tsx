'use client';

import { Card, CardContent } from '@cozumel/ui';
import { 
  UtensilsCrossed, 
  Wine, 
  Waves, 
  ShoppingBag, 
  Wrench, 
  Bed,
  Car,
  Heart,
  Calendar
} from 'lucide-react';
import { useTranslation } from '@cozumel/i18n';

const categories = [
  { key: 'restaurants', icon: UtensilsCrossed, color: 'text-coral-500' },
  { key: 'bars', icon: Wine, color: 'text-purple-500' },
  { key: 'activities', icon: Waves, color: 'text-caribbean-500' },
  { key: 'shopping', icon: ShoppingBag, color: 'text-pink-500' },
  { key: 'services', icon: Wrench, color: 'text-blue-500' },
  { key: 'accommodation', icon: Bed, color: 'text-green-500' },
  { key: 'transportation', icon: Car, color: 'text-yellow-500' },
  { key: 'health', icon: Heart, color: 'text-red-500' },
  { key: 'events', icon: Calendar, color: 'text-indigo-500' },
];

export function CategoryGrid() {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {categories.map((category) => {
        const Icon = category.icon;
        return (
          <Card key={category.key} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                <Icon className={`h-6 w-6 ${category.color}`} />
              </div>
              <h3 className="font-medium text-sm group-hover:text-primary transition-colors">
                {t(`categories.${category.key}` as any)}
              </h3>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}