import { auth } from "@/lib/auth/auth";
import { withAdmin } from "@/app/api/admin/with-admin";
import { noContentResponse } from "@/app/api/response";

export const DELETE = withAdmin(
  async (request, { params }) => {
    const { id } = await params;
    await auth.api.updateApiKey({
      body: { keyId: id, enabled: false },
      headers: request.headers,
    });
    return noContentResponse();
  },
  { apiKey: ["delete:any"] },
);
