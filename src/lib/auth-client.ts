"use client";

import { createAuthClient } from "better-auth/react";
import { adminClient, magicLinkClient, organizationClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [
    magicLinkClient(),
    adminClient(),
    organizationClient(),
  ],
});
