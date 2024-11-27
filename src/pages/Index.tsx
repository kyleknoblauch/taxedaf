import { TaxCalculator } from "@/components/TaxCalculator";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ui/use-toast";
import { Footer } from "@/components/Footer";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("first_name")
        .eq("id", user.id)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }
      return data;
    },
    enabled: !!user,
  });

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
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="px-4 py-12">
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
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              TaxedAF
            </h1>
            <p className="text-lg text-muted-foreground">
              {user && profile?.first_name 
                ? `Estimate your federal and state tax obligations as a freelancer, ${profile.first_name}.`
                : "Estimate your federal and state tax obligations as a freelancer"}
            </p>
          </div>
          
          <TaxCalculator />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;