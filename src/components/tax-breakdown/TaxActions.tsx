import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface TaxActionsProps {
  income: number;
  federalTax: number;
  stateTax: number;
  selfEmploymentTax: number;
  invoiceName?: string;
  notes?: string;
}

export const TaxActions = ({
  income,
  federalTax,
  stateTax,
  selfEmploymentTax,
  invoiceName,
  notes,
}: TaxActionsProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSaveEstimate = async () => {
    console.log('TaxActions - handleSaveEstimate called with user:', user?.id);
    console.log('TaxActions - Data to save:', {
      income,
      federalTax,
      stateTax,
      selfEmploymentTax,
      invoiceName,
      notes
    });

    if (!user) {
      console.log('TaxActions - No user found, redirecting to login');
      toast({
        title: "Sign in required",
        description: "Please sign in to save your tax estimates",
      });
      navigate("/login", { state: { 
        returnTo: "/dashboard",
        estimateData: {
          income,
          federalTax,
          stateTax,
          selfEmploymentTax,
          invoiceName,
          notes
        }
      }});
      return;
    }

    try {
      const { data, error } = await supabase
        .from("tax_calculations")
        .insert({
          user_id: user.id,
          income,
          federal_tax: federalTax,
          state_tax: stateTax,
          self_employment_tax: selfEmploymentTax,
          notes,
          invoice_name: invoiceName || "Untitled Invoice",
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      console.log('TaxActions - Estimate saved successfully:', data);
      
      toast({
        title: "Success",
        description: "Your tax estimate has been saved",
      });

      navigate("/dashboard");
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
    <div className="space-y-2">
      <button
        onClick={handleSaveEstimate}
        className="w-full text-sm text-primary hover:text-primary/90 underline text-left mt-2"
      >
        Cut Your Taxes & Deduct Your Business Costs
      </button>
      <div className="flex justify-end">
        <Button onClick={handleSaveEstimate} className="mt-2">
          Save Estimate
        </Button>
      </div>
    </div>
  );
};