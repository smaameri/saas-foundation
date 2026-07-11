"use client";

import { apiKeysApi } from "@/services/api/admin/apiKeysApi";
import { DataTable } from "@/components/connected-data-table/data-table";
import { useConnectedTable } from "@/hooks/use-connected-table";
import { columns } from "@/app/(web)/admin/api-keys/columns";

export function ApiKeysTable() {
  const { table } = useConnectedTable({
    queryKey: ["admin", "api-keys"],
    queryFn: (params) => apiKeysApi.listApiKeys(params),
    columns,
  });

  return (
    <DataTable
      table={table}
      showSearch
      searchPlaceholder="Search by name or key..."
      filters={[
        {
          columnId: "enabled",
          title: "Status",
          options: [
            { label: "Active", value: "true" },
            { label: "Disabled", value: "false" },
          ],
        },
      ]}
    />
  );
}
