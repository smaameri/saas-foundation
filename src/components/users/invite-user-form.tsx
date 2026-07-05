"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { inviteOrganizationUser } from "@/app/(web)/admin/(customers)/users/actions";

const roleOptions = [
  { value: "member", label: "Member" },
  { value: "admin", label: "Admin" },
  { value: "owner", label: "Owner" },
] as const;

const formSchema = z.object({
  email: z.string().email("Enter a valid email"),
  role: z.enum(["owner", "admin", "member"]),
  organizationId: z.string().min(1, "Organization is required"),
});

type FormValues = z.infer<typeof formSchema>;
type Organization = { id: string; name: string };

export function InviteUserForm({
  organizations,
  onSuccess,
}: {
  organizations: Organization[];
  onSuccess?: () => void;
}) {
  const [status, setStatus] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      role: "member",
      organizationId: organizations[0]?.id ?? "",
    },
  });

  const onSubmit = (values: FormValues) => {
    setStatus(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", values.email);
      formData.append("role", values.role);
      formData.append("organizationId", values.organizationId);

      const result = await inviteOrganizationUser(formData);

      if (result.ok) {
        form.reset();
        onSuccess?.();
      } else {
        setStatus(result.message);
      }
    });
  };

  return (
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
        <Label htmlFor="invite-organization">Organization</Label>
        <select
          id="invite-organization"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          {...form.register("organizationId")}
        >
          {organizations.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>
        {form.formState.errors.organizationId ? (
          <p className="text-sm text-destructive">{form.formState.errors.organizationId.message}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="invite-role">Role</Label>
        <select
          id="invite-role"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          {...form.register("role")}
        >
          {roleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {status ? <p className="text-sm text-destructive">{status}</p> : null}

      <div className="flex items-center justify-between gap-4">
        <p className="flex-1 text-sm text-muted-foreground">
          The recipient will receive an email invitation to join.
        </p>
        <Button disabled={isPending} type="submit">
          {isPending ? "Sending..." : "Send invite"}
        </Button>
      </div>
    </form>
  );
}
