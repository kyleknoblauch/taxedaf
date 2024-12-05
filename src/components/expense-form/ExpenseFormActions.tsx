import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const ExpenseFormActions = () => {
  return (
    <>
      <Button type="submit" className="w-full">
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