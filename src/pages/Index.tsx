import { TaxCalculator } from "@/components/TaxCalculator";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end mb-4 space-x-4">
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Freelancer Tax Calculator
          </h1>
          <p className="text-lg text-gray-600">
            Estimate your federal and state tax obligations as a freelancer
          </p>
        </div>
        
        <TaxCalculator />
      </div>
    </div>
  );
};

export default Index;