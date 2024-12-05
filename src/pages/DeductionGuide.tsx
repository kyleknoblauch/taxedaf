import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";

const DeductionGuide = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-4xl font-display font-black text-foreground">
            Tax Deductions for Self-Employed
          </h1>
        </div>

        <div className="prose dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Home Office Deductions</h2>
            <Card className="p-6 space-y-4">
              <p>If you use part of your home regularly and exclusively for business, you can deduct:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Portion of rent or mortgage interest</li>
                <li>Property taxes</li>
                <li>Utilities (proportional to office space)</li>
                <li>Home insurance</li>
                <li>Home repairs and maintenance</li>
              </ul>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Business Equipment & Supplies</h2>
            <Card className="p-6 space-y-4">
              <ul className="list-disc pl-6 space-y-2">
                <li>Computers and technology</li>
                <li>Office furniture</li>
                <li>Software subscriptions</li>
                <li>Office supplies</li>
                <li>Printing and shipping costs</li>
                <li>Phone and internet services</li>
              </ul>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Professional Development</h2>
            <Card className="p-6 space-y-4">
              <ul className="list-disc pl-6 space-y-2">
                <li>Training and education costs</li>
                <li>Professional certifications</li>
                <li>Books and publications</li>
                <li>Conference fees</li>
                <li>Online courses and workshops</li>
              </ul>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Travel & Transportation</h2>
            <Card className="p-6 space-y-4">
              <ul className="list-disc pl-6 space-y-2">
                <li>Business travel expenses</li>
                <li>Vehicle expenses for business use</li>
                <li>Parking fees and tolls</li>
                <li>Public transportation costs</li>
                <li>Meals during business travel (50% deductible)</li>
              </ul>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Insurance & Healthcare</h2>
            <Card className="p-6 space-y-4">
              <ul className="list-disc pl-6 space-y-2">
                <li>Health insurance premiums</li>
                <li>Business liability insurance</li>
                <li>Professional liability insurance</li>
                <li>Workers compensation insurance</li>
              </ul>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Professional Services</h2>
            <Card className="p-6 space-y-4">
              <ul className="list-disc pl-6 space-y-2">
                <li>Legal fees</li>
                <li>Accounting services</li>
                <li>Tax preparation fees</li>
                <li>Consulting fees</li>
                <li>Business coaching</li>
              </ul>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Marketing & Advertising</h2>
            <Card className="p-6 space-y-4">
              <ul className="list-disc pl-6 space-y-2">
                <li>Website costs</li>
                <li>Social media advertising</li>
                <li>Business cards and promotional materials</li>
                <li>Email marketing services</li>
                <li>SEO and digital marketing services</li>
              </ul>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DeductionGuide;