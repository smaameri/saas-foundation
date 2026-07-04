"use client";

import { DataTable } from "@/components/data-table/data-table";
import { getColumns } from "@/app/(web)/(admin)/admin/api-keys/columns";
import { apiKeysApi } from "@/api/admin/apiKeysApi";

interface ApiKeysTableProps {
  refreshTrigger?: number;
  onDeleted?: () => void;
}

export function ApiKeysTable({ refreshTrigger, onDeleted }: ApiKeysTableProps) {
  return (
    <DataTable
      columns={getColumns(onDeleted ?? (() => {}))}
      fetcher={apiKeysApi.listApiKeys}
      emptyMessage="No API keys yet."
      refreshTrigger={refreshTrigger}
    />
  );
}
