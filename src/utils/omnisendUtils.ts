import { supabase } from "@/integrations/supabase/client";

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
    const { data, error } = await supabase.functions.invoke('omnisend', {
      body: {
        action: 'track',
        eventName,
        email: customerProperties.email,
        firstName: customerProperties.first_name,
        lastName: customerProperties.last_name,
        properties,
      },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error tracking Omnisend event:', error);
    throw error;
  }
};

export const subscribeToOmnisend = async (
  email: string,
  firstName?: string,
  lastName?: string
) => {
  try {
    const { data, error } = await supabase.functions.invoke('omnisend', {
      body: {
        action: 'subscribe',
        email,
        firstName,
        lastName,
      },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error subscribing to Omnisend:', error);
    throw error;
  }
};