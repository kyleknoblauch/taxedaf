import { DraggableBlock } from "./DraggableBlock";
import { SavedEstimates } from "@/components/SavedEstimates";
import { QuarterlyEstimates } from "@/components/QuarterlyEstimates";
import { ExpenseForm } from "@/components/ExpenseForm";
import { TaxSummary } from "@/components/TaxSummary";
import { TaxInformation } from "@/components/TaxInformation";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

interface DashboardItem {
  id: string;
  title: string;
  defaultOpen: boolean;
}

interface DashboardBlocksProps {
  items: DashboardItem[];
}

const renderBlockContent = (id: string) => {
  switch (id) {
    case "saved-estimates":
      return <SavedEstimates />;
    case "quarterly-estimates":
      return <QuarterlyEstimates />;
    case "add-expense":
      return <ExpenseForm />;
    case "tax-summary":
      return <TaxSummary />;
    case "tax-information":
      return <TaxInformation />;
    default:
      return null;
  }
};

export const DashboardBlocks = ({ items }: DashboardBlocksProps) => {
  return (
    <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item) => (
          <DraggableBlock
            key={item.id}
            id={item.id}
            title={item.title}
            defaultOpen={item.defaultOpen}
          >
            {renderBlockContent(item.id)}
          </DraggableBlock>
        ))}
      </div>
    </SortableContext>
  );
};