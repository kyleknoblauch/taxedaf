import { useState } from "react";
import { useAuth } from "./AuthProvider";
import { EstimateCard } from "./saved-estimates/EstimateCard";
import { useEstimates } from "@/hooks/useEstimates";

export const SavedEstimates = () => {
  const { user } = useAuth();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedNote, setEditedNote] = useState("");
  
  const { calculations, updateNoteMutation, deleteMutation } = useEstimates(user?.id);

  if (!calculations?.length) {
    return (
      <div className="p-4">
        <p className="text-center text-gray-500">No saved estimates yet.</p>
      </div>
    );
  }

  const handleStartEditing = (calc: any) => {
    setEditingId(calc.id);
    setEditedNote(calc.notes || "");
  };

  const handleSaveNote = (id: string) => {
    updateNoteMutation.mutate({ id, note: editedNote }, {
      onSuccess: () => {
        setEditingId(null);
        setEditedNote("");
      }
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedNote("");
  };

  return (
    <div className="space-y-4">
      {calculations.map((calc) => (
        <EstimateCard
          key={calc.id}
          calc={calc}
          editingId={editingId}
          editedNote={editedNote}
          onStartEditing={handleStartEditing}
          onSaveNote={handleSaveNote}
          onCancelEdit={handleCancelEdit}
          onDelete={(id) => deleteMutation.mutate(id)}
          onEditNoteChange={(note) => setEditedNote(note)}
        />
      ))}
    </div>
  );
};