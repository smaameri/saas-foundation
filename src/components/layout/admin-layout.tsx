"use client";

import React from "react";
import { AppSidebar } from "@/components/layout/admin-sidebar";
import { BaseAuthenticatedLayout } from "@/components/layout/authenticated-layout";
import { Header } from "@/components/layout/header";
import { ProfileDropdown } from "@/components/profile-dropdown";
import type { User } from "@/types/user";

type AdminLayoutProps = {
  user: User;
  children?: React.ReactNode;
};

export function AdminLayout({ user, children }: AdminLayoutProps) {
  return (
    <BaseAuthenticatedLayout
      header={
        <Header fixed>
          <div className="ml-auto">
            <ProfileDropdown user={user} />
          </div>
        </Header>
      }
      sidebar={<AppSidebar user={user} />}
    >
      {children}
    </BaseAuthenticatedLayout>
  );
}
