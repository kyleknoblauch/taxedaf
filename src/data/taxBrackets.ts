interface TaxBracket {
  max: number;
  rate: number;
}

export const federalTaxBrackets2024 = {
  single: [
    { max: 11600, rate: 0.10 },
    { max: 47700, rate: 0.12 },
    { max: 102750, rate: 0.22 },
    { max: 215950, rate: 0.24 },
    { max: 539900, rate: 0.32 },
    { max: 1000000, rate: 0.35 },
    { max: Infinity, rate: 0.37 }
  ],
  joint: [
    { max: 23200, rate: 0.10 },
    { max: 95400, rate: 0.12 },
    { max: 205500, rate: 0.22 },
    { max: 431900, rate: 0.24 },
    { max: 647850, rate: 0.32 },
    { max: 1000000, rate: 0.35 },
    { max: Infinity, rate: 0.37 }
  ]
};

export const selfEmploymentTaxRate = 0.153; // 15.3% (12.4% Social Security + 2.9% Medicare)
export const socialSecurityWageBase2024 = 168600; // Social Security wage base for 2024