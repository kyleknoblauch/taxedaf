import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useTaxEstimates = (userId: string | undefined) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: estimates, isLoading, isError } = useQuery({
    queryKey: ['tax-estimates', userId],
    queryFn: async () => {
      console.log('useTaxEstimates - Fetching estimates for user:', userId);
      if (!userId) throw new Error("User ID is required");
      
      const { data, error } = await supabase
        .from('tax_calculations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('useTaxEstimates - Error fetching estimates:', error);
        throw error;
      }
      
      console.log('useTaxEstimates - Fetched estimates:', data);
      return data;
    },
    enabled: !!userId,
    retry: 2,
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  const updateNote = async (id: string, note: string) => {
    console.log('useTaxEstimates - Updating note for estimate:', id);
    if (!userId) return false;
    
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
    console.log('useTaxEstimates - Attempting to delete estimate:', id);
    if (!userId) {
      console.error('useTaxEstimates - No user ID provided for delete operation');
      return false;
    }

    try {
      const previousEstimates = queryClient.getQueryData(['tax-estimates', userId]);
      
      // Optimistically update UI
      queryClient.setQueryData(['tax-estimates', userId], (old: any) => 
        old?.filter((calc: any) => calc.id !== id)
      );

      const { error } = await supabase
        .from('tax_calculations')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) {
        console.error('useTaxEstimates - Error deleting estimate:', error);
        // Rollback optimistic update if error occurs
        queryClient.setQueryData(['tax-estimates', userId], previousEstimates);
        throw error;
      }

      console.log('useTaxEstimates - Successfully deleted estimate:', id);
      await queryClient.invalidateQueries({ queryKey: ['tax-estimates', userId] });

      toast({
        title: "Success",
        description: "Estimate deleted successfully",
      });
      return true;
    } catch (error: any) {
      console.error('useTaxEstimates - Error in delete operation:', error);
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