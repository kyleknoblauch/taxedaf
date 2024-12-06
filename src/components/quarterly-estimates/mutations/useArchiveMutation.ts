import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ArchiveQuarterParams {
  quarter: string;
}

export const useArchiveMutation = (userId: string | undefined) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<void, Error, ArchiveQuarterParams>({
    mutationFn: async ({ quarter }) => {
      if (!userId) throw new Error('User ID is required');
      
      console.log('Archiving quarter:', quarter, 'for user:', userId);
      
      const { error } = await supabase
        .from('quarterly_estimates')
        .update({ 
          archived: true,
          archived_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('quarter', quarter);

      if (error) {
        console.error('Archive error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quarterly-estimates"] });
      toast({
        title: "Success",
        description: "Quarter archived successfully",
      });
    },
    onError: (error) => {
      console.error('Archive mutation error:', error);
      toast({
        title: "Error",
        description: "Failed to archive quarter",
        variant: "destructive",
      });
    },
  });
};