import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ui/use-toast";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { useState } from "react";

export const Header = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (isSigningOut) return; // Prevent multiple clicks

    try {
      setIsSigningOut(true);
      await signOut();
      
      // Clear any stored state or cached data here if needed
      toast({
        title: "Signed out successfully",
      });
      
      // Force navigation to home page
      window.location.href = '/';
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message || "Please try again",
      });
      setIsSigningOut(false); // Reset the signing out state on error
    }
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <DarkModeToggle />
      <div className="flex gap-4">
        {user ? (
          <>
            <Link to="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
            <Button 
              onClick={handleSignOut}
              disabled={isSigningOut}
              variant="destructive"
            >
              {isSigningOut ? (
                <>
                  <span className="animate-pulse">Signing out...</span>
                </>
              ) : (
                "Sign Out"
              )}
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