import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { formatCurrency } from "@/utils/taxCalculations";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Pencil, Trash2, X, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  const [savedCalculations, setSavedCalculations] = useLocalStorage<SavedCalculation[]>("tax-calculations", []);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedNote, setEditedNote] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const totalIncome = savedCalculations.reduce((sum, calc) => sum + calc.income, 0);
  const totalFederalTax = savedCalculations.reduce((sum, calc) => sum + calc.federalTax, 0);
  const totalStateTax = savedCalculations.reduce((sum, calc) => sum + calc.stateTax, 0);
  const totalSelfEmploymentTax = savedCalculations.reduce((sum, calc) => sum + calc.selfEmploymentTax, 0);

  const handleDelete = (id: string) => {
    const newCalculations = savedCalculations.filter(calc => calc.id !== id);
    setSavedCalculations(newCalculations);
    toast({
      title: "Estimate deleted",
      description: "The tax estimate has been removed.",
    });
  };

  const startEditing = (calculation: SavedCalculation) => {
    setEditingId(calculation.id);
    setEditedNote(calculation.notes || "");
  };

  const saveEdit = (id: string) => {
    const newCalculations = savedCalculations.map(calc =>
      calc.id === id ? { ...calc, notes: editedNote } : calc
    );
    setSavedCalculations(newCalculations);
    setEditingId(null);
    toast({
      title: "Note updated",
      description: "Your changes have been saved.",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditedNote("");
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Saved Estimates</h1>
          <Button 
            variant="outline"
            onClick={() => navigate("/")}
          >
            Back to Calculator
          </Button>
        </div>
        
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
                <TableHead>Actions</TableHead>
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
                  <TableCell className="max-w-xs">
                    {editingId === calc.id ? (
                      <div className="flex gap-2">
                        <Input
                          value={editedNote}
                          onChange={(e) => setEditedNote(e.target.value)}
                          className="w-full"
                        />
                        <Button size="icon" variant="ghost" onClick={() => saveEdit(calc.id)}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={cancelEdit}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="truncate">{calc.notes}</span>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => startEditing(calc)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Tax Estimate</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this tax estimate? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(calc.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
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