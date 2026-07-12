"use client";

import { useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { invitationsApi } from "@/services/api/admin/invitationsApi";
import { Button } from "@/components/ui/button";

export function CancelInvitationButton({ invitationId }: { invitationId: string }) {
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await invitationsApi.cancelInvitation(invitationId);
          queryClient.invalidateQueries({ queryKey: ["admin", "invitations"] });
        })
      }
    >
      {isPending ? "Canceling..." : "Cancel"}
    </Button>
  );
}
