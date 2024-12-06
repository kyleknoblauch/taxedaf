import { CalendarClock } from "lucide-react";

interface QuarterInfoProps {
  quarterNum: number;
  dateRange: string;
  dueDate: string;
  taxYear: number;
}

export const QuarterInfo = ({ quarterNum, dateRange, dueDate, taxYear }: QuarterInfoProps) => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <CalendarClock className="h-5 w-5 text-blue-500" />
      <div>
        <h3 className="text-lg font-medium">Q{quarterNum} ({dateRange})</h3>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          <p className="text-sm text-red-600 font-medium">Payment Due: {dueDate}</p>
          {quarterNum === 4 && (
            <p className="text-sm text-gray-500">
              (for {taxYear} taxes)
            </p>
          )}
        </div>
      </div>
    </div>
  );
};