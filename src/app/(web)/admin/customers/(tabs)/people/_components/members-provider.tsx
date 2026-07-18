"use client";

import React, { useState } from "react";
import type { OrganizationMemberUser } from "@/services/api/types/organizationMemberUser";
import useDialogState from "@/hooks/use-dialog-state";

type MembersDialogType = "view" | "change-role" | "ban" | "unban" | "delete";

type MembersContextType = {
  open: MembersDialogType | null;
  setOpen: (dialog: MembersDialogType | null) => void;
  currentRow: OrganizationMemberUser | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<OrganizationMemberUser | null>>;
  selectedMemberId: string;
  setSelectedMemberId: React.Dispatch<React.SetStateAction<string>>;
};

const MembersContext = React.createContext<MembersContextType | null>(null);

export function MembersProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<MembersDialogType>(null);
  const [currentRow, setCurrentRow] = useState<OrganizationMemberUser | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");

  return (
    <MembersContext
      value={{ open, setOpen, currentRow, setCurrentRow, selectedMemberId, setSelectedMemberId }}
    >
      {children}
    </MembersContext>
  );
}

export function useOrganizationMembers() {
  const context = React.useContext(MembersContext);
  if (!context) throw new Error("useOrganizationMembers must be used within <MembersProvider>");
  return context;
}
