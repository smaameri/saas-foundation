"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { apiKeysApi } from "@/services/api/admin/apiKeysApi";
import type { ApiKey } from "@/services/api/types/apiKey";
import { CreateApiKeyButton } from "@/components/admin/create-api-key-button";
import { DataTableColumnHeader } from "@/components/connected-data-table/column-header";
import { DataTable } from "@/components/connected-data-table/data-table";
import { useConnectedTable } from "@/hooks/use-connected-table";
import { ApiKeyRowActions } from "@/app/(web)/admin/account/_components/api-key-row-actions";

const columns: ColumnDef<ApiKey>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => row.original.name ?? <span className="text-muted-foreground">—</span>,
  },
  {
    accessorKey: "start",
    header: "Key",
    enableSorting: false,
    cell: ({ row }) => {
      const { prefix, start } = row.original;
      const display = [prefix, start].filter(Boolean).join("") + "••••••••";
      return <span className="font-mono text-sm text-muted-foreground">{display}</span>;
    },
  },
  {
    accessorKey: "enabled",
    header: "Status",
    enableSorting: false,
    cell: ({ row }) =>
      row.original.enabled === false ? (
        <span className="text-sm text-destructive">Disabled</span>
      ) : (
        <span className="text-sm text-muted-foreground">Active</span>
      ),
  },
  {
    accessorKey: "lastRequest",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Last Request" />,
    cell: ({ row }) =>
      row.original.lastRequest ? (
        <span className="text-muted-foreground">
          {new Date(row.original.lastRequest).toLocaleDateString()}
        </span>
      ) : (
        <span className="text-muted-foreground">Never</span>
      ),
  },
  {
    accessorKey: "expiresAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Expires" />,
    cell: ({ row }) =>
      row.original.expiresAt ? (
        new Date(row.original.expiresAt).toLocaleDateString()
      ) : (
        <span className="text-muted-foreground">Never</span>
      ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {new Date(row.original.createdAt).toLocaleDateString()}
      </span>
    ),
  },
  {
    id: "actions",
    enableSorting: false,
    cell: ({ row }) => <ApiKeyRowActions id={row.original.id} name={row.original.name} />,
  },
];

export function AccountApiKeysTab() {
  const { table } = useConnectedTable({
    queryKey: ["admin", "account", "api-keys"],
    queryFn: (params) => apiKeysApi.listAccountApiKeys(params),
    columns,
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CreateApiKeyButton />
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
