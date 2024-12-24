import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { SubscriptionButton } from "./SubscriptionButton";
import { trackTrialExtension } from "@/utils/omnisendEvents";

interface PricingDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PricingDialog = ({ isOpen, onClose }: PricingDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubscription = async (type: 'lifetime' | 'quarterly' | 'trial') => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Please log in",
        description: "You need to be logged in to subscribe",
      });
      onClose();
      navigate('/login');
      return;
    }

    setIsLoading(true);
    try {
      if (type === 'trial') {
        console.log('Starting trial extension for user:', user.id);
        
        // Check if user has already used trial
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('last_trial_used')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error checking trial status:', profileError);
          throw new Error('Could not check trial status');
        }

        if (profile?.last_trial_used) {
          const lastTrialDate = new Date(profile.last_trial_used);
          const daysSinceLastTrial = Math.floor((Date.now() - lastTrialDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysSinceLastTrial < 30) {
            throw new Error('You can only extend your trial once every 30 days');
          }
        }

        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            subscription_type: type,
            subscription_expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            last_trial_used: new Date().toISOString()
          })
          .eq('id', user.id);

        if (updateError) {
          console.error('Error updating trial:', updateError);
          throw updateError;
        }

        if (user.email) {
          await trackTrialExtension(user.email);
        }

        toast({
          title: "Trial activated",
          description: "You have 30 more days of free access. We'll remind you about pricing after each invoice you add.",
        });
        onClose();
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { type }
      });

      if (error) throw error;
      if (!data.url) throw new Error('No checkout URL received');

      window.location.href = data.url;
    } catch (error: any) {
      console.error('Subscription error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to process subscription. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">
            Choose Your Plan
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <SubscriptionButton
              type="lifetime"
              price="$45.99"
              originalPrice="$99.99"
              isLoading={isLoading}
              onSubscribe={handleSubscription}
            />

            <SubscriptionButton
              type="quarterly"
              price="$14.99"
              isLoading={isLoading}
              onSubscribe={handleSubscription}
            />

            <div className="text-center mt-6">
              <SubscriptionButton
                type="trial"
                isLoading={isLoading}
                onSubscribe={handleSubscription}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};