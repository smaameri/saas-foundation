"use client";

import { type Permissions } from "@/lib/auth/permissions";
import { authApi } from "@/services/api/auth/authApi";

export const permissionsService = {
  can: async (permissions: Permissions): Promise<boolean> => {
    const { allowed } = await authApi.checkPermissions({ permissions });
    return allowed;
  },
};
