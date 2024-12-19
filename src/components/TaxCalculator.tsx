import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { TaxBreakdown } from "./TaxBreakdown";
import { calculateFederalTax, calculateStateTax, calculateSelfEmploymentTax } from "../utils/taxCalculations";
import { useGeolocation } from "../hooks/useGeolocation";
import { IncomeInputForm } from "./tax-calculator/IncomeInputForm";
import { federalTaxBrackets2024 } from "../data/taxBrackets";
import { useAuth } from "./AuthProvider";
import { trackEstimateAbandonment } from "@/utils/omnisendEvents";

export const TaxCalculator = () => {
  const [income, setIncome] = useState<number>(0);
  const { selectedState, setSelectedState } = useGeolocation();
  const [filingStatus, setFilingStatus] = useState<"single" | "joint">("single");
  const [annualIncome, setAnnualIncome] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [invoiceName, setInvoiceName] = useState<string>("");
  const { user } = useAuth();

  useEffect(() => {
    const handleBeforeUnload = async (e: BeforeUnloadEvent) => {
      if (income > 0 && user?.email) {
        await trackEstimateAbandonment(user.email, income);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [income, user?.email]);

  const getEffectiveRate = (selectedAnnualIncome: string) => {
    const annualMax = Number(selectedAnnualIncome);
    const brackets = filingStatus === "single" 
      ? federalTaxBrackets2024.single 
      : federalTaxBrackets2024.joint;
    const bracket = brackets.find(b => b.max >= annualMax) || brackets[brackets.length - 1];
    return bracket.rate;
  };

  const federalTax = annualIncome 
    ? income * getEffectiveRate(annualIncome)
    : calculateFederalTax(income, filingStatus);
  const stateTax = calculateStateTax(income, selectedState, filingStatus, annualIncome);
  const selfEmploymentTax = calculateSelfEmploymentTax(income);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Income Reality Check
          </h2>
        </div>
        
        <IncomeInputForm
          income={income}
          setIncome={setIncome}
          selectedState={selectedState}
          setSelectedState={setSelectedState}
          filingStatus={filingStatus}
          setFilingStatus={setFilingStatus}
          annualIncome={annualIncome}
          setAnnualIncome={setAnnualIncome}
          notes={notes}
          setNotes={setNotes}
          invoiceName={invoiceName}
          setInvoiceName={setInvoiceName}
        />
      </Card>

      {income > 0 && (
        <>
          <TaxBreakdown
            income={income}
            federalTax={federalTax}
            stateTax={stateTax}
            selfEmploymentTax={selfEmploymentTax}
            invoiceName={invoiceName}
            notes={notes}
          />
          <div className="space-y-2">
            <p className="text-sm text-gray-500 text-center">
              * This is an approximate estimate for what you may owe in tax based on 2024 data. Consider setting aside this amount now to ensure you have funds available when taxes are due. Please consult with a tax professional for precise calculations.
            </p>
          </div>
        </>
      )}
    </div>
  );
};
