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
    mutationFn: async (params: ArchiveQuarterParams) => {
      console.log('Archiving quarter:', params.quarter);
      const { error } = await supabase
        .rpc('archive_quarterly_estimate', {
          p_user_id: userId,
          p_quarter: params.quarter
        });

      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quarterly-estimates"] });
      queryClient.invalidateQueries({ queryKey: ["tax-calculations"] });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast({
        title: "Success",
        description: "Quarter archived successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to archive quarter",
        variant: "destructive",
      });
    },
  });
};