"use client";

import { DataTableRowActions } from "./_components/data-table-row-actions";
import type { ColumnDef } from "@tanstack/react-table";
import type { User } from "@/services/api/types/user";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "firstName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="First Name" />,
    cell: ({ row }) => row.original.firstName ?? row.original.name,
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Last Name" />,
    cell: ({ row }) => row.original.lastName ?? <span className="text-muted-foreground">—</span>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => row.original.email,
  },
  {
    accessorKey: "role",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
    cell: ({ row }) => (
      <span className="capitalize text-muted-foreground">{row.original.role ?? "—"}</span>
    ),
  },
  {
    accessorKey: "emailVerified",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email Verified" />,
    cell: ({ row }) => (
      <Badge variant={row.original.emailVerified ? "secondary" : "outline"}>
        {row.original.emailVerified ? "Yes" : "No"}
      </Badge>
    ),
  },
  {
    accessorKey: "banned",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) =>
      row.original.banned ? (
        <Badge variant="destructive">Banned</Badge>
      ) : (
        <Badge variant="secondary">Active</Badge>
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
