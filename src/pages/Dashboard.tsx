import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { formatCurrency } from "@/utils/taxCalculations";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Pencil, Trash2, X, Check, Plus, Minus, GripVertical } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ExpenseForm } from "@/components/ExpenseForm";
import { TaxSummary } from "@/components/TaxSummary";
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(true);
  const [isTaxSummaryOpen, setIsTaxSummaryOpen] = useState(true);
  const [isSavedEstimatesOpen, setIsSavedEstimatesOpen] = useState(true);
  
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">Tax Dashboard</h1>
          <Button 
            variant="outline"
            onClick={() => navigate("/")}
            className="w-full sm:w-auto"
          >
            Back to Calculator
          </Button>
        </div>
        
        <div className="space-y-6">
          <Collapsible open={isExpenseFormOpen} onOpenChange={setIsExpenseFormOpen}>
            <Card className="relative">
              <CollapsibleTrigger className="absolute right-4 top-4">
                {isExpenseFormOpen ? (
                  <Minus className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </CollapsibleTrigger>
              <div className="cursor-move p-2 hover:bg-gray-50">
                <GripVertical className="h-4 w-4 text-gray-400" />
              </div>
              <CollapsibleContent>
                <div className="p-6 pt-0">
                  <ExpenseForm />
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          <Collapsible open={isTaxSummaryOpen} onOpenChange={setIsTaxSummaryOpen}>
            <Card className="relative">
              <CollapsibleTrigger className="absolute right-4 top-4">
                {isTaxSummaryOpen ? (
                  <Minus className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </CollapsibleTrigger>
              <div className="cursor-move p-2 hover:bg-gray-50">
                <GripVertical className="h-4 w-4 text-gray-400" />
              </div>
              <CollapsibleContent>
                <div className="p-6 pt-0">
                  <TaxSummary />
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          <Collapsible open={isSavedEstimatesOpen} onOpenChange={setIsSavedEstimatesOpen}>
            <Card className="relative">
              <CollapsibleTrigger className="absolute right-4 top-4">
                {isSavedEstimatesOpen ? (
                  <Minus className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </CollapsibleTrigger>
              <div className="cursor-move p-2 hover:bg-gray-50">
                <GripVertical className="h-4 w-4 text-gray-400" />
              </div>
              <CollapsibleContent>
                <div className="p-6 pt-0">
                  <h2 className="text-2xl font-semibold text-gray-800">Saved Estimates</h2>
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
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
