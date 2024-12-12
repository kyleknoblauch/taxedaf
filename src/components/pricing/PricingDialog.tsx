import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PricingDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PricingDialog = ({ isOpen, onClose }: PricingDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscription = async (type: 'lifetime' | 'quarterly' | 'trial') => {
    setIsLoading(true);
    try {
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }

      if (type === 'trial') {
        const { error } = await supabase
          .from('profiles')
          .update({ 
            subscription_type: type,
            subscription_expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            last_trial_used: new Date().toISOString()
          })
          .eq('id', session.user.id);

        if (error) throw error;

        toast({
          title: "Trial activated",
          description: "You have 30 more days of free access",
        });
        onClose();
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { type }
      });

      if (error) throw error;
      if (!data.url) throw new Error('No checkout URL received');

      // Redirect to Stripe Checkout
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">
            Choose Your Plan
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="border rounded-lg p-4 hover:border-primary transition-colors">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Lifetime Access</h3>
                <div className="text-right">
                  <span className="text-sm line-through text-muted-foreground">$99.99</span>
                  <span className="text-lg font-bold ml-2">$45.99</span>
                </div>
              </div>
              <Button 
                className="w-full" 
                onClick={() => handleSubscription('lifetime')}
                disabled={isLoading}
              >
                Get Lifetime Access
              </Button>
            </div>

            <div className="border rounded-lg p-4 hover:border-primary transition-colors">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Quarterly Access</h3>
                <span className="text-lg font-bold">$14.99</span>
              </div>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => handleSubscription('quarterly')}
                disabled={isLoading}
              >
                Get 3 Months Access
              </Button>
            </div>

            <div className="text-center mt-6">
              <button
                onClick={() => handleSubscription('trial')}
                className="text-sm text-muted-foreground hover:text-primary"
                disabled={isLoading}
              >
                I'm broke, let me use it for another 30 days for free
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};