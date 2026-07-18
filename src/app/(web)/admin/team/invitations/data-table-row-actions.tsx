"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Row } from "@tanstack/react-table";
import { XCircle } from "lucide-react";
import { toast } from "sonner";
import { invitationsApi } from "@/services/api/admin/invitationsApi";
import type { Invitation } from "@/services/api/types/invitation";
import { RowActionsDropdown } from "@/components/data-table/row-actions-dropdown";
import { DeleteDialog } from "@/components/dialogs/delete-dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

type InvitationsRowActionsProps = {
  row: Row<Invitation>;
};

export function InvitationsRowActions({ row }: InvitationsRowActionsProps) {
  const invitation = row.original;
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => invitationsApi.cancelAdminTeamInvitation(invitation.id),
    onSuccess: () => {
      toast.success("Invitation canceled.");
      void queryClient.invalidateQueries({ queryKey: ["admin", "team", "invitations"] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to cancel invitation.";
      toast.error(message);
    },
  });

  if (invitation.status !== "pending") {
    return null;
  }

  return (
    <>
      <RowActionsDropdown>
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => setOpenCancelDialog(true)}
        >
          Cancel invitation
          <XCircle size={16} className="ml-auto" />
        </DropdownMenuItem>
      </RowActionsDropdown>

      <DeleteDialog
        open={openCancelDialog}
        onOpenChange={setOpenCancelDialog}
        title="Cancel invitation"
        description={`Are you sure you want to cancel the invitation for ${invitation.email}?`}
        onDelete={() => mutateAsync()}
        isPending={isPending}
        confirmLabel="Cancel invite"
        confirmPendingLabel="Canceling..."
      />
    </>
  );
}
