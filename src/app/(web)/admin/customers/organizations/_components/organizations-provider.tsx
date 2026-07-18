"use client";

import React, { useState } from "react";
import useDialogState from "@/hooks/use-dialog-state";

type OrganizationsDialogType = "details";

type OrganizationsContextValue = {
  open: OrganizationsDialogType | null;
  setOpen: (value: OrganizationsDialogType | null) => void;
  currentOrganizationId: string | null;
  setCurrentOrganizationId: React.Dispatch<React.SetStateAction<string | null>>;
};

const OrganizationsContext = React.createContext<OrganizationsContextValue | null>(null);

export function OrganizationsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<OrganizationsDialogType>(null);
  const [currentOrganizationId, setCurrentOrganizationId] = useState<string | null>(null);

  return (
    <OrganizationsContext.Provider
      value={{ open, setOpen, currentOrganizationId, setCurrentOrganizationId }}
    >
      {children}
    </OrganizationsContext.Provider>
  );
}

export function useOrganizations() {
  const context = React.useContext(OrganizationsContext);
  if (!context) throw new Error("useOrganizations must be used within OrganizationsProvider");
  return context;
}
