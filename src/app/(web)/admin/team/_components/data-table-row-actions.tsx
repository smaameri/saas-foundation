"use client";

import { useMembers } from "./members-provider";
import type { Row } from "@tanstack/react-table";
import { ShieldCheck, UserSearch } from "lucide-react";
import type { Member } from "@/services/api/types/member";
import { RowActionsDropdown } from "@/components/data-table/row-actions-dropdown";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

type DataTableRowActionsProps = {
  row: Row<Member>;
};

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useMembers();

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
      <DropdownMenuItem
        onClick={() => {
          setCurrentRow(row.original);
          setOpen("change-role");
        }}
      >
        Change role
        <ShieldCheck size={16} className="ml-auto" />
      </DropdownMenuItem>
    </RowActionsDropdown>
  );
}
