import { Logo } from "@/components/Logo";
import { useAuth } from "@/components/AuthProvider";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface WelcomeSectionProps {
  greeting: string;
}

export const WelcomeSection = ({ greeting }: WelcomeSectionProps) => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Query to check if user has any saved estimates
  const { data: taxCalculations } = useQuery({
    queryKey: ["tax_calculations", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("tax_calculations")
        .select("*")
        .eq("user_id", user.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Query to get user profile
  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (user && profile && taxCalculations) {
      const isFirstTimeUser = taxCalculations.length === 0;
      
      if (isFirstTimeUser) {
        toast({
          title: `Hey ${profile.first_name || 'there'}!`,
          description: "You're gearing up to take on the IRS like a boss. We've got your back to help you save more of your hard-earned cash—legally—and guide you through every move.",
        });
      } else {
        toast({
          title: `Welcome back, ${profile.first_name || 'there'}!`,
          description: `You have ${taxCalculations.length} saved estimate${taxCalculations.length === 1 ? '' : 's'}.`,
        });
      }
    }
  }, [user, profile, taxCalculations, toast]);

  return (
    <div className="text-center mt-8 mb-12">
      <Logo width="40" className="mx-auto mb-2.5" />
      <h1 className="text-4xl font-display font-black text-foreground mb-4">
        taxed<span className="text-primary">AF</span>
      </h1>
      {user ? (
        <p className="text-lg text-muted-foreground mb-2">
          {taxCalculations?.length === 0
            ? "Create your first tax estimate to get started"
            : `You have ${taxCalculations?.length || 0} saved estimate${taxCalculations?.length === 1 ? '' : 's'}`}
        </p>
      ) : (
        <p className="text-lg text-muted-foreground mb-2">
          Welcome to the smartest way to handle your self-employed taxes
        </p>
      )}
    </div>
  );
};