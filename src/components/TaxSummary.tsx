import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthProvider";
import { formatCurrency } from "@/utils/taxCalculations";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, X, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

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
  
  const adjustedTaxableIncome = Math.max(0, totalIncome - totalExpenses);
  const taxReductionFactor = adjustedTaxableIncome / (totalIncome || 1);
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
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Income (All Estimates)</span>
            <span className="font-medium">{formatCurrency(totalIncome)}</span>
          </div>
          
          <div className="pl-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Federal Tax</span>
              <span className="font-medium text-red-600">{formatCurrency(totalFederalTax)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">State Tax</span>
              <span className="font-medium text-red-600">{formatCurrency(totalStateTax)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Self-Employment Tax</span>
              <span className="font-medium text-red-600">{formatCurrency(totalSelfEmploymentTax)}</span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 border-t">
            <span className="font-medium text-gray-700">Total Tax Before Deductions</span>
            <span className="font-medium text-red-600">{formatCurrency(totalTax)}</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700">Expense Deductions</h3>
          {expenses?.map((expense) => (
            <div key={expense.id} className="flex items-center justify-between pl-4 py-2 hover:bg-gray-50 rounded-lg">
              <div className="flex-grow">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">{expense.description}</span>
                  <span className="text-sm text-gray-500">({expense.category})</span>
                </div>
                {editingId === expense.id ? (
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={editedNote}
                      onChange={(e) => setEditedNote(e.target.value)}
                      placeholder="Add a note..."
                      className="flex-grow"
                    />
                    <Button size="icon" variant="ghost" onClick={() => handleSaveNote(expense.id)}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => setEditingId(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-500">{expense.notes || "No notes"}</span>
                    <Button size="icon" variant="ghost" onClick={() => startEditing(expense)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span className="font-medium text-green-600">-{formatCurrency(expense.amount)}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDelete(expense.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          
          <div className="flex justify-between items-center pt-2 border-t">
            <span className="font-medium text-gray-700">Total Deductions</span>
            <span className="font-medium text-green-600">-{formatCurrency(totalExpenses)}</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Adjusted Taxable Income</span>
            <span className="font-medium">{formatCurrency(adjustedTaxableIncome)}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t">
            <span className="font-semibold text-gray-700">Final Estimated Tax Due</span>
            <span className="font-semibold text-red-600">{formatCurrency(adjustedTotalTax)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};