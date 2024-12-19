import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { WelcomeSection } from "@/components/welcome/WelcomeSection";

const Index = () => {
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleOmnisendSync = async () => {
    setIsSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('sync-omnisend');
      
      if (error) throw error;
      
      toast({
        title: "Sync Complete",
        description: `${data.succeeded} contacts synced successfully. ${data.failed} failed.`,
      });
    } catch (error: any) {
      console.error('Error syncing to Omnisend:', error);
      toast({
        title: "Sync Failed",
        description: error.message || "Failed to sync contacts to Omnisend",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <WelcomeSection />
      
      <div className="mt-8">
        <Button
          onClick={handleOmnisendSync}
          disabled={isSyncing}
          className="w-full sm:w-auto"
        >
          {isSyncing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Syncing Contacts...
            </>
          ) : (
            'Sync Contacts to Omnisend'
          )}
        </Button>
      </div>
    </div>
  );
};

export default Index;