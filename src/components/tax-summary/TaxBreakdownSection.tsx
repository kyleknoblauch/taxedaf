import { formatCurrency } from "@/utils/taxCalculations";

interface TaxBreakdownSectionProps {
  totalIncome: number;
  totalFederalTax: number;
  totalStateTax: number;
  totalSelfEmploymentTax: number;
  totalTax: number;
}

export const TaxBreakdownSection = ({
  totalIncome,
  totalFederalTax,
  totalStateTax,
  totalSelfEmploymentTax,
  totalTax,
}: TaxBreakdownSectionProps) => {
  return (
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
    </div>
  );
};