"use client";

import { apiKeysApi } from "@/api/admin/apiKeysApi";
import type { ListApiKeysParams } from "@/app/api/admin/api-keys/schema";
import { useConnectedTable, type ConnectedTableParams } from "@/hooks/use-connected-table";
import { ContentLayout } from "@/components/platform/content-layout";
import { columns } from "./columns";
import { ConnectedDataTable } from "@/components/connected-data-table/connected-data-table";
import { CreateApiKeyModal } from "./_components/create-api-key-modal";

export default function ApiKeysPage() {
  const table = useConnectedTable({
    queryKey: ["admin", "api-keys"],
    queryFn: ({ sorting, pagination }: ConnectedTableParams) => {
      const sort = sorting[0];
      return apiKeysApi.listApiKeys({
        page: pagination.pageIndex + 1,
        perPage: pagination.pageSize,
        ...(sort ? { sort: sort.id as ListApiKeysParams["sort"], order: sort.desc ? "desc" : "asc" } : {}),
      });
    },
    columns,
  });

  return (
    <ContentLayout
      title="API Keys"
      description="Manage API keys for programmatic access."
      actions={<CreateApiKeyModal />}
    >
      <ConnectedDataTable table={table} />
    </ContentLayout>
  );
}
