"use client";

import {useState} from "react";
import {Controller} from "react-hook-form";
import {UserPlus} from "lucide-react";

import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useInviteTeamMemberForm} from "./use-invite-team-member-form";

const roleOptions = [
  {value: "member", label: "Member"},
  {value: "admin", label: "Admin"},
  {value: "owner", label: "Owner"},
] as const;

export function InviteTeamMemberModal({organizationId}: { organizationId: string }) {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    form.reset();
  };

  const {form, error, isPending, onSubmit} = useInviteTeamMemberForm(organizationId, handleClose);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <UserPlus className="h-4 w-4"/>
        Invite team member
      </Button>

      <Dialog open={open} onOpenChange={(val) => {
        if (!val) handleClose();
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite a team member</DialogTitle>
            <DialogDescription>
              Send an invitation to join your internal team.
            </DialogDescription>
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
              <Label htmlFor="invite-role">Role</Label>
              <Controller
                control={form.control}
                name="role"
                render={({field}) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="invite-role">
                      <SelectValue/>
                    </SelectTrigger>
                    <SelectContent>
                      {roleOptions.map((option) => (
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

            <div className="flex items-center justify-between gap-4">
              <p className="flex-1 text-sm text-muted-foreground">
                The recipient will receive an email invitation to join your team.
              </p>
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
