"use client";

import { CancelButton } from "@/components/buttons/cancel-button";
import { DestructiveButton } from "@/components/buttons/destructive-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onDelete: () => void;
  isPending?: boolean;
}

export function DeleteDialog({
  open,
  onOpenChange,
  title,
  description,
  onDelete,
  isPending = false,
}: DeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <CancelButton onClick={() => onOpenChange(false)} disabled={isPending} />
          <DestructiveButton onClick={onDelete} isPending={isPending} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
