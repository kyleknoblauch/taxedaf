import { TaxCalculation, Expense } from './database';

export interface QuarterlyEstimate {
  user_id: string;
  quarter: string;
  total_income: number | null;
  total_expenses: number | null;
  total_federal_tax: number | null;
  total_state_tax: number | null;
  total_self_employment_tax: number | null;
  total_tax: number | null;
  paid_at: string | null;
  archived: boolean;
  archived_at: string | null;
  can_unarchive: boolean;
  archive_expires_at: string | null;
  manual_unarchive_count: number;
  taxCalculations: TaxCalculation[];
  expenses: Expense[];
}