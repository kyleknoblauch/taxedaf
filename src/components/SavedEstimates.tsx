import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthProvider";
import { formatCurrency } from "@/utils/taxCalculations";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { useEffect } from "react";
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

export const SavedEstimates = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: calculations } = useQuery({
    queryKey: ["tax-calculations", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tax_calculations")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('tax-calculations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tax_calculations',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // Removed realtime updates for now to prevent conflicts with optimistic updates
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [user, queryClient]);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("tax_calculations")
        .delete()
        .eq("id", id)
        .eq("user_id", user?.id);

      if (error) throw error;
      return id;
    },
    onMutate: async (deletedId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["tax-calculations", user?.id] });

      // Snapshot the previous value
      const previousCalculations = queryClient.getQueryData(["tax-calculations", user?.id]);

      // Optimistically update to the new value
      queryClient.setQueryData(
        ["tax-calculations", user?.id],
        (old: any) => old?.filter((calc: any) => calc.id !== deletedId) || []
      );

      // Return a context object with the snapshotted value
      return { previousCalculations };
    },
    onError: (err, deletedId, context) => {
      // Rollback to the previous value if there's an error
      queryClient.setQueryData(["tax-calculations", user?.id], context?.previousCalculations);
      toast({
        title: "Error",
        description: "Failed to delete estimate. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: (deletedId) => {
      toast({
        title: "Success",
        description: "Estimate deleted successfully",
      });
    },
    onSettled: () => {
      // Always refetch after error or success to ensure cache consistency
      queryClient.invalidateQueries({ queryKey: ["tax-calculations", user?.id] });
    },
  });

  if (!calculations?.length) {
    return (
      <div className="p-4">
        <p className="text-center text-gray-500">No saved estimates yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {calculations.map((calc) => (
        <div key={calc.id} className="space-y-1">
          <p className="text-xs text-gray-500 pl-1">
            {calc.created_at ? format(new Date(calc.created_at), 'MMM d, yyyy') : 'Date not available'}
          </p>
          <Card className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Income</span>
                    <span className="font-medium">{formatCurrency(calc.income)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Federal Tax</span>
                    <span className="font-medium text-red-600">{formatCurrency(calc.federal_tax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">State Tax</span>
                    <span className="font-medium text-red-600">{formatCurrency(calc.state_tax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Self-Employment Tax</span>
                    <span className="font-medium text-red-600">{formatCurrency(calc.self_employment_tax)}</span>
                  </div>
                </div>
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
                      <AlertDialogAction 
                        onClick={() => {
                          deleteMutation.mutate(calc.id);
                        }}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              {calc.notes && (
                <p className="text-sm text-gray-600 mt-2 pt-2 border-t">{calc.notes}</p>
              )}
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};