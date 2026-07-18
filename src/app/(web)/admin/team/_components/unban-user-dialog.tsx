"use client";

import { useMembers } from "./members-provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { teamApi } from "@/services/api/admin/teamApi";
import { DeleteDialog } from "@/components/dialogs/delete-dialog";

export function UnbanUserDialog() {
  const { open, setOpen, currentRow, currentUserId } = useMembers();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => teamApi.unbanUser(currentRow!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "team"] });
      toast.success("User unbanned.");
      setOpen(null);
    },
  });

  if (!currentRow || currentRow.id === currentUserId) return null;

  return (
    <DeleteDialog
      open={open === "unban"}
      onOpenChange={(val) => !val && setOpen(null)}
      title="Unban user"
      description={`${currentRow.name} will regain access to the admin portal.`}
      onDelete={mutateAsync}
      isPending={isPending}
      confirmLabel="Unban"
      confirmPendingLabel="Unbanning..."
    />
  );
}
