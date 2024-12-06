import { Database } from "@/integrations/supabase/types";

export type QuarterlyEstimate = Database["public"]["Tables"]["quarterly_estimates"]["Row"] & {
  taxCalculations: Array<Database["public"]["Tables"]["tax_calculations"]["Row"]>;
  expenses: Array<Database["public"]["Tables"]["expenses"]["Row"]>;
};