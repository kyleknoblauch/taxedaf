import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

export const ExpenseFormActions = () => {
  const navigate = useNavigate();

  const handleAddDeduction = () => {
    navigate("/dashboard", { state: { scrollToExpenses: true } });
  };

  return (
    <>
      <Button type="submit" className="w-full" onClick={handleAddDeduction}>
        Add Deduction
      </Button>

      <Link 
        to="/deduction-guide" 
        className="block text-sm text-primary hover:text-primary/90 underline text-center mt-2"
      >
        What can I deduct?
      </Link>
    </>
  );
};