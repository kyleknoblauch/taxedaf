import { useEffect } from "react";
import { Header } from "@/components/deduction-guide/Header";
import { DeductionSection } from "@/components/deduction-guide/DeductionSection";

const DeductionGuide = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const deductionSections = [
    {
      title: "Home Office Deductions",
      items: [
        "Portion of rent or mortgage interest",
        "Property taxes",
        "Utilities (proportional to office space)",
        "Home insurance",
        "Home repairs and maintenance",
      ],
    },
    {
      title: "Business Equipment & Supplies",
      items: [
        "Computers and technology",
        "Office furniture",
        "Software subscriptions",
        "Office supplies",
        "Printing and shipping costs",
        "Phone and internet services",
      ],
    },
    {
      title: "Professional Development",
      items: [
        "Training and education costs",
        "Professional certifications",
        "Books and publications",
        "Conference fees",
        "Online courses and workshops",
      ],
    },
    {
      title: "Travel & Transportation",
      items: [
        "Business travel expenses",
        "Vehicle expenses for business use",
        "Parking fees and tolls",
        "Public transportation costs",
        "Meals during business travel (50% deductible)",
      ],
    },
    {
      title: "Insurance & Healthcare",
      items: [
        "Health insurance premiums",
        "Business liability insurance",
        "Professional liability insurance",
        "Workers compensation insurance",
      ],
    },
    {
      title: "Professional Services",
      items: [
        "Legal fees",
        "Accounting services",
        "Tax preparation fees",
        "Consulting fees",
        "Business coaching",
      ],
    },
    {
      title: "Marketing & Advertising",
      items: [
        "Website costs",
        "Social media advertising",
        "Business cards and promotional materials",
        "Email marketing services",
        "SEO and digital marketing services",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Header />
        <div className="prose dark:prose-invert max-w-none space-y-8">
          {deductionSections.map((section, index) => (
            <DeductionSection
              key={index}
              title={section.title}
              items={section.items}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeductionGuide;