import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';

interface LocalFirstOptions<T> {
  key: string;
  fetchFn: () => Promise<T>;
  syncInterval?: number;
  maxAge?: number;
}

export function useLocalFirst<T>({
  key,
  fetchFn,
  syncInterval = 30000, // 30 seconds
  maxAge = 300000, // 5 minutes
}: LocalFirstOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastSync, setLastSync] = useState<number>(0);

  // Load from local storage first
  const loadFromCache = useCallback(async () => {
    try {
      const cached = await AsyncStorage.getItem(`cache_${key}`);
      const timestamp = await AsyncStorage.getItem(`cache_${key}_timestamp`);
      
      if (cached && timestamp) {
        const age = Date.now() - parseInt(timestamp);
        if (age < maxAge) {
          setData(JSON.parse(cached));
          setLastSync(parseInt(timestamp));
          return true;
        }
      }
    } catch (err) {
      console.warn('Failed to load from cache:', err);
    }
    return false;
  }, [key, maxAge]);

  // Sync with remote
  const syncWithRemote = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && now - lastSync < syncInterval) {
      return;
    }

    try {
      setError(null);
      const remoteData = await fetchFn();
      
      // Update local storage
      await AsyncStorage.setItem(`cache_${key}`, JSON.stringify(remoteData));
      await AsyncStorage.setItem(`cache_${key}_timestamp`, now.toString());
      
      setData(remoteData);
      setLastSync(now);
    } catch (err) {
      setError(err as Error);
      console.error('Sync failed:', err);
    }
  }, [key, fetchFn, syncInterval, lastSync]);

  // Initial load
  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      
      // Try cache first
      const hasCachedData = await loadFromCache();
      
      if (hasCachedData) {
        setLoading(false);
        // Sync in background
        syncWithRemote();
      } else {
        // No cache, sync immediately
        await syncWithRemote(true);
        setLoading(false);
      }
    };

    initialize();
  }, [loadFromCache, syncWithRemote]);

  // Periodic sync
  useEffect(() => {
    const interval = setInterval(() => {
      syncWithRemote();
    }, syncInterval);

    return () => clearInterval(interval);
  }, [syncWithRemote, syncInterval]);

  return {
    data,
    loading,
    error,
    refresh: () => syncWithRemote(true),
    lastSync,
  };
}