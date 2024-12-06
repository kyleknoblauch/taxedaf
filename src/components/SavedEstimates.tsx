import { EstimatesList } from "./saved-estimates/EstimatesList";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthProvider";
import { useQueryClient } from "@tanstack/react-query";

export const SavedEstimates = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user?.id) return;

    // Subscribe to changes in tax_calculations table
    const channel = supabase
      .channel('tax-calculations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tax_calculations',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // Invalidate relevant queries when changes occur
          queryClient.invalidateQueries({ queryKey: ["tax-calculations", user.id] });
          queryClient.invalidateQueries({ queryKey: ["quarterly-estimates", user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  return <EstimatesList />;
};