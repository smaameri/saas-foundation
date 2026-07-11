"use client";

import { adminClient, magicLinkClient, organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { ac, admin, member, owner } from "@/lib/permissions";

export const authClient = createAuthClient({
  plugins: [
    magicLinkClient(),
    adminClient(),
    organizationClient({ ac, roles: { owner, admin, member } }),
  ],
});
