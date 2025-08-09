import React from 'react';
import {
  Box,
  ScrollView,
  Text,
  VStack,
  HStack,
  Avatar,
  Icon,
  Pressable,
  Divider,
  Switch,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';

const menuItems = [
  {
    id: '1',
    title: 'Mi Negocio',
    subtitle: 'Administra tu negocio',
    icon: 'storefront-outline',
    action: 'business',
  },
  {
    id: '2',
    title: 'Favoritos',
    subtitle: 'Lugares guardados',
    icon: 'heart-outline',
    action: 'favorites',
  },
  {
    id: '3',
    title: 'Historial',
    subtitle: 'Reservas anteriores',
    icon: 'time-outline',
    action: 'history',
  },
  {
    id: '4',
    title: 'Configuración',
    subtitle: 'Preferencias de la app',
    icon: 'settings-outline',
    action: 'settings',
  },
  {
    id: '5',
    title: 'Ayuda',
    subtitle: 'Soporte y preguntas',
    icon: 'help-circle-outline',
    action: 'help',
  },
];

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  return (
    <Box flex={1} bg="white" safeArea>
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack space={6} p={4}>
          {/* Profile Header */}
          <VStack alignItems="center" space={4}>
            <Avatar
              size="xl"
              source={{
                uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
              }}
            />
            <VStack alignItems="center" space={1}>
              <Text fontSize="xl" fontWeight="bold">
                Carlos Rodriguez
              </Text>
              <Text fontSize="md" color="gray.600">
                carlos@email.com
              </Text>
              <HStack alignItems="center" space={1}>
                <Icon
                  as={Ionicons}
                  name="location-outline"
                  size="sm"
                  color="gray.500"
                />
                <Text fontSize="sm" color="gray.500">
                  Cozumel, México
                </Text>
              </HStack>
            </VStack>
          </VStack>

          <Divider />

          {/* Quick Stats */}
          <HStack justifyContent="space-around">
            <VStack alignItems="center" space={1}>
              <Text fontSize="2xl" fontWeight="bold" color="primary.500">
                12
              </Text>
              <Text fontSize="sm" color="gray.600">
                Reservas
              </Text>
            </VStack>
            <VStack alignItems="center" space={1}>
              <Text fontSize="2xl" fontWeight="bold" color="primary.500">
                8
              </Text>
              <Text fontSize="sm" color="gray.600">
                Reseñas
              </Text>
            </VStack>
            <VStack alignItems="center" space={1}>
              <Text fontSize="2xl" fontWeight="bold" color="primary.500">
                15
              </Text>
              <Text fontSize="sm" color="gray.600">
                Favoritos
              </Text>
            </VStack>
          </HStack>

          <Divider />

          {/* Notifications Toggle */}
          <HStack justifyContent="space-between" alignItems="center">
            <VStack flex={1}>
              <Text fontSize="md" fontWeight="medium">
                Notificaciones
              </Text>
              <Text fontSize="sm" color="gray.600">
                Recibir ofertas y actualizaciones
              </Text>
            </VStack>
            <Switch
              isChecked={notificationsEnabled}
              onToggle={setNotificationsEnabled}
              colorScheme="primary"
            />
          </HStack>

          <Divider />

          {/* Menu Items */}
          <VStack space={1}>
            {menuItems.map((item) => (
              <Pressable key={item.id}>
                <HStack
                  alignItems="center"
                  space={3}
                  p={3}
                  rounded="lg"
                  _pressed={{ bg: 'gray.100' }}
                >
                  <Icon
                    as={Ionicons}
                    name={item.icon as any}
                    size="lg"
                    color="gray.600"
                  />
                  <VStack flex={1} space={1}>
                    <Text fontSize="md" fontWeight="medium">
                      {item.title}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {item.subtitle}
                    </Text>
                  </VStack>
                  <Icon
                    as={Ionicons}
                    name="chevron-forward"
                    size="sm"
                    color="gray.400"
                  />
                </HStack>
              </Pressable>
            ))}
          </VStack>

          <Divider />

          {/* Logout Button */}
          <Pressable>
            <HStack
              alignItems="center"
              space={3}
              p={3}
              rounded="lg"
              _pressed={{ bg: 'red.50' }}
            >
              <Icon
                as={Ionicons}
                name="log-out-outline"
                size="lg"
                color="red.500"
              />
              <Text fontSize="md" fontWeight="medium" color="red.500">
                Cerrar Sesión
              </Text>
            </HStack>
          </Pressable>
        </VStack>
      </ScrollView>
    </Box>
  );
}