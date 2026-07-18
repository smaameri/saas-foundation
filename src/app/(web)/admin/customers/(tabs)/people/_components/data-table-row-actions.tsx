"use client";

import { useOrganizationMembers } from "./members-provider";
import type { Row } from "@tanstack/react-table";
import { Ban, RotateCcw, ShieldCheck, Trash2, UserSearch } from "lucide-react";
import type { OrganizationMemberUser } from "@/services/api/types/organizationMemberUser";
import { RowActionsDropdown } from "@/components/data-table/row-actions-dropdown";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

type DataTableRowActionsProps = {
  row: Row<OrganizationMemberUser>;
};

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow, setSelectedMemberId } = useOrganizationMembers();
  const isBanned = row.original.banned ?? false;

  const handleOpen = (dialog: Parameters<typeof setOpen>[0]) => {
    setCurrentRow(row.original);
    setSelectedMemberId(row.original.organizations[0]?.memberId ?? "");
    setOpen(dialog);
  };

  return (
    <RowActionsDropdown>
      <DropdownMenuItem onClick={() => handleOpen("view")}>
        View details
        <UserSearch size={16} className="ml-auto" />
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => handleOpen("change-role")}>
        Change role
        <ShieldCheck size={16} className="ml-auto" />
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      {isBanned ? (
        <DropdownMenuItem onClick={() => handleOpen("unban")}>
          Unban user
          <RotateCcw size={16} className="ml-auto" />
        </DropdownMenuItem>
      ) : (
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => handleOpen("ban")}
        >
          Ban user
          <Ban size={16} className="ml-auto" />
        </DropdownMenuItem>
      )}
      <DropdownMenuSeparator />
      <DropdownMenuItem
        className="text-destructive focus:text-destructive"
        onClick={() => handleOpen("delete")}
      >
        Delete user
        <Trash2 size={16} className="ml-auto" />
      </DropdownMenuItem>
    </RowActionsDropdown>
  );
}
