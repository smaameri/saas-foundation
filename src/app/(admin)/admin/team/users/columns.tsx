"use client";

import type {ColumnDef} from "@tanstack/react-table";

import {DataTableColumnHeader} from "@/components/data-table/data-table-column-header";
import type {listAdminUsers} from "@/repositories/admin/adminOrganizationRepository";

export type AdminUser = Awaited<ReturnType<typeof listAdminUsers>>[number];

export const columns: ColumnDef<AdminUser>[] = [
  {
    accessorKey: "firstName",
    header: ({column}) => <DataTableColumnHeader column={column} title="First Name"/>,
    cell: ({row}) => row.original.firstName ?? row.original.name,
  },
  {
    accessorKey: "lastName",
    header: ({column}) => <DataTableColumnHeader column={column} title="Last Name"/>,
    cell: ({row}) => row.original.lastName ?? "—",
  },
  {
    accessorKey: "email",
    header: ({column}) => <DataTableColumnHeader column={column} title="Email"/>,
  },
  {
    accessorKey: "members",
    header: "Organizations",
    enableSorting: false,
    cell: ({row}) => {
      const members = row.original.members;
      if (members.length === 0) return <span className="text-muted-foreground">—</span>;
      return (
        <div className="flex flex-wrap gap-1">
          {members.map(({organization}) => (
            <span
              key={organization.id}
              className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
            >
              {organization.name}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: ({column}) => <DataTableColumnHeader column={column} title="Role"/>,
    cell: ({row}) => (
      <span className="capitalize text-muted-foreground">{row.original.role ?? "—"}</span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({column}) => <DataTableColumnHeader column={column} title="Joined"/>,
    cell: ({row}) => (
      <span className="text-muted-foreground">
        {row.original.createdAt.toLocaleDateString()}
      </span>
    ),
  },
];
