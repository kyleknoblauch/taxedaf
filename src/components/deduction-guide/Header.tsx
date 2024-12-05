import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4">
      <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <h1 className="text-4xl font-display font-black text-foreground">
        Tax Deductions for Self-Employed
      </h1>
    </div>
  );
};