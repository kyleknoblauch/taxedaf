import { federalTaxBrackets2024, selfEmploymentTaxRate, socialSecurityWageBase2024 } from "../data/taxBrackets";
import { stateTaxData } from "../data/stateTaxRates";

export const calculateFederalTax = (income: number, filingStatus: "single" | "joint"): number => {
  const brackets = filingStatus === "single" ? federalTaxBrackets2024.single : federalTaxBrackets2024.joint;
  let tax = 0;
  let remainingIncome = income;
  let previousMax = 0;

  for (const bracket of brackets) {
    const taxableInThisBracket = Math.min(remainingIncome, bracket.max - previousMax);
    tax += taxableInThisBracket * bracket.rate;
    remainingIncome -= taxableInThisBracket;
    previousMax = bracket.max;
    if (remainingIncome <= 0) break;
  }

  return tax;
};

export const calculateSelfEmploymentTax = (income: number): number => {
  const socialSecurityTax = Math.min(income, socialSecurityWageBase2024) * 0.124;
  const medicareTax = income * 0.029;
  return socialSecurityTax + medicareTax;
};

export const calculateStateTax = (
  income: number, 
  stateCode: string, 
  filingStatus: "single" | "joint" | "hoh" = "single",
  annualIncome?: string
): number => {
  const state = stateTaxData[stateCode];
  if (!state || !state.hasIncomeTax) return 0;
  
  if (state.brackets) {
    const brackets = state.brackets[filingStatus];
    
    // If annual income is provided, use it to determine the effective rate
    if (annualIncome) {
      const annualMax = Number(annualIncome);
      const bracket = brackets.find(b => b.max >= annualMax) || brackets[brackets.length - 1];
      return income * bracket.rate;
    }
    
    // Otherwise use progressive calculation
    let tax = 0;
    let remainingIncome = income;
    let previousMax = 0;

    for (const bracket of brackets) {
      const taxableInThisBracket = Math.min(remainingIncome, bracket.max - previousMax);
      tax += taxableInThisBracket * bracket.rate;
      remainingIncome -= taxableInThisBracket;
      previousMax = bracket.max;
      if (remainingIncome <= 0) break;
    }
    return tax;
  }
  
  // Fallback to flat rate for states without defined brackets
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
