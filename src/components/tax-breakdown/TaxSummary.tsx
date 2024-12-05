import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TaxSummaryProps {
  totalTax: number;
  takeHome: number;
  income: number;
  formatCurrency: (amount: number) => string;
  formatPercentage: (amount: number) => string;
  onDeductionClick: () => void;
  federalTax: number;
  stateTax: number;
  selfEmploymentTax: number;
  invoiceName?: string;
}

export const TaxSummary = ({
  totalTax,
  takeHome,
  income,
  formatCurrency,
  formatPercentage,
  onDeductionClick,
  federalTax,
  stateTax,
  selfEmploymentTax,
  invoiceName = "Untitled Invoice",
}: TaxSummaryProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDeductionClick = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save your tax estimates and manage deductions",
      });
      navigate("/login");
      return;
    }

    try {
      // Save the estimate first
      const { error } = await supabase
        .from("tax_calculations")
        .insert({
          user_id: user.id,
          income,
          federal_tax: federalTax,
          state_tax: stateTax,
          self_employment_tax: selfEmploymentTax,
          invoice_name: invoiceName,
          created_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your tax estimate has been saved",
      });

      // Then navigate to dashboard with the deductions section expanded
      onDeductionClick();
    } catch (error: any) {
      console.error('Error saving estimate:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save tax estimate",
      });
    }
  };

  return (
    <div className="pt-4 border-t space-y-4">
      <div className="flex justify-between mb-2">
        <span className="font-medium">Total Tax</span>
        <div className="flex gap-2">
          <span className="font-semibold text-red-500">{formatCurrency(totalTax)}</span>
          <span className="text-gray-500">({formatPercentage(totalTax)})</span>
        </div>
      </div>
      <div className="flex justify-between">
        <span className="font-medium">Take Home</span>
        <div className="flex gap-2">
          <span className="font-semibold text-green-500">{formatCurrency(takeHome)}</span>
          <span className="text-gray-500">({formatPercentage(takeHome)})</span>
        </div>
      </div>
      <button
        onClick={handleDeductionClick}
        className="w-full text-sm text-primary hover:text-primary/90 underline text-left mt-2"
      >
        Cut Your Taxes & Deduct Your Business Costs
      </button>
    </div>
  );
};