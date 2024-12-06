import { Database } from "@/integrations/supabase/types";

export interface QuarterlyEstimate extends Database["public"]["Tables"]["quarterly_estimates"]["Row"] {
  taxCalculations: Array<Database["public"]["Tables"]["tax_calculations"]["Row"]>;
  expenses: Array<Database["public"]["Tables"]["expenses"]["Row"]>;
  can_unarchive: boolean;
  archive_expires_at: string | null;
  manual_unarchive_count: number;
}