import type { Metadata } from "next";

import { ContentLayout } from "@/components/platform/content-layout";
import { InviteUserForm } from "@/components/users/invite-user-form";

export const metadata: Metadata = {
  title: "Users",
};

export default function UsersPage() {
  return (
    <ContentLayout
      title="Users"
      description="Manage platform access for your team."
    >
      <InviteUserForm />
    </ContentLayout>
  );
}
