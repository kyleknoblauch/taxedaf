import { Button } from "@/components/ui/button";
import { Download, Archive, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

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
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from("tax_calculations")
        .insert({
          income,
          federal_tax: federalTax,
          state_tax: stateTax,
          self_employment_tax: selfEmploymentTax,
          invoice_name: invoiceName,
          notes,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["tax-calculations"] });
      queryClient.invalidateQueries({ queryKey: ["quarterly-estimates"] });

      toast({
        title: "Success",
        description: "Tax calculation saved successfully",
      });

      navigate("/dashboard", { state: { fromSaveEstimate: true } });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to save tax calculation",
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