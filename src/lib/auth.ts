import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { magicLink } from "better-auth/plugins";

import { prisma } from "@/lib/prisma";
import { sendMagicLinkInviteEmail } from "@/lib/email";

const authSecret = process.env.BETTER_AUTH_SECRET;

if (!authSecret) {
  throw new Error("BETTER_AUTH_SECRET must be set to initialize Better Auth.");
}

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: authSecret,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    nextCookies(),
    magicLink({
      async sendMagicLink({ email, url }, ctx) {
        await sendMagicLinkInviteEmail({
          email,
          link: url,
          invitedBy: ctx?.session?.user?.name,
          role: ctx?.metadata?.role ?? "admin",
        });
      },
    }),
  ],
});

export type Auth = typeof auth;
