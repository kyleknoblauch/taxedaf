export interface TaxCalculation {
  id: string;
  user_id: string;
  income: number | null;
  federal_tax: number | null;
  state_tax: number | null;
  self_employment_tax: number | null;
  notes: string | null;
  created_at: string | null;
  invoice_name: string | null;
  archived: boolean;
  archived_at: string | null;
  quarter_id: string | null;
}

export interface Expense {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  category: string;
  created_at: string | null;
  notes: string | null;
  archived: boolean;
  archived_at: string | null;
  quarter_id: string | null;
}