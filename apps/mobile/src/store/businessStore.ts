import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { immer } from 'zustand/middleware/immer';

interface Business {
  id: string;
  name: string;
  category: string;
  rating: number;
  distance?: string;
  latitude: number;
  longitude: number;
  verified: boolean;
  images: string[];
  description?: string;
  phone?: string;
  website?: string;
  hours?: Record<string, string>;
}

interface BusinessState {
  businesses: Business[];
  favorites: string[];
  searchQuery: string;
  selectedCategory: string | null;
  loading: boolean;
  error: string | null;
  lastFetch: number;
}

interface BusinessActions {
  setBusinesses: (businesses: Business[]) => void;
  addBusiness: (business: Business) => void;
  updateBusiness: (id: string, updates: Partial<Business>) => void;
  toggleFavorite: (businessId: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  refreshBusinesses: () => Promise<void>;
}

export const useBusinessStore = create<BusinessState & BusinessActions>()(
  persist(
    immer((set, get) => ({
      // State
      businesses: [],
      favorites: [],
      searchQuery: '',
      selectedCategory: null,
      loading: false,
      error: null,
      lastFetch: 0,

      // Actions
      setBusinesses: (businesses) =>
        set((state) => {
          state.businesses = businesses;
          state.lastFetch = Date.now();
        }),

      addBusiness: (business) =>
        set((state) => {
          const exists = state.businesses.find((b) => b.id === business.id);
          if (!exists) {
            state.businesses.push(business);
          }
        }),

      updateBusiness: (id, updates) =>
        set((state) => {
          const index = state.businesses.findIndex((b) => b.id === id);
          if (index !== -1) {
            Object.assign(state.businesses[index], updates);
          }
        }),

      toggleFavorite: (businessId) =>
        set((state) => {
          const index = state.favorites.indexOf(businessId);
          if (index === -1) {
            state.favorites.push(businessId);
          } else {
            state.favorites.splice(index, 1);
          }
        }),

      setSearchQuery: (query) =>
        set((state) => {
          state.searchQuery = query;
        }),

      setSelectedCategory: (category) =>
        set((state) => {
          state.selectedCategory = category;
        }),

      setLoading: (loading) =>
        set((state) => {
          state.loading = loading;
        }),

      setError: (error) =>
        set((state) => {
          state.error = error;
        }),

      clearError: () =>
        set((state) => {
          state.error = null;
        }),

      refreshBusinesses: async () => {
        const { setLoading, setError, setBusinesses } = get();
        
        try {
          setLoading(true);
          setError(null);
          
          // Simulate API call - replace with actual Supabase call
          const response = await fetch('/api/businesses');
          const businesses = await response.json();
          
          setBusinesses(businesses);
        } catch (error) {
          setError(error instanceof Error ? error.message : 'Failed to fetch businesses');
        } finally {
          setLoading(false);
        }
      },
    })),
    {
      name: 'business-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        businesses: state.businesses,
        favorites: state.favorites,
        lastFetch: state.lastFetch,
      }),
    }
  )
);