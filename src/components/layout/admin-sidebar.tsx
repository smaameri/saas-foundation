"use client";

import { useEffect, useState } from "react";
import { sidebarData } from "./data/sidebar-data";
import { NavGroup } from "./nav-group";
import { NavUser } from "./nav-user";
import { type NavGroup as NavGroupType } from "./types";
import { permissionsService } from "@/services/permissions/permissionsService";
import { AppTitle } from "@/components/layout/app-title";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useLayout } from "@/context/layout-provider";
import type { User } from "@/types/user";

type AppSidebarProps = {
  user: User;
};

export function AppSidebar({ user }: AppSidebarProps) {
  const { collapsible, variant } = useLayout();
  const [navGroups, setNavGroups] = useState<NavGroupType[]>(() =>
    sidebarData.navGroups.map((group) => ({
      ...group,
      items: group.items.filter((item) => !item.permissions),
    })),
  );

  useEffect(() => {
    async function filterNavItems() {
      const filtered = await Promise.all(
        sidebarData.navGroups.map(async (group) => {
          const items = await Promise.all(
            group.items.map(async (item) => {
              if (!item.permissions) return item;
              const allowed = await permissionsService.can(item.permissions);
              return allowed ? item : null;
            }),
          );
          return { ...group, items: items.filter((item) => item !== null) };
        }),
      );
      setNavGroups(filtered);
    }

    void filterNavItems();
  }, []);

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <AppTitle />
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
