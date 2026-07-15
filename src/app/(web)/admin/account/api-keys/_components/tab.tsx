"use client";

import { columns } from "./columns";
import { apiKeysApi } from "@/services/api/admin/apiKeysApi";
import { CreateApiKeyButton } from "@/components/admin/create-api-key-button";
import { DataTable } from "@/components/data-table/data-table";
import { useConnectedTable } from "@/hooks/use-connected-table";

export function AccountApiKeysTab() {
  const { table } = useConnectedTable({
    queryKey: ["admin", "account", "api-keys"],
    queryFn: (params) => apiKeysApi.listAccountApiKeys(params),
    columns,
    initialFilters: [{ id: "enabled", value: ["true"] }],
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CreateApiKeyButton queryKey={["admin", "account", "api-keys"]} />
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
