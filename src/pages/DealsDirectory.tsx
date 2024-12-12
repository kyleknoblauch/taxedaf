import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bitcoin } from "lucide-react";
import { useEffect } from "react";

const DealsDirectory = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-4xl font-bold">Deals Directory</h1>
        </div>
        
        <div className="space-y-8 text-foreground">
          <section>
            <h2 className="text-2xl font-semibold mb-6">Cryptocurrency Deals</h2>
            <div className="grid gap-6">
              <div className="p-6 rounded-lg border bg-card">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900">
                    <Bitcoin className="h-6 w-6 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">Strike Bitcoin Trading</h3>
                    <p className="text-muted-foreground mb-4">Get $100 of fee-free bitcoin trading when you sign up using our link.</p>
                    <a 
                      href="https://invite.strike.me/ROBMFZ" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block"
                    >
                      <Button>
                        Claim Deal
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">About Our Deals</h2>
            <p className="text-muted-foreground">
              We carefully select partnerships that provide value to our users. Some links may be affiliate links, 
              meaning we may earn a commission if you make a purchase through these links, at no extra cost to you.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DealsDirectory;