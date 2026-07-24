import { type SidebarData } from "../types";
import { KeyRound, LayoutDashboard, UserCog, Users } from "lucide-react";

export const sidebarData: SidebarData = {
  navGroups: [
    {
      title: "General",
      items: [
        {
          title: "Dashboard",
          url: "/admin/dashboard",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: "Platform",
      items: [
        {
          title: "Organizations",
          url: "/admin/organizations",
          icon: Users,
        },
      ],
    },
    {
      title: "Administration",
      items: [
        {
          title: "Admin Team",
          url: "/admin/team",
          icon: UserCog,
        },
        {
          title: "Users",
          url: "/admin/users",
          icon: Users,
        },
        {
          title: "API Keys",
          url: "/admin/api-keys",
          icon: KeyRound,
          permissions: { apiKey: ["read:any"] },
        },
      ],
    },
  ],
};
