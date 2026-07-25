"use client";

import { useMembers } from "./members-provider";
import type { Row } from "@tanstack/react-table";
import { ShieldCheck, UserMinus, UserSearch } from "lucide-react";
import { RowActionsDropdown } from "@/components/data-table/row-actions-dropdown";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import type { Member } from "@/types/member";

export function MemberRowActions({ row }: { row: Row<Member> }) {
  const { setOpen, setCurrentMember, currentUserId } = useMembers();
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
        <UserSearch className="ml-auto" />
      </DropdownMenuItem>
      {canModify && <DropdownMenuSeparator />}
      {canModify && (
        <DropdownMenuItem onClick={() => openDialog("change-role")}>
          Change role
          <ShieldCheck className="ml-auto" />
        </DropdownMenuItem>
      )}
      {canModify && <DropdownMenuSeparator />}
      {canModify && (
        <DropdownMenuItem variant="destructive" onClick={() => openDialog("remove")}>
          Remove membership
          <UserMinus className="ml-auto" />
        </DropdownMenuItem>
      )}
    </RowActionsDropdown>
  );
}
