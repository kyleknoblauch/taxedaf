import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Pencil, X, Check } from "lucide-react";

export const SavedEstimates = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");

  const { data: estimates, isLoading } = useQuery({
    queryKey: ['tax-estimates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tax_calculations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, invoice_name }: { id: string, invoice_name: string }) => {
      const { error } = await supabase
        .from('tax_calculations')
        .update({ invoice_name })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tax-estimates'] });
      toast({
        title: "Success",
        description: "Invoice name updated successfully",
      });
      setEditingId(null);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update invoice name",
      });
    },
  });

  const startEditing = (id: string, currentName: string) => {
    setEditingId(id);
    setEditedName(currentName);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditedName("");
  };

  const handleUpdate = (id: string) => {
    if (editedName.trim()) {
      updateMutation.mutate({ id, invoice_name: editedName.trim() });
    }
  };

  if (isLoading) {
    return <div>Loading estimates...</div>;
  }

  if (!estimates?.length) {
    return <div>No saved estimates found.</div>;
  }

  return (
    <div className="space-y-4">
      {estimates.map((estimate) => (
        <div key={estimate.id} className="bg-card p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-2">
            {editingId === estimate.id ? (
              <div className="flex items-center gap-2 flex-1">
                <Input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="flex-1"
                  placeholder="Enter invoice name"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleUpdate(estimate.id)}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={cancelEditing}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-1">
                <h3 className="text-lg font-semibold flex-1">
                  {estimate.invoice_name || "Untitled Invoice"}
                </h3>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => startEditing(estimate.id, estimate.invoice_name || "")}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Income</p>
              <p className="font-medium">${estimate.income?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Federal Tax</p>
              <p className="font-medium">${estimate.federal_tax?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">State Tax</p>
              <p className="font-medium">${estimate.state_tax?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Self Employment Tax</p>
              <p className="font-medium">${estimate.self_employment_tax?.toLocaleString()}</p>
            </div>
          </div>
          {estimate.notes && (
            <div className="mt-2">
              <p className="text-sm text-muted-foreground">Notes</p>
              <p className="text-sm">{estimate.notes}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};