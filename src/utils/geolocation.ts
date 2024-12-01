export const getStateFromIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    // Return the state code (region_code) or default to CA if not found
    return data.region_code || 'CA';
  } catch (error) {
    console.error('Error fetching location:', error);
    return 'CA'; // Fallback to CA if there's an error
  }
};