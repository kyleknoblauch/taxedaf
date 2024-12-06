import { format } from "date-fns";
import { QuarterlyEstimate } from "@/types/quarterlyEstimates";

interface ArchivedQuarterDetailsProps {
  calculation: QuarterlyEstimate["taxCalculations"][0];
}

export const ArchivedQuarterDetails = ({ calculation }: ArchivedQuarterDetailsProps) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
      <div className="flex justify-between items-center">
        <span className="text-sm">{calculation.invoice_name || "Untitled Invoice"}</span>
        <span className="text-sm text-gray-500">
          {format(new Date(calculation.created_at || ''), "MMM d, yyyy")}
        </span>
      </div>
      {calculation.notes && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{calculation.notes}</p>
      )}
    </div>
  );
};