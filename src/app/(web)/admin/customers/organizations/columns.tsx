"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import type { Organization } from "@/services/api/types/organization";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<Organization>[] = [
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
  {
    id: "actions",
    header: () => null,
    cell: ({ row }) => (
      <Button variant="ghost" size="icon" asChild aria-label="View organization details">
        <Link href={`/admin/customers/organizations/${row.original.id}`}>
          <Eye className="h-4 w-4" />
        </Link>
      </Button>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
