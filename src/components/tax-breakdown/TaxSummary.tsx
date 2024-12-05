interface TaxSummaryProps {
  totalTax: number;
  takeHome: number;
  income: number;
  formatCurrency: (amount: number) => string;
  formatPercentage: (amount: number) => string;
  federalTax: number;
  stateTax: number;
  selfEmploymentTax: number;
  invoiceName?: string;
  notes?: string;
}

export const TaxSummary = ({
  totalTax,
  takeHome,
  income,
  formatCurrency,
  formatPercentage,
  federalTax,
  stateTax,
  selfEmploymentTax,
  invoiceName,
  notes,
}: TaxSummaryProps) => {
  console.log('TaxSummary - Props received:', {
    totalTax,
    takeHome,
    income,
    federalTax,
    stateTax,
    selfEmploymentTax,
    invoiceName,
    notes
  });

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
    </div>
  );
};