import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthProvider";
import { useQueryClient } from "@tanstack/react-query";
import { ExpenseFormFields } from "./expense-form/ExpenseFormFields";
import { ExpenseFormActions } from "./expense-form/ExpenseFormActions";
import { useNavigate } from "react-router-dom";

export const ExpenseForm = () => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<string>("");
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !amount || !category) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("expenses").insert({
        user_id: user?.id,
        description,
        amount: Number(amount),
        category,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Expense added successfully",
      });

      setDescription("");
      setAmount("");
      setCategory("");
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["quarterly-estimates"] });
      
      // Navigate to dashboard and scroll to expenses
      navigate("/dashboard", { state: { scrollToExpenses: true } });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add expense",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <ExpenseFormFields
          description={description}
          setDescription={setDescription}
          amount={amount}
          setAmount={setAmount}
          category={category}
          setCategory={setCategory}
        />
        <ExpenseFormActions />
      </form>
    </Card>
  );
};