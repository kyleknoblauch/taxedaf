import { supabase } from "@/integrations/supabase/client";

export const trackKlaviyoEvent = async (
  eventName: string,
  customerProperties: {
    email: string;
    first_name?: string;
    last_name?: string;
  },
  properties?: Record<string, any>
) => {
  try {
    const { data, error } = await supabase.functions.invoke('klaviyo', {
      body: {
        action: 'track',
        eventName,
        customerProperties,
        properties,
      },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error tracking Klaviyo event:', error);
    throw error;
  }
};

export const subscribeToKlaviyoList = async (
  email: string,
  firstName?: string,
  lastName?: string
) => {
  try {
    const { data, error } = await supabase.functions.invoke('klaviyo', {
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
    console.error('Error subscribing to Klaviyo list:', error);
    throw error;
  }
};