"use client";

import { useOrganizationMembers } from "./members-provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usersApi } from "@/services/api/admin/usersApi";
import { CancelButton } from "@/components/buttons/cancel-button";
import { PrimaryButton } from "@/components/buttons/primary-button";
import { MutationError } from "@/components/feedback/mutation-error";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function UnbanUserDialog() {
  const { open, setOpen, currentRow } = useOrganizationMembers();
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async () => {
      if (!currentRow) return;
      await usersApi.unbanUser(currentRow.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "organizations", "members"] });
      toast.success("User unbanned.");
      setOpen(null);
    },
  });

  const handleOpenChange = (value: boolean) => {
    if (!value) setOpen(null);
  };

  if (!currentRow) return null;

  return (
    <Dialog open={open === "unban"} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Unban user</DialogTitle>
          <DialogDescription>Allow {currentRow.name} to sign in again.</DialogDescription>
        </DialogHeader>

        <MutationError
          isError={isError}
          error={error}
          fallback="Failed to unban user. Please try again."
        />

        <DialogFooter className="flex justify-end gap-2">
          <CancelButton onClick={() => setOpen(null)} disabled={isPending} />
          <PrimaryButton
            type="button"
            onClick={() => mutate()}
            isPending={isPending}
            pendingLabel="Unbanning..."
          >
            Unban user
          </PrimaryButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
