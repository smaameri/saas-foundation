"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { OrganizationMember } from "@/services/api/types/organization";
import { DataTableColumnHeader } from "@/components/data-table/column-header";

export const memberColumns: ColumnDef<OrganizationMember>[] = [
  {
    accessorKey: "user.name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => {
      const { firstName, lastName, name } = row.original.user;
      return (
        <span className="font-medium">
          {[firstName, lastName].filter(Boolean).join(" ") || name}
        </span>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "user.email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.user.email}</span>,
    enableSorting: false,
  },
  {
    accessorKey: "role",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Org Role" />,
    cell: ({ row }) => (
      <span className="capitalize text-muted-foreground">{row.original.role}</span>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "platformRole",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Platform Role" />,
    cell: ({ row }) => (
      <span className="capitalize text-muted-foreground">{row.original.platformRole ?? "—"}</span>
    ),
    enableSorting: false,
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
];
