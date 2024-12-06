import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { DarkModeToggle } from "@/components/DarkModeToggle";

export const DashboardHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="relative">
      <div className="absolute right-0 top-0">
        <DarkModeToggle />
      </div>
      
      <div className="space-y-4 pt-10 sm:pt-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-4xl font-display font-black text-foreground">
            taxed<span className="text-primary">AF</span> Dashboard
          </h1>
        </div>

        <p className="text-lg text-muted-foreground">
          It's wild how much we're taxed on our earnings, but owing the state with penalties is worse. Calculate your taxes, deduct your expenses and don't pay the IRS a dime more than you need to.
        </p>

        <div className="sm:hidden">
          <Button 
            variant="outline"
            onClick={() => navigate("/")}
            className="w-full text-primary hover:text-primary/90"
          >
            Add Another Invoice
          </Button>
        </div>

        <div className="hidden sm:block">
          <Button 
            variant="outline"
            onClick={() => navigate("/")}
            className="text-primary hover:text-primary/90"
          >
            Add Another Invoice
          </Button>
        </div>
      </div>
    </div>
  );
};