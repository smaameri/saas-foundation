import { updateMemberSchema } from "./schema";
import {
  countOrganizationOwners,
  deleteMember,
  findMember,
  updateMember,
} from "@/repositories/admin/memberRepository";
import { serializeMember } from "@/serializers/memberSerializer";
import { withAdmin } from "@/app/api/admin/with-admin";
import {
  conflictResponse,
  detailResponse,
  forbiddenResponse,
  noContentResponse,
  notFoundResponse,
} from "@/app/api/response";

export const GET = withAdmin(async (_request, { params }) => {
  const { id } = await params;
  const member = await findMember(id);
  if (!member) return notFoundResponse();
  return detailResponse(serializeMember(member));
});

export const PATCH = withAdmin(
  async (request, { params }, { user }) => {
    const { id } = await params;
    const existing = await findMember(id);
    if (!existing) return notFoundResponse();
    if (existing.userId === user.id) {
      return forbiddenResponse("You cannot update your own membership.");
    }

    const body = updateMemberSchema.parse(await request.json());
    if (
      existing.role === "owner" &&
      body.role !== "owner" &&
      (await countOrganizationOwners(existing.organizationId)) <= 1
    ) {
      return conflictResponse("You cannot change the role of the last organization owner.");
    }

    const updated = await updateMember(id, body);
    return detailResponse(serializeMember(updated));
  },
  { member: ["update"] },
);

export const DELETE = withAdmin(
  async (_request, { params }, { user }) => {
    const { id } = await params;
    const existing = await findMember(id);
    if (!existing) return notFoundResponse();
    if (existing.userId === user.id) {
      return forbiddenResponse("You cannot remove your own membership.");
    }
    if (
      existing.role === "owner" &&
      (await countOrganizationOwners(existing.organizationId)) <= 1
    ) {
      return conflictResponse("You cannot remove the last organization owner.");
    }

    await deleteMember(id);
    return noContentResponse();
  },
  { member: ["delete"] },
);
