import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthProvider";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { TaxBreakdownSection } from "./tax-summary/TaxBreakdownSection";
import { ExpensesList } from "./tax-summary/ExpensesList";
import { FinalCalculations } from "./tax-summary/FinalCalculations";
import { useLocation } from "react-router-dom";

export const TaxSummary = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedNote, setEditedNote] = useState("");
  const location = useLocation();
  const expensesRef = useRef<HTMLDivElement>(null);

  const { data: expenses } = useQuery({
    queryKey: ["expenses", user?.id],
    queryFn: async () => {
      console.log('Fetching expenses for user:', user?.id);
      const startTime = performance.now();

      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching expenses:', error);
        throw error;
      }

      const endTime = performance.now();
      console.log(`Expenses fetch took ${endTime - startTime}ms`);
      console.log('Expenses data:', data);

      return data || [];
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (location.state?.scrollToExpenses && expensesRef.current) {
      expensesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.state?.scrollToExpenses, expenses]);

  const { data: taxCalculations } = useQuery({
    queryKey: ["tax-calculations", user?.id],
    queryFn: async () => {
      console.log('Fetching tax calculations for user:', user?.id);
      const startTime = performance.now();

      const { data, error } = await supabase
        .from("tax_calculations")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error('Error fetching tax calculations:', error);
        throw error;
      }

      const endTime = performance.now();
      console.log(`Tax calculations fetch took ${endTime - startTime}ms`);
      console.log('Tax calculations data:', data);

      return data || [];
    },
    enabled: !!user,
  });

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
          queryClient.invalidateQueries({ queryKey: ["tax-calculations", user?.id] });
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
      // Invalidate all relevant queries
      queryClient.invalidateQueries({ queryKey: ["expenses", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["quarterly-estimates", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["tax-calculations", user?.id] });
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

  const handleDeleteExpense = async (id: string): Promise<void> => {
    console.log('TaxSummary - Deleting expense:', id);
    await deleteExpenseMutation.mutateAsync(id);
  };

  const updateNoteMutation = useMutation({
    mutationFn: async ({ id, note }: { id: string; note: string }) => {
      const { error } = await supabase
        .from("expenses")
        .update({ notes: note })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses", user?.id] });
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
  
  const adjustedTaxableIncome = Math.max(0, totalIncome - totalExpenses);
  const taxReductionFactor = totalIncome > 0 ? adjustedTaxableIncome / totalIncome : 0;
  const adjustedTotalTax = totalTax * taxReductionFactor;

  return (
    <div className="space-y-6">
      <TaxBreakdownSection
        totalIncome={totalIncome}
        totalFederalTax={totalFederalTax}
        totalStateTax={totalStateTax}
        totalSelfEmploymentTax={totalSelfEmploymentTax}
        totalTax={totalTax}
      />

      <Separator />

      <div className="space-y-4" ref={expensesRef}>
        <h3 className="text-lg font-medium text-gray-700 dark:text-white">Deductions</h3>
        <ExpensesList
          expenses={expenses || []}
          editingId={editingId}
          editedNote={editedNote}
          onStartEditing={(expense) => {
            setEditingId(expense.id);
            setEditedNote(expense.notes || "");
          }}
          onSaveNote={(id) => {
            updateNoteMutation.mutate({ id, note: editedNote });
          }}
          onCancelEdit={() => setEditingId(null)}
          onDelete={handleDeleteExpense}
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
  );
};
