import { requirePermission } from "@/lib/adminAuthorization";
import { ContentLayout } from "@/components/platform/content-layout";
import { ApiKeysTable } from "@/app/(web)/admin/api-keys/_components/api-keys-table";

export default async function ApiKeysPage() {
  await requirePermission({ apiKey: ["read:any"] });

  return (
    <ContentLayout title="API Keys" description="Manage API keys for programmatic access.">
      <ApiKeysTable />
    </ContentLayout>
  );
}
