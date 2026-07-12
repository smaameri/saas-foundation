"use client";

import { DataTableRowActions } from "./_components/data-table-row-actions";
import type { ColumnDef } from "@tanstack/react-table";
import type { Member } from "@/services/api/types/member";
import { DataTableColumnHeader } from "@/components/connected-data-table/column-header";

export const columns: ColumnDef<Member>[] = [
  {
    accessorKey: "user.firstName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="First Name" />,
    cell: ({ row }) => row.original.user.firstName ?? row.original.user.name,
  },
  {
    accessorKey: "user.lastName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Last Name" />,
    cell: ({ row }) =>
      row.original.user.lastName ?? <span className="text-muted-foreground">—</span>,
  },
  {
    accessorKey: "user.email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => row.original.user.email,
  },
  {
    accessorKey: "user.role",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Platform Role" />,
    cell: ({ row }) => (
      <span className="capitalize text-muted-foreground">{row.original.user.role ?? "—"}</span>
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Organization Role" />,
    cell: ({ row }) => (
      <span className="capitalize text-muted-foreground">{row.original.role}</span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Joined" />,
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {new Date(row.original.createdAt).toLocaleDateString()}
      </span>
    ),
  },
  {
    id: "actions",
    enableSorting: false,
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
