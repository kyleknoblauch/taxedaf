import { Progress } from "@/components/ui/progress";

interface TaxProgressBarProps {
  label: string;
  amount: number;
  income: number;
  formatCurrency: (amount: number) => string;
  formatPercentage: (amount: number) => string;
}

export const TaxProgressBar = ({
  label,
  amount,
  income,
  formatCurrency,
  formatPercentage,
}: TaxProgressBarProps) => {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium">{label}</span>
        <div className="flex gap-2">
          <span className="text-sm font-semibold">{formatCurrency(amount)}</span>
          <span className="text-sm text-gray-500">({formatPercentage(amount)})</span>
        </div>
      </div>
      <Progress value={(amount / income) * 100} className="h-2" />
    </div>
  );
};