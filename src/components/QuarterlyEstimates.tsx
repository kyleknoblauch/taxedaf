import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthProvider";
import { formatCurrency } from "@/utils/taxCalculations";
import { CalendarClock, CheckCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

export const QuarterlyEstimates = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: estimates } = useQuery({
    queryKey: ["quarterly-estimates", user?.id],
    queryFn: async () => {
      console.log('Fetching quarterly estimates for user:', user?.id);
      const { data, error } = await supabase
        .from("quarterly_estimates")
        .select("*")
        .eq("user_id", user?.id)
        .order("quarter", { ascending: false });

      if (error) {
        console.error('Error fetching quarterly estimates:', error);
        throw error;
      }
      console.log('Quarterly estimates data:', data);
      return data;
    },
    enabled: !!user,
  });

  // Set up real-time subscription
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

  const markAsPaidMutation = useMutation({
    mutationFn: async ({ quarter }: { quarter: string }) => {
      const { error } = await supabase
        .from("quarterly_estimates")
        .update({ paid_at: new Date().toISOString() })
        .eq("user_id", user?.id)
        .eq("quarter", quarter);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quarterly-estimates"] });
      toast({
        title: "Success",
        description: "Payment status updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update payment status",
        variant: "destructive",
      });
    },
  });

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

  const getPaymentLink = (quarterNum: number, year: number) => {
    return `https://www.irs.gov/payments/direct-pay`;
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
      <div className="space-y-8">
        {estimates.map((quarter) => {
          const { quarterNum, dateRange, dueDate, taxYear } = getQuarterInfo(quarter.quarter);
          const isPaid = !!quarter.paid_at;
          const paymentLink = getPaymentLink(quarterNum, taxYear);

          return (
            <div key={quarter.quarter} className="border-b pb-6 last:border-b-0">
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

              <div className="mt-4 flex flex-wrap items-center gap-3">
                {isPaid ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">
                      Paid on {new Date(quarter.paid_at).toLocaleDateString()}
                    </span>
                  </div>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => markAsPaidMutation.mutate({ quarter: quarter.quarter })}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Mark as Paid
                    </Button>
                    <a
                      href={paymentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                    >
                      Make Payment
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};