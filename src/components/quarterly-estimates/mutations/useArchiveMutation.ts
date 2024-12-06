import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ArchiveQuarterParams {
  quarter: string;
}

export const useArchiveMutation = (userId: string | undefined) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ quarter }: ArchiveQuarterParams) => {
      if (!userId) throw new Error("User ID is required");

      const quarterDate = new Date(quarter);
      const nextQuarter = new Date(quarterDate);
      nextQuarter.setMonth(quarterDate.getMonth() + 3);

      // Archive the quarterly estimate
      const { error: quarterError } = await supabase
        .from("quarterly_estimates")
        .update({
          archived: true,
          archived_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .eq("quarter", quarter);

      if (quarterError) throw quarterError;

      // Archive all tax calculations within the quarter
      const { error: calcError } = await supabase
        .from("tax_calculations")
        .update({
          archived: true,
          archived_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .gte("created_at", quarter)
        .lt("created_at", nextQuarter.toISOString());

      if (calcError) throw calcError;

      // Archive all expenses within the quarter
      const { error: expenseError } = await supabase
        .from("expenses")
        .update({
          archived: true,
          archived_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .gte("created_at", quarter)
        .lt("created_at", nextQuarter.toISOString());

      if (expenseError) throw expenseError;

      return { quarter };
    },
    onSuccess: () => {
      // Invalidate all relevant queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: ["quarterly-estimates"] });
      queryClient.invalidateQueries({ queryKey: ["tax-calculations"] });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["archived-quarters"] });
    },
  });
};