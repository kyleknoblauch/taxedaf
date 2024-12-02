import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthProvider";
import { formatCurrency } from "@/utils/taxCalculations";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil, Check, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const SavedEstimates = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedNote, setEditedNote] = useState("");

  const { data: calculations } = useQuery({
    queryKey: ["tax-calculations", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tax_calculations")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const updateNoteMutation = useMutation({
    mutationFn: async ({ id, note }: { id: string; note: string }) => {
      const { error } = await supabase
        .from("tax_calculations")
        .update({ notes: note })
        .eq("id", id)
        .eq("user_id", user?.id)
        .single();

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tax-calculations", user?.id] });
      toast({
        title: "Success",
        description: "Note updated successfully",
      });
      setEditingId(null);
      setEditedNote("");
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
        .eq("user_id", user?.id)
        .single();

      if (error) throw error;
      return id;
    },
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ["tax-calculations", user?.id] });
      const previousCalculations = queryClient.getQueryData(["tax-calculations", user?.id]);
      queryClient.setQueryData(
        ["tax-calculations", user?.id],
        (old: any) => old?.filter((calc: any) => calc.id !== deletedId) || []
      );
      return { previousCalculations };
    },
    onError: (err, deletedId, context) => {
      queryClient.setQueryData(["tax-calculations", user?.id], context?.previousCalculations);
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
      queryClient.invalidateQueries({ queryKey: ["tax-calculations", user?.id] });
    },
  });

  if (!calculations?.length) {
    return (
      <div className="p-4">
        <p className="text-center text-gray-500">No saved estimates yet.</p>
      </div>
    );
  }

  const handleStartEditing = (calc: any) => {
    setEditingId(calc.id);
    setEditedNote(calc.notes || "");
  };

  const handleSaveNote = (id: string) => {
    updateNoteMutation.mutate({ id, note: editedNote });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedNote("");
  };

  return (
    <div className="space-y-4">
      {calculations.map((calc) => {
        const totalTax = (calc.federal_tax || 0) + (calc.state_tax || 0) + (calc.self_employment_tax || 0);
        const takeHome = (calc.income || 0) - totalTax;

        return (
          <div key={calc.id} className="space-y-1">
            <div className="flex justify-between items-center pl-1">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {calc.invoice_name || "Untitled Invoice"}
              </p>
              <p className="text-xs text-gray-500">
                {calc.created_at ? format(new Date(calc.created_at), 'MMM d, yyyy') : 'Date not available'}
              </p>
            </div>
            <Card className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Income</span>
                      <span className="font-medium">{formatCurrency(calc.income || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Federal Tax</span>
                      <span className="font-medium text-red-600">{formatCurrency(calc.federal_tax || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">State Tax</span>
                      <span className="font-medium text-red-600">{formatCurrency(calc.state_tax || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Self-Employment Tax</span>
                      <span className="font-medium text-red-600">{formatCurrency(calc.self_employment_tax || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Total Tax</span>
                      <span className="font-medium text-red-600">{formatCurrency(totalTax)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-sm font-medium text-gray-500">Take Home</span>
                      <span className="font-medium text-green-600">{formatCurrency(takeHome)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {editingId !== calc.id && (
                      <Button variant="ghost" size="icon" onClick={() => handleStartEditing(calc)}>
                        <Pencil className="h-4 w-4 text-gray-500" />
                      </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Estimate</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this tax estimate? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteMutation.mutate(calc.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                {editingId === calc.id ? (
                  <div className="space-y-2 pt-2 border-t">
                    <Textarea
                      value={editedNote}
                      onChange={(e) => setEditedNote(e.target.value)}
                      placeholder="Add a note about this estimate..."
                      className="min-h-[80px]"
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelEdit}
                        className="flex items-center gap-1"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSaveNote(calc.id)}
                        className="flex items-center gap-1"
                      >
                        <Check className="h-4 w-4" />
                        Save
                      </Button>
                    </div>
                  </div>
                ) : calc.notes && (
                  <p className="text-sm text-gray-600 mt-2 pt-2 border-t">{calc.notes}</p>
                )}
              </div>
            </Card>
          </div>
        );
      })}
    </div>
  );
};