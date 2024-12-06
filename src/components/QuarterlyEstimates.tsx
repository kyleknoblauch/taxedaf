import { Card } from "@/components/ui/card";
import { useAuth } from "./AuthProvider";
import { useToast } from "@/components/ui/use-toast";
import { useArchiveMutation } from "./quarterly-estimates/mutations/useArchiveMutation";
import { useTogglePaidMutation } from "./quarterly-estimates/mutations/useTogglePaidMutation";
import { useQuarterlyEstimatesData } from "@/hooks/useQuarterlyEstimatesData";
import { QuarterlyEstimateItem } from "./quarterly-estimates/QuarterlyEstimateItem";

export const QuarterlyEstimates = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const estimates = useQuarterlyEstimatesData(user?.id);
  
  const togglePaidMutation = useTogglePaidMutation(user?.id);
  const archiveMutation = useArchiveMutation(user?.id);

  if (!estimates?.length) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500">No quarterly estimates available yet.</p>
      </Card>
    );
  }

  const handleArchive = async (quarter: string) => {
    try {
      await archiveMutation.mutateAsync({ quarter });
      toast({
        title: "Quarter Archived",
        description: "The quarter and all related data have been archived successfully.",
      });
    } catch (error) {
      console.error('Error archiving quarter:', error);
      toast({
        title: "Error",
        description: "Failed to archive quarter. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-8">
        {estimates.map((quarter) => (
          <QuarterlyEstimateItem
            key={quarter.quarter}
            quarter={quarter}
            onArchive={handleArchive}
            onTogglePaid={togglePaidMutation.mutate}
          />
        ))}
      </div>
    </Card>
  );
};