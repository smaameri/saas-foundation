import type { Metadata } from "next";

import { InviteOrgUserModal } from "@/components/organizations/invite-org-user-modal";
import { ContentLayout } from "@/components/platform/content-layout";
import { UsersTabs } from "@/components/users/users-tabs";
import {
  findAdminOrganization,
  listAdminInvitations,
  listAdminUsers,
} from "@/repositories/admin/adminOrganizationRepository";

export const metadata: Metadata = {
  title: "Team",
};

export default async function TeamPage() {
  const [adminOrganization, users, invitations] = await Promise.all([
    findAdminOrganization(),
    listAdminUsers(),
    listAdminInvitations(),
  ]);

  return (
    <ContentLayout
      title="Team"
      description="Manage your internal team members and their access."
      actions={adminOrganization ? <InviteOrgUserModal organizationId={adminOrganization.id} /> : null}
    >
      <UsersTabs users={users} invitations={invitations} />
    </ContentLayout>
  );
}
