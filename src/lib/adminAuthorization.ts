import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { type Permissions } from "@/lib/permissions";

export async function requirePermission(permissions: Permissions): Promise<void> {
  const session = await auth.api.getSession({ headers: await headers() });

  const { success } = await auth.api.userHasPermission({
    body: {
      userId: session?.user.id,
      permissions: permissions as Record<string, string[]>,
    },
  });

  if (!success) redirect("/admin/dashboard");
}
