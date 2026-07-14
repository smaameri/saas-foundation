"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    const result = await authClient.signOut();

    if (!result.error) {
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <Button onClick={handleSignOut} size="sm" variant="outline">
      Log out
    </Button>
  );
}
