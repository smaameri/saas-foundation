import type { ReactNode } from "react";
import { InviteTeamMemberModal } from "./_components/invite-team-member-modal";
import { findAdminOrganization } from "@/repositories/admin/adminOrganizationRepository";
import { NavTabs } from "@/components/navigation/nav-tabs";
import { ContentLayout } from "@/components/platform/content-layout";

export default async function TeamLayout({ children }: { children: ReactNode }) {
  const adminOrganization = await findAdminOrganization();

  if (!adminOrganization) throw new Error("Admin organization not found");

  return (
    <ContentLayout
      title="Team"
      description="Manage your internal team members and their access."
      actions={<InviteTeamMemberModal organizationId={adminOrganization.id} />}
    >
      <NavTabs
        tabs={[
          { label: "Users", href: "/admin/team/users" },
          { label: "Invitations", href: "/admin/team/invitations" },
        ]}
      />
      {children}
    </ContentLayout>
  );
}
