import { formatCurrency } from "@/utils/formatters";

interface QuarterlyAmountsProps {
  totalIncome: number;
  totalExpenses: number;
  totalFederalTax: number;
  totalStateTax: number;
  totalSelfEmploymentTax: number;
  totalTax: number;
}

export const QuarterlyAmounts = ({
  totalIncome,
  totalExpenses,
  totalFederalTax,
  totalStateTax,
  totalSelfEmploymentTax,
  totalTax,
}: QuarterlyAmountsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-sm text-gray-500">Total Income</p>
        <p className="text-lg font-medium">{formatCurrency(totalIncome)}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Total Expenses</p>
        <p className="text-lg font-medium">{formatCurrency(totalExpenses)}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Federal Tax</p>
        <p className="text-lg font-medium text-red-600">{formatCurrency(totalFederalTax)}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">State Tax</p>
        <p className="text-lg font-medium text-red-600">{formatCurrency(totalStateTax)}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Self-Employment Tax</p>
        <p className="text-lg font-medium text-red-600">{formatCurrency(totalSelfEmploymentTax)}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Total Tax Due</p>
        <p className="text-lg font-medium text-red-600">{formatCurrency(totalTax)}</p>
      </div>
    </div>
  );
};