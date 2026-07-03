"use client";

import { DataTable } from "@/components/data-table/data-table";
import { columns } from "@/app/(web)/(admin)/admin/api-keys/columns";
import { apiKeysApi } from "@/api/admin/apiKeysApi";

export function ApiKeysTable() {
  return (
    <DataTable
      columns={columns}
      fetcher={apiKeysApi.listApiKeys}
      emptyMessage="No API keys yet."
    />
  );
}
