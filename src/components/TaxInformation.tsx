import { Card } from "@/components/ui/card";

export const TaxInformation = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-800">Where do my Federal Taxes go?</h3>
        <p className="text-gray-600">
          Federal taxes fund various national programs and services including:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-600">
          <li>Social Security and Medicare programs</li>
          <li>National defense and military</li>
          <li>Infrastructure (highways, bridges, etc.)</li>
          <li>Education and research programs</li>
          <li>Federal law enforcement and courts</li>
          <li>Interest on national debt</li>
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-800">Where do my State Taxes go?</h3>
        <p className="text-gray-600">
          State taxes support state-level services and programs including:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-600">
          <li>Public schools and universities</li>
          <li>State highways and transportation</li>
          <li>State parks and recreation</li>
          <li>Public safety and prisons</li>
          <li>Healthcare programs</li>
          <li>State employee salaries and benefits</li>
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-800">What is Self-Employment Tax?</h3>
        <p className="text-gray-600">
          Self-employment tax is how self-employed individuals contribute to Social Security and Medicare. It consists of:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-600">
          <li>12.4% for Social Security (up to the wage base limit)</li>
          <li>2.9% for Medicare (no income limit)</li>
          <li>Total of 15.3% on net earnings</li>
        </ul>
        <p className="mt-2 text-gray-600">
          When you're traditionally employed, your employer pays half of these taxes. 
          As a self-employed person, you're responsible for both halves, but you can 
          deduct half of the self-employment tax as a business expense.
        </p>
      </div>
    </div>
  );
};