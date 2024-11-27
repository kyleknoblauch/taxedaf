import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { formatCurrency } from "@/utils/taxCalculations";

interface SavedCalculation {
  id: string;
  date: string;
  income: number;
  federalTax: number;
  stateTax: number;
  selfEmploymentTax: number;
  state: string;
  notes?: string;
}

const Dashboard = () => {
  const [savedCalculations] = useLocalStorage<SavedCalculation[]>("tax-calculations", []);
  
  const totalIncome = savedCalculations.reduce((sum, calc) => sum + calc.income, 0);
  const totalFederalTax = savedCalculations.reduce((sum, calc) => sum + calc.federalTax, 0);
  const totalStateTax = savedCalculations.reduce((sum, calc) => sum + calc.stateTax, 0);
  const totalSelfEmploymentTax = savedCalculations.reduce((sum, calc) => sum + calc.selfEmploymentTax, 0);
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Saved Estimates</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Income</h3>
            <p className="text-2xl font-semibold text-gray-900">{formatCurrency(totalIncome)}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Federal Tax</h3>
            <p className="text-2xl font-semibold text-red-600">{formatCurrency(totalFederalTax)}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Total State Tax</h3>
            <p className="text-2xl font-semibold text-red-600">{formatCurrency(totalStateTax)}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Self-Employment Tax</h3>
            <p className="text-2xl font-semibold text-red-600">{formatCurrency(totalSelfEmploymentTax)}</p>
          </Card>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Income</TableHead>
                <TableHead>Federal Tax</TableHead>
                <TableHead>State Tax</TableHead>
                <TableHead>Self-Employment Tax</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {savedCalculations.map((calc) => (
                <TableRow key={calc.id}>
                  <TableCell>{new Date(calc.date).toLocaleDateString()}</TableCell>
                  <TableCell>{formatCurrency(calc.income)}</TableCell>
                  <TableCell>{formatCurrency(calc.federalTax)}</TableCell>
                  <TableCell>{formatCurrency(calc.stateTax)}</TableCell>
                  <TableCell>{formatCurrency(calc.selfEmploymentTax)}</TableCell>
                  <TableCell>{calc.state}</TableCell>
                  <TableCell className="max-w-xs truncate">{calc.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;