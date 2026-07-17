"use client";

import { useMembers } from "./members-provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { teamApi } from "@/services/api/admin/teamApi";
import { DeleteDialog } from "@/components/dialogs/delete-dialog";

export function DeleteUserDialog() {
  const { open, setOpen, currentRow } = useMembers();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => teamApi.deleteUser(currentRow!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "team"] });
      toast.success("User deleted.");
    },
  });

  if (!currentRow) return null;

  return (
    <DeleteDialog
      open={open === "delete"}
      onOpenChange={(val) => !val && setOpen(null)}
      title="Delete user"
      description={`This will permanently delete ${currentRow.name} and revoke their access. This action cannot be undone.`}
      onDelete={mutateAsync}
      isPending={isPending}
      confirmLabel="Delete"
      confirmPendingLabel="Deleting..."
    />
  );
}
