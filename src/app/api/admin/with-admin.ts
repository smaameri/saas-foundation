import {Portal} from "@/config/portals";
import {prisma} from "@/lib/prisma";
import {fetchSession} from "@/lib/session";
import type {Session, User} from "better-auth";
import {withErrorHandler} from "@/app/api/with-error-handler";

export type AdminContext = {
  session: { user: User; session: Session };
};

type RouteContext = { params: Promise<Record<string, string>> };

type AdminHandler = (
  request: Request,
  context: RouteContext,
  adminContext: AdminContext
) => Promise<Response>;

export function withAdmin(handler: AdminHandler) {
  return withErrorHandler(async (request, context) => {
    const session = await fetchSession();

    if (!session?.user) {
      return Response.json({message: "Unauthorized."}, {status: 401});
    }

    const adminMember = await prisma.member.findFirst({
      where: {
        userId: session.user.id,
        organization: {portals: {has: Portal.admin}},
      },
    });

    if (!adminMember) {
      return Response.json({message: "Forbidden."}, {status: 403});
    }

    return handler(request, context, {session});
  });
}
