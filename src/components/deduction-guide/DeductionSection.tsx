import { Card } from "@/components/ui/card";

interface DeductionSectionProps {
  title: string;
  items: string[];
}

export const DeductionSection = ({ title, items }: DeductionSectionProps) => {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <Card className="p-6 space-y-4">
        <ul className="list-disc pl-6 space-y-2">
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </Card>
    </section>
  );
};