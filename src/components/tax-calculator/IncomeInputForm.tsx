import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { federalTaxBrackets2024 } from "../../data/taxBrackets";
import { stateTaxData } from "../../data/stateTaxRates";

interface IncomeInputFormProps {
  income: number;
  setIncome: (income: number) => void;
  selectedState: string;
  setSelectedState: (state: string) => void;
  filingStatus: "single" | "joint";
  setFilingStatus: (status: "single" | "joint") => void;
  annualIncome: string;
  setAnnualIncome: (income: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
  invoiceName: string;
  setInvoiceName: (name: string) => void;
}

export const IncomeInputForm = ({
  income,
  setIncome,
  selectedState,
  setSelectedState,
  filingStatus,
  setFilingStatus,
  annualIncome,
  setAnnualIncome,
  notes,
  setNotes,
  invoiceName,
  setInvoiceName,
}: IncomeInputFormProps) => {
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

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="invoiceName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Name of Invoice
        </label>
        <Input
          id="invoiceName"
          type="text"
          value={invoiceName}
          onChange={(e) => setInvoiceName(e.target.value)}
          placeholder="Enter the name of your invoice"
          className="w-full"
        />
      </div>

      <div>
        <label htmlFor="income" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
        <label htmlFor="annualIncome" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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

      <div>
        <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
  );
};