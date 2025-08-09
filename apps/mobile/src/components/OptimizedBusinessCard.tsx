import React, { memo, useMemo } from 'react';
import { Pressable } from 'react-native';
import {
  Box,
  Text,
  VStack,
  HStack,
  Badge,
  BadgeText,
} from '@gluestack-ui/themed';

interface Business {
  id: string;
  name: string;
  category: string;
  rating: number;
  distance?: string;
  verified: boolean;
  images: string[];
}

interface BusinessCardProps {
  business: Business;
  onPress: (business: Business) => void;
  isFavorite: boolean;
  onToggleFavorite: (businessId: string) => void;
}

const OptimizedBusinessCard = memo<BusinessCardProps>(({
  business,
  onPress,
  isFavorite,
  onToggleFavorite,
}) => {
  const handlePress = useMemo(
    () => () => onPress(business),
    [onPress, business]
  );

  const handleFavoritePress = useMemo(
    () => () => onToggleFavorite(business.id),
    [onToggleFavorite, business.id]
  );

  const ratingDisplay = useMemo(
    () => `⭐ ${business.rating.toFixed(1)}`,
    [business.rating]
  );

  return (
    <Pressable onPress={handlePress}>
      <Box
        bg="$white"
        borderRadius="$xl"
        shadowColor="$shadowColor"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.1}
        shadowRadius={4}
        elevation={3}
        p="$4"
        mb="$3"
      >
        <VStack space="$3">
          <HStack justifyContent="space-between" alignItems="center">
            <VStack flex={1} space="$1">
              <Text size="lg" fontWeight="$semibold" numberOfLines={1}>
                {business.name}
              </Text>
              <HStack alignItems="center" space="$2" flexWrap="wrap">
                <Badge variant="outline" borderRadius="$full" size="sm">
                  <BadgeText>{business.category}</BadgeText>
                </Badge>
                {business.verified && (
                  <Badge variant="solid" bg="$green500" borderRadius="$full" size="sm">
                    <BadgeText color="$white">✓ Verificado</BadgeText>
                  </Badge>
                )}
              </HStack>
            </VStack>
            
            <VStack alignItems="flex-end" space="$1">
              <Pressable onPress={handleFavoritePress}>
                <Text fontSize="$xl">
                  {isFavorite ? '❤️' : '🤍'}
                </Text>
              </Pressable>
            </VStack>
          </HStack>

          <HStack alignItems="center" space="$3">
            <Text size="sm" color="$gray600">
              {ratingDisplay}
            </Text>
            {business.distance && (
              <Text size="sm" color="$gray600">
                📍 {business.distance}
              </Text>
            )}
          </HStack>
        </VStack>
      </Box>
    </Pressable>
  );
});

OptimizedBusinessCard.displayName = 'OptimizedBusinessCard';

export default OptimizedBusinessCard;