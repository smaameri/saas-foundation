"use client";

import { useEffect, useState } from "react";
import { permissionsService } from "@/services/permissions/permissionsService";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTitle } from "@/components/layout/app-title";
import { NavUser } from "@/components/layout/nav-user";
import type { NavGroup as NavGroupType } from "@/components/layout/types";
import { menu } from "@/app/(web)/admin/_components/menu";
import type { User } from "@/types/user";

type SidebarProps = {
  user: User;
};

export function Sidebar({ user }: SidebarProps) {
  const [navGroups, setNavGroups] = useState<NavGroupType[]>(() =>
    menu.navGroups.map((group) => ({
      ...group,
      items: group.items.filter((item) => !item.permissions),
    })),
  );

  useEffect(() => {
    async function filterNavItems() {
      const filtered = await Promise.all(
        menu.navGroups.map(async (group) => {
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
    <AppSidebar
      header={<AppTitle />}
      navigationGroups={navGroups}
      footer={<NavUser user={user} />}
    />
  );
}
