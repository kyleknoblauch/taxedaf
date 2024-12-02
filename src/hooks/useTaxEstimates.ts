import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useTaxEstimates = (userId: string | undefined) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: estimates, isLoading, isError } = useQuery({
    queryKey: ['tax-estimates', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tax_calculations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const updateNote = async (id: string, note: string) => {
    if (!userId) return;
    
    try {
      const { error } = await supabase
        .from('tax_calculations')
        .update({ notes: note })
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['tax-estimates', userId] });
      
      toast({
        title: "Success",
        description: "Note updated successfully",
      });
      return true;
    } catch (error: any) {
      console.error('Error updating note:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update note",
      });
      return false;
    }
  };

  const deleteEstimate = async (id: string) => {
    if (!userId) return;

    try {
      // First optimistically update the UI
      const previousEstimates = queryClient.getQueryData(['tax-estimates', userId]);
      
      queryClient.setQueryData(['tax-estimates', userId], (old: any) => 
        old?.filter((calc: any) => calc.id !== id)
      );

      const { error } = await supabase
        .from('tax_calculations')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) {
        // If there was an error, rollback the optimistic update
        queryClient.setQueryData(['tax-estimates', userId], previousEstimates);
        throw error;
      }

      // If successful, invalidate to ensure we're in sync with the server
      await queryClient.invalidateQueries({ queryKey: ['tax-estimates', userId] });

      toast({
        title: "Success",
        description: "Estimate deleted successfully",
      });
      return true;
    } catch (error: any) {
      console.error('Error deleting estimate:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete estimate",
      });
      return false;
    }
  };

  return {
    estimates,
    isLoading,
    isError,
    updateNote,
    deleteEstimate,
  };
};