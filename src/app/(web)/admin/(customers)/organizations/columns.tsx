"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Organization } from "@/services/api/types/organization";
import { DataTableColumnHeader } from "@/components/data-table/column-header";

export const columns: ColumnDef<Organization>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
  },
  {
    accessorKey: "memberCount",
    header: "Members",
    enableSorting: false,
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.memberCount}</span>,
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
];
