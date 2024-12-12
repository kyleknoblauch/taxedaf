import { Card } from "@/components/ui/card";
import { EstimateCard } from "./EstimateCard";
import { useState } from "react";
import { useAuth } from "../AuthProvider";
import { useTaxEstimates } from "@/hooks/useTaxEstimates";
import { Loader2 } from "lucide-react";

export const EstimatesList = () => {
  const { user } = useAuth();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedNote, setEditedNote] = useState("");
  const { estimates, isLoading, isError, updateNote, deleteEstimate } = useTaxEstimates(user?.id);

  console.log('EstimatesList - Rendering with estimates:', estimates);

  if (isLoading) {
    return (
      <Card className="p-6 flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="p-6">
        <p className="text-center text-red-500">Error loading estimates. Please try again.</p>
      </Card>
    );
  }

  if (!estimates?.length) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500">No saved estimates found.</p>
      </Card>
    );
  }

  const handleStartEditing = (calc: any) => {
    setEditingId(calc.id);
    setEditedNote(calc.notes || "");
  };

  const handleSaveNote = async (id: string) => {
    await updateNote(id, editedNote);
    setEditingId(null);
  };

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