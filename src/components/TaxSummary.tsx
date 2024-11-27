import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthProvider";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { TaxBreakdownSection } from "./tax-summary/TaxBreakdownSection";
import { ExpensesList } from "./tax-summary/ExpensesList";
import { FinalCalculations } from "./tax-summary/FinalCalculations";

export const TaxSummary = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedNote, setEditedNote] = useState("");

  const { data: expenses } = useQuery({
    queryKey: ["expenses", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: taxCalculations } = useQuery({
    queryKey: ["tax-calculations", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tax_calculations")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('tax-calculations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tax_calculations',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // Invalidate and refetch the tax calculations query
          queryClient.invalidateQueries({ queryKey: ["tax-calculations"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  const deleteExpenseMutation = useMutation({
    mutationFn: async (expenseId: string) => {
      const { error } = await supabase
        .from("expenses")
        .delete()
        .eq("id", expenseId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast({
        title: "Success",
        description: "Expense deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete expense",
        variant: "destructive",
      });
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: async ({ id, note }: { id: string; note: string }) => {
      const { error } = await supabase
        .from("expenses")
        .update({ notes: note })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
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

  const totalExpenses = expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0;
  const totalIncome = taxCalculations?.reduce((sum, calc) => sum + (calc.income || 0), 0) || 0;
  const totalFederalTax = taxCalculations?.reduce((sum, calc) => sum + (calc.federal_tax || 0), 0) || 0;
  const totalStateTax = taxCalculations?.reduce((sum, calc) => sum + (calc.state_tax || 0), 0) || 0;
  const totalSelfEmploymentTax = taxCalculations?.reduce((sum, calc) => sum + (calc.self_employment_tax || 0), 0) || 0;
  const totalTax = totalFederalTax + totalStateTax + totalSelfEmploymentTax;
  
  // Calculate adjusted values based on deductions
  const adjustedTaxableIncome = Math.max(0, totalIncome - totalExpenses);
  const taxReductionFactor = totalIncome > 0 ? adjustedTaxableIncome / totalIncome : 0;
  const adjustedTotalTax = totalTax * taxReductionFactor;

  const startEditing = (expense: any) => {
    setEditingId(expense.id);
    setEditedNote(expense.notes || "");
  };

  const handleSaveNote = (id: string) => {
    updateNoteMutation.mutate({ id, note: editedNote });
  };

  const handleDelete = (id: string) => {
    deleteExpenseMutation.mutate(id);
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Tax Summary</h2>
      
      <div className="space-y-6">
        <TaxBreakdownSection
          totalIncome={totalIncome}
          totalFederalTax={totalFederalTax}
          totalStateTax={totalStateTax}
          totalSelfEmploymentTax={totalSelfEmploymentTax}
          totalTax={totalTax}
        />

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700">Expense Deductions</h3>
          <ExpensesList
            expenses={expenses || []}
            editingId={editingId}
            editedNote={editedNote}
            onStartEditing={startEditing}
            onSaveNote={handleSaveNote}
            onCancelEdit={() => setEditingId(null)}
            onDelete={handleDelete}
            onEditNoteChange={(note) => setEditedNote(note)}
          />
        </div>

        <Separator />

        <FinalCalculations
          adjustedTaxableIncome={adjustedTaxableIncome}
          adjustedTotalTax={adjustedTotalTax}
          totalExpenses={totalExpenses}
        />
      </div>
    </Card>
  );
};
