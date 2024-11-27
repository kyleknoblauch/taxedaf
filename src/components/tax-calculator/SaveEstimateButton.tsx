import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

interface SaveEstimateButtonProps {
  income: number;
  federalTax: number;
  stateTax: number;
  selfEmploymentTax: number;
  notes: string;
  disabled: boolean;
}

export const SaveEstimateButton = ({
  income,
  federalTax,
  stateTax,
  selfEmploymentTax,
  notes,
  disabled
}: SaveEstimateButtonProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSaveCalculation = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please log in to save estimates",
        variant: "destructive",
      });
      return;
    }

    if (income === 0) {
      toast({
        title: "Error",
        description: "Please enter an income amount first",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("tax_calculations")
        .insert({
          user_id: user.id,
          income,
          federal_tax: federalTax,
          state_tax: stateTax,
          self_employment_tax: selfEmploymentTax,
          notes,
          created_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Calculation saved successfully",
      });
      
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save calculation",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      onClick={handleSaveCalculation}
      disabled={disabled}
    >
      Save Estimate
    </Button>
  );
};