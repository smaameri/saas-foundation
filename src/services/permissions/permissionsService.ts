"use client";

import { authClient } from "@/lib/auth-client";
import { type Permissions } from "@/lib/permissions";

type OrgRole = "owner" | "admin" | "member";

let cachedRole: OrgRole | null = null;

async function getRole(): Promise<OrgRole | null> {
  if (cachedRole) return cachedRole;

  const result = await authClient.organization.getActiveMember();

  if (result.data?.role) {
    cachedRole = result.data.role as OrgRole;
  }

  return cachedRole;
}

export const permissionsService = {
  can: async (permissions: Permissions): Promise<boolean> => {
    const role = await getRole();
    if (!role) return false;
    return authClient.organization.checkRolePermission({ permissions, role });
  },

  clearCache: () => {
    cachedRole = null;
  },
};
