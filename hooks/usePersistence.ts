
import { useState, useEffect } from 'react';
import { persistenceService } from '../services/persistenceService';

export function usePersistence<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Try IndexedDB first
        const dbValue = await persistenceService.get<T>(key);
        if (dbValue !== null) {
          setStoredValue(dbValue);
        } else {
            // Fallback/Sync with LocalStorage if exists (migration path)
            const item = localStorage.getItem(key);
            if (item) {
                setStoredValue(JSON.parse(item));
            }
        }
      } catch (error) {
        console.warn(`Error loading persistence key "${key}":`, error);
        // Fallback to localStorage on error
        try {
            const item = localStorage.getItem(key);
            if(item) setStoredValue(JSON.parse(item));
        } catch (e) {}
      } finally {
        setIsLoaded(true);
      }
    };

    loadData();
  }, [key]);

  const setValue = async (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      // Save to both for redundancy in MVP
      localStorage.setItem(key, JSON.stringify(valueToStore));
      await persistenceService.set(key, valueToStore);
    } catch (error) {
      console.warn(`Error saving persistence key "${key}":`, error);
    }
  };

  return [storedValue, setValue, isLoaded] as const;
}
