import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { auth } from "@/lib/auth/auth";
import { requireSession } from "@/lib/auth/session";
import { listUserOrganizations } from "@/repositories/customers/organizationRepository";
import { serializeUser } from "@/serializers/userSerializer";
import { AppShell } from "@/components/layout/app-shell";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/app/(web)/(customer)/workspace/(portal)/_components/sidebar";

export default async function CustomerPortalLayout({ children }: { children: ReactNode }) {
  const session = await requireSession();
  const organizations = await listUserOrganizations(session.user.id);
  const requestHeaders = await headers();

  if (organizations.length === 0) {
    redirect("/workspace/no-organization");
  }

  const activeOrganizationId = session.session.activeOrganizationId;
  let activeOrganization = organizations.find(
    (organization) => organization.id === activeOrganizationId,
  );

  if (!activeOrganization) {
    if (organizations.length === 1) {
      activeOrganization = organizations[0];
      await auth.api.setActiveOrganization({
        body: {
          organizationId: activeOrganization.id,
          organizationSlug: activeOrganization.slug ?? undefined,
        },
        headers: requestHeaders,
      });
    } else {
      redirect("/workspace/select-organization");
    }
  }

  const user = serializeUser(session.user);

  return (
    <AppShell
      header={<Header fixed shadowOnScroll={false} />}
      sidebar={
        <Sidebar
          user={user}
          activeOrganizationId={activeOrganization.id}
          organizationName={activeOrganization.name}
        />
      }
    >
      {children}
    </AppShell>
  );
}
