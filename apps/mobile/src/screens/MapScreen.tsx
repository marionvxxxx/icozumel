import React from 'react';
import { Box, Text, Center } from 'native-base';
import { StyleSheet, Dimensions, Platform } from 'react-native';

// Conditional import for web compatibility
let MapView: any, Marker: any;
if (Platform.OS !== 'web') {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
}

const { width, height } = Dimensions.get('window');

// Cozumel coordinates
const COZUMEL_REGION = {
  latitude: 20.4230,
  longitude: -86.9523,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

// Mock business data
const mockBusinesses = [
  {
    id: '1',
    name: 'Restaurant El Moro',
    latitude: 20.4230,
    longitude: -86.9523,
    category: 'restaurant',
  },
  {
    id: '2',
    name: 'Dive Shop Paradise',
    latitude: 20.4200,
    longitude: -86.9400,
    category: 'activities',
  },
  {
    id: '3',
    name: 'Beach Club Sunset',
    latitude: 20.4300,
    longitude: -86.9600,
    category: 'entertainment',
  },
];

export default function MapScreen() {
  // Web fallback component
  if (Platform.OS === 'web') {
    return (
      <Box flex={1}>
        {/* Web Map Preview */}
        <Box
          flex={1}
          bg="gradient-to-br from-teal.100 to-teal.200"
          position="relative"
        >
          <Center flex={1}>
            <Box textAlign="center">
              <Text fontSize="4xl" mb={4}>🗺️</Text>
              <Text fontSize="xl" fontWeight="bold" color="teal.800" mb={2}>
                Mapa de Cozumel
              </Text>
              <Text fontSize="md" color="teal.600" mb={4}>
                Vista previa web - Funciona completamente en móvil
              </Text>
              <Box bg="white" rounded="lg" p={4} shadow={2} maxW="sm">
                <Text fontSize="sm" color="gray.600" mb={2}>Negocios cercanos:</Text>
                {mockBusinesses.map((business) => (
                  <Box key={business.id} mb={2} p={2} bg="gray.50" rounded="md">
                    <Text fontSize="sm" fontWeight="medium">{business.name}</Text>
                    <Text fontSize="xs" color="gray.500">{business.category}</Text>
                  </Box>
                ))}
              </Box>
            </Box>
          </Center>
        </Box>
        
        {/* Search Bar Overlay */}
        <Box
          position="absolute"
          top={12}
          left={4}
          right={4}
          bg="white"
          rounded="xl"
          shadow={3}
          p={4}
        >
          <Text fontSize="md" color="gray.500">
            Buscar negocios en Cozumel...
          </Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box flex={1}>
      <MapView
        style={styles.map}
        initialRegion={COZUMEL_REGION}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {mockBusinesses.map((business) => (
          <Marker
            key={business.id}
            coordinate={{
              latitude: business.latitude,
              longitude: business.longitude,
            }}
            title={business.name}
            description={business.category}
            pinColor="#14b8a6"
          />
        ))}
      </MapView>
      
      {/* Search Bar Overlay */}
      <Box
        position="absolute"
        top={12}
        left={4}
        right={4}
        bg="white"
        rounded="xl"
        shadow={3}
        p={4}
      >
        <Text fontSize="md" color="gray.500">
          Buscar negocios en Cozumel...
        </Text>
      </Box>
    </Box>
  );
}

const styles = StyleSheet.create({
  map: {
    width,
    height,
  },
});