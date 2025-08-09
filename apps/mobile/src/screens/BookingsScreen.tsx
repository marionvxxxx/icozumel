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
  {
    id: '3',
    businessName: 'Beach Club Sunset',
    date: '2024-01-25',
    time: '15:00',
    status: 'confirmed',
    guests: 6,
    type: 'Club de Playa',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'green';
    case 'pending':
      return 'yellow';
    case 'cancelled':
      return 'red';
    default:
      return 'gray';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'Confirmada';
    case 'pending':
      return 'Pendiente';
    case 'cancelled':
      return 'Cancelada';
    default:
      return 'Desconocido';
  }
};

export default function BookingsScreen() {
  return (
    <Box flex={1} bg="white" safeArea>
      <VStack space={4} p={4}>
        <Text fontSize="3xl" fontWeight="bold" color="gray.800">
          Mis Reservas 📅
        </Text>

        {mockBookings.length > 0 ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            <VStack space={4}>
              {mockBookings.map((booking) => (
                <Pressable key={booking.id}>
                  <Box bg="white" rounded="xl" shadow={3} p={4}>
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
                            {new Date(booking.date).toLocaleDateString('es-MX', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
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

                      <HStack space={2} justifyContent="flex-end">
                        <Pressable>
                          <Box
                            bg="gray.100"
                            rounded="lg"
                            px={4}
                            py={2}
                          >
                            <Text fontSize="sm" fontWeight="medium">
                              Ver Detalles
                            </Text>
                          </Box>
                        </Pressable>
                        {booking.status === 'confirmed' && (
                          <Pressable>
                            <Box
                              bg="red.100"
                              rounded="lg"
                              px={4}
                              py={2}
                            >
                              <Text fontSize="sm" fontWeight="medium" color="red.600">
                                Cancelar
                              </Text>
                            </Box>
                          </Pressable>
                        )}
                      </HStack>
                    </VStack>
                  </Box>
                </Pressable>
              ))}
            </VStack>
          </ScrollView>
        ) : (
          <Center flex={1}>
            <VStack alignItems="center" space={4}>
              <Text fontSize="6xl">📅</Text>
              <Text fontSize="lg" color="gray.500" textAlign="center">
                No tienes reservas aún
              </Text>
              <Text fontSize="md" color="gray.400" textAlign="center">
                Explora negocios y haz tu primera reserva
              </Text>
            </VStack>
          </Center>
        )}
      </VStack>
    </Box>
  );
}