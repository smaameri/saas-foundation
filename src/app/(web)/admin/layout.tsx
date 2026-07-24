import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { requireSession } from "@/lib/auth/session";
import { serializeUser } from "@/serializers/userSerializer";
import { AdminLayout } from "@/components/layout/admin-layout";

function hasAdminPortalAccess(role?: string | null): boolean {
  return role != null;
}

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await requireSession();

  if (!hasAdminPortalAccess(session.user.role)) {
    redirect("/unauthorized");
  }

  return <AdminLayout user={serializeUser(session.user)}>{children}</AdminLayout>;
}
