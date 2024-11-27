import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthProvider";
import { formatCurrency } from "@/utils/taxCalculations";

export const SavedEstimates = () => {
  const { user } = useAuth();

  const { data: calculations } = useQuery({
    queryKey: ["tax-calculations", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tax_calculations")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  if (!calculations?.length) {
    return (
      <div className="p-4">
        <p className="text-center text-gray-500">No saved estimates yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {calculations.map((calc) => (
        <Card key={calc.id} className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Income</span>
              <span className="font-medium">{formatCurrency(calc.income)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Federal Tax</span>
              <span className="font-medium text-red-600">{formatCurrency(calc.federal_tax)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">State Tax</span>
              <span className="font-medium text-red-600">{formatCurrency(calc.state_tax)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Self-Employment Tax</span>
              <span className="font-medium text-red-600">{formatCurrency(calc.self_employment_tax)}</span>
            </div>
            {calc.notes && (
              <p className="text-sm text-gray-600 mt-2 pt-2 border-t">{calc.notes}</p>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};