import type { Metadata } from "next";

import { ContentLayout } from "@/components/platform/content-layout";
import { InviteUserModal } from "@/components/users/invite-user-modal";
import { UsersTabs } from "@/components/users/users-tabs";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Users",
};

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <ContentLayout
      title="Users"
      description="Manage platform access for your team."
      actions={<InviteUserModal />}
    >
      <UsersTabs users={users} />
    </ContentLayout>
  );
}
