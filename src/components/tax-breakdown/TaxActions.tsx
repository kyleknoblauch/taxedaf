import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { trackEstimateSaved } from "@/utils/omnisendEvents";

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
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save estimates",
        variant: "destructive",
      });
      return;
    }

    if (isSaving) return;

    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from("tax_calculations")
        .insert({
          user_id: user.id,
          income,
          federal_tax: federalTax,
          state_tax: stateTax,
          self_employment_tax: selfEmploymentTax,
          invoice_name: invoiceName || 'Untitled Invoice',
          notes,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving estimate:', error);
        throw error;
      }

      // Track the successful save
      if (user.email) {
        await trackEstimateSaved(
          user.email,
          income,
          federalTax,
          stateTax,
          selfEmploymentTax
        );
      }

      // Invalidate relevant queries
      await queryClient.invalidateQueries({ queryKey: ["tax-calculations", user.id] });
      await queryClient.invalidateQueries({ queryKey: ["quarterly-estimates", user.id] });

      toast({
        title: "Success",
        description: "Tax calculation saved successfully",
      });

      navigate("/dashboard", { state: { fromSaveEstimate: true } });
    } catch (error: any) {
      console.error('Failed to save estimate:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save tax calculation",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Button
        onClick={handleSave}
        className="flex-1"
        disabled={isSaving}
      >
        {isSaving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Download className="mr-2 h-4 w-4" />
            Save Estimate
          </>
        )}
      </Button>
    </div>
  );
};
