import React from 'react';
import {
  Box,
  ScrollView,
  Text,
  VStack,
  HStack,
  Image,
  Badge,
  Icon,
  Pressable,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';

const categories = [
  { id: '1', name: 'Restaurantes', icon: 'restaurant', color: 'primary.500' },
  { id: '2', name: 'Actividades', icon: 'boat', color: 'secondary.500' },
  { id: '3', name: 'Compras', icon: 'bag', color: 'purple.500' },
  { id: '4', name: 'Hoteles', icon: 'bed', color: 'blue.500' },
];

const featuredBusinesses = [
  {
    id: '1',
    name: 'Restaurant El Moro',
    category: 'Restaurante',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=200&fit=crop',
    verified: true,
  },
  {
    id: '2',
    name: 'Dive Shop Paradise',
    category: 'Actividades',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=200&fit=crop',
    verified: true,
  },
];

export default function ExploreScreen() {
  return (
    <Box flex={1} bg="white" safeArea>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <VStack space={4} p={4}>
          <Text fontSize="2xl" fontWeight="bold" color="gray.800">
            Descubre Cozumel
          </Text>
          <Text fontSize="md" color="gray.600">
            Encuentra los mejores negocios locales
          </Text>
        </VStack>

        {/* Categories */}
        <VStack space={4} px={4}>
          <Text fontSize="lg" fontWeight="semibold" color="gray.800">
            Categorías
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <HStack space={3}>
              {categories.map((category) => (
                <Pressable key={category.id}>
                  <VStack
                    alignItems="center"
                    space={2}
                    bg="gray.50"
                    rounded="xl"
                    p={4}
                    minW="20"
                  >
                    <Icon
                      as={Ionicons}
                      name={category.icon as any}
                      size="lg"
                      color={category.color}
                    />
                    <Text fontSize="sm" fontWeight="medium" textAlign="center">
                      {category.name}
                    </Text>
                  </VStack>
                </Pressable>
              ))}
            </HStack>
          </ScrollView>
        </VStack>

        {/* Featured Businesses */}
        <VStack space={4} p={4}>
          <Text fontSize="lg" fontWeight="semibold" color="gray.800">
            Negocios Destacados
          </Text>
          <VStack space={3}>
            {featuredBusinesses.map((business) => (
              <Pressable key={business.id}>
                <Box bg="white" rounded="xl" shadow={2} overflow="hidden">
                  <Image
                    source={{ uri: business.image }}
                    alt={business.name}
                    height="40"
                    width="100%"
                  />
                  <VStack space={2} p={4}>
                    <HStack justifyContent="space-between" alignItems="center">
                      <Text fontSize="lg" fontWeight="semibold">
                        {business.name}
                      </Text>
                      {business.verified && (
                        <Badge colorScheme="green" variant="solid" rounded="full">
                          Verificado
                        </Badge>
                      )}
                    </HStack>
                    <HStack alignItems="center" space={2}>
                      <Badge variant="outline" rounded="full">
                        {business.category}
                      </Badge>
                      <HStack alignItems="center" space={1}>
                        <Icon
                          as={Ionicons}
                          name="star"
                          size="sm"
                          color="yellow.400"
                        />
                        <Text fontSize="sm" color="gray.600">
                          {business.rating}
                        </Text>
                      </HStack>
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