import {z} from "zod";

import {withAdmin} from "@/app/api/admin/with-admin";
import {conflictResponse, createdResponse, notFoundResponse, validationErrorResponse} from "@/app/api/response";
import {findPendingInvitation} from "@/repositories/admin/invitationRepository";
import {findById} from "@/repositories/admin/organizationRepository";
import {sendInvitation} from "@/services/admin/invitationService";

const bodySchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  role: z.enum(["owner", "admin", "member"]),
});

export const POST = withAdmin(async (request, {params}, {session}) => {
  const {id: organizationId} = await params;
  const body = await request.json();

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) return validationErrorResponse(parsed.error.issues);

  const {email, role} = parsed.data;

  const org = await findById(organizationId);
  if (!org) return notFoundResponse("Organization not found.");

  const existingInvitation = await findPendingInvitation(email, organizationId);
  if (existingInvitation) return conflictResponse("This person already has a pending invitation.");

  await sendInvitation({
    email,
    role,
    organizationId,
    organizationName: org.name,
    inviterId: session.user.id,
    inviterName: session.user.name,
  });

  return createdResponse(`Invitation sent to ${email}.`);
});
