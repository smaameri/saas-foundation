import { apiKey } from "@better-auth/api-key";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin, organization } from "better-auth/plugins";
import { ac, adminRole, userRole } from "@/lib/auth/permissions";
import { sendOrganizationInvitationEmail, sendSetPasswordInviteEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

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
  user: {
    additionalFields: {
      firstName: {
        type: "string",
        required: false,
      },
      lastName: {
        type: "string",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    resetPasswordTokenExpiresIn: 60 * 60 * 24 * 7, // 7 days
    sendResetPassword: async ({ user, token }) => {
      const url = `${process.env.BETTER_AUTH_URL}/reset-password?token=${token}`;
      void sendSetPasswordInviteEmail({ email: user.email, url });
    },
  },
  plugins: [
    nextCookies(),
    admin({
      ac,
      roles: { admin: adminRole, user: userRole },
    }),
    organization({
      async sendInvitationEmail(data) {
        await sendOrganizationInvitationEmail({
          email: data.email,
          organizationName: data.organization.name,
          invitedBy: data.inviter.user.name,
          inviteLink: `${process.env.BETTER_AUTH_URL}/accept-invitation/${data.id}`,
        });
      },
    }),
    apiKey({
      enableSessionForAPIKeys: true,
      rateLimit: {
        enabled: false,
      },
    }),
  ],
});

export type Auth = typeof auth;
