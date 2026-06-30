"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { invitationsApi } from "@/services/api/admin/invitationsApi";
import { Button } from "@/components/ui/button";

export function CancelInvitationButton({ invitationId }: { invitationId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await invitationsApi.cancelInvitation(invitationId);
          router.refresh();
        })
      }
    >
      {isPending ? "Canceling..." : "Cancel"}
    </Button>
  );
}
