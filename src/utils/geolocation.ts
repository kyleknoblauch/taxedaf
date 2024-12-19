import { useLocalStorage } from '@/hooks/useLocalStorage';

const CACHE_KEY = 'geolocation_state';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getStateFromIP = async (): Promise<string> => {
  try {
    // Try to get cached state first
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      const { state, timestamp } = JSON.parse(cachedData);
      // Check if cache is still valid (less than 24 hours old)
      if (Date.now() - timestamp < CACHE_DURATION) {
        console.log('Using cached state:', state);
        return state;
      }
      localStorage.removeItem(CACHE_KEY);
    }

    console.log('Fetching location from ipapi.co...');
    const response = await fetch('https://ipapi.co/json/');
    
    if (response.status === 429) {
      console.log('Rate limited by ipapi.co, retrying after delay...');
      await delay(1100); // Wait slightly more than 1 second as suggested by the API
      return getStateFromIP(); // Retry once
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Location data received:', data);

    if (data.error) {
      throw new Error(data.reason || 'API Error');
    }

    // Cache the successful response
    const stateCode = data.region_code || 'CA';
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      state: stateCode,
      timestamp: Date.now()
    }));

    return stateCode;
  } catch (error) {
    console.error('Error fetching location:', error);
    return 'CA'; // Fallback to CA if there's any error
  }
};