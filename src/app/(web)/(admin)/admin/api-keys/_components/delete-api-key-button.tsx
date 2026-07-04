"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { apiKeysApi } from "@/api/admin/apiKeysApi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteApiKeyButtonProps {
  id: string;
  onDeleted?: () => void;
}

export function DeleteApiKeyButton({ id, onDeleted }: DeleteApiKeyButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    startTransition(async () => {
      await apiKeysApi.deleteApiKey(id);
      setOpen(false);
      onDeleted?.();
    });
  };

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
            <DialogTitle>Delete API key?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Any integrations using this key will stop working.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirm} disabled={isPending}>
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
