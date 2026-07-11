import { auth } from "@/lib/auth";
import { type Permissions } from "@/lib/permissions";
import { forbiddenResponse } from "@/app/api/response";

type RouteHandler = (
  request: Request,
  context: { params: Promise<Record<string, string>> },
) => Promise<Response>;

export function withPermission(permissions: Permissions) {
  return (handler: RouteHandler): RouteHandler =>
    async (request, context) => {
      const { success } = await auth.api.hasPermission({
        headers: request.headers,
        body: { permissions },
      });

      if (!success) {
        return forbiddenResponse();
      }

      return handler(request, context);
    };
}
