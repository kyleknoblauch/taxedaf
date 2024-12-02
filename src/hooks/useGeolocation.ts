import { useState, useEffect } from 'react';
import { getStateFromIP } from '../utils/geolocation';
import { useToast } from '@/components/ui/use-toast';
import { stateTaxData } from '../data/stateTaxRates';

export const useGeolocation = () => {
  const [selectedState, setSelectedState] = useState<string>("CA");
  const { toast } = useToast();

  useEffect(() => {
    const detectLocation = async () => {
      try {
        const detectedState = await getStateFromIP();
        if (stateTaxData[detectedState]) {
          setSelectedState(detectedState);
          toast({
            title: "Location detected",
            description: `Your state has been set to ${stateTaxData[detectedState].name}`,
          });
        }
      } catch (error) {
        console.error('Error detecting location:', error);
      }
    };

    detectLocation();
  }, [toast]);

  return { selectedState, setSelectedState };
};