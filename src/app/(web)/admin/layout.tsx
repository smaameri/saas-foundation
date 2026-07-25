import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { requireSession } from "@/lib/auth/session";
import { serializeUser } from "@/serializers/userSerializer";
import { AppShell } from "@/components/layout/app-shell";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/app/(web)/admin/_components/sidebar";

function hasAdminPortalAccess(role?: string | null): boolean {
  return role != null;
}

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await requireSession();

  if (!hasAdminPortalAccess(session.user.role)) {
    redirect("/unauthorized");
  }

  const user = serializeUser(session.user);

  return (
    <AppShell header={<Header fixed />} sidebar={<Sidebar user={user} />}>
      {children}
    </AppShell>
  );
}
