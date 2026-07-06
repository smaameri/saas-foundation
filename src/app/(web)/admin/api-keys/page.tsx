"use client";

import { apiKeysApi } from "@/services/api/admin/apiKeysApi";
import { DataTable } from "@/components/connected-data-table/data-table";
import { ContentLayout } from "@/components/platform/content-layout";
import { useConnectedTable } from "@/hooks/use-connected-table";
import { CreateApiKeyButton } from "@/app/(web)/admin/api-keys/_components/create-api-key-button";
import { columns } from "@/app/(web)/admin/api-keys/columns";

export default function ApiKeysPage() {
  const { table } = useConnectedTable({
    queryKey: ["admin", "api-keys"],
    queryFn: (params) => apiKeysApi.listApiKeys(params),
    columns,
  });

  return (
    <ContentLayout
      title="API Keys"
      description="Manage API keys for programmatic access."
      actions={<CreateApiKeyButton />}
    >
      <DataTable table={table} />
    </ContentLayout>
  );
}
