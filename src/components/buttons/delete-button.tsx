"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CancelButton } from "@/components/buttons/cancel-button";
import { DestructiveButton } from "@/components/buttons/destructive-button";

interface DeleteButtonProps {
  title: string;
  description: string;
  onDelete: () => void;
  isPending?: boolean;
}

export function DeleteButton({ title, description, onDelete, isPending = false }: DeleteButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <CancelButton onClick={() => setOpen(false)} disabled={isPending} />
            <DestructiveButton onClick={onDelete} isPending={isPending} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
