"use client";

import { authClient } from "@/lib/auth/auth-client";
import { type Permissions } from "@/lib/auth/permissions";

type AdminRole = "admin" | "user";

let cachedRole: AdminRole | null = null;

async function getRole(): Promise<AdminRole | null> {
  if (cachedRole) return cachedRole;

  const { data } = await authClient.getSession();

  if (data?.user?.role) {
    cachedRole = data.user.role as AdminRole;
  }

  return cachedRole;
}

export const permissionsService = {
  can: async (permissions: Permissions): Promise<boolean> => {
    const role = await getRole();
    if (!role) return false;
    return authClient.admin.checkRolePermission({ permissions, role });
  },

  clearCache: () => {
    cachedRole = null;
  },
};
