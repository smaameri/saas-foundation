import type {Metadata} from "next";

import {ContentLayout} from "@/components/platform/content-layout";
import {InviteUserModal} from "@/components/users/invite-user-modal";
import {UsersTabs} from "@/components/users/users-tabs";
import {prisma} from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Users",
};

export default async function UsersPage() {
  const [users, organizations] = await Promise.all([
    prisma.user.findMany({
      where: {
        members: {
          some: {
            organization: {portals: {has: "customer"}},
          },
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        members: {
          select: {
            organization: {select: {id: true, name: true}},
          },
        },
      },
      orderBy: {createdAt: "asc"},
    }),
    prisma.organization.findMany({
      select: {id: true, name: true},
      orderBy: {name: "asc"},
    }),
  ]);

  return (
    <ContentLayout
      title="Users"
      description="Manage users on the platform."
      actions={<InviteUserModal organizations={organizations}/>}
    >
      <UsersTabs users={users}/>
    </ContentLayout>
  );
}
