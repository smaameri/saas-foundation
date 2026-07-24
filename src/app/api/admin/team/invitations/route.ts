import { createAdminPortalInvitationSchema, listAdminPortalInvitationsSchema } from "./schema";
import { validateQuery } from "@/lib/api";
import { sendAdminPortalInvitationEmail } from "@/lib/email/adminPortalInvitationEmail";
import {
  createAdminPortalInvitation,
  listInvitations,
} from "@/repositories/admin/invitationRepository";
import { findUserByEmail } from "@/repositories/admin/teamRepository";
import { serializeInvitation } from "@/serializers/invitationSerializer";
import { withAdmin } from "@/app/api/admin/with-admin";
import { conflictResponse, createdResponse, paginatedResponse } from "@/app/api/response";
import { Portal } from "@/config/portals";

const INVITATION_EXPIRES_IN_DAYS = 2;

export const GET = withAdmin(async (request) => {
  const parsed = validateQuery(request, listAdminPortalInvitationsSchema);
  const { page, perPage, order, sort, status } = parsed;

  const { data, total } = await listInvitations({
    options: { page, perPage, order, sort },
    filters: { status, portals: [Portal.admin] },
  });

  return paginatedResponse(data.map(serializeInvitation), {
    page,
    perPage,
    total,
  });
});

export const POST = withAdmin(async (request, _context, { user }) => {
  const { email, role } = createAdminPortalInvitationSchema.parse(await request.json());

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return conflictResponse("A user with this email already exists.");
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + INVITATION_EXPIRES_IN_DAYS);

  const invitation = await createAdminPortalInvitation({
    email,
    role,
    inviterId: user.id,
    expiresAt,
  });

  await sendAdminPortalInvitationEmail({
    email,
    invitedBy: user.name,
    inviteLink: `${process.env.BETTER_AUTH_URL}/accept-invitation/admin-portal/${invitation.id}`,
  });

  return createdResponse({
    message: `Invitation sent to ${email}.`,
    invitationId: invitation.id,
  });
});
