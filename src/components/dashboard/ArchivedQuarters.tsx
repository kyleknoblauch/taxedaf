import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../AuthProvider";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { QuarterlyAmounts } from "../quarterly-estimates/QuarterlyAmounts";
import { QuarterInfo } from "../quarterly-estimates/QuarterInfo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUnarchiveMutation } from "../quarterly-estimates/mutations/useUnarchiveMutation";
import { QuarterlyEstimate } from "@/types/quarterlyEstimates";
import { ArchivedQuarterDetails } from "../quarterly-estimates/archived/ArchivedQuarterDetails";
import { ArchivedExpenseDetails } from "../quarterly-estimates/archived/ArchivedExpenseDetails";

export const ArchivedQuarters = () => {
  const { user } = useAuth();
  const unarchiveMutation = useUnarchiveMutation(user?.id);

  const { data: archivedQuarters, isLoading } = useQuery({
    queryKey: ["archived-quarters", user?.id],
    queryFn: async () => {
      console.log('Fetching archived quarters for user:', user?.id);
      
      const { data: quarters, error } = await supabase
        .from("quarterly_estimates")
        .select(`
          *,
          taxCalculations:tax_calculations(*),
          expenses:expenses(*)
        `)
        .eq("user_id", user?.id)
        .eq("archived", true)
        .order("quarter", { ascending: false });

      if (error) throw error;
      return quarters as QuarterlyEstimate[];
    },
    enabled: !!user?.id
  });

  const handleUnarchive = async (quarter: string) => {
    await unarchiveMutation.mutateAsync({ quarter });
  };

  if (isLoading) {
    return (
      <Card className="p-6 flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </Card>
    );
  }

  if (!archivedQuarters?.length) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500">No archived quarters found.</p>
      </Card>
    );
  }

  const getQuarterInfo = (date: string) => {
    const quarterDate = new Date(date);
    const month = quarterDate.getMonth();
    const year = quarterDate.getFullYear();
    
    let quarterNum, startMonth, endMonth, dueDate, taxYear;
    if (month >= 0 && month < 3) {
      quarterNum = 4;
      startMonth = "October";
      endMonth = "December";
      dueDate = "January 15";
      taxYear = year - 1;
    } else if (month >= 3 && month < 6) {
      quarterNum = 1;
      startMonth = "January";
      endMonth = "March";
      dueDate = "April 15";
      taxYear = year;
    } else if (month >= 6 && month < 9) {
      quarterNum = 2;
      startMonth = "April";
      endMonth = "June";
      dueDate = "June 15";
      taxYear = year;
    } else {
      quarterNum = 3;
      startMonth = "July";
      endMonth = "September";
      dueDate = "September 15";
      taxYear = year;
    }

    return {
      quarterNum,
      dateRange: `${startMonth} - ${endMonth} ${taxYear}`,
      dueDate: `${dueDate}, ${year}`,
      taxYear,
    };
  };

  return (
    <Card className="p-6">
      <div className="space-y-8">
        {archivedQuarters.map((quarter: QuarterlyEstimate) => {
          const { quarterNum, dateRange, dueDate, taxYear } = getQuarterInfo(quarter.quarter);
          const canUnarchive = quarter.can_unarchive;
          const archiveExpiresAt = quarter.archive_expires_at ? new Date(quarter.archive_expires_at) : null;
          
          return (
            <div key={quarter.quarter} className="border-b pb-6 last:border-b-0">
              <div className="flex items-start justify-between mb-4">
                <QuarterInfo
                  quarterNum={quarterNum}
                  dateRange={dateRange}
                  dueDate={dueDate}
                  taxYear={taxYear}
                />
                <div className="flex flex-col items-end gap-2">
                  <Badge variant="secondary" className="ml-2">
                    Archived {format(new Date(quarter.archived_at || ''), "MMM d, yyyy")}
                  </Badge>
                  {archiveExpiresAt && canUnarchive && (
                    <span className="text-xs text-gray-500">
                      Can unarchive for {formatDistanceToNow(archiveExpiresAt)}
                    </span>
                  )}
                </div>
              </div>

              <QuarterlyAmounts
                totalIncome={quarter.total_income || 0}
                totalExpenses={quarter.total_expenses || 0}
                totalFederalTax={quarter.total_federal_tax || 0}
                totalStateTax={quarter.total_state_tax || 0}
                totalSelfEmploymentTax={quarter.total_self_employment_tax || 0}
                totalTax={quarter.total_tax || 0}
              />

              {canUnarchive && (
                <div className="mt-4">
                  <Button
                    variant="outline"
                    onClick={() => handleUnarchive(quarter.quarter)}
                    disabled={unarchiveMutation.isPending}
                    className="w-full"
                  >
                    {unarchiveMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Unarchiving...
                      </>
                    ) : (
                      'Unarchive Quarter'
                    )}
                  </Button>
                </div>
              )}

              {quarter.taxCalculations?.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Saved Estimates</h4>
                  <div className="space-y-2">
                    {quarter.taxCalculations.map((calc) => (
                      <ArchivedQuarterDetails key={calc.id} calculation={calc} />
                    ))}
                  </div>
                </div>
              )}

              {quarter.expenses?.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Deductions</h4>
                  <div className="space-y-2">
                    {quarter.expenses.map((expense) => (
                      <ArchivedExpenseDetails key={expense.id} expense={expense} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};