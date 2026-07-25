"use client";

import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { CustomerSidebar } from "@/components/layout/customer/customer-sidebar";
import { Header } from "@/components/layout/header";
import { ProfileDropdown } from "@/components/profile-dropdown";
import type { User } from "@/types/user";

export function CustomerLayout({ user, children }: { user: User; children?: ReactNode }) {
  return (
    <AppShell
      header={
        <Header fixed>
          <div className="ml-auto">
            <ProfileDropdown user={user} />
          </div>
        </Header>
      }
      sidebar={<CustomerSidebar user={user} />}
    >
      {children}
    </AppShell>
  );
}
