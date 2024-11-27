import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthProvider";
import { formatCurrency } from "@/utils/taxCalculations";

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
      <div className="space-y-6">
        {estimates.map((quarter) => (
          <div key={quarter.quarter} className="border-b pb-6 last:border-b-0">
            <h3 className="text-lg font-medium mb-4">
              {new Date(quarter.quarter).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              })}
            </h3>
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
        ))}
      </div>
    </Card>
  );
};