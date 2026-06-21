import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/app/app-sidebar";
import { fetchSession } from "@/lib/session";

export default async function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await fetchSession();

  if (!session?.session) {
    redirect("/login");
  }

  const email = session.user?.email ?? null;

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar email={email} />
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
