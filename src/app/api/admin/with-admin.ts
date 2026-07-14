import type { Session, User } from "better-auth";
import { type Permissions } from "@/lib/auth/permissions";
import { fetchSession } from "@/lib/auth/session";
import { forbiddenResponse, unauthorizedResponse } from "@/app/api/response";
import { withErrorHandler } from "@/app/api/with-error-handler";
import { withPermission } from "@/app/api/with-permission";

export type AdminContext = {
  user: User;
  session: Session;
  organizationId: string;
};

type RouteContext = { params: Promise<Record<string, string>> };

type AdminHandler = (
  request: Request,
  context: RouteContext,
  adminContext: AdminContext,
) => Promise<Response>;

export function withAdmin(handler: AdminHandler, permissions?: Permissions) {
  return withErrorHandler(async (request, context) => {
    const result = await fetchSession();

    if (!result?.user) {
      return unauthorizedResponse();
    }

    const { user, session } = result;

    if (!user.role) {
      return forbiddenResponse();
    }

    const organizationId = session.activeOrganizationId;

    if (!organizationId) {
      return forbiddenResponse();
    }

    const adminContext: AdminContext = { user, session, organizationId };

    if (permissions) {
      return withPermission(permissions)((req, ctx) => handler(req, ctx, adminContext))(
        request,
        context,
      );
    }

    return handler(request, context, adminContext);
  });
}
