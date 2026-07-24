"use client";

import { useUsers } from "./users-provider";
import type { Row } from "@tanstack/react-table";
import { Ban, RotateCcw, Trash2, UserSearch } from "lucide-react";
import { RowActionsDropdown } from "@/components/data-table/row-actions-dropdown";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import type { User } from "@/types/user";

export function UserRowActions({ row }: { row: Row<User> }) {
  const { setOpen, setCurrentUser, currentUserId } = useUsers();
  const user = row.original;
  const canModify = user.id !== currentUserId;

  const openDialog = (dialog: "view" | "ban" | "unban" | "delete") => {
    setCurrentUser(user);
    setOpen(dialog);
  };

  return (
    <RowActionsDropdown>
      <DropdownMenuItem onClick={() => openDialog("view")}>
        View details
        <UserSearch size={16} className="ml-auto" />
      </DropdownMenuItem>
      {canModify && <DropdownMenuSeparator />}
      {canModify &&
        (user.banned ? (
          <DropdownMenuItem onClick={() => openDialog("unban")}>
            Unban user
            <RotateCcw size={16} className="ml-auto" />
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => openDialog("ban")}
          >
            Ban user
            <Ban size={16} className="ml-auto" />
          </DropdownMenuItem>
        ))}
      {canModify && <DropdownMenuSeparator />}
      {canModify && (
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => openDialog("delete")}
        >
          Delete user
          <Trash2 size={16} className="ml-auto" />
        </DropdownMenuItem>
      )}
    </RowActionsDropdown>
  );
}
