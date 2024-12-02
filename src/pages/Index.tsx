import { TaxCalculator } from "@/components/TaxCalculator";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ui/use-toast";
import { Footer } from "@/components/Footer";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Index = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState<string>("");

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      console.log('Fetching profile for user:', user.id);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }
      console.log('Profile data received:', data);
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    const fetchGreeting = async () => {
      if (!user) {
        console.log('No user, skipping greeting fetch');
        return;
      }
      
      if (!profile?.first_name) {
        console.log('No first_name in profile, skipping greeting fetch');
        return;
      }

      console.log('Attempting to fetch greeting for:', profile.first_name);
      
      try {
        const { data, error } = await supabase.functions.invoke('generate-greeting', {
          body: { firstName: profile.first_name }
        });
        
        if (error) {
          console.error('Error fetching greeting:', error);
          throw error;
        }
        
        console.log('Greeting response:', data);
        
        if (data?.greeting) {
          setGreeting(data.greeting);
        } else {
          console.error('No greeting in response:', data);
          setGreeting(`Welcome back, ${profile.first_name}!`);
        }
      } catch (error) {
        console.error('Error in fetchGreeting:', error);
        setGreeting(`Welcome back, ${profile.first_name}!`);
      }
    };

    fetchGreeting();
  }, [profile?.first_name, user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      setGreeting("");
      toast({
        title: "Signed out successfully",
      });
      navigate("/login");
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
            <h1 className="text-4xl font-display font-black text-foreground mb-4">
              taxed<span className="text-primary">AF</span>
            </h1>
            {user ? (
              <p className="text-lg text-muted-foreground mb-2">
                {greeting}
              </p>
            ) : (
              <p className="text-lg text-muted-foreground mb-2">
                Welcome to the smartest way to handle your self-employed taxes
              </p>
            )}
            <p className="text-lg text-muted-foreground">
              Estimate your federal and state tax obligations accurately AF.
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