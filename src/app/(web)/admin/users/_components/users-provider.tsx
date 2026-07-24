"use client";

import React, { useState } from "react";
import useDialogState from "@/hooks/use-dialog-state";
import type { User } from "@/types/user";

type UsersDialogType = "view" | "ban" | "unban" | "delete";

type UsersContextType = {
  open: UsersDialogType | null;
  setOpen: (value: UsersDialogType | null) => void;
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  currentUserId: string;
};

const UsersContext = React.createContext<UsersContextType | null>(null);

export function UsersProvider({
  children,
  currentUserId,
}: {
  children: React.ReactNode;
  currentUserId: string;
}) {
  const [open, setOpen] = useDialogState<UsersDialogType>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  return (
    <UsersContext value={{ open, setOpen, currentUser, setCurrentUser, currentUserId }}>
      {children}
    </UsersContext>
  );
}

export function useUsers() {
  const context = React.useContext(UsersContext);
  if (!context) throw new Error("useUsers has to be used within <UsersProvider>");
  return context;
}
