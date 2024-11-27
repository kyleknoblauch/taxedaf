import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaxBreakdown } from "./TaxBreakdown";
import { calculateFederalTax, calculateStateTax, calculateSelfEmploymentTax } from "../utils/taxCalculations";
import { stateTaxData } from "../data/stateTaxRates";

export const TaxCalculator = () => {
  const [income, setIncome] = useState<number>(0);
  const [selectedState, setSelectedState] = useState<string>("CA");

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setIncome(Number(value));
  };

  const federalTax = calculateFederalTax(income);
  const stateTax = calculateStateTax(income, selectedState);
  const selfEmploymentTax = calculateSelfEmploymentTax(income);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Freelancer Tax Calculator
        </h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="income" className="block text-sm font-medium text-gray-700 mb-1">
              Income by Invoice
            </label>
            <Input
              id="income"
              type="text"
              value={income === 0 ? "" : income.toString()}
              onChange={handleIncomeChange}
              placeholder="Enter your invoice amount"
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
              State
            </label>
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your state" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(stateTaxData).map(([code, data]) => (
                  <SelectItem key={code} value={code}>
                    {data.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {income > 0 && (
        <TaxBreakdown
          income={income}
          federalTax={federalTax}
          stateTax={stateTax}
          selfEmploymentTax={selfEmploymentTax}
        />
      )}
    </div>
  );
};