import { TaxCalculator } from "@/components/TaxCalculator";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Freelancer Tax Calculator
          </h1>
          <p className="text-lg text-gray-600">
            Estimate your federal and state tax obligations as a freelancer
          </p>
        </div>
        
        <TaxCalculator />
      </div>
    </div>
  );
};

export default Index;