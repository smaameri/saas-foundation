"use client";

import { CancelInvitationButton } from "./cancel-invitation-button";
import type { ColumnDef } from "@tanstack/react-table";
import type { Invitation } from "@/services/api/types/invitation";
import { DataTableColumnHeader } from "@/components/connected-data-table/column-header";
import { Badge } from "@/components/ui/badge";

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "default",
  accepted: "secondary",
  rejected: "outline",
  canceled: "destructive",
};

export const columns: ColumnDef<Invitation>[] = [
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
  },
  {
    accessorKey: "role",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
    cell: ({ row }) => (
      <span className="capitalize text-muted-foreground">{row.original.role}</span>
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
    enableSorting: false,
    cell: ({ row }) =>
      row.original.status === "pending" ? (
        <div className="text-right">
          <CancelInvitationButton invitationId={row.original.id} />
        </div>
      ) : null,
  },
];
