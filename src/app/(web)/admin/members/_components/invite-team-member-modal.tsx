"use client";

import { useState } from "react";
import { Controller } from "react-hook-form";
import { useInviteTeamMemberForm } from "./use-invite-team-member-form";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const orgRoleOptions = [
  { value: "member", label: "Member" },
  { value: "admin", label: "Admin" },
  { value: "owner", label: "Owner" },
] as const;

const platformRoleOptions = [
  { value: "user", label: "User" },
  { value: "admin", label: "Admin" },
] as const;

export function InviteTeamMemberModal({ organizationId }: { organizationId: string }) {
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  const { form, error, isPending, onSubmit } = useInviteTeamMemberForm(organizationId, handleClose);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <UserPlus className="h-4 w-4" />
        Invite team members
      </Button>

      <Dialog
        open={open}
        onOpenChange={(val) => {
          if (!val) handleClose();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite a team member</DialogTitle>
            <DialogDescription>Send an invitation to join your organization.</DialogDescription>
          </DialogHeader>

          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-1.5">
              <Label htmlFor="invite-email">Email</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="jane@example.com"
                {...form.register("email")}
              />
              {form.formState.errors.email ? (
                <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="invite-platform-role">Admin portal role</Label>
              <p className="text-sm text-muted-foreground">
                The role the user will have when accessing the admin portal.
              </p>
              <Controller
                control={form.control}
                name="platformRole"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="invite-platform-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {platformRoleOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="invite-role">Customer portal role</Label>
              <p className="text-sm text-muted-foreground">
                The role the user will have when accessing the customer portal.
              </p>
              <Controller
                control={form.control}
                name="role"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="invite-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {orgRoleOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {error ? <p className="text-sm text-destructive">{error}</p> : null}

            <div className="flex justify-end">
              <Button disabled={isPending} type="submit">
                {isPending ? "Sending..." : "Send invite"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
