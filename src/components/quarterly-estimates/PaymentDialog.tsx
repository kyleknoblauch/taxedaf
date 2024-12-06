import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

interface PaymentDialogProps {
  federalTax: number;
  stateTax: number;
  selfEmploymentTax: number;
}

export const PaymentDialog = ({ federalTax, stateTax, selfEmploymentTax }: PaymentDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
          Payment Instructions
          <ExternalLink className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tax Payment Instructions</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Federal Tax ({formatCurrency(federalTax)})</h3>
            <p className="text-sm text-gray-600">
              Pay through IRS Direct Pay or EFTPS:
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-600 mt-1">
              <li><a href="https://www.irs.gov/payments/direct-pay" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">IRS Direct Pay</a> - No registration required</li>
              <li><a href="https://www.eftps.gov/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">EFTPS</a> - Registration required but recommended for regular payments</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">State Tax ({formatCurrency(stateTax)})</h3>
            <p className="text-sm text-gray-600">
              Visit your state's Department of Revenue website to make payments. Most states offer online payment portals.
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Find your state's tax portal at{" "}
              <a 
                href="https://www.taxadmin.org/state-tax-agencies" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                State Tax Agencies Directory
              </a>
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Self-Employment Tax ({formatCurrency(selfEmploymentTax)})</h3>
            <p className="text-sm text-gray-600">
              Self-employment tax is paid along with your federal taxes through the same IRS payment systems.
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Learn more about self-employment tax at{" "}
              <a 
                href="https://www.irs.gov/businesses/small-businesses-self-employed/self-employment-tax-social-security-and-medicare-taxes"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                IRS Self-Employment Tax Guide
              </a>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};