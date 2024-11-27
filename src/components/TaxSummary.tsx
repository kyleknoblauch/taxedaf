import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthProvider";
import { formatCurrency } from "@/utils/taxCalculations";
import { Separator } from "@/components/ui/separator";

export const TaxSummary = () => {
  const { user } = useAuth();

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
  const totalFederalTax = estimates?.reduce((sum, quarter) => sum + (quarter.total_federal_tax || 0), 0) || 0;
  const totalStateTax = estimates?.reduce((sum, quarter) => sum + (quarter.total_state_tax || 0), 0) || 0;
  const totalSelfEmploymentTax = estimates?.reduce((sum, quarter) => sum + (quarter.total_self_employment_tax || 0), 0) || 0;
  const totalTax = totalFederalTax + totalStateTax + totalSelfEmploymentTax;
  
  const adjustedTaxableIncome = Math.max(0, totalIncome - totalExpenses);
  const taxReductionFactor = adjustedTaxableIncome / (totalIncome || 1);
  const adjustedTotalTax = totalTax * taxReductionFactor;

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Tax Summary</h2>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Income</span>
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
            <div key={expense.id} className="flex justify-between items-center pl-4">
              <div>
                <span className="text-gray-600">{expense.description}</span>
                <span className="text-sm text-gray-500 ml-2">({expense.category})</span>
              </div>
              <span className="font-medium text-green-600">-{formatCurrency(expense.amount)}</span>
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