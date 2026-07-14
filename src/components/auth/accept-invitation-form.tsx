"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { authClient } from "@/lib/auth/auth-client";
import { Button } from "@/components/ui/button";

export function AcceptInvitationForm({ invitationId }: { invitationId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleAccept = () => {
    startTransition(async () => {
      const result = await authClient.organization.acceptInvitation({ invitationId });
      if (result.error) {
        console.error(result.error);
        return;
      }
      router.push("/");
    });
  };

  return (
    <Button onClick={handleAccept} disabled={isPending}>
      {isPending ? "Accepting..." : "Accept invitation"}
    </Button>
  );
}
