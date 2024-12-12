import { TaxCalculator } from "@/components/TaxCalculator";
import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Header } from "@/components/header/Header";
import { WelcomeSection } from "@/components/welcome/WelcomeSection";
import { PricingDialog } from "@/components/pricing/PricingDialog";

const Index = () => {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState<string>("");
  const [showPricing, setShowPricing] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    const fetchGreeting = async () => {
      if (!user || !profile?.first_name) return;
      
      try {
        const { data, error } = await supabase.functions.invoke('generate-greeting', {
          body: { firstName: profile.first_name }
        });
        
        if (error) throw error;
        
        if (data?.greeting) {
          setGreeting(data.greeting);
        }
      } catch (error) {
        console.error('Error fetching greeting:', error);
        setGreeting(`Welcome back, ${profile.first_name}!`);
      }
    };

    if (profile?.first_name) {
      fetchGreeting();
    }
  }, [profile?.first_name, user]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="px-4 py-12">
          <Header />
          <WelcomeSection greeting={greeting} />
          <TaxCalculator />
        </div>
      </div>
      <PricingDialog 
        isOpen={showPricing} 
        onClose={() => setShowPricing(false)} 
      />
    </div>
  );
};

export default Index;