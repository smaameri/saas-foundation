import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/app/app-sidebar";
import { prisma } from "@/lib/prisma";
import { fetchSession } from "@/lib/session";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await fetchSession();

  if (!session?.session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, image: true, platformRole: true },
  });

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar
        name={user?.name ?? session.user.name ?? ""}
        email={user?.email ?? session.user.email ?? ""}
        role={user?.platformRole}
        image={user?.image}
      />
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
