import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface TaxBreakdownProps {
  income: number;
  federalTax: number;
  stateTax: number;
  selfEmploymentTax: number;
}

export const TaxBreakdown = ({
  income,
  federalTax,
  stateTax,
  selfEmploymentTax,
}: TaxBreakdownProps) => {
  const totalTax = federalTax + stateTax + selfEmploymentTax;
  const takeHome = income - totalTax;
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(amount / income);
  };

  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Tax Breakdown</h2>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Federal Tax</span>
            <div className="flex gap-2">
              <span className="text-sm font-semibold">{formatCurrency(federalTax)}</span>
              <span className="text-sm text-gray-500">({formatPercentage(federalTax)})</span>
            </div>
          </div>
          <Progress value={(federalTax / income) * 100} className="h-2" />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">State Tax</span>
            <div className="flex gap-2">
              <span className="text-sm font-semibold">{formatCurrency(stateTax)}</span>
              <span className="text-sm text-gray-500">({formatPercentage(stateTax)})</span>
            </div>
          </div>
          <Progress value={(stateTax / income) * 100} className="h-2" />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Self-Employment Tax</span>
            <div className="flex gap-2">
              <span className="text-sm font-semibold">{formatCurrency(selfEmploymentTax)}</span>
              <span className="text-sm text-gray-500">({formatPercentage(selfEmploymentTax)})</span>
            </div>
          </div>
          <Progress value={(selfEmploymentTax / income) * 100} className="h-2" />
        </div>
      </div>

      <div className="pt-4 border-t">
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
    </Card>
  );
};