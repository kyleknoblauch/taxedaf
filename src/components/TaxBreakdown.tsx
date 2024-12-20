import { Card } from "@/components/ui/card";
import { TaxProgressBar } from "./tax-breakdown/TaxProgressBar";
import { TaxSummary } from "./tax-breakdown/TaxSummary";
import { TaxActions } from "./tax-breakdown/TaxActions";
import { formatCurrency, formatPercentage } from "@/utils/formatters";

interface TaxBreakdownProps {
  income: number;
  federalTax: number;
  stateTax: number;
  selfEmploymentTax: number;
  invoiceName?: string;
  notes?: string;
}

export const TaxBreakdown = ({
  income,
  federalTax,
  stateTax,
  selfEmploymentTax,
  invoiceName,
  notes,
}: TaxBreakdownProps) => {
  const totalTax = federalTax + stateTax + selfEmploymentTax;
  const takeHome = income - totalTax;

  const formatPercentageWithIncome = (amount: number) => formatPercentage(amount, income);

  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Tax Breakdown</h2>
      
      <div className="space-y-4">
        <TaxProgressBar
          label="Federal Tax"
          amount={federalTax}
          income={income}
          formatCurrency={formatCurrency}
          formatPercentage={formatPercentageWithIncome}
        />
        <TaxProgressBar
          label="State Tax"
          amount={stateTax}
          income={income}
          formatCurrency={formatCurrency}
          formatPercentage={formatPercentageWithIncome}
        />
        <TaxProgressBar
          label="Self-Employment Tax"
          amount={selfEmploymentTax}
          income={income}
          formatCurrency={formatCurrency}
          formatPercentage={formatPercentageWithIncome}
        />
      </div>

      <TaxSummary
        totalTax={totalTax}
        takeHome={takeHome}
        income={income}
        formatCurrency={formatCurrency}
        formatPercentage={formatPercentageWithIncome}
        federalTax={federalTax}
        stateTax={stateTax}
        selfEmploymentTax={selfEmploymentTax}
        invoiceName={invoiceName}
        notes={notes}
      />

      <TaxActions
        income={income}
        federalTax={federalTax}
        stateTax={stateTax}
        selfEmploymentTax={selfEmploymentTax}
        invoiceName={invoiceName}
        notes={notes}
      />
    </Card>
  );
};