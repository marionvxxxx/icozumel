import React from 'react';
import { Box } from '@gluestack-ui/themed';
import { Text } from '@gluestack-ui/themed';
import { Center } from '@gluestack-ui/themed';
import { VStack } from '@gluestack-ui/themed';
import { HStack } from '@gluestack-ui/themed';
import { Badge, BadgeText } from '@gluestack-ui/themed';
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
    <Box flex={1} bg="$white">
      {/* Map Area */}
      <Box
        flex={1}
        bg="$primary100"
        position="relative"
      >
        <Center flex={1}>
          <VStack alignItems="center" space={4}>
            <Text size="6xl">🗺️</Text>
            <Text size="2xl" fontWeight="$bold" color="$primary800">
              Mapa de Cozumel
            </Text>
            <Text size="md" color="$primary600" textAlign="center" px="$4">
              {Platform.OS === 'web' 
                ? 'Vista previa web - Mapa interactivo disponible en móvil' 
                : 'Encuentra negocios cerca de ti'}
            </Text>
          </VStack>
        </Center>
        
        {/* Search Bar Overlay */}
        <Box
          position="absolute"
          top="$4"
          left="$4"
          right="$4"
          bg="$white"
          borderRadius="$xl"
          shadowColor="$shadowColor"
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.25}
          shadowRadius={3.84}
          elevation={5}
          p="$4"
        >
          <Text size="md" color="$gray500">
            🔍 Buscar negocios en Cozumel...
          </Text>
        </Box>

        {/* Business Cards Overlay */}
        <Box
          position="absolute"
          bottom="$4"
          left="$4"
          right="$4"
          maxHeight={200}
        >
          <VStack space="$2">
            <Text size="sm" fontWeight="$bold" color="$primary800" mb="$2">
              Negocios Cercanos:
            </Text>
            {mockBusinesses.map((business) => (
              <Box 
                key={business.id} 
                bg="$white" 
                borderRadius="$lg" 
                p="$3" 
                shadowColor="$shadowColor"
                shadowOffset={{ width: 0, height: 1 }}
                shadowOpacity={0.22}
                shadowRadius={2.22}
                elevation={3}
              >
                <HStack justifyContent="space-between" alignItems="center">
                  <VStack flex={1}>
                    <Text size="md" fontWeight="$semibold">
                      {business.name}
                    </Text>
                    <HStack alignItems="center" space="$2">
                      <Badge variant="outline" borderRadius="$full" size="sm">
                        <BadgeText>{business.category}</BadgeText>
                      </Badge>
                      <Text size="sm" color="$gray600">
                        ⭐ {business.rating}
                      </Text>
                      <Text size="sm" color="$gray600">
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