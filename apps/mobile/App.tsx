import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NativeBaseProvider, extendTheme } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Platform, View, Text } from 'react-native';

// Import screens
import MapScreen from './src/screens/MapScreen';
import ExploreScreen from './src/screens/ExploreScreen';
import BookingsScreen from './src/screens/BookingsScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// Cozumel theme
const theme = extendTheme({
  colors: {
    primary: {
      50: '#f0fdfa',
      100: '#ccfbf1',
      200: '#99f6e4',
      300: '#5eead4',
      400: '#2dd4bf',
      500: '#14b8a6',
      600: '#0d9488',
      700: '#0f766e',
      800: '#115e59',
      900: '#134e4a',
    },
    secondary: {
      50: '#fef7ee',
      100: '#fdedd6',
      200: '#fbd7ac',
      300: '#f8ba77',
      400: '#f59440',
      500: '#f2751a',
      600: '#e35a10',
      700: '#bc4210',
      800: '#963516',
      900: '#792d15',
    },
  },
});

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