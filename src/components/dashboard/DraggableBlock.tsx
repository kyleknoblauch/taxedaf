import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { Minus, Plus, GripVertical } from "lucide-react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface DraggableBlockProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

export const DraggableBlock = ({ id, title, children }: DraggableBlockProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card className="mb-6">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex items-center p-4">
            <div className="cursor-move" {...listeners}>
              <GripVertical className="h-4 w-4 text-gray-400 mr-2" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 flex-1">{title}</h2>
            <CollapsibleTrigger asChild>
              <button className="p-1 hover:bg-gray-100 rounded-full">
                {isOpen ? (
                  <Minus className="h-4 w-4 text-gray-600" />
                ) : (
                  <Plus className="h-4 w-4 text-gray-600" />
                )}
              </button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <div className="p-4 pt-0">
              {children}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
};