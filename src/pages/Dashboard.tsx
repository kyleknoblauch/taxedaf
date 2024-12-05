import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { ExpenseForm } from "@/components/ExpenseForm";
import { TaxSummary } from "@/components/TaxSummary";
import { DraggableBlock } from "@/components/dashboard/DraggableBlock";
import { SavedEstimates } from "@/components/SavedEstimates";
import { TaxInformation } from "@/components/TaxInformation";
import { DarkModeToggle } from "@/components/DarkModeToggle";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [items, setItems] = useState([
    { id: "saved-estimates", title: "Saved Estimates", defaultOpen: true },
    { id: "add-expense", title: "Add Deduction", defaultOpen: true },
    { id: "tax-summary", title: "Tax Summary", defaultOpen: true },
    { id: "tax-information", title: "General Tax Information", defaultOpen: false },
  ]);

  useEffect(() => {
    if (location.state?.scrollToTop || location.state?.fromSaveEstimate) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (location.state?.expandDeductions) {
      // Move add-expense to the top if it's not already there
      setItems(prevItems => {
        const currentIndex = prevItems.findIndex(item => item.id === "add-expense");
        if (currentIndex === 0) return prevItems;
        
        const newItems = [...prevItems];
        const [movedItem] = newItems.splice(currentIndex, 1);
        newItems.unshift({ ...movedItem, defaultOpen: true });
        return newItems;
      });
    }
  }, [location.state]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
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
        return <SavedEstimates />;
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

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="relative">
          <div className="absolute right-0 top-0">
            <DarkModeToggle />
          </div>
          
          <div className="space-y-4 pt-10 sm:pt-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-4xl font-display font-black text-foreground">
                taxed<span className="text-primary">AF</span> Dashboard
              </h1>
            </div>

            <p className="text-lg text-muted-foreground">
              It's wild how much we're taxed on our earnings, but owing the state with penalties is worse. Calculate your taxes, deduct your expenses and don't pay the IRS a dime more than you need to.
            </p>

            <div className="sm:hidden">
              <Button 
                variant="outline"
                onClick={() => navigate("/")}
                className="w-full text-primary hover:text-primary/90"
              >
                Add Another Invoice
              </Button>
            </div>

            <div className="hidden sm:block">
              <Button 
                variant="outline"
                onClick={() => navigate("/")}
                className="text-primary hover:text-primary/90"
              >
                Add Another Invoice
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
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
          </DndContext>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;