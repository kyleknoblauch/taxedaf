import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export const TaxAdvice = () => {
  const [question, setQuestion] = useState("");
  const [advice, setAdvice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      toast({
        variant: "destructive",
        title: "Please enter a question",
        description: "Your question cannot be empty",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-tax-advice', {
        body: { question }
      });

      if (error) throw error;

      setAdvice(data.advice);
      toast({
        title: "Tax advice generated",
        description: "Here's your personalized tax advice!",
      });
    } catch (error: any) {
      console.error('Error getting tax advice:', error);
      toast({
        variant: "destructive",
        title: "Failed to get tax advice",
        description: error.message || "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="Ask any tax-related question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="min-h-[100px]"
        />
        <Button 
          type="submit" 
          disabled={isLoading || !question.trim()}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Getting advice...
            </>
          ) : (
            "Get Tax Advice"
          )}
        </Button>
      </form>

      {advice && (
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h3 className="font-medium mb-2">Tax Advice:</h3>
          <p className="text-sm whitespace-pre-wrap">{advice}</p>
        </div>
      )}
    </div>
  );
};