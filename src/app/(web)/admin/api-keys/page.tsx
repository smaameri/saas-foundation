"use client";

import { CreateApiKeyButton } from "@/app/(web)/admin/api-keys/_components/create-api-key-button";
import { columns } from "@/app/(web)/admin/api-keys/columns";
import type { ListApiKeysParams } from "@/app/api/admin/api-keys/schema";
import { DataTable } from "@/components/connected-data-table/data-table";
import { ContentLayout } from "@/components/platform/content-layout";
import { useConnectedTable } from "@/hooks/use-connected-table";
import { apiKeysApi } from "@/services/api/admin/apiKeysApi";

export default function ApiKeysPage() {
  const { table } = useConnectedTable({
    queryKey: ["admin", "api-keys"],
    queryFn: ({ sort, order, page, perPage }) =>
      apiKeysApi.listApiKeys({
        sort: sort as ListApiKeysParams["sort"],
        order,
        page,
        perPage,
      }),
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
