"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function SignOutButton({ redirectTo, children }: { redirectTo?: string; children: React.ReactNode }) {
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
