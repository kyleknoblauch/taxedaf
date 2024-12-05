import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ui/use-toast";
import { DarkModeToggle } from "@/components/DarkModeToggle";

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
      navigate('/');
    } catch (error: any) {
      console.error('Sign out error:', error);
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
            <Button 
              variant="outline" 
              onClick={() => navigate("/dashboard", { state: { scrollToTop: true } })}
            >
              Dashboard
            </Button>
            <Button onClick={handleSignOut}>
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