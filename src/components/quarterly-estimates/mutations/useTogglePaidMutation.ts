import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface TogglePaidParams {
  quarter: string;
  currentPaidStatus: string | null;
}

export const useTogglePaidMutation = (userId: string | undefined) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<void, Error, TogglePaidParams>({
    mutationFn: async ({ quarter, currentPaidStatus }) => {
      const { error } = await supabase
        .from("quarterly_estimates")
        .update({ paid_at: currentPaidStatus ? null : new Date().toISOString() })
        .eq("user_id", userId)
        .eq("quarter", quarter);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quarterly-estimates"] });
      toast({
        title: "Success",
        description: "Payment status updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update payment status",
        variant: "destructive",
      });
    },
  });
};