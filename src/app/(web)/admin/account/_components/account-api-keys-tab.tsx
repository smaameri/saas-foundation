"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { apiKeysApi } from "@/services/api/admin/apiKeysApi";
import type { ApiKey } from "@/services/api/types/apiKey";
import { DataTableColumnHeader } from "@/components/connected-data-table/column-header";
import { DataTable } from "@/components/connected-data-table/data-table";
import { useConnectedTable } from "@/hooks/use-connected-table";
import { CreateApiKeyButton } from "@/app/(web)/admin/api-keys/_components/create-api-key-button";
import { DeleteApiKeyButton } from "@/app/(web)/admin/api-keys/_components/delete-api-key-button";

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
    cell: ({ row }) => <DeleteApiKeyButton id={row.original.id} />,
  },
];

export function AccountApiKeysTab() {
  const { table } = useConnectedTable({
    queryKey: ["admin", "account", "api-keys"],
    queryFn: ({ sort, order, page, perPage }) =>
      apiKeysApi.listAccountApiKeys({ sort, order, page, perPage }),
    columns,
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CreateApiKeyButton />
      </div>
      <DataTable table={table} />
    </div>
  );
}
