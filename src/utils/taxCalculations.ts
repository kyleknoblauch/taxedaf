import { federalTaxBrackets2024, selfEmploymentTaxRate, socialSecurityWageBase2024 } from "../data/taxBrackets";
import { stateTaxData } from "../data/stateTaxRates";

export const calculateSelfEmploymentTax = (income: number): number => {
  const socialSecurityTax = Math.min(income, socialSecurityWageBase2024) * 0.124;
  const medicareTax = income * 0.029;
  return socialSecurityTax + medicareTax;
};

export const calculateAdjustedIncome = (income: number): number => {
  const selfEmploymentTax = calculateSelfEmploymentTax(income);
  // Deduct 50% of SE tax from income before other tax calculations
  return income - (selfEmploymentTax * 0.5);
};

export const calculateFederalTax = (income: number, filingStatus: "single" | "joint"): number => {
  // Use adjusted income (after SE tax deduction) for federal tax calculation
  const adjustedIncome = calculateAdjustedIncome(income);
  const brackets = filingStatus === "single" ? federalTaxBrackets2024.single : federalTaxBrackets2024.joint;
  let tax = 0;
  let remainingIncome = adjustedIncome;
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

export const calculateStateTax = (
  income: number, 
  stateCode: string, 
  filingStatus: "single" | "joint" | "hoh" = "single",
  annualIncome?: string
): number => {
  // Use adjusted income (after SE tax deduction) for state tax calculation
  const adjustedIncome = calculateAdjustedIncome(income);
  const state = stateTaxData[stateCode];
  if (!state || !state.hasIncomeTax) return 0;
  
  if (state.brackets) {
    const brackets = state.brackets[filingStatus];
    
    if (annualIncome) {
      const annualMax = Number(annualIncome);
      const bracket = brackets.find(b => b.max >= annualMax) || brackets[brackets.length - 1];
      return adjustedIncome * bracket.rate;
    }
    
    let tax = 0;
    let remainingIncome = adjustedIncome;
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
  
  return adjustedIncome * state.maxRate;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};