"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useOrganizationMembers } from "./members-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { membersApi } from "@/services/api/admin/membersApi";
import { CancelButton } from "@/components/buttons/cancel-button";
import { PrimaryButton } from "@/components/buttons/primary-button";
import { MutationError } from "@/components/feedback/mutation-error";
import { RoleSelectField } from "@/components/forms/role-select-field";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { orgRoleOptions, platformRoleOptions } from "@/constants/roles";

const changeRoleSchema = z.object({
  memberId: z.string().min(1, "Select an organization"),
  platformRole: z.enum(["admin", "user"]),
  role: z.enum(["owner", "admin", "member"]),
});

type ChangeRoleValues = z.infer<typeof changeRoleSchema>;

export function ChangeRoleDialog() {
  const { open, setOpen, currentRow, selectedMemberId, setSelectedMemberId } =
    useOrganizationMembers();
  const queryClient = useQueryClient();

  const form = useForm<ChangeRoleValues>({
    resolver: zodResolver(changeRoleSchema),
    mode: "onSubmit",
    defaultValues: {
      memberId: "",
      platformRole: "user",
      role: "member",
    },
  });

  useEffect(() => {
    if (!currentRow) return;
    const defaultMembership =
      currentRow.organizations.find((membership) => membership.memberId === selectedMemberId) ??
      currentRow.organizations[0];
    setSelectedMemberId(defaultMembership?.memberId ?? "");
    form.reset({
      memberId: defaultMembership?.memberId ?? "",
      platformRole: (currentRow.role as ChangeRoleValues["platformRole"]) ?? "user",
      role: (defaultMembership?.memberRole as ChangeRoleValues["role"]) ?? "member",
    });
  }, [currentRow, form, open, selectedMemberId, setSelectedMemberId]);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "memberId" && currentRow) {
        setSelectedMemberId(value.memberId ?? "");
        const membership = currentRow.organizations.find((org) => org.memberId === value.memberId);
        if (membership) {
          form.setValue("role", membership.memberRole as ChangeRoleValues["role"], {
            shouldDirty: false,
            shouldValidate: true,
          });
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [currentRow, form, setSelectedMemberId]);

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async (values: ChangeRoleValues) => {
      await membersApi.updateMember(values.memberId, {
        platformRole: values.platformRole,
        role: values.role,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "organizations", "members"] });
      toast.success("Member role updated.");
      setOpen(null);
    },
  });

  const handleOpenChange = (value: boolean) => {
    if (!value) setOpen(null);
  };

  if (!currentRow) return null;

  return (
    <Dialog open={open === "change-role"} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change role</DialogTitle>
          <DialogDescription>
            Update the organization role and admin portal role for this member.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-5" onSubmit={form.handleSubmit((values) => mutate(values))}>
            <FormField
              control={form.control}
              name="memberId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {currentRow.organizations.map((membership) => (
                        <SelectItem key={membership.memberId} value={membership.memberId}>
                          {membership.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <RoleSelectField
              control={form.control}
              name="role"
              label="Organization role"
              options={orgRoleOptions}
            />

            <RoleSelectField
              control={form.control}
              name="platformRole"
              label="Admin portal role"
              options={platformRoleOptions}
            />

            <MutationError
              isError={isError}
              error={error}
              fallback="Failed to update member. Please try again."
            />

            <div className="flex justify-end gap-2">
              <CancelButton onClick={() => setOpen(null)} disabled={isPending} />
              <PrimaryButton type="submit" isPending={isPending} pendingLabel="Saving...">
                Save changes
              </PrimaryButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
