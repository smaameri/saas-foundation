"use client";

import { type AdminPermissions } from "@/lib/auth/admin-permissions";
import { authApi } from "@/services/api/auth/authApi";

export const permissionsService = {
  can: async (permissions: AdminPermissions): Promise<boolean> => {
    const { allowed } = await authApi.checkPermissions({ permissions });
    return allowed;
  },
};
