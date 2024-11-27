import { formatCurrency } from "@/utils/taxCalculations";

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
    </div>
  );
};