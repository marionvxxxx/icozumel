import React from 'react';
import React, { memo, useMemo, useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import {
  Box,
  Text,
  VStack,
  HStack,
  Pressable,
} from '@gluestack-ui/themed';
import { useBusinessStore } from '../store/businessStore';
import { useLocalFirst } from '../hooks/useLocalFirst';
import OptimizedBusinessCard from '../components/OptimizedBusinessCard';

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface Business {
  id: string;
  name: string;
  category: string;
  rating: number;
  distance?: string;
  verified: boolean;
  images: string[];
}

const categories: Category[] = [
  { id: '1', name: 'Restaurantes', icon: '🍽️', color: '$primary500' },
  { id: '2', name: 'Actividades', icon: '🏊‍♂️', color: '$secondary500' },
  { id: '3', name: 'Compras', icon: '🛍️', color: '$purple500' },
  { id: '4', name: 'Hoteles', icon: '🏨', color: '$blue500' },
  { id: '5', name: 'Transporte', icon: '🚗', color: '$green500' },
  { id: '6', name: 'Vida Nocturna', icon: '🌙', color: '$pink500' },
];

// Memoized category item component
const CategoryItem = memo<{ category: Category; onPress: (category: Category) => void }>(
  ({ category, onPress }) => {
    const handlePress = useCallback(() => onPress(category), [category, onPress]);
    
    return (
      <Pressable onPress={handlePress} flex={1}>
        <VStack
          alignItems="center"
          space="$3"
          bg="$gray50"
          borderRadius="$xl"
          p="$4"
          mx="$1"
          mb="$2"
        >
          <Text fontSize="$3xl">{category.icon}</Text>
          <Text fontSize="$sm" fontWeight="$medium" textAlign="center">
            {category.name}
          </Text>
        </VStack>
      </Pressable>
    );
  }
);

CategoryItem.displayName = 'CategoryItem';

const ExploreScreen = memo(() => {
  const {
    businesses,
    favorites,
    selectedCategory,
    setSelectedCategory,
    toggleFavorite,
  } = useBusinessStore();

  // Local-first data fetching
  const { data: featuredBusinesses, loading } = useLocalFirst<Business[]>({
    key: 'featured_businesses',
    fetchFn: async () => {
      // Replace with actual Supabase call
      const response = await fetch('/api/businesses/featured');
      return response.json();
    },
    syncInterval: 60000, // 1 minute
    maxAge: 300000, // 5 minutes
  });

  const handleCategoryPress = useCallback((category: Category) => {
    setSelectedCategory(selectedCategory === category.id ? null : category.id);
  }, [selectedCategory, setSelectedCategory]);

  const handleBusinessPress = useCallback((business: Business) => {
    // Navigate to business details
    console.log('Navigate to business:', business.id);
  }, []);

  const filteredBusinesses = useMemo(() => {
    if (!featuredBusinesses) return [];
    if (!selectedCategory) return featuredBusinesses;
    return featuredBusinesses.filter(business => 
      business.category.toLowerCase().includes(selectedCategory.toLowerCase())
    );
  }, [featuredBusinesses, selectedCategory]);

  const renderBusinessItem: ListRenderItem<Business> = useCallback(({ item }) => (
    <OptimizedBusinessCard
      business={item}
      onPress={handleBusinessPress}
      isFavorite={favorites.includes(item.id)}
      onToggleFavorite={toggleFavorite}
    />
  ), [handleBusinessPress, favorites, toggleFavorite]);

  const keyExtractor = useCallback((item: Business) => item.id, []);

  return (
    <Box flex={1} bg="$white">
      <VStack flex={1} space="$4" p="$4">
        {/* Header */}
        <VStack space="$2">
          <Text size="3xl" fontWeight="$bold" color="$gray800">
            Descubre Cozumel 🏝️
          </Text>
          <Text size="md" color="$gray600">
            Encuentra los mejores negocios locales
          </Text>
        </VStack>

        {/* Categories */}
        <VStack space="$3">
          <Text size="xl" fontWeight="$semibold" color="$gray800">
            Categorías
          </Text>
          <HStack flexWrap="wrap" justifyContent="space-between">
            {categories.map((category) => (
              <Box key={category.id} width="48%">
                <CategoryItem
                  category={category}
                  onPress={handleCategoryPress}
                />
              </Box>
            ))}
          </HStack>
        </VStack>

        {/* Featured Businesses */}
        <VStack flex={1} space="$3">
          <Text size="xl" fontWeight="$semibold" color="$gray800">
            Negocios Destacados ⭐
          </Text>
          
          {loading ? (
            <Text>Cargando...</Text>
          ) : (
            <FlatList
              data={filteredBusinesses}
              renderItem={renderBusinessItem}
              keyExtractor={keyExtractor}
              showsVerticalScrollIndicator={false}
              removeClippedSubviews={true}
              maxToRenderPerBatch={10}
              windowSize={10}
              initialNumToRender={5}
            />
          )}
        </VStack>
      </VStack>
    </Box>
  );
});

ExploreScreen.displayName = 'ExploreScreen';

export default ExploreScreen;