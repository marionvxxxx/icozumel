import React from 'react';
import {
  Box,
  ScrollView,
  Text,
  VStack,
  HStack,
  Badge,
  Pressable,
  Center,
} from 'native-base';

const mockBookings = [
  {
    id: '1',
    businessName: 'Restaurant El Moro',
    date: '2024-01-20',
    time: '19:00',
    status: 'confirmed',
    guests: 4,
    type: 'Cena',
  },
  {
    id: '2',
    businessName: 'Dive Shop Paradise',
    date: '2024-01-22',
    time: '09:00',
    status: 'pending',
    guests: 2,
    type: 'Buceo',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed': return 'green';
    case 'pending': return 'yellow';
    case 'cancelled': return 'red';
    default: return 'gray';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'confirmed': return 'Confirmada';
    case 'pending': return 'Pendiente';
    case 'cancelled': return 'Cancelada';
    default: return 'Desconocido';
  }
};

export default function BookingsScreen() {
  return (
    <Box flex={1} bg="white" safeArea>
      <VStack space={4} p={4}>
        <Text fontSize="3xl" fontWeight="bold" color="gray.800">
          Mis Reservas 📅
        </Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          <VStack space={4}>
            {mockBookings.map((booking) => (
              <Box key={booking.id} bg="white" rounded="xl" shadow={3} p={4}>
                <VStack space={3}>
                  <HStack justifyContent="space-between" alignItems="center">
                    <VStack flex={1}>
                      <Text fontSize="lg" fontWeight="semibold">
                        {booking.businessName}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {booking.type}
                      </Text>
                    </VStack>
                    <Badge
                      colorScheme={getStatusColor(booking.status)}
                      variant="solid"
                      rounded="full"
                    >
                      {getStatusText(booking.status)}
                    </Badge>
                  </HStack>

                  <VStack space={2}>
                    <HStack alignItems="center" space={2}>
                      <Text fontSize="lg">📅</Text>
                      <Text fontSize="md" color="gray.600">
                        {new Date(booking.date).toLocaleDateString('es-MX')}
                      </Text>
                    </HStack>

                    <HStack alignItems="center" space={2}>
                      <Text fontSize="lg">🕐</Text>
                      <Text fontSize="md" color="gray.600">
                        {booking.time}
                      </Text>
                    </HStack>

                    <HStack alignItems="center" space={2}>
                      <Text fontSize="lg">👥</Text>
                      <Text fontSize="md" color="gray.600">
                        {booking.guests} {booking.guests === 1 ? 'persona' : 'personas'}
                      </Text>
                    </HStack>
                  </VStack>
                </VStack>
              </Box>
            ))}
          </VStack>
        </ScrollView>
      </VStack>
    </Box>
  );
}