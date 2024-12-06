import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface MarkAsPaidDialogProps {
  isPaid: boolean;
  onConfirm: () => void;
  loading?: boolean;
}

export const MarkAsPaidDialog = ({ isPaid, onConfirm, loading }: MarkAsPaidDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={isPaid ? "outline" : "default"}
          size="sm"
          className="flex items-center gap-2"
        >
          <CheckCircle className="h-4 w-4" />
          {isPaid ? "Paid" : "Mark as Paid"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isPaid ? "Remove Paid Status" : "Mark as Paid"}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isPaid
              ? "Are you sure you want to remove the paid status for this quarterly estimate?"
              : "Are you sure you want to mark this quarterly estimate as paid?"}
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <DialogTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </DialogTrigger>
          <DialogTrigger asChild>
            <Button onClick={onConfirm} disabled={loading}>
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⭮</span>
                  Processing...
                </>
              ) : (
                "Confirm"
              )}
            </Button>
          </DialogTrigger>
        </div>
      </DialogContent>
    </Dialog>
  );
};