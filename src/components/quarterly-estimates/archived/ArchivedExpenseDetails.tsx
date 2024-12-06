import { QuarterlyEstimate } from "@/types/quarterlyEstimates";

interface ArchivedExpenseDetailsProps {
  expense: QuarterlyEstimate["expenses"][0];
}

export const ArchivedExpenseDetails = ({ expense }: ArchivedExpenseDetailsProps) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-sm">{expense.description}</span>
          <span className="text-sm text-gray-500 ml-2">({expense.category})</span>
        </div>
        <span className="text-sm font-medium text-green-600">
          ${expense.amount.toLocaleString()}
        </span>
      </div>
      {expense.notes && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{expense.notes}</p>
      )}
    </div>
  );
};