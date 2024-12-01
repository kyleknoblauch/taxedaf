import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface SaveEstimateButtonProps {
  income: number;
  federalTax: number;
  stateTax: number;
  selfEmploymentTax: number;
  notes?: string;
  invoiceName?: string;
  disabled?: boolean;
}

export const SaveEstimateButton = ({
  income,
  federalTax,
  stateTax,
  selfEmploymentTax,
  notes,
  invoiceName,
  disabled
}: SaveEstimateButtonProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save your tax estimates",
      });
      navigate("/login");
      return;
    }

    try {
      const { error } = await supabase
        .from("tax_calculations")
        .insert({
          income,
          federal_tax: federalTax,
          state_tax: stateTax,
          self_employment_tax: selfEmploymentTax,
          notes,
          invoice_name: invoiceName || "Untitled Invoice",
          created_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your tax estimate has been saved",
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save tax estimate. Please try again.",
      });
    }
  };

  return (
    <Button onClick={handleSave} disabled={disabled}>
      Save Estimate
    </Button>
  );
};