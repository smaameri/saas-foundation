"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InviteUserForm } from "@/components/users/invite-user-form";

export function InviteUserModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <UserPlus className="h-4 w-4" />
        Invite user
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite a platform user</DialogTitle>
            <DialogDescription>
              Send a magic link so teammates can access the platform.
            </DialogDescription>
          </DialogHeader>
          <InviteUserForm onSuccess={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
