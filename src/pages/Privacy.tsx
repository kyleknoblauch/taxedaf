import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";

const Privacy = () => {
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
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
        </div>
        
        <div className="space-y-6 text-foreground">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Information Collection</h2>
            <p>We collect information that you provide directly to us, including when you create an account, use our services, or contact us for support.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Use of Information</h2>
            <p>We use the information we collect to provide, maintain, and improve our services, to process your tax calculations, and to communicate with you.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p>We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or destruction.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Sharing</h2>
            <p>We do not sell your personal information. We may share your information with third-party service providers who assist us in operating our services.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;