import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export const useQuarterlyEstimatesData = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  const { data: estimates } = useQuery({
    queryKey: ["quarterly-estimates", userId],
    queryFn: async () => {
      console.log('Fetching quarterly estimates for user:', userId);
      const startTime = performance.now();
      
      const { data, error } = await supabase
        .from("quarterly_estimates")
        .select("*")
        .eq("user_id", userId)
        .eq("archived", false)
        .order("quarter", { ascending: false });

      if (error) {
        console.error('Error fetching quarterly estimates:', error);
        throw error;
      }

      const endTime = performance.now();
      console.log(`Quarterly estimates fetch took ${endTime - startTime}ms`);
      console.log('Quarterly estimates data:', data);
      
      return data;
    },
    enabled: !!userId,
  });

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('quarterly-estimates-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quarterly_estimates',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["quarterly-estimates"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);

  return estimates;
};