import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '../../theme/gluestack-ui.config';
import OptimizedBusinessCard from '../OptimizedBusinessCard';

const mockBusiness = {
  id: '1',
  name: 'Test Restaurant',
  category: 'Restaurant',
  rating: 4.5,
  distance: '0.5 km',
  verified: true,
  images: ['image1.jpg', 'image2.jpg'],
};

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <GluestackUIProvider config={config}>
      {component}
    </GluestackUIProvider>
  );
};

describe('OptimizedBusinessCard', () => {
  const mockOnPress = jest.fn();
  const mockOnToggleFavorite = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders business information correctly', () => {
    const { getByText } = renderWithProvider(
      <OptimizedBusinessCard
        business={mockBusiness}
        onPress={mockOnPress}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    expect(getByText('Test Restaurant')).toBeTruthy();
    expect(getByText('Restaurant')).toBeTruthy();
    expect(getByText('⭐ 4.5')).toBeTruthy();
    expect(getByText('📍 0.5 km')).toBeTruthy();
    expect(getByText('✓ Verificado')).toBeTruthy();
  });

  it('calls onPress when card is pressed', () => {
    const { getByText } = renderWithProvider(
      <OptimizedBusinessCard
        business={mockBusiness}
        onPress={mockOnPress}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    fireEvent.press(getByText('Test Restaurant'));
    expect(mockOnPress).toHaveBeenCalledWith(mockBusiness);
  });

  it('calls onToggleFavorite when favorite button is pressed', () => {
    const { getByText } = renderWithProvider(
      <OptimizedBusinessCard
        business={mockBusiness}
        onPress={mockOnPress}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    fireEvent.press(getByText('🤍'));
    expect(mockOnToggleFavorite).toHaveBeenCalledWith('1');
  });

  it('displays correct favorite icon based on isFavorite prop', () => {
    const { getByText, rerender } = renderWithProvider(
      <OptimizedBusinessCard
        business={mockBusiness}
        onPress={mockOnPress}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    expect(getByText('🤍')).toBeTruthy();

    rerender(
      <GluestackUIProvider config={config}>
        <OptimizedBusinessCard
          business={mockBusiness}
          onPress={mockOnPress}
          isFavorite={true}
          onToggleFavorite={mockOnToggleFavorite}
        />
      </GluestackUIProvider>
    );

    expect(getByText('❤️')).toBeTruthy();
  });

  it('handles unverified business correctly', () => {
    const unverifiedBusiness = { ...mockBusiness, verified: false };
    const { queryByText } = renderWithProvider(
      <OptimizedBusinessCard
        business={unverifiedBusiness}
        onPress={mockOnPress}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    expect(queryByText('✓ Verificado')).toBeNull();
  });
});