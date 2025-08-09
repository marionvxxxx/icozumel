import React from 'react';
import { Box, Text, Center, VStack, HStack, Badge } from 'native-base';
import { Platform } from 'react-native';

// Mock business data for Cozumel
const mockBusinesses = [
  {
    id: '1',
    name: 'Restaurant El Moro',
    category: 'Restaurante',
    rating: 4.8,
    distance: '0.2 km',
  },
  {
    id: '2',
    name: 'Dive Shop Paradise',
    category: 'Actividades',
    rating: 4.9,
    distance: '0.5 km',
  },
  {
    id: '3',
    name: 'Beach Club Sunset',
    category: 'Entretenimiento',
    rating: 4.7,
    distance: '1.2 km',
  },
];

export default function MapScreen() {
  return (
    <Box flex={1} bg="white" safeArea>
      {/* Map Area */}
      <Box
        flex={1}
        bg="gradient-to-br from-teal.100 to-teal.200"
        position="relative"
      >
        <Center flex={1}>
          <VStack alignItems="center" space={4}>
            <Text fontSize="6xl">🗺️</Text>
            <Text fontSize="2xl" fontWeight="bold" color="teal.800">
              Mapa de Cozumel
            </Text>
            <Text fontSize="md" color="teal.600" textAlign="center" px={4}>
              {Platform.OS === 'web' 
                ? 'Vista previa web - Mapa interactivo disponible en móvil' 
                : 'Encuentra negocios cerca de ti'}
            </Text>
          </VStack>
        </Center>
        
        {/* Search Bar Overlay */}
        <Box
          position="absolute"
          top={4}
          left={4}
          right={4}
          bg="white"
          rounded="xl"
          shadow={3}
          p={4}
        >
          <Text fontSize="md" color="gray.500">
            🔍 Buscar negocios en Cozumel...
          </Text>
        </Box>

        {/* Business Cards Overlay */}
        <Box
          position="absolute"
          bottom={4}
          left={4}
          right={4}
          maxH="200"
        >
          <VStack space={2}>
            <Text fontSize="sm" fontWeight="bold" color="teal.800" mb={2}>
              Negocios Cercanos:
            </Text>
            {mockBusinesses.map((business) => (
              <Box key={business.id} bg="white" rounded="lg" p={3} shadow={2}>
                <HStack justifyContent="space-between" alignItems="center">
                  <VStack flex={1}>
                    <Text fontSize="md" fontWeight="semibold">
                      {business.name}
                    </Text>
                    <HStack alignItems="center" space={2}>
                      <Badge variant="outline" rounded="full" size="sm">
                        {business.category}
                      </Badge>
                      <Text fontSize="sm" color="gray.600">
                        ⭐ {business.rating}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        📍 {business.distance}
                      </Text>
                    </HStack>
                  </VStack>
                </HStack>
              </Box>
            ))}
          </VStack>
        </Box>
      </Box>
    </Box>
  );
}