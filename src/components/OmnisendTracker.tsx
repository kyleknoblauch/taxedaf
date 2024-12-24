import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    omnisend: any[];
  }
}

export const OmnisendTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Initialize Omnisend if not already initialized
    if (!window.omnisend) {
      window.omnisend = [];
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = 'https://cdn.omnisend.com/inshop/launcher-v2.js';
      
      script.onerror = (error) => {
        console.error('Error loading Omnisend script:', error);
      };

      document.body.appendChild(script);
    }

    try {
      // Push brand ID and track page view with error handling
      window.omnisend.push(["brandID", "6763b6f1a2ed8277fe8244f8"]);
      window.omnisend.push(["track", "$pageViewed"]);
    } catch (error) {
      console.error('Error tracking Omnisend event:', error);
    }
  }, [location.pathname]); // Re-run when route changes

  return null;
};