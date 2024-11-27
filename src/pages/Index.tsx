import { TaxCalculator } from "@/components/TaxCalculator";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ui/use-toast";
import { Footer } from "@/components/Footer";

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex justify-end mb-4">
          {user ? (
            <>
              <Link to="/dashboard">
                <Button>Dashboard</Button>
              </Link>
              <Button variant="outline" onClick={handleSignOut} className="ml-4">
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
      <Footer />
    </div>
  );
};

export default Index;