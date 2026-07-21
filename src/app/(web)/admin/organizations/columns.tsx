"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import type { OrganizationLegacy } from "@/services/api/types/organization";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { Button } from "@/components/ui/button";

function OrganizationActionsCell({ organization }: { organization: OrganizationLegacy }) {
  return (
    <Button variant="ghost" size="icon" asChild aria-label="View organization details">
      <Link href={`/admin/organizations/${organization.id}`}>
        <Eye className="h-4 w-4" />
      </Link>
    </Button>
  );
}

export const columns: ColumnDef<OrganizationLegacy>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
  },
  {
    accessorKey: "slug",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Slug" />,
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.slug ?? "—"}</span>,
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
    header: () => null,
    cell: ({ row }) => <OrganizationActionsCell organization={row.original} />,
    enableSorting: false,
    enableHiding: false,
  },
];
