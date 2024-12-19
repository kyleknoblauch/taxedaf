import { useState, useEffect } from 'react';
import { getStateFromIP } from '../utils/geolocation';
import { useToast } from '@/components/ui/use-toast';
import { stateTaxData } from '../data/stateTaxRates';
import { useLocalStorage } from './useLocalStorage';

export const useGeolocation = () => {
  const [selectedState, setSelectedState] = useState<string>("CA");
  const { toast } = useToast();
  const [hasVisitedBefore, setHasVisitedBefore] = useLocalStorage('hasVisitedBefore', false);

  useEffect(() => {
    const detectLocation = async () => {
      try {
        const detectedState = await getStateFromIP();
        if (stateTaxData[detectedState]) {
          setSelectedState(detectedState);
          
          // Show the toast only on first visit
          if (!hasVisitedBefore) {
            toast({
              title: "Welcome to taxedAF!",
              description: `We've detected your state as ${stateTaxData[detectedState].name}. You can change this anytime.`,
            });
            setHasVisitedBefore(true);
          }
        }
      } catch (error) {
        console.error('Error detecting location:', error);
        // Don't show error toast to user, just fallback silently to CA
      }
    };

    detectLocation();
  }, [toast, hasVisitedBefore]);

  return { selectedState, setSelectedState };
};