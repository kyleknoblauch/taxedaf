import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthProvider";
import { formatCurrency } from "@/utils/taxCalculations";
import { CalendarClock } from "lucide-react";

export const QuarterlyEstimates = () => {
  const { user } = useAuth();

  const { data: estimates } = useQuery({
    queryKey: ["quarterly-estimates", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quarterly_estimates")
        .select("*")
        .eq("user_id", user?.id)
        .order("quarter", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const getQuarterInfo = (date: string) => {
    const quarterDate = new Date(date);
    const month = quarterDate.getMonth();
    const year = quarterDate.getFullYear();
    
    // Determine quarter number and date range
    let quarterNum, startMonth, endMonth, dueDate;
    if (month >= 0 && month < 3) {
      quarterNum = 4;
      startMonth = "October";
      endMonth = "December";
      dueDate = "January 15";
    } else if (month >= 3 && month < 6) {
      quarterNum = 1;
      startMonth = "January";
      endMonth = "March";
      dueDate = "April 15";
    } else if (month >= 6 && month < 9) {
      quarterNum = 2;
      startMonth = "April";
      endMonth = "June";
      dueDate = "June 15";
    } else {
      quarterNum = 3;
      startMonth = "July";
      endMonth = "September";
      dueDate = "September 15";
    }

    return {
      quarterNum,
      dateRange: `${startMonth} - ${endMonth} ${year}`,
      dueDate: `${dueDate}, ${year}`,
    };
  };

  if (!estimates?.length) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500">No quarterly estimates available yet.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Quarterly Estimates</h2>
      <div className="space-y-8">
        {estimates.map((quarter) => {
          const { quarterNum, dateRange, dueDate } = getQuarterInfo(quarter.quarter);
          return (
            <div key={quarter.quarter} className="border-b pb-6 last:border-b-0">
              <div className="flex items-center gap-2 mb-4">
                <CalendarClock className="h-5 w-5 text-blue-500" />
                <div>
                  <h3 className="text-lg font-medium">Q{quarterNum} ({dateRange})</h3>
                  <p className="text-sm text-red-600 font-medium">Payment Due: {dueDate}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total Income</p>
                  <p className="text-lg font-medium">{formatCurrency(quarter.total_income)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Expenses</p>
                  <p className="text-lg font-medium">{formatCurrency(quarter.total_expenses)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Federal Tax</p>
                  <p className="text-lg font-medium text-red-600">{formatCurrency(quarter.total_federal_tax)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">State Tax</p>
                  <p className="text-lg font-medium text-red-600">{formatCurrency(quarter.total_state_tax)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Self-Employment Tax</p>
                  <p className="text-lg font-medium text-red-600">{formatCurrency(quarter.total_self_employment_tax)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Tax Due</p>
                  <p className="text-lg font-medium text-red-600">{formatCurrency(quarter.total_tax)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};