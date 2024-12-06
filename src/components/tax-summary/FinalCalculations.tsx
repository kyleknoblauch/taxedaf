import { formatCurrency } from "@/utils/taxCalculations";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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

  const downloadCSV = () => {
    try {
      // Create CSV content
      const csvContent = [
        ['Tax Summary'],
        ['Category', 'Amount'],
        ['Adjusted Taxable Income', adjustedTaxableIncome],
        ['Total Deductions', totalExpenses],
        ['Final Estimated Tax Due', adjustedTotalTax]
      ].map(row => row.join(',')).join('\n');

      // Create blob and download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', 'tax-summary.csv');
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
          Download Tax Summary (CSV)
        </Button>
      </div>
    </div>
  );
};