import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export const TaxInformation = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Federal Taxes</h3>
        <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-600">
          <li><span className="font-medium">Social Security & Medicare:</span> A portion of your paycheck goes to these programs to support retirement benefits and healthcare for seniors and individuals with disabilities.</li>
          <li><span className="font-medium">Defense:</span> Funds are allocated for national security, including military operations and preparedness.</li>
          <li><span className="font-medium">Infrastructure:</span> Maintaining and improving roads, bridges, and public transit systems across the country.</li>
          <li><span className="font-medium">Education & Research:</span> Supporting schools, universities, and innovation to advance knowledge and competitiveness.</li>
          <li><span className="font-medium">Law Enforcement & Courts:</span> Funding federal law enforcement, prisons, and the judiciary system.</li>
          <li><span className="font-medium">Debt Interest:</span> Paying interest on the national debt accumulated by previous spending.</li>
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">State Taxes</h3>
        <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-600">
          <li><span className="font-medium">Education:</span> Significant funding for K-12 schools and public universities comes from state budgets.</li>
          <li><span className="font-medium">Transportation:</span> Maintaining highways, public transit, and local road infrastructure.</li>
          <li><span className="font-medium">Parks & Recreation:</span> Supporting state parks, natural reserves, and community recreational programs.</li>
          <li><span className="font-medium">Public Safety:</span> Funding police, fire departments, and emergency response services.</li>
          <li><span className="font-medium">Healthcare:</span> Programs like Medicaid and public health initiatives are covered at the state level.</li>
          <li><span className="font-medium">State Salaries:</span> Paying government employees, from legislators to teachers and public service workers.</li>
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">County Taxes (specific states)</h3>
        <p className="text-gray-600 mb-2">
          In <span className="font-medium">Maryland, Indiana, Ohio, and Pennsylvania,</span> counties add an additional income tax ranging from 1% to 3%, depending on the jurisdiction. These funds typically support local infrastructure, schools, and community services.
        </p>
        <p className="text-gray-600">
          In other states, county-level taxes may include property taxes or sales tax contributions, ensuring every layer of government has its share.
        </p>
      </div>

      <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="space-y-4">
            <p className="text-gray-700">
              Consider paying quarterly estimated taxes to avoid penalties. This ensures you're covering your share of federal, state, and local taxes throughout the year.
            </p>
            
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Where to Pay Quarterly Taxes:</h4>
              <ul className="space-y-2 text-gray-600">
                <li><span className="font-medium">Federal Taxes:</span> Pay through the IRS Direct Pay system or set up an account with the Electronic Federal Tax Payment System (EFTPS).</li>
                <li><span className="font-medium">State Taxes:</span> Visit your state's Department of Revenue website for instructions and payment options. Most states offer online portals for easy access.</li>
                <li><span className="font-medium">County/Local Taxes (where applicable):</span> Check with your local tax office for payment methods and deadlines.</li>
              </ul>
            </div>
            
            <p className="text-gray-700">
              Staying on top of quarterly payments helps you avoid surprises at tax time and keeps you in good standing with the government.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};