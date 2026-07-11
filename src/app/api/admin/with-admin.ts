import type { Session, User } from "better-auth";
import { type Permissions } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { fetchSession } from "@/lib/session";
import { forbiddenResponse, unauthorizedResponse } from "@/app/api/response";
import { withErrorHandler } from "@/app/api/with-error-handler";
import { withPermission } from "@/app/api/with-permission";
import { Portal } from "@/config/portals";

export type AdminContext = {
  session: { user: User; session: Session };
};

type RouteContext = { params: Promise<Record<string, string>> };

type AdminHandler = (
  request: Request,
  context: RouteContext,
  adminContext: AdminContext,
) => Promise<Response>;

export function withAdmin(handler: AdminHandler, permissions?: Permissions) {
  return withErrorHandler(async (request, context) => {
    const session = await fetchSession();

    if (!session?.user) {
      return unauthorizedResponse();
    }

    const adminMember = await prisma.member.findFirst({
      where: {
        userId: session.user.id,
        organization: { portals: { has: Portal.admin } },
      },
    });

    if (!adminMember) {
      return forbiddenResponse();
    }

    if (permissions) {
      return withPermission(permissions)((req, ctx) => handler(req, ctx, { session }))(
        request,
        context,
      );
    }

    return handler(request, context, { session });
  });
}
