import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardBlocks } from "@/components/dashboard/DashboardBlocks";

const Dashboard = () => {
  const location = useLocation();
  const [items, setItems] = useState([
    { id: "saved-estimates", title: "Saved Estimates", defaultOpen: true },
    { id: "add-expense", title: "Add Deduction", defaultOpen: true },
    { id: "tax-summary", title: "Tax Summary", defaultOpen: true },
    { id: "quarterly-estimates", title: "Quarterly Tax Estimates", defaultOpen: true },
    { id: "archived-quarters", title: "Archived Quarters", defaultOpen: false },
    { id: "tax-information", title: "General Tax Information", defaultOpen: false },
  ]);

  useEffect(() => {
    if (location.state?.scrollToTop || location.state?.fromSaveEstimate) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (location.state?.expandDeductions) {
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

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader />
        <div className="mt-8">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <DashboardBlocks items={items} />
          </DndContext>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;