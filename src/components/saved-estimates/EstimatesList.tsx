import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../AuthProvider";
import { EstimateCard } from "./EstimateCard";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export const EstimatesList = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedNote, setEditedNote] = useState("");

  const { data: estimates, isLoading, isError } = useQuery({
    queryKey: ['tax-estimates', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tax_calculations')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const handleStartEditing = (calc: any) => {
    setEditingId(calc.id);
    setEditedNote(calc.notes || "");
  };

  const handleSaveNote = async (id: string) => {
    if (!user?.id) return;
    
    try {
      const { error } = await supabase
        .from('tax_calculations')
        .update({ notes: editedNote })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['tax-estimates', user.id] });
      
      toast({
        title: "Success",
        description: "Note updated successfully",
      });
      setEditingId(null);
    } catch (error: any) {
      console.error('Error updating note:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update note",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!user?.id) return;

    try {
      // First optimistically update the UI
      const previousEstimates = queryClient.getQueryData(['tax-estimates', user.id]);
      
      queryClient.setQueryData(['tax-estimates', user.id], (old: any) => 
        old?.filter((calc: any) => calc.id !== id)
      );

      const { error } = await supabase
        .from('tax_calculations')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        // If there was an error, rollback the optimistic update
        queryClient.setQueryData(['tax-estimates', user.id], previousEstimates);
        throw error;
      }

      // If successful, invalidate to ensure we're in sync with the server
      await queryClient.invalidateQueries({ queryKey: ['tax-estimates', user.id] });

      toast({
        title: "Success",
        description: "Estimate deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting estimate:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete estimate",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center p-4 text-red-500">
        Error loading estimates. Please try again later.
      </div>
    );
  }

  if (!estimates?.length) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        No saved estimates found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {estimates.map((calc) => (
        <EstimateCard
          key={calc.id}
          calc={calc}
          editingId={editingId}
          editedNote={editedNote}
          onStartEditing={handleStartEditing}
          onSaveNote={handleSaveNote}
          onCancelEdit={() => setEditingId(null)}
          onDelete={handleDelete}
          onEditNoteChange={setEditedNote}
        />
      ))}
    </div>
  );
};