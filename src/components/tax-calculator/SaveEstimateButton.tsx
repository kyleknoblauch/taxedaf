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
      console.log('Attempting to save estimate with user_id:', user.id);
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

      if (error) {
        console.error('Error saving estimate:', error);
        throw error;
      }

      console.log('Estimate saved successfully:', data);

      toast({
        title: "Success",
        description: "Your tax estimate has been saved",
      });

      navigate("/dashboard");
    } catch (error: any) {
      console.error('Detailed error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save tax estimate. Please try again.",
      });
    }
  };

  return (
    <Button onClick={handleSave} disabled={disabled}>
      Save Estimate
    </Button>
  );
};