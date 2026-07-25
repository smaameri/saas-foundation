"use client";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { CustomerTitle } from "@/components/layout/customer/customer-title";
import { customerSidebarData } from "@/components/layout/customer/sidebar-data";
import { NavUser } from "@/components/layout/nav-user";
import type { User } from "@/types/user";

type SidebarProps = {
  user: User;
  activeOrganizationId: string;
};

export function Sidebar({ user, activeOrganizationId }: SidebarProps) {
  return (
    <AppSidebar
      header={<CustomerTitle />}
      navigationGroups={customerSidebarData.navGroups}
      footer={
        <NavUser
          user={user}
          portal="customer"
          accountUrl="/workspace/account"
          activeOrganizationId={activeOrganizationId}
        />
      }
    />
  );
}
