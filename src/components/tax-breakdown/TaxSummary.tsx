interface TaxSummaryProps {
  totalTax: number;
  takeHome: number;
  income: number;
  formatCurrency: (amount: number) => string;
  formatPercentage: (amount: number) => string;
  onDeductionClick: () => void;
}

export const TaxSummary = ({
  totalTax,
  takeHome,
  income,
  formatCurrency,
  formatPercentage,
  onDeductionClick,
}: TaxSummaryProps) => {
  return (
    <div className="pt-4 border-t space-y-4">
      <div className="flex justify-between mb-2">
        <span className="font-medium">Total Tax</span>
        <div className="flex gap-2">
          <span className="font-semibold text-red-500">{formatCurrency(totalTax)}</span>
          <span className="text-gray-500">({formatPercentage(totalTax)})</span>
        </div>
      </div>
      <div className="flex justify-between">
        <span className="font-medium">Take Home</span>
        <div className="flex gap-2">
          <span className="font-semibold text-green-500">{formatCurrency(takeHome)}</span>
          <span className="text-gray-500">({formatPercentage(takeHome)})</span>
        </div>
      </div>
      <button
        onClick={onDeductionClick}
        className="w-full text-sm text-primary hover:text-primary/90 underline text-left mt-2"
      >
        Cut Your Taxes & Deduct Your Business Costs
      </button>
    </div>
  );
};