"use client";

import { customerSidebarData } from "./sidebar-data";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { CustomerTitle } from "@/components/layout/customer/customer-title";
import { NavUser } from "@/components/layout/nav-user";
import type { User } from "@/types/user";

export function CustomerSidebar({ user }: { user: User }) {
  return (
    <AppSidebar
      header={<CustomerTitle />}
      navigationGroups={customerSidebarData.navGroups}
      footer={<NavUser user={user} />}
    />
  );
}
