import React from 'react';
import { Box, Text, HStack, Icon } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

export function WebPreviewBanner() {
  if (Platform.OS !== 'web') return null;

  return (
    <Box bg="blue.500" py={2} px={4}>
      <HStack alignItems="center" justifyContent="center" space={2}>
        <Icon as={Ionicons} name="information-circle" color="white" size="sm" />
        <Text color="white" fontSize="sm" fontWeight="medium">
          Vista Previa Web - Descarga la app móvil para la experiencia completa
        </Text>
      </HStack>
    </Box>
  );
}