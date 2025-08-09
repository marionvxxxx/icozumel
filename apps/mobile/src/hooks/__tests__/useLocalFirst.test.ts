import { renderHook, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalFirst } from '../useLocalFirst';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

// Mock fetch function
const mockFetchFn = jest.fn();

describe('useLocalFirst', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('loads data from cache first', async () => {
    const cachedData = { id: 1, name: 'Cached Business' };
    const timestamp = Date.now().toString();

    (AsyncStorage.getItem as jest.Mock)
      .mockResolvedValueOnce(JSON.stringify(cachedData))
      .mockResolvedValueOnce(timestamp);

    const { result } = renderHook(() =>
      useLocalFirst({
        key: 'test-key',
        fetchFn: mockFetchFn,
        maxAge: 300000,
      })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(cachedData);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('cache_test-key');
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('cache_test-key_timestamp');
  });

  it('fetches from remote when cache is expired', async () => {
    const expiredTimestamp = (Date.now() - 400000).toString(); // 400 seconds ago
    const remoteData = { id: 2, name: 'Remote Business' };

    (AsyncStorage.getItem as jest.Mock)
      .mockResolvedValueOnce(JSON.stringify({ old: 'data' }))
      .mockResolvedValueOnce(expiredTimestamp);

    mockFetchFn.mockResolvedValueOnce(remoteData);

    const { result } = renderHook(() =>
      useLocalFirst({
        key: 'test-key',
        fetchFn: mockFetchFn,
        maxAge: 300000, // 5 minutes
      })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockFetchFn).toHaveBeenCalled();
    expect(result.current.data).toEqual(remoteData);
  });

  it('handles fetch errors gracefully', async () => {
    const cachedData = { id: 1, name: 'Cached Business' };
    const validTimestamp = Date.now().toString();

    (AsyncStorage.getItem as jest.Mock)
      .mockResolvedValueOnce(JSON.stringify(cachedData))
      .mockResolvedValueOnce(validTimestamp);

    mockFetchFn.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() =>
      useLocalFirst({
        key: 'test-key',
        fetchFn: mockFetchFn,
        maxAge: 300000,
      })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should still have cached data despite fetch error
    expect(result.current.data).toEqual(cachedData);
    expect(result.current.error).toBeInstanceOf(Error);
  });

  it('refreshes data when refresh is called', async () => {
    const initialData = { id: 1, name: 'Initial' };
    const refreshedData = { id: 1, name: 'Refreshed' };

    (AsyncStorage.getItem as jest.Mock)
      .mockResolvedValueOnce(JSON.stringify(initialData))
      .mockResolvedValueOnce(Date.now().toString());

    mockFetchFn.mockResolvedValueOnce(refreshedData);

    const { result } = renderHook(() =>
      useLocalFirst({
        key: 'test-key',
        fetchFn: mockFetchFn,
      })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(initialData);

    // Call refresh
    await result.current.refresh();

    expect(mockFetchFn).toHaveBeenCalled();
    expect(result.current.data).toEqual(refreshedData);
  });
});