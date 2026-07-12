"use client";

import { useRouter } from "next/navigation";
import { useMembers } from "./members-provider";
import type { Row } from "@tanstack/react-table";
import { Pencil, UserSearch } from "lucide-react";
import type { Member } from "@/services/api/types/member";
import { RowActionsDropdown } from "@/components/connected-data-table/row-actions-dropdown";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

type DataTableRowActionsProps = {
  row: Row<Member>;
};

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useMembers();
  const router = useRouter();

  return (
    <RowActionsDropdown>
      <DropdownMenuItem
        onClick={() => {
          setCurrentRow(row.original);
          setOpen("view");
        }}
      >
        View details
        <UserSearch size={16} className="ml-auto" />
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => router.push(`/admin/members/${row.original.id}/edit`)}>
        Edit
        <Pencil size={16} className="ml-auto" />
      </DropdownMenuItem>
    </RowActionsDropdown>
  );
}
