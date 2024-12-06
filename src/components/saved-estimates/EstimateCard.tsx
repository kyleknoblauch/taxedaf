import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil, Check, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
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
import { format } from "date-fns";

interface EstimateCardProps {
  calc: any;
  editingId: string | null;
  editedNote: string;
  onStartEditing: (calc: any) => void;
  onSaveNote: (id: string) => void;
  onCancelEdit: () => void;
  onDelete: (id: string) => Promise<boolean>;
  onEditNoteChange: (note: string) => void;
}

export const EstimateCard = ({
  calc,
  editingId,
  editedNote,
  onStartEditing,
  onSaveNote,
  onCancelEdit,
  onDelete,
  onEditNoteChange,
}: EstimateCardProps) => {
  console.log('EstimateCard - Rendering with calc:', calc);
  
  const totalTax = (calc.federal_tax || 0) + (calc.state_tax || 0) + (calc.self_employment_tax || 0);
  const takeHome = (calc.income || 0) - totalTax;

  const handleDelete = async () => {
    console.log('EstimateCard - Attempting to delete estimate:', calc.id);
    const success = await onDelete(calc.id);
    console.log('EstimateCard - Delete result:', success);
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center pl-1">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
          {calc.invoice_name || "Untitled Invoice"}
        </p>
        <p className="text-xs text-gray-500">
          {calc.created_at ? format(new Date(calc.created_at), 'MMM d, yyyy') : 'Date not available'}
        </p>
      </div>
      <Card className="p-4">
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <div className="flex-grow">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Income</span>
                <span className="font-medium">{formatCurrency(calc.income || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Federal Tax</span>
                <span className="font-medium text-red-600">{formatCurrency(calc.federal_tax || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">State Tax</span>
                <span className="font-medium text-red-600">{formatCurrency(calc.state_tax || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Self-Employment Tax</span>
                <span className="font-medium text-red-600">{formatCurrency(calc.self_employment_tax || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Total Tax</span>
                <span className="font-medium text-red-600">{formatCurrency(totalTax)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="text-sm font-medium text-gray-500">Take Home</span>
                <span className="font-medium text-green-600">{formatCurrency(takeHome)}</span>
              </div>
            </div>
            <div className="flex gap-2">
              {editingId !== calc.id && (
                <Button variant="ghost" size="icon" onClick={() => onStartEditing(calc)}>
                  <Pencil className="h-4 w-4 text-gray-500" />
                </Button>
              )}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Estimate</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this tax estimate? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          {editingId === calc.id ? (
            <div className="space-y-2 pt-2 border-t">
              <Textarea
                value={editedNote}
                onChange={(e) => onEditNoteChange(e.target.value)}
                placeholder="Add a note about this estimate..."
                className="min-h-[80px]"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onCancelEdit}
                  className="flex items-center gap-1"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => onSaveNote(calc.id)}
                  className="flex items-center gap-1"
                >
                  <Check className="h-4 w-4" />
                  Save
                </Button>
              </div>
            </div>
          ) : calc.notes && (
            <p className="text-sm text-gray-600 mt-2 pt-2 border-t">{calc.notes}</p>
          )}
        </div>
      </Card>
    </div>
  );
};