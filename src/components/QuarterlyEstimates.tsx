import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthProvider";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { QuarterInfo } from "./quarterly-estimates/QuarterInfo";
import { QuarterlyAmounts } from "./quarterly-estimates/QuarterlyAmounts";
import { PaymentDialog } from "./quarterly-estimates/PaymentDialog";
import { Archive, CheckCircle } from "lucide-react";
import { useArchiveMutation } from "./quarterly-estimates/mutations/useArchiveMutation";
import { useTogglePaidMutation } from "./quarterly-estimates/mutations/useTogglePaidMutation";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

export const QuarterlyEstimates = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: estimates } = useQuery({
    queryKey: ["quarterly-estimates", user?.id],
    queryFn: async () => {
      console.log('Fetching quarterly estimates for user:', user?.id);
      const startTime = performance.now();
      
      const { data, error } = await supabase
        .from("quarterly_estimates")
        .select("*")
        .eq("user_id", user?.id)
        .eq("archived", false)  // Only fetch non-archived quarters
        .order("quarter", { ascending: false });

      if (error) {
        console.error('Error fetching quarterly estimates:', error);
        throw error;
      }

      const endTime = performance.now();
      console.log(`Quarterly estimates fetch took ${endTime - startTime}ms`);
      console.log('Quarterly estimates data:', data);
      
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('quarterly-estimates-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quarterly_estimates',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["quarterly-estimates"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  const togglePaidMutation = useTogglePaidMutation(user?.id);
  const archiveMutation = useArchiveMutation(user?.id);

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

  if (!estimates?.length) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500">No quarterly estimates available yet.</p>
      </Card>
    );
  }

  const handleArchive = async (quarter: string) => {
    await archiveMutation.mutateAsync({ quarter });
    toast({
      title: "Quarter Archived",
      description: "The quarter has been moved to archived quarters.",
    });
  };

  return (
    <Card className="p-6">
      <div className="space-y-8">
        {estimates.map((quarter) => {
          const { quarterNum, dateRange, dueDate, taxYear } = getQuarterInfo(quarter.quarter);
          const isPaid = !!quarter.paid_at;

          return (
            <div key={quarter.quarter} className="border-b pb-6 last:border-b-0">
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
                  onClick={() => togglePaidMutation.mutate({ 
                    quarter: quarter.quarter,
                    currentPaidStatus: quarter.paid_at
                  })}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  {isPaid ? "Paid" : "Mark as Paid"}
                </Button>

                {isPaid && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleArchive(quarter.quarter)}
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
        })}
      </div>
    </Card>
  );
};