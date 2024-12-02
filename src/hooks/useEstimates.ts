import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useEstimates = (userId: string | undefined) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: calculations } = useQuery({
    queryKey: ["tax-calculations", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tax_calculations")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });

  const updateNoteMutation = useMutation({
    mutationFn: async ({ id, note }: { id: string; note: string }) => {
      const { error } = await supabase
        .from("tax_calculations")
        .update({ notes: note })
        .eq("id", id)
        .eq("user_id", userId)
        .single();

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tax-calculations", userId] });
      toast({
        title: "Success",
        description: "Note updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update note",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("tax_calculations")
        .delete()
        .eq("id", id)
        .eq("user_id", userId)
        .single();

      if (error) throw error;
      return id;
    },
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ["tax-calculations", userId] });
      const previousCalculations = queryClient.getQueryData(["tax-calculations", userId]);
      queryClient.setQueryData(
        ["tax-calculations", userId],
        (old: any) => old?.filter((calc: any) => calc.id !== deletedId) || []
      );
      return { previousCalculations };
    },
    onError: (err, deletedId, context) => {
      queryClient.setQueryData(["tax-calculations", userId], context?.previousCalculations);
      toast({
        title: "Error",
        description: "Failed to delete estimate. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Estimate deleted successfully",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tax-calculations", userId] });
    },
  });

  return {
    calculations,
    updateNoteMutation,
    deleteMutation,
  };
};