import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthProvider";
import { formatCurrency } from "@/utils/taxCalculations";

export const TaxSummary = () => {
  const { user } = useAuth();

  const { data: expenses } = useQuery({
    queryKey: ["expenses", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("expenses")
        .select("amount")
        .eq("user_id", user?.id);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: estimates } = useQuery({
    queryKey: ["quarterly-estimates", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quarterly_estimates")
        .select("*")
        .eq("user_id", user?.id)
        .order("quarter", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const totalExpenses = expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0;
  const totalIncome = estimates?.reduce((sum, quarter) => sum + (quarter.total_income || 0), 0) || 0;
  const totalTax = estimates?.reduce((sum, quarter) => sum + (quarter.total_tax || 0), 0) || 0;
  const adjustedTaxableIncome = Math.max(0, totalIncome - totalExpenses);
  const adjustedTax = totalTax * (adjustedTaxableIncome / (totalIncome || 1));

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Tax Summary</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Income</span>
          <span className="font-medium">{formatCurrency(totalIncome)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Expenses</span>
          <span className="font-medium text-red-600">-{formatCurrency(totalExpenses)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Adjusted Taxable Income</span>
          <span className="font-medium">{formatCurrency(adjustedTaxableIncome)}</span>
        </div>
        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-semibold">Estimated Tax Due</span>
            <span className="font-semibold text-red-600">{formatCurrency(adjustedTax)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};