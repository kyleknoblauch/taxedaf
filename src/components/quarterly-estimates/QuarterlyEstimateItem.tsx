import { Button } from "@/components/ui/button";
import { Archive, CheckCircle } from "lucide-react";
import { QuarterInfo } from "./QuarterInfo";
import { QuarterlyAmounts } from "./QuarterlyAmounts";
import { PaymentDialog } from "./PaymentDialog";
import { getQuarterInfo } from "@/utils/quarterCalculations";
import { useAuth } from "@/components/AuthProvider";
import { trackQuarterlyInvoicePaid, trackQuarterlyEstimateArchived } from "@/utils/omnisendEvents";

interface QuarterlyEstimateItemProps {
  quarter: any;
  onArchive: (quarter: string) => Promise<void>;
  onTogglePaid: (params: { quarter: string; currentPaidStatus: string | null }) => void;
}

export const QuarterlyEstimateItem = ({
  quarter,
  onArchive,
  onTogglePaid,
}: QuarterlyEstimateItemProps) => {
  const { quarterNum, dateRange, dueDate, taxYear } = getQuarterInfo(quarter.quarter);
  const isPaid = !!quarter.paid_at;
  const { user } = useAuth();

  const handleArchive = async () => {
    await onArchive(quarter.quarter);
    if (user?.email) {
      await trackQuarterlyEstimateArchived(
        user.email,
        quarter.quarter
      );
    }
  };

  const handleTogglePaid = async () => {
    onTogglePaid({ 
      quarter: quarter.quarter,
      currentPaidStatus: quarter.paid_at
    });
    
    if (!quarter.paid_at && user?.email) {
      await trackQuarterlyInvoicePaid(
        user.email,
        quarter.quarter,
        quarter.total_tax
      );
    }
  };

  return (
    <div className="border-b pb-6 last:border-b-0">
      <div className="flex items-start justify-between mb-4">
        <QuarterInfo
          quarterNum={quarterNum}
          dateRange={dateRange}
          dueDate={dueDate}
          taxYear={taxYear}
        />
      </div>
      
      <QuarterlyAmounts
        totalIncome={quarter.total_income}
        totalExpenses={quarter.total_expenses}
        totalFederalTax={quarter.total_federal_tax}
        totalStateTax={quarter.total_state_tax}
        totalSelfEmploymentTax={quarter.total_self_employment_tax}
        totalTax={quarter.total_tax}
      />

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button
          variant={isPaid ? "outline" : "default"}
          size="sm"
          onClick={handleTogglePaid}
          className="flex items-center gap-2"
        >
          <CheckCircle className="h-4 w-4" />
          {isPaid ? "Paid" : "Mark as Paid"}
        </Button>

        {isPaid && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleArchive}
            className="flex items-center gap-2 text-yellow-600 hover:text-yellow-700"
          >
            <Archive className="h-4 w-4" />
            Archive Quarter
          </Button>
        )}

        <PaymentDialog
          federalTax={quarter.total_federal_tax}
          stateTax={quarter.total_state_tax}
          selfEmploymentTax={quarter.total_self_employment_tax}
        />
      </div>
    </div>
  );
};
