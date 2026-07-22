"use client";

import { useMemo } from "react";
import { customerSidebarData } from "./sidebar-data";
import { CustomerTitle } from "@/components/layout/customer/customer-title";
import { NavGroup } from "@/components/layout/nav-group";
import { NavUser } from "@/components/layout/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useLayout } from "@/context/layout-provider";
import type { User } from "@/types/user";

export function CustomerSidebar({ user }: { user: User }) {
  const { collapsible, variant } = useLayout();
  const navGroups = useMemo(() => customerSidebarData.navGroups, []);

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <CustomerTitle />
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((group) => (
          <NavGroup key={group.title} {...group} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
