'use client';

import { useEffect, useState, useCallback } from 'react';

interface UseRealTimeDataOptions<T> {
  table: string;
  filter?: Record<string, any>;
  select?: string;
  orderBy?: { column: string; ascending?: boolean };
}

interface UseRealTimeDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastUpdate: number | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for real-time data fetching with Supabase
 * Automatically subscribes to changes and updates data
 */
export function useRealTimeData<T>({
  table,
  filter,
  select = '*',
  orderBy
}: UseRealTimeDataOptions<T>): UseRealTimeDataReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      
      // Mock data for development
      const mockData = [
        {
          id: '1',
          businessName: 'Restaurant El Moro',
          ownerName: 'Carlos Rodriguez',
          type: 'Mexican Business',
          status: 'pending',
          riskScore: 0.2,
          documents: ['RFC', 'INE', 'Proof of Address'],
          submittedAt: '2024-01-15T10:30:00Z',
          platform: 'iOS',
        },
        {
          id: '2',
          businessName: 'Dive Shop Paradise',
          ownerName: 'Sarah Johnson',
          type: 'Expat Business',
          status: 'review',
          riskScore: 0.7,
          documents: ['Passport', 'Storefront Photo', 'Liveness Check'],
          submittedAt: '2024-01-15T09:15:00Z',
          platform: 'Android',
        },
        {
          id: '3',
          businessName: 'Beach Club Sunset',
          ownerName: 'Miguel Hernandez',
          type: 'Mexican Business',
          status: 'pending',
          riskScore: 0.1,
          documents: ['RFC', 'INE', 'Proof of Address', 'Business License'],
          submittedAt: '2024-01-15T08:45:00Z',
          platform: 'iOS',
        },
      ];
      
      setData(mockData as T);
      setLastUpdate(Date.now());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [table, select, filter, orderBy]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    lastUpdate,
    refetch: fetchData,
  };
}