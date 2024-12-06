import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Check if window is defined and localStorage is available
  const isLocalStorageAvailable = () => {
    try {
      const testKey = '__storage_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      console.warn('LocalStorage is not available:', e);
      return false;
    }
  };

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (!isLocalStorageAvailable()) {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  useEffect(() => {
    if (!isLocalStorageAvailable()) {
      return;
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn('Error writing to localStorage:', error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}