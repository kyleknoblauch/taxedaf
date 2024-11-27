import { federalTaxBrackets2024, selfEmploymentTaxRate, socialSecurityWageBase2024 } from "../data/taxBrackets";
import { stateTaxData } from "../data/stateTaxRates";

export const calculateSelfEmploymentTax = (income: number): number => {
  // 92.35% of income is subject to SE tax
  const taxableIncome = income * 0.9235;
  
  // Calculate Social Security portion (12.4%)
  const socialSecurityIncome = Math.min(taxableIncome, socialSecurityWageBase2024);
  const socialSecurityTax = socialSecurityIncome * 0.124;
  
  // Calculate Medicare portion (2.9%)
  const medicareTax = taxableIncome * 0.029;
  
  // Total SE tax
  return socialSecurityTax + medicareTax;
};

export const calculateAdjustedIncome = (income: number): number => {
  const selfEmploymentTax = calculateSelfEmploymentTax(income);
  // You can deduct 50% of SE tax from income before calculating other taxes
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