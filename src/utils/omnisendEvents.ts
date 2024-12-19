import { trackOmnisendEvent } from './omnisendUtils';

export const trackEstimateAbandonment = async (email: string, income: number) => {
  await trackOmnisendEvent(
    'Estimate Abandoned',
    { email },
    { income }
  );
};

export const trackEstimateSaved = async (email: string, income: number, federalTax: number, stateTax: number, selfEmploymentTax: number) => {
  await trackOmnisendEvent(
    'Estimate Saved',
    { email },
    { income, federalTax, stateTax, selfEmploymentTax }
  );
};

export const trackTrialExtension = async (email: string) => {
  await trackOmnisendEvent(
    'Trial Extended',
    { email }
  );
};

export const trackCheckoutAbandoned = async (email: string, type: 'lifetime' | 'quarterly') => {
  await trackOmnisendEvent(
    'Checkout Abandoned',
    { email },
    { plan_type: type }
  );
};

export const trackPurchaseCompleted = async (email: string, type: 'lifetime' | 'quarterly', amount: number) => {
  await trackOmnisendEvent(
    'Purchase Completed',
    { email },
    { plan_type: type, amount }
  );
};

export const trackTaxSummaryDownload = async (email: string, totalIncome: number, totalDeductions: number) => {
  await trackOmnisendEvent(
    'Tax Summary Downloaded',
    { email },
    { totalIncome, totalDeductions }
  );
};

export const trackDeductionAdded = async (email: string, amount: number, category: string) => {
  await trackOmnisendEvent(
    'Deduction Added',
    { email },
    { amount, category }
  );
};

export const trackDealsDirectoryOpened = async (email: string) => {
  await trackOmnisendEvent(
    'Deals Directory Opened',
    { email }
  );
};

export const trackQuarterlyInvoicePaid = async (email: string, quarter: string, amount: number) => {
  await trackOmnisendEvent(
    'Quarterly Invoice Marked Paid',
    { email },
    { quarter, amount }
  );
};

export const trackQuarterlyEstimateArchived = async (email: string, quarter: string) => {
  await trackOmnisendEvent(
    'Quarterly Estimate Archived',
    { email },
    { quarter }
  );
};