"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { DeleteDialog } from "@/components/dialogs/delete-dialog";
import { Button } from "@/components/ui/button";

interface DeleteButtonProps {
  title: string;
  description: string;
  onDelete: () => void;
  isPending?: boolean;
}

export function DeleteButton({
  title,
  description,
  onDelete,
  isPending = false,
}: DeleteButtonProps) {
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

      <DeleteDialog
        open={open}
        onOpenChange={setOpen}
        title={title}
        description={description}
        onDelete={onDelete}
        isPending={isPending}
      />
    </>
  );
}
