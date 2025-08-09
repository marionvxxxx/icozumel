import React from 'react';
import { Box, Text, Center } from 'native-base';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, Dimensions } from 'react-native';

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