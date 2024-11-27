import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { TaxBreakdown } from "./TaxBreakdown";
import { calculateFederalTax, calculateStateTax, calculateSelfEmploymentTax } from "../utils/taxCalculations";
import { stateTaxData } from "../data/stateTaxRates";

export const TaxCalculator = () => {
  const [income, setIncome] = useState<number>(0);
  const [selectedState, setSelectedState] = useState<string>("CA");
  const [filingStatus, setFilingStatus] = useState<"single" | "joint">("single");

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setIncome(Number(value));
  };

  const federalTax = calculateFederalTax(income, filingStatus);
  const stateTax = calculateStateTax(income, selectedState);
  const selfEmploymentTax = calculateSelfEmploymentTax(income);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Freelancer Tax Calculator
        </h2>
        
        <div className="space-y-6">
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

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Filing Status
            </label>
            <RadioGroup
              value={filingStatus}
              onValueChange={(value: "single" | "joint") => setFilingStatus(value)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="single" id="single" />
                <Label htmlFor="single">Single</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="joint" id="joint" />
                <Label htmlFor="joint">Married Filing Jointly</Label>
              </div>
            </RadioGroup>
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