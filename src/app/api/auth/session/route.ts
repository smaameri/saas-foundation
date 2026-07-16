import { auth } from "@/lib/auth/auth";
import { detailResponse } from "@/app/api/response";
import { withErrorHandler } from "@/app/api/with-error-handler";

export const GET = withErrorHandler(async (request) => {
  const session = await auth.api.getSession({ headers: request.headers });
  return detailResponse({ role: (session?.user?.role as string) ?? null });
});
