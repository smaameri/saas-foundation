"use client";

import { useState } from "react";
import { useInviteTeamMemberForm } from "./use-invite-team-member-form";
import { UserPlus } from "lucide-react";
import { PrimaryButton } from "@/components/buttons/primary-button";
import { MutationError } from "@/components/feedback/mutation-error";
import { RoleSelectField } from "@/components/forms/role-select-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { orgRoleOptions, platformRoleOptions } from "@/constants/roles";

export function InviteTeamMemberModal({ organizationId }: { organizationId: string }) {
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  const { form, mutate, isPending, isError, error } = useInviteTeamMemberForm(
    organizationId,
    handleClose,
  );

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

          <Form {...form}>
            <form className="space-y-5" onSubmit={form.handleSubmit((values) => mutate(values))}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="jane@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <RoleSelectField
                control={form.control}
                name="platformRole"
                label="Admin portal role"
                description="The role the user will have when accessing the admin portal."
                options={platformRoleOptions}
              />

              <RoleSelectField
                control={form.control}
                name="role"
                label="Customer portal role"
                description="The role the user will have when accessing the customer portal."
                options={orgRoleOptions}
              />

              <MutationError
                isError={isError}
                error={error}
                fallback="Failed to send invite. Please try again."
              />

              <div className="flex justify-end">
                <PrimaryButton type="submit" isPending={isPending} pendingLabel="Sending...">
                  Send invite
                </PrimaryButton>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
