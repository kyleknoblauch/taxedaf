import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";

const Support = () => {
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
          <h1 className="text-4xl font-bold">Support</h1>
        </div>
        
        <div className="space-y-6 text-foreground">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">How accurate are the tax calculations?</h3>
                <p>Our calculations are based on current tax rates and regulations but should be used as estimates only. Always consult a tax professional for final filing.</p>
              </div>
              <div>
                <h3 className="font-semibold">How is my data protected?</h3>
                <p>We use industry-standard encryption and security measures to protect your data. See our Privacy Policy for more details.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p>For support inquiries, please email us at:</p>
            <p className="font-semibold mt-2">support@taxedaf.com</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Response Time</h2>
            <p>We typically respond to support requests within 24-48 hours during business days.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Support;