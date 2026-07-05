"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function SignOutButton({
  redirectTo,
  children,
}: {
  redirectTo?: string;
  children: React.ReactNode;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSignOut = () => {
    startTransition(async () => {
      await authClient.signOut();
      router.push(redirectTo ? `/login?redirect=${encodeURIComponent(redirectTo)}` : "/login");
    });
  };

  return (
    <Button onClick={handleSignOut} disabled={isPending}>
      {isPending ? "Signing out..." : children}
    </Button>
  );
}
