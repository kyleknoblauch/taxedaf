import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { formatCurrency } from "@/utils/taxCalculations";
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

interface Expense {
  id: string;
  description: string;
  category: string;
  amount: number;
  notes?: string;
}

interface ExpensesListProps {
  expenses: Expense[];
  editingId: string | null;
  editedNote: string;
  onStartEditing: (expense: Expense) => void;
  onSaveNote: (id: string) => void;
  onCancelEdit: () => void;
  onDelete: (id: string) => void;
  onEditNoteChange: (note: string) => void;
}

export const ExpensesList = ({
  expenses,
  editingId,
  editedNote,
  onStartEditing,
  onSaveNote,
  onCancelEdit,
  onDelete,
  onEditNoteChange,
}: ExpensesListProps) => {
  return (
    <div className="space-y-4">
      {expenses?.map((expense) => (
        <div key={expense.id} className="flex items-center justify-between pl-4 py-2 rounded-lg">
          <div className="flex-grow">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">{expense.description}</span>
              <span className="text-sm text-gray-500">({expense.category})</span>
            </div>
            {editingId === expense.id ? (
              <div className="flex gap-2 mt-1">
                <Input
                  value={editedNote}
                  onChange={(e) => onEditNoteChange(e.target.value)}
                  placeholder="Add a note..."
                  className="flex-grow"
                />
                <Button size="icon" variant="ghost" onClick={() => onSaveNote(expense.id)}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={onCancelEdit}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-500">{expense.notes || "No notes"}</span>
                <Button size="icon" variant="ghost" onClick={() => onStartEditing(expense)}>
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="font-medium text-green-600">-{formatCurrency(expense.amount)}</span>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Expense</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this expense? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(expense.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      ))}
    </div>
  );
};