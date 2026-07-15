"use client";

import { apiKeysApi } from "@/services/api/admin/apiKeysApi";
import { CreateApiKeyButton } from "@/components/admin/create-api-key-button";
import { DataTable } from "@/components/data-table/data-table";
import { useConnectedTable } from "@/hooks/use-connected-table";
import { columns } from "@/app/(web)/admin/api-keys/columns";

const QUERY_KEY = ["admin", "api-keys"];

export function ApiKeysTable() {
  const { table } = useConnectedTable({
    queryKey: QUERY_KEY,
    queryFn: (params) => apiKeysApi.listApiKeys(params),
    columns,
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CreateApiKeyButton queryKey={QUERY_KEY} />
      </div>
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
    </div>
  );
}
