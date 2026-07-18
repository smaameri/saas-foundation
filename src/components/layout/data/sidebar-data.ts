import { type SidebarData } from "../types";
import { Building2, KeyRound, LayoutDashboard, UserCog, Users } from "lucide-react";

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
      title: "Customers",
      items: [
        {
          title: "Organizations",
          url: "/admin/organizations",
          icon: Building2,
        },
        {
          title: "People",
          url: "/admin/people",
          icon: Users,
        },
      ],
    },
    {
      title: "Administration",
      items: [
        {
          title: "Team",
          url: "/admin/team",
          icon: UserCog,
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
