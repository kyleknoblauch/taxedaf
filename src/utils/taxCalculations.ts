import { federalTaxBrackets2024, selfEmploymentTaxRate } from "../data/taxBrackets";
import { stateTaxData } from "../data/stateTaxRates";

export const calculateFederalTax = (income: number): number => {
  let tax = 0;
  let remainingIncome = income;
  let previousMax = 0;

  for (const bracket of federalTaxBrackets2024) {
    const taxableInThisBracket = Math.min(remainingIncome, bracket.max - previousMax);
    tax += taxableInThisBracket * bracket.rate;
    remainingIncome -= taxableInThisBracket;
    previousMax = bracket.max;
    if (remainingIncome <= 0) break;
  }

  return tax;
};

export const calculateSelfEmploymentTax = (income: number): number => {
  return income * selfEmploymentTaxRate;
};

export const calculateStateTax = (income: number, stateCode: string): number => {
  const state = stateTaxData[stateCode];
  if (!state || !state.hasIncomeTax) return 0;
  // This is a simplified calculation. In reality, states have their own brackets
  return income * state.maxRate;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};