import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { TaxBreakdown } from "./TaxBreakdown";
import { calculateFederalTax, calculateStateTax, calculateSelfEmploymentTax } from "../utils/taxCalculations";
import { stateTaxData } from "../data/stateTaxRates";
import { federalTaxBrackets2024 } from "../data/taxBrackets";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";

export const TaxCalculator = () => {
  const [income, setIncome] = useState<number>(0);
  const [selectedState, setSelectedState] = useState<string>("CA");
  const [filingStatus, setFilingStatus] = useState<"single" | "joint">("single");
  const [annualIncome, setAnnualIncome] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [savedCalculations, setSavedCalculations] = useLocalStorage<Array<any>>("tax-calculations", []);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setIncome(Number(value));
  };

  const brackets = filingStatus === "single" 
    ? federalTaxBrackets2024.single 
    : federalTaxBrackets2024.joint;

  const getBracketLabel = (bracket: { max: number; rate: number }, index: number, brackets: Array<{ max: number; rate: number }>) => {
    const min = index === 0 ? 0 : brackets[index - 1].max + 1;
    const max = bracket.max === Infinity ? "+" : bracket.max;
    return `$${min.toLocaleString()} - $${max.toLocaleString()} (${(bracket.rate * 100).toFixed(1)}%)`;
  };

  const getEffectiveRate = (selectedAnnualIncome: string) => {
    const annualMax = Number(selectedAnnualIncome);
    const bracket = brackets.find(b => b.max >= annualMax) || brackets[brackets.length - 1];
    return bracket.rate;
  };

  const federalTax = annualIncome 
    ? income * getEffectiveRate(annualIncome)
    : calculateFederalTax(income, filingStatus);
  const stateTax = calculateStateTax(income, selectedState);
  const selfEmploymentTax = calculateSelfEmploymentTax(income);

  const handleSaveCalculation = () => {
    if (income === 0) {
      toast({
        title: "Error",
        description: "Please enter an income amount first",
        variant: "destructive",
      });
      return;
    }

    const newCalculation = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      income,
      federalTax,
      stateTax,
      selfEmploymentTax,
      state: selectedState,
      notes,
    };

    setSavedCalculations([...savedCalculations, newCalculation]);
    toast({
      title: "Success",
      description: "Calculation saved successfully",
    });
    setNotes("");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Freelancer Tax Calculator
          </h2>
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
          >
            Saved Invoices
          </Button>
        </div>
        
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

          <div>
            <label htmlFor="annualIncome" className="block text-sm font-medium text-gray-700 mb-1">
              Expected Annual Income Range
            </label>
            <Select value={annualIncome} onValueChange={setAnnualIncome}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your expected annual income range" />
              </SelectTrigger>
              <SelectContent>
                {brackets.map((bracket, index) => (
                  <SelectItem key={index} value={bracket.max.toString()}>
                    {getBracketLabel(bracket, index, brackets)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this invoice..."
              className="w-full"
            />
          </div>
        </div>
      </Card>

      {income > 0 && (
        <>
          <TaxBreakdown
            income={income}
            federalTax={federalTax}
            stateTax={stateTax}
            selfEmploymentTax={selfEmploymentTax}
          />
          <div className="flex justify-end">
            <Button onClick={handleSaveCalculation}>
              Save Calculation
            </Button>
          </div>
        </>
      )}
    </div>
  );
};