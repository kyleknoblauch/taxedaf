import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { QuarterlyEstimate } from "@/types/quarterlyEstimates";

interface UnarchiveQuarterParams {
  quarter: string;
}

interface QuarterArchiveStatus {
  can_unarchive: boolean;
  archive_expires_at: string | null;
  manual_unarchive_count: number;
}

export const useUnarchiveMutation = (userId: string | undefined) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ quarter }: UnarchiveQuarterParams) => {
      if (!userId) throw new Error("User ID is required");

      // First, check if the quarter can be unarchived
      const { data: quarterData, error: checkError } = await supabase
        .from("quarterly_estimates")
        .select<string, QuarterArchiveStatus>("can_unarchive, archive_expires_at, manual_unarchive_count")
        .eq("user_id", userId)
        .eq("quarter", quarter)
        .single();

      if (checkError) throw checkError;

      if (!quarterData?.can_unarchive) {
        throw new Error("This quarter can no longer be unarchived");
      }

      // Increment the manual_unarchive_count and unarchive
      const { error: unarchiveError } = await supabase
        .from("quarterly_estimates")
        .update({
          archived: false,
          archived_at: null,
          manual_unarchive_count: (quarterData?.manual_unarchive_count || 0) + 1
        })
        .eq("user_id", userId)
        .eq("quarter", quarter);

      if (unarchiveError) throw unarchiveError;

      // Unarchive related tax calculations
      const { error: calcError } = await supabase
        .from("tax_calculations")
        .update({
          archived: false,
          archived_at: null
        })
        .eq("user_id", userId)
        .eq("quarter_id", quarter);

      if (calcError) throw calcError;

      // Unarchive related expenses
      const { error: expenseError } = await supabase
        .from("expenses")
        .update({
          archived: false,
          archived_at: null
        })
        .eq("user_id", userId)
        .eq("quarter_id", quarter);

      if (expenseError) throw expenseError;

      return { quarter };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quarterly-estimates"] });
      queryClient.invalidateQueries({ queryKey: ["tax-calculations"] });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["archived-quarters"] });
      
      toast({
        title: "Quarter Unarchived",
        description: "The quarter and all related data have been restored successfully.",
      });
    },
    onError: (error: Error) => {
      console.error('Error unarchiving quarter:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to unarchive quarter. Please try again.",
        variant: "destructive",
      });
    },
  });
};