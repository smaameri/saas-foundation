import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/app/app-sidebar";
import { HeaderUserButton } from "@/components/app/header-user-button";
import { SetPasswordModal } from "@/components/auth/set-password-modal";
import { prisma } from "@/lib/prisma";
import { fetchSession } from "@/lib/session";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await fetchSession();

  if (!session?.session) {
    redirect("/login");
  }

  const [user, account] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true, image: true, platformRole: true },
    }),
    prisma.account.findFirst({
      where: { userId: session.user.id, providerId: "credential" },
      select: { password: true },
    }),
  ]);

  const needsPassword = !account?.password;

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar
        name={user?.name ?? session.user.name ?? ""}
        email={user?.email ?? session.user.email ?? ""}
        role={user?.platformRole}
        image={user?.image}
      />
      <div className="flex flex-1 flex-col">
        {needsPassword ? <SetPasswordModal /> : null}
        <header className="flex h-12 shrink-0 items-center justify-end border-b px-4">
          <HeaderUserButton />
        </header>
        {children}
      </div>
    </div>
  );
}
