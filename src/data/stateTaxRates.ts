export interface StateTaxInfo {
  name: string;
  maxRate: number;
  hasIncomeTax: boolean;
  brackets?: {
    single: Array<{ max: number; rate: number }>;
    joint: Array<{ max: number; rate: number }>;
    hoh: Array<{ max: number; rate: number }>;
  };
}

export const stateTaxData: { [key: string]: StateTaxInfo } = {
  CA: {
    name: "California",
    maxRate: 0.133,
    hasIncomeTax: true,
    brackets: {
      single: [
        { max: 10738, rate: 0.01 },
        { max: 25563, rate: 0.02 },
        { max: 40391, rate: 0.04 },
        { max: 63245, rate: 0.06 },
        { max: 85496, rate: 0.08 },
        { max: 437700, rate: 0.093 },
        { max: 525300, rate: 0.103 },
        { max: 1000000, rate: 0.113 },
        { max: 5000000, rate: 0.123 },
        { max: Infinity, rate: 0.133 }
      ],
      joint: [
        { max: 21476, rate: 0.01 },
        { max: 51126, rate: 0.02 },
        { max: 80782, rate: 0.04 },
        { max: 126490, rate: 0.06 },
        { max: 170992, rate: 0.08 },
        { max: 875400, rate: 0.093 },
        { max: 1050600, rate: 0.103 },
        { max: 2000000, rate: 0.113 },
        { max: 5000000, rate: 0.123 },
        { max: Infinity, rate: 0.133 }
      ],
      hoh: [
        { max: 21476, rate: 0.01 },
        { max: 43051, rate: 0.02 },
        { max: 66336, rate: 0.04 },
        { max: 93859, rate: 0.06 },
        { max: 120668, rate: 0.08 },
        { max: 701250, rate: 0.093 },
        { max: 850600, rate: 0.103 },
        { max: 1000000, rate: 0.113 },
        { max: 5000000, rate: 0.123 },
        { max: Infinity, rate: 0.133 }
      ]
    }
  },
  AL: { name: "Alabama", maxRate: 0.05, hasIncomeTax: true },
  AK: { name: "Alaska", maxRate: 0, hasIncomeTax: false },
  AZ: { name: "Arizona", maxRate: 0.0259, hasIncomeTax: true }, // Updated for 2024
  AR: { name: "Arkansas", maxRate: 0.049, hasIncomeTax: true }, // Updated for 2024
  CO: { name: "Colorado", maxRate: 0.0440, hasIncomeTax: true }, // Updated for 2024
  CT: { name: "Connecticut", maxRate: 0.0699, hasIncomeTax: true },
  DE: { name: "Delaware", maxRate: 0.066, hasIncomeTax: true },
  FL: { name: "Florida", maxRate: 0, hasIncomeTax: false },
  GA: { name: "Georgia", maxRate: 0.0575, hasIncomeTax: true }, // Updated for 2024
  HI: { name: "Hawaii", maxRate: 0.11, hasIncomeTax: true },
  ID: { name: "Idaho", maxRate: 0.059, hasIncomeTax: true }, // Updated for 2024
  IL: { name: "Illinois", maxRate: 0.0495, hasIncomeTax: true },
  IN: { name: "Indiana", maxRate: 0.0315, hasIncomeTax: true }, // Updated for 2024
  IA: { name: "Iowa", maxRate: 0.0600, hasIncomeTax: true }, // Updated for 2024
  KS: { name: "Kansas", maxRate: 0.0570, hasIncomeTax: true },
  KY: { name: "Kentucky", maxRate: 0.0450, hasIncomeTax: true }, // Updated for 2024
  LA: { name: "Louisiana", maxRate: 0.0425, hasIncomeTax: true }, // Updated for 2024
  ME: { name: "Maine", maxRate: 0.0715, hasIncomeTax: true }, // Updated for 2024
  MD: { name: "Maryland", maxRate: 0.0575, hasIncomeTax: true },
  MA: { name: "Massachusetts", maxRate: 0.05, hasIncomeTax: true },
  MI: { name: "Michigan", maxRate: 0.0405, hasIncomeTax: true }, // Updated for 2024
  MN: { name: "Minnesota", maxRate: 0.0985, hasIncomeTax: true }, // Updated for 2024
  MS: { name: "Mississippi", maxRate: 0.05, hasIncomeTax: true },
  MO: { name: "Missouri", maxRate: 0.0495, hasIncomeTax: true }, // Updated for 2024
  MT: { name: "Montana", maxRate: 0.0675, hasIncomeTax: true }, // Fixed from incorrect 0.69
  NE: { name: "Nebraska", maxRate: 0.0664, hasIncomeTax: true }, // Updated for 2024
  NV: { name: "Nevada", maxRate: 0, hasIncomeTax: false },
  NH: { name: "New Hampshire", maxRate: 0, hasIncomeTax: false },
  NJ: { name: "New Jersey", maxRate: 0.1075, hasIncomeTax: true },
  NM: { name: "New Mexico", maxRate: 0.059, hasIncomeTax: true }, // Updated for 2024
  NY: { name: "New York", maxRate: 0.109, hasIncomeTax: true }, // Updated for 2024
  NC: { name: "North Carolina", maxRate: 0.0475, hasIncomeTax: true }, // Updated for 2024
  ND: { name: "North Dakota", maxRate: 0.0290, hasIncomeTax: true }, // Updated for 2024
  OH: { name: "Ohio", maxRate: 0.0399, hasIncomeTax: true }, // Updated for 2024
  OK: { name: "Oklahoma", maxRate: 0.0475, hasIncomeTax: true }, // Updated for 2024
  OR: { name: "Oregon", maxRate: 0.099, hasIncomeTax: true },
  PA: { name: "Pennsylvania", maxRate: 0.0307, hasIncomeTax: true },
  RI: { name: "Rhode Island", maxRate: 0.0599, hasIncomeTax: true }, // Updated for 2024
  SC: { name: "South Carolina", maxRate: 0.0700, hasIncomeTax: true },
  SD: { name: "South Dakota", maxRate: 0, hasIncomeTax: false },
  TN: { name: "Tennessee", maxRate: 0, hasIncomeTax: false },
  TX: { name: "Texas", maxRate: 0, hasIncomeTax: false },
  UT: { name: "Utah", maxRate: 0.0485, hasIncomeTax: true }, // Updated for 2024
  VT: { name: "Vermont", maxRate: 0.0875, hasIncomeTax: true },
  VA: { name: "Virginia", maxRate: 0.0575, hasIncomeTax: true },
  WA: { name: "Washington", maxRate: 0, hasIncomeTax: false },
  WV: { name: "West Virginia", maxRate: 0.065, hasIncomeTax: true },
  WI: { name: "Wisconsin", maxRate: 0.0765, hasIncomeTax: true }, // Updated for 2024
  WY: { name: "Wyoming", maxRate: 0, hasIncomeTax: false }
};
