import React from 'react';
import {
  Box,
  ScrollView,
  Text,
  VStack,
  HStack,
  Badge,
  Pressable,
  SimpleGrid,
} from 'native-base';

const categories = [
  { id: '1', name: 'Restaurantes', icon: '🍽️', color: 'primary.500' },
  { id: '2', name: 'Actividades', icon: '🏊‍♂️', color: 'secondary.500' },
  { id: '3', name: 'Compras', icon: '🛍️', color: 'purple.500' },
  { id: '4', name: 'Hoteles', icon: '🏨', color: 'blue.500' },
  { id: '5', name: 'Transporte', icon: '🚗', color: 'green.500' },
  { id: '6', name: 'Vida Nocturna', icon: '🌙', color: 'pink.500' },
];

const featuredBusinesses = [
  {
    id: '1',
    name: 'Restaurant El Moro',
    category: 'Restaurante',
    rating: 4.8,
    verified: true,
    price: '$$',
  },
  {
    id: '2',
    name: 'Dive Shop Paradise',
    category: 'Actividades',
    rating: 4.9,
    verified: true,
    price: '$$$',
  },
  {
    id: '3',
    name: 'Beach Club Sunset',
    category: 'Entretenimiento',
    rating: 4.7,
    verified: false,
    price: '$$',
  },
];

export default function ExploreScreen() {
  return (
    <Box flex={1} bg="white" safeArea>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <VStack space={4} p={4}>
          <Text fontSize="3xl" fontWeight="bold" color="gray.800">
            Descubre Cozumel 🏝️
          </Text>
          <Text fontSize="md" color="gray.600">
            Encuentra los mejores negocios locales
          </Text>
        </VStack>

        {/* Categories */}
        <VStack space={4} px={4}>
          <Text fontSize="xl" fontWeight="semibold" color="gray.800">
            Categorías
          </Text>
          <SimpleGrid columns={2} spacing={3}>
            {categories.map((category) => (
              <Pressable key={category.id}>
                <VStack
                  alignItems="center"
                  space={3}
                  bg="gray.50"
                  rounded="xl"
                  p={4}
                  _pressed={{ bg: 'gray.100' }}
                >
                  <Text fontSize="3xl">{category.icon}</Text>
                  <Text fontSize="sm" fontWeight="medium" textAlign="center">
                    {category.name}
                  </Text>
                </VStack>
              </Pressable>
            ))}
          </SimpleGrid>
        </VStack>

        {/* Featured Businesses */}
        <VStack space={4} p={4}>
          <Text fontSize="xl" fontWeight="semibold" color="gray.800">
            Negocios Destacados ⭐
          </Text>
          <VStack space={4}>
            {featuredBusinesses.map((business) => (
              <Pressable key={business.id}>
                <Box bg="white" rounded="xl" shadow={3} overflow="hidden" p={4}>
                  <VStack space={3}>
                    <HStack justifyContent="space-between" alignItems="center">
                      <Text fontSize="lg" fontWeight="semibold" flex={1}>
                        {business.name}
                      </Text>
                      {business.verified && (
                        <Badge colorScheme="green" variant="solid" rounded="full">
                          ✓ Verificado
                        </Badge>
                      )}
                    </HStack>
                    <HStack alignItems="center" space={3}>
                      <Badge variant="outline" rounded="full">
                        {business.category}
                      </Badge>
                      <HStack alignItems="center" space={1}>
                        <Text fontSize="sm" color="gray.600">
                          ⭐ {business.rating}
                        </Text>
                      </HStack>
                      <Text fontSize="sm" color="gray.600">
                        💰 {business.price}
                      </Text>
                    </HStack>
                  </VStack>
                </Box>
              </Pressable>
            ))}
          </VStack>
        </VStack>
      </ScrollView>
    </Box>
  );
}