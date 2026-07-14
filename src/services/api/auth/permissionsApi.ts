"use client";

import { authClient } from "@/lib/auth/auth-client";
import { type Permissions } from "@/lib/auth/permissions";

export const permissionsApi = {
  hasPermission: (permissions: Permissions) =>
    authClient.$fetch<{ success: boolean }>("/organization/has-permission", {
      method: "POST",
      body: { permissions },
    }),
};
