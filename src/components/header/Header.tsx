import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ui/use-toast";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { useState } from "react";

export const Header = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (isSigningOut) return; // Prevent multiple clicks

    try {
      setIsSigningOut(true);
      console.log('Starting sign out in Header...');
      await signOut();
      
      toast({
        title: "Signed out successfully",
      });
      
      // Clear any local storage or session storage if needed
      localStorage.clear();
      sessionStorage.clear();
      
      // Small delay to ensure state updates are processed
      setTimeout(() => {
        console.log('Reloading page...');
        window.location.href = '/';
      }, 100);
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