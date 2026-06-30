import type {ReactNode} from "react";

import {NavTabs} from "@/components/navigation/nav-tabs";
import {ContentLayout} from "@/components/platform/content-layout";
import {InviteOrgUserModal} from "@/components/organizations/invite-org-user-modal";
import {findAdminOrganization} from "@/repositories/admin/adminOrganizationRepository";

export default async function TeamLayout({children}: { children: ReactNode }) {
  const adminOrganization = await findAdminOrganization();

  if (!adminOrganization) throw new Error("Admin organization not found");

  return (
    <ContentLayout
      title="Team"
      description="Manage your internal team members and their access."
      actions={<InviteOrgUserModal organizationId={adminOrganization.id}/>}
    >
      <NavTabs tabs={[
        {label: "Users", href: "/admin/team/users"},
        {label: "Invitations", href: "/admin/team/invitations"},
      ]}/>
      {children}
    </ContentLayout>
  );
}

