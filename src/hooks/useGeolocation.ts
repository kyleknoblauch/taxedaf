import { useState, useEffect } from 'react';
import { getStateFromIP } from '../utils/geolocation';
import { useToast } from '@/components/ui/use-toast';
import { stateTaxData } from '../data/stateTaxRates';
import { useLocalStorage } from './useLocalStorage';
import { useAuth } from '@/components/AuthProvider';

export const useGeolocation = () => {
  const [selectedState, setSelectedState] = useState<string>("CA");
  const { toast } = useToast();
  const { user } = useAuth();
  const [hasShownLocationMessage, setHasShownLocationMessage] = useLocalStorage('hasShownLocationMessage', false);

  useEffect(() => {
    const detectLocation = async () => {
      try {
        const detectedState = await getStateFromIP();
        if (stateTaxData[detectedState]) {
          setSelectedState(detectedState);
          
          // Only show the toast if the user is logged in and hasn't seen the message before
          if (user && !hasShownLocationMessage) {
            toast({
              title: "Location detected",
              description: `Your state has been set to ${stateTaxData[detectedState].name}`,
            });
            setHasShownLocationMessage(true);
          }
        }
      } catch (error) {
        console.error('Error detecting location:', error);
      }
    };

    detectLocation();
  }, [toast, hasShownLocationMessage, user]);

  return { selectedState, setSelectedState };
};