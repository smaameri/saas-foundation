import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { auth } from "@/lib/auth/auth";
import { requireSession } from "@/lib/auth/session";
import { listUserOrganizations } from "@/repositories/customers/organizationRepository";

export default async function CustomerPortalLayout({ children }: { children: ReactNode }) {
  const session = await requireSession();
  const organizations = await listUserOrganizations(session.user.id);
  const requestHeaders = await headers();

  if (organizations.length === 0) {
    redirect("/workspace/no-organization");
  }

  const activeOrganizationId = session.session.activeOrganizationId;
  const organizationIds = new Set(organizations.map((organization) => organization.id));
  const hasValidActiveOrganization =
    activeOrganizationId != null && organizationIds.has(activeOrganizationId);

  if (!hasValidActiveOrganization) {
    if (organizations.length === 1) {
      const organization = organizations[0];
      await auth.api.setActiveOrganization({
        body: {
          organizationId: organization.id,
          organizationSlug: organization.slug ?? undefined,
        },
        headers: requestHeaders,
      });
      session.session.activeOrganizationId = organization.id;
    } else {
      redirect("/workspace/select-organization");
    }
  }

  return <>{children}</>;
}
