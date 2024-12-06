import { useAuth } from "../AuthProvider";
import { EstimateCard } from "./EstimateCard";
import { useState } from "react";
import { useTaxEstimates } from "@/hooks/useTaxEstimates";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const EstimatesList = () => {
  const { user } = useAuth();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedNote, setEditedNote] = useState("");
  const { estimates, isLoading, isError, updateNote, deleteEstimate } = useTaxEstimates(user?.id);

  const handleStartEditing = (calc: any) => {
    setEditingId(calc.id);
    setEditedNote(calc.notes || "");
  };

  const handleSaveNote = async (id: string) => {
    const success = await updateNote(id, editedNote);
    if (success) {
      setEditingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertDescription>
          Error loading estimates. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  if (!estimates?.length) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        No saved estimates found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {estimates.map((calc) => (
        <EstimateCard
          key={calc.id}
          calc={calc}
          editingId={editingId}
          editedNote={editedNote}
          onStartEditing={handleStartEditing}
          onSaveNote={handleSaveNote}
          onCancelEdit={() => setEditingId(null)}
          onDelete={deleteEstimate}
          onEditNoteChange={setEditedNote}
        />
      ))}
    </div>
  );
};