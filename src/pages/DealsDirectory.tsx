import { useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { trackDealsDirectoryOpened } from "@/utils/omnisendEvents";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const DealsDirectory = () => {
  const { user } = useAuth();

  useEffect(() => {
    const trackPageView = async () => {
      if (user?.email) {
        await trackDealsDirectoryOpened(user.email);
      }
    };
    trackPageView();
  }, [user?.email]);

  const deals = [
    {
      name: "QuickBooks Self-Employed",
      description: "Track mileage, sort expenses, and calculate quarterly taxes automatically.",
      discount: "50% off for 3 months",
      link: "https://quickbooks.intuit.com/self-employed/",
    },
    {
      name: "FreshBooks",
      description: "Cloud accounting software designed for small business owners.",
      discount: "60% off for first 6 months",
      link: "https://www.freshbooks.com/",
    },
    {
      name: "TaxAct",
      description: "File your taxes online with confidence.",
      discount: "25% off federal and state returns",
      link: "https://www.taxact.com/",
    },
    {
      name: "H&R Block",
      description: "Get your taxes done right with expert help.",
      discount: "20% off online filing",
      link: "https://www.hrblock.com/",
    },
  ];

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Exclusive Deals for Freelancers
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Save money on the tools you need to manage your business
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {deals.map((deal, index) => (
            <Card key={index} className="p-6">
              <h3 className="text-xl font-semibold mb-2">{deal.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {deal.description}
              </p>
              <div className="bg-primary/10 text-primary rounded-md px-3 py-1 inline-block mb-4">
                {deal.discount}
              </div>
              <Button
                className="w-full flex items-center justify-center gap-2"
                variant="outline"
                asChild
              >
                <a href={deal.link} target="_blank" rel="noopener noreferrer">
                  Get Deal
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </Card>
          ))}
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          * Deals and discounts are subject to change. Please verify all offers on the provider's website.
        </p>
      </div>
    </div>
  );
};

export default DealsDirectory;