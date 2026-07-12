import type { ReactNode } from "react";
import { InviteTeamMemberModal } from "./_components/invite-team-member-modal";
import { findAdminOrganization } from "@/repositories/admin/adminOrganizationRepository";
import { NavTabs } from "@/components/navigation/nav-tabs";
import { ContentLayout } from "@/components/platform/content-layout";

export default async function MembersLayout({ children }: { children: ReactNode }) {
  const adminOrganization = await findAdminOrganization();

  if (!adminOrganization) throw new Error("Admin organization not found");

  return (
    <ContentLayout
      title="Members"
      description="Manage your organization's members and invitations."
      actions={<InviteTeamMemberModal organizationId={adminOrganization.id} />}
    >
      <NavTabs
        tabs={[
          { label: "Members", href: "/admin/members" },
          { label: "Invitations", href: "/admin/members/invitations" },
        ]}
      />
      {children}
    </ContentLayout>
  );
}
