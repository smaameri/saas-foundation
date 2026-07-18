"use client";

import { useMembers } from "./members-provider";
import type { Row } from "@tanstack/react-table";
import { Ban, RotateCcw, ShieldCheck, Trash2, UserSearch } from "lucide-react";
import type { User } from "@/services/api/types/user";
import { RowActionsDropdown } from "@/components/data-table/row-actions-dropdown";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

type DataTableRowActionsProps = {
  row: Row<User>;
};

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow, currentUserId } = useMembers();
  const isBanned = row.original.banned ?? false;
  const canModify = currentUserId ? row.original.id !== currentUserId : true;

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
      {canModify && <DropdownMenuSeparator />}
      {canModify && (
        <>
          {isBanned ? (
            <DropdownMenuItem
              onClick={() => {
                setCurrentRow(row.original);
                setOpen("unban");
              }}
            >
              Unban user
              <RotateCcw size={16} className="ml-auto" />
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => {
                setCurrentRow(row.original);
                setOpen("ban");
              }}
            >
              Ban user
              <Ban size={16} className="ml-auto" />
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
        </>
      )}
      {canModify && (
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => {
            setCurrentRow(row.original);
            setOpen("delete");
          }}
        >
          Delete user
          <Trash2 size={16} className="ml-auto" />
        </DropdownMenuItem>
      )}
    </RowActionsDropdown>
  );
}
