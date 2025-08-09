import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NativeBaseProvider, extendTheme } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Platform, View, Text } from 'react-native';

// Simple theme
const theme = extendTheme({
  colors: {
    primary: {
      50: '#f0fdfa',
      500: '#14b8a6',
      600: '#0d9488',
    },
  },
});

// Simple screens for preview
function MapScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0fdfa' }}>
      <Text style={{ fontSize: 48, marginBottom: 16 }}>🗺️</Text>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#0d9488', marginBottom: 8 }}>
        Mapa de Cozumel
      </Text>
      <Text style={{ fontSize: 16, color: '#666', textAlign: 'center', paddingHorizontal: 20 }}>
        {Platform.OS === 'web' 
          ? 'Vista previa web - Funciona completamente en móvil' 
          : 'Encuentra negocios cerca de ti'}
      </Text>
    </View>
  );
}

function ExploreScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 48, marginBottom: 16 }}>🔍</Text>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#0d9488', marginBottom: 8 }}>
        Explorar
      </Text>
      <Text style={{ fontSize: 16, color: '#666', textAlign: 'center', paddingHorizontal: 20 }}>
        Descubre restaurantes, actividades y más
      </Text>
    </View>
  );
}

function BookingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 48, marginBottom: 16 }}>📅</Text>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#0d9488', marginBottom: 8 }}>
        Mis Reservas
      </Text>
      <Text style={{ fontSize: 16, color: '#666', textAlign: 'center', paddingHorizontal: 20 }}>
        Gestiona tus reservas y citas
      </Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 48, marginBottom: 16 }}>👤</Text>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#0d9488', marginBottom: 8 }}>
        Mi Perfil
      </Text>
      <Text style={{ fontSize: 16, color: '#666', textAlign: 'center', paddingHorizontal: 20 }}>
        Configuración y preferencias
      </Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

// Web preview banner
function WebPreviewBanner() {
  if (Platform.OS !== 'web') return null;
  
  return (
    <View style={{ 
      backgroundColor: '#3b82f6', 
      paddingVertical: 8, 
      paddingHorizontal: 16,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Text style={{ color: 'white', fontSize: 14, fontWeight: '500' }}>
        📱 Vista Previa Web - Descarga la app móvil para la experiencia completa
      </Text>
    </View>
  );
}

export default function App() {
  return (
    <NativeBaseProvider theme={theme}>
      <WebPreviewBanner />
      <NavigationContainer>
        <StatusBar style="auto" />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: keyof typeof Ionicons.glyphMap;

              if (route.name === 'Map') {
                iconName = focused ? 'map' : 'map-outline';
              } else if (route.name === 'Explore') {
                iconName = focused ? 'compass' : 'compass-outline';
              } else if (route.name === 'Bookings') {
                iconName = focused ? 'calendar' : 'calendar-outline';
              } else if (route.name === 'Profile') {
                iconName = focused ? 'person' : 'person-outline';
              } else {
                iconName = 'help-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#14b8a6',
            tabBarInactiveTintColor: 'gray',
            headerShown: false,
          })}
        >
          <Tab.Screen 
            name="Map" 
            component={MapScreen}
            options={{ title: 'Mapa' }}
          />
          <Tab.Screen 
            name="Explore" 
            component={ExploreScreen}
            options={{ title: 'Explorar' }}
          />
          <Tab.Screen 
            name="Bookings" 
            component={BookingsScreen}
            options={{ title: 'Reservas' }}
          />
          <Tab.Screen 
            name="Profile" 
            component={ProfileScreen}
            options={{ title: 'Perfil' }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}