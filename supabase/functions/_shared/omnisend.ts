const OMNISEND_API_KEY = Deno.env.get('OMNISEND_API_KEY');

export const trackOmnisendEvent = async (
  eventName: string,
  customerProperties: {
    email: string;
    first_name?: string;
    last_name?: string;
  },
  properties?: Record<string, any>
) => {
  try {
    const response = await fetch('https://api.omnisend.com/v3/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': OMNISEND_API_KEY!,
      },
      body: JSON.stringify({
        email: customerProperties.email,
        name: eventName,
        properties: {
          ...properties,
          firstName: customerProperties.first_name,
          lastName: customerProperties.last_name,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to track event in Omnisend: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error tracking Omnisend event:', error);
    throw error;
  }
};