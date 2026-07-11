"use client";

import { authClient } from "@/lib/auth-client";
import { type Permissions } from "@/lib/permissions";

export const permissionsApi = {
  hasPermission: (permissions: Permissions) =>
    authClient.$fetch<{ success: boolean }>("/organization/has-permission", {
      method: "POST",
      body: { permissions },
    }),
};
