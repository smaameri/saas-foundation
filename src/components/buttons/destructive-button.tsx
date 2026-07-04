"use client";

import { Button } from "@/components/ui/button";

interface DestructiveButtonProps {
  onClick: () => void;
  isPending?: boolean;
}

export function DestructiveButton({ onClick, isPending = false }: DestructiveButtonProps) {
  return (
    <Button variant="destructive" onClick={onClick} disabled={isPending}>
      {isPending ? "Deleting..." : "Delete"}
    </Button>
  );
}
