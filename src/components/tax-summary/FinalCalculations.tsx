import { formatCurrency } from "@/utils/taxCalculations";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../AuthProvider";

interface FinalCalculationsProps {
  adjustedTaxableIncome: number;
  adjustedTotalTax: number;
  totalExpenses: number;
}

export const FinalCalculations = ({
  adjustedTaxableIncome,
  adjustedTotalTax,
  totalExpenses,
}: FinalCalculationsProps) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: expenses } = useQuery({
    queryKey: ["expenses", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

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

  const totalIncome = calculations?.reduce((sum, calc) => sum + (calc.income || 0), 0) || 0;

  const downloadCSV = () => {
    try {
      // Create CSV header and summary section
      const csvContent = [
        ['Tax Summary Report'],
        ['Generated on', new Date().toLocaleDateString()],
        [''],
        ['Income Summary'],
        ['Total Income (Before Taxes)', formatCurrency(totalIncome).replace('$', '')],
        ['Adjusted Taxable Income', formatCurrency(adjustedTaxableIncome).replace('$', '')],
        ['Total Tax Due', formatCurrency(adjustedTotalTax).replace('$', '')],
        [''],
        ['Deductions Summary'],
        ['Total Deductions', formatCurrency(totalExpenses).replace('$', '')],
        [''],
        ['Itemized Deductions'],
        ['Description', 'Category', 'Amount', 'Notes']
      ];

      // Add each expense as a row
      expenses?.forEach(expense => {
        csvContent.push([
          expense.description,
          expense.category,
          formatCurrency(expense.amount).replace('$', ''),
          expense.notes || ''
        ]);
      });

      // Add summary by category
      csvContent.push(
        [''],
        ['Deductions by Category'],
        ['Category', 'Total Amount']
      );

      // Calculate and add category totals
      const categoryTotals = expenses?.reduce((acc: Record<string, number>, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
      }, {});

      Object.entries(categoryTotals || {}).forEach(([category, amount]) => {
        csvContent.push([category, formatCurrency(amount).replace('$', '')]);
      });

      // Convert to CSV string
      const csvString = csvContent.map(row => row.join(',')).join('\n');

      // Create and download file
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `tax-summary-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Success",
        description: "Tax summary downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download tax summary",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-gray-600">Adjusted Taxable Income</span>
        <span className="font-medium">{formatCurrency(adjustedTaxableIncome)}</span>
      </div>
      <div className="flex justify-between items-center pt-2 border-t">
        <span className="font-medium text-gray-700">Total Deductions</span>
        <span className="font-medium text-green-600">-{formatCurrency(totalExpenses)}</span>
      </div>
      <div className="flex justify-between items-center pt-2 border-t">
        <span className="font-semibold text-gray-700">Final Estimated Tax Due</span>
        <span className="font-semibold text-red-600">{formatCurrency(adjustedTotalTax)}</span>
      </div>
      <div className="pt-4">
        <Button
          onClick={downloadCSV}
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download Detailed Tax Summary (CSV)
        </Button>
      </div>
    </div>
  );
};