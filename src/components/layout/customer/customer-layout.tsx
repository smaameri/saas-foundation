"use client";

import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Header } from "@/components/layout/header";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Sidebar } from "@/app/(web)/(customer)/workspace/(portal)/_components/sidebar";
import type { User } from "@/types/user";

type CustomerLayoutProps = {
  user: User;
  activeOrganizationId: string;
  children?: ReactNode;
};

export function CustomerLayout({ user, activeOrganizationId, children }: CustomerLayoutProps) {
  return (
    <AppShell
      header={
        <Header fixed>
          <div className="ml-auto">
            <ProfileDropdown user={user} />
          </div>
        </Header>
      }
      sidebar={<Sidebar user={user} activeOrganizationId={activeOrganizationId} />}
    >
      {children}
    </AppShell>
  );
}
