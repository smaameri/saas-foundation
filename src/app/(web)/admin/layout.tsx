import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { auth } from "@/lib/auth/auth";
import { requireSession } from "@/lib/auth/session";
import { serializeUser } from "@/serializers/userSerializer";
import { AdminLayout } from "@/components/layout/admin-layout";

function hasAdminPortalAccess(role?: string | null): boolean {
  return role != null;
}

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await requireSession();

  if (session.session.activeOrganizationId) {
    await auth.api.setActiveOrganization({
      body: { organizationId: null },
      headers: await headers(),
    });
    session.session.activeOrganizationId = null;
  }

  if (!hasAdminPortalAccess(session.user.role)) {
    redirect("/unauthorized");
  }

  return <AdminLayout user={serializeUser(session.user)}>{children}</AdminLayout>;
}
