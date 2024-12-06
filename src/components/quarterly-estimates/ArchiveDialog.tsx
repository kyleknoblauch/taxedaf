import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Archive, ArchiveRestore } from "lucide-react";

interface ArchiveDialogProps {
  isArchived: boolean;
  canUnarchive: boolean;
  onConfirm: () => void;
  loading?: boolean;
}

export const ArchiveDialog = ({ isArchived, canUnarchive, onConfirm, loading }: ArchiveDialogProps) => {
  if (isArchived && !canUnarchive) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2 text-gray-500 cursor-not-allowed"
        disabled
      >
        <Archive className="h-4 w-4" />
        Archived
      </Button>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
        >
          {isArchived ? (
            <>
              <ArchiveRestore className="h-4 w-4" />
              Unarchive
            </>
          ) : (
            <>
              <Archive className="h-4 w-4" />
              Archive
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isArchived ? "Unarchive Estimate" : "Archive Estimate"}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isArchived
              ? "Are you sure you want to unarchive this quarterly estimate? This will make it visible in the main list again."
              : "Are you sure you want to archive this quarterly estimate? It will be moved to the archived estimates section."}
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