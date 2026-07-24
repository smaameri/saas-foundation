"use client";

import { useOrganizationMembers } from "./organization-members-provider";
import type { Row } from "@tanstack/react-table";
import { ShieldCheck, UserMinus, UserSearch } from "lucide-react";
import { RowActionsDropdown } from "@/components/data-table/row-actions-dropdown";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import type { Member } from "@/types/member";

export function MemberRowActions({ row }: { row: Row<Member> }) {
  const { setOpen, setCurrentMember, currentUserId } = useOrganizationMembers();
  const member = row.original;
  const canModify = member.user.id !== currentUserId;

  const openDialog = (dialog: "view" | "change-role" | "remove") => {
    setCurrentMember(member);
    setOpen(dialog);
  };

  return (
    <RowActionsDropdown>
      <DropdownMenuItem onClick={() => openDialog("view")}>
        View details
        <UserSearch size={16} className="ml-auto" />
      </DropdownMenuItem>
      {canModify && <DropdownMenuSeparator />}
      {canModify && (
        <DropdownMenuItem onClick={() => openDialog("change-role")}>
          Change role
          <ShieldCheck size={16} className="ml-auto" />
        </DropdownMenuItem>
      )}
      {canModify && <DropdownMenuSeparator />}
      {canModify && (
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => openDialog("remove")}
        >
          Remove membership
          <UserMinus size={16} className="ml-auto" />
        </DropdownMenuItem>
      )}
    </RowActionsDropdown>
  );
}
