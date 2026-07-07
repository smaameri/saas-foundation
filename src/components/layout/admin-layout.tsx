"use client";

import { AppSidebar } from "@/components/layout/admin-sidebar";
import { BaseAuthenticatedLayout } from "@/components/layout/authenticated-layout";
import { Header } from "@/components/layout/header";
import { ProfileDropdown } from "@/components/profile-dropdown";

type NavUser = {
  name: string;
  email: string;
  image: string;
};

type AdminLayoutProps = {
  user: NavUser;
  children?: React.ReactNode;
};

export function AdminLayout({ user, children }: AdminLayoutProps) {
  return (
    <BaseAuthenticatedLayout
      sidebar={<AppSidebar user={user} />}
      header={
        <Header fixed>
          <div className="ml-auto">
            <ProfileDropdown name={user.name} email={user.email} image={user.image} />
          </div>
        </Header>
      }
    >
      {children}
    </BaseAuthenticatedLayout>
  );
}
