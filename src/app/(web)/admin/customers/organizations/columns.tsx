"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useOrganizations } from "./_components/organizations-provider";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import type { Organization } from "@/services/api/types/organization";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { Button } from "@/components/ui/button";

function OrganizationActionsCell({ organization }: { organization: Organization }) {
  const { setOpen, setCurrentOrganizationId } = useOrganizations();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="View organization details"
      onClick={() => {
        setCurrentOrganizationId(organization.id);
        setOpen("details");
        const params = new URLSearchParams(searchParams.toString());
        params.set("organizationId", organization.id);
        const next = params.toString();
        router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
      }}
    >
      <Eye className="h-4 w-4" />
    </Button>
  );
}

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
    cell: ({ row }) => <OrganizationActionsCell organization={row.original} />,
    enableSorting: false,
    enableHiding: false,
  },
];
