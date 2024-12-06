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
      if (!userId) {
        console.error('No user ID provided');
        throw new Error('User ID is required');
      }

      console.log('Attempting to archive quarter:', quarter, 'for user:', userId);
      
      const { data, error } = await supabase
        .from('quarterly_estimates')
        .update({
          archived: true,
          archived_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('quarter', quarter)
        .select();

      if (error) {
        console.error('Archive error:', error);
        throw new Error(error.message);
      }

      console.log('Archive successful:', data);
      return data;
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
        description: "Failed to archive quarter. Please try again.",
        variant: "destructive",
      });
    },
  });
};