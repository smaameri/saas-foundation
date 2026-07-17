"use client";

import React, { useState } from "react";
import type { User } from "@/services/api/types/user";
import useDialogState from "@/hooks/use-dialog-state";

type MembersDialogType = "view" | "change-role" | "delete";

type MembersContextType = {
  open: MembersDialogType | null;
  setOpen: (str: MembersDialogType | null) => void;
  currentRow: User | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<User | null>>;
};

const MembersContext = React.createContext<MembersContextType | null>(null);

export function MembersProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<MembersDialogType>(null);
  const [currentRow, setCurrentRow] = useState<User | null>(null);

  return (
    <MembersContext value={{ open, setOpen, currentRow, setCurrentRow }}>{children}</MembersContext>
  );
}

export function useMembers() {
  const context = React.useContext(MembersContext);
  if (!context) throw new Error("useMembers has to be used within <MembersProvider>");
  return context;
}
