import { type SidebarData } from "../types";
import { Building2, KeyRound, LayoutDashboard, Users, UsersRound } from "lucide-react";

export const sidebarData: SidebarData = {
  user: {
    name: "",
    email: "",
    avatar: "",
  },
  teams: [],
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
          title: "Users",
          url: "/admin/users",
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
          icon: UsersRound,
        },
        {
          title: "API Keys",
          url: "/admin/api-keys",
          icon: KeyRound,
        },
      ],
    },
  ],
};
