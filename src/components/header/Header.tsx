import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ui/use-toast";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { Logo } from "@/components/Logo";

export const Header = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
      });
      navigate('/login');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    }
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <DarkModeToggle />
      <div className="flex gap-4">
        {user ? (
          <>
            <Link to="/dashboard">
              <Button>Dashboard</Button>
            </Link>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </>
        ) : (
          <Link to="/login">
            <Button>Login / Sign Up</Button>
          </Link>
        )}
      </div>
    </div>
  );
};