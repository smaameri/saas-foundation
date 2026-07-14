"use client";

"use client";

import { adminClient, magicLinkClient, organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { ac, adminRole, userRole } from "@/lib/auth/permissions";

export const authClient = createAuthClient({
  plugins: [
    magicLinkClient(),
    adminClient({ ac, roles: { admin: adminRole, user: userRole } }),
    organizationClient(),
  ],
});
