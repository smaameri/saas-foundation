import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ContentLayout } from "@/components/platform/content-layout";
import { ApiKeysTable } from "@/app/(web)/admin/api-keys/_components/api-keys-table";
import { CreateApiKeyButton } from "@/app/(web)/admin/api-keys/_components/create-api-key-button";

export default async function ApiKeysPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const hasPermission = await auth.api.userHasPermission({
    body: {
      userId: session?.user.id,
      permissions: { apiKey: ["read:any"] } as Record<string, string[]>,
    },
  });

  if (!hasPermission.success) redirect("/admin/dashboard");

  return (
    <ContentLayout
      title="API Keys"
      description="Manage API keys for programmatic access."
      actions={<CreateApiKeyButton />}
    >
      <ApiKeysTable />
    </ContentLayout>
  );
}
