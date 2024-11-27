import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ExpenseForm } from "@/components/ExpenseForm";
import { TaxSummary } from "@/components/TaxSummary";
import { DraggableBlock } from "@/components/dashboard/DraggableBlock";

const Dashboard = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([
    { id: "saved-estimates", title: "Saved Estimates" },
    { id: "tax-summary", title: "Tax Summary" },
    { id: "add-expense", title: "Add Expense" },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const renderBlockContent = (id: string) => {
    switch (id) {
      case "saved-estimates":
        return <div>Saved Estimates content here</div>;
      case "tax-summary":
        return <TaxSummary />;
      case "add-expense":
        return <ExpenseForm />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Tax Dashboard</h1>
          <Button 
            variant="outline"
            onClick={() => navigate("/")}
            className="self-start"
          >
            Back to Calculator
          </Button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
            {items.map((item) => (
              <DraggableBlock
                key={item.id}
                id={item.id}
                title={item.title}
              >
                {renderBlockContent(item.id)}
              </DraggableBlock>
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default Dashboard;