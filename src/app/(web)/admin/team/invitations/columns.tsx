"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Invitation } from "@/services/api/types/invitation";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { Badge } from "@/components/ui/badge";
import { InvitationsRowActions } from "@/app/(web)/admin/team/invitations/data-table-row-actions";

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "default",
  accepted: "secondary",
  canceled: "destructive",
  rejected: "outline",
};

export const columns: ColumnDef<Invitation>[] = [
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
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => (
      <Badge variant={statusVariant[row.original.status] ?? "outline"} className="capitalize">
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Sent" />,
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {new Date(row.original.createdAt).toLocaleDateString()}
      </span>
    ),
  },
  {
    accessorKey: "expiresAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Expires" />,
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {new Date(row.original.expiresAt).toLocaleDateString()}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => null,
    cell: ({ row }) => <InvitationsRowActions row={row} />,
    enableSorting: false,
    enableHiding: false,
  },
];
