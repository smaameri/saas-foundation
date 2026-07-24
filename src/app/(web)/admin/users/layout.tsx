import type { ReactNode } from "react";
import { NavTabs } from "@/components/navigation/nav-tabs";
import { ContentLayout } from "@/components/platform/content-layout";

export default function UsersLayout({ children }: { children: ReactNode }) {
  return (
    <ContentLayout title="Users" description="Manage users and invitations across the platform.">
      <NavTabs
        tabs={[
          { label: "Users", href: "/admin/users" },
          { label: "Invitations", href: "/admin/users/invitations" },
        ]}
      />
      {children}
    </ContentLayout>
  );
}
