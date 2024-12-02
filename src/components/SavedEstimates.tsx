import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Pencil, X, Check } from "lucide-react";
import { Card } from "@/components/ui/card";

export const SavedEstimates = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedNote, setEditedNote] = useState("");

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
    mutationFn: async ({ id, invoice_name, notes }: { id: string, invoice_name?: string, notes?: string }) => {
      const updateData: { invoice_name?: string; notes?: string } = {};
      if (invoice_name !== undefined) updateData.invoice_name = invoice_name;
      if (notes !== undefined) updateData.notes = notes;

      const { error } = await supabase
        .from('tax_calculations')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tax-estimates'] });
      toast({
        title: "Success",
        description: "Invoice updated successfully",
      });
      setEditingId(null);
      setEditedName("");
      setEditedNote("");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update invoice",
      });
    },
  });

  const startEditing = (estimate: any) => {
    setEditingId(estimate.id);
    setEditedName(estimate.invoice_name || "");
    setEditedNote(estimate.notes || "");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditedName("");
    setEditedNote("");
  };

  const handleUpdate = (id: string) => {
    updateMutation.mutate({
      id,
      invoice_name: editedName.trim(),
      notes: editedNote.trim()
    });
  };

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "$0";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return <div>Loading estimates...</div>;
  }

  if (!estimates?.length) {
    return <div>No saved estimates found.</div>;
  }

  return (
    <div className="space-y-4">
      {estimates.map((estimate) => {
        const totalTax = (estimate.federal_tax || 0) + 
                        (estimate.state_tax || 0) + 
                        (estimate.self_employment_tax || 0);
        const takeHome = (estimate.income || 0) - totalTax;

        return (
          <Card key={estimate.id} className="p-4">
            <div className="space-y-4">
              {/* Invoice Name Section */}
              <div className="flex items-center justify-between">
                {editingId === estimate.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="flex-1"
                      placeholder="Enter invoice name"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 flex-1">
                    <h3 className="text-lg font-semibold">
                      {estimate.invoice_name || "Untitled Invoice"}
                    </h3>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => startEditing(estimate)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Financial Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Income</p>
                  <p className="font-medium">{formatCurrency(estimate.income)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Federal Tax</p>
                  <p className="font-medium text-red-600">{formatCurrency(estimate.federal_tax)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">State Tax</p>
                  <p className="font-medium text-red-600">{formatCurrency(estimate.state_tax)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Self Employment Tax</p>
                  <p className="font-medium text-red-600">{formatCurrency(estimate.self_employment_tax)}</p>
                </div>
              </div>

              {/* Totals */}
              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Tax</span>
                  <span className="font-medium text-red-600">{formatCurrency(totalTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Take Home</span>
                  <span className="font-medium text-green-600">{formatCurrency(takeHome)}</span>
                </div>
              </div>

              {/* Notes Section */}
              {editingId === estimate.id ? (
                <div className="space-y-2">
                  <Textarea
                    value={editedNote}
                    onChange={(e) => setEditedNote(e.target.value)}
                    placeholder="Add notes about this invoice..."
                    className="min-h-[80px]"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={cancelEditing}
                      className="flex items-center gap-1"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleUpdate(estimate.id)}
                      className="flex items-center gap-1"
                    >
                      <Check className="h-4 w-4" />
                      Save
                    </Button>
                  </div>
                </div>
              ) : estimate.notes ? (
                <div className="pt-3 border-t">
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="text-sm mt-1">{estimate.notes}</p>
                </div>
              ) : null}
            </div>
          </Card>
        );
      })}
    </div>
  );
};