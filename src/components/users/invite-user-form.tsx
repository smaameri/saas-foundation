"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { invitePlatformUser } from "@/app/(admin)/admin/users/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const roleOptions = [
  { value: "admin", label: "Admin" },
  { value: "owner", label: "Owner" },
  { value: "member", label: "Member" },
] as const;

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  role: z.enum(["owner", "admin", "member"]),
});

type FormValues = z.infer<typeof formSchema>;

export function InviteUserForm({ onSuccess }: { onSuccess?: () => void }) {
  const [status, setStatus] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { firstName: "", lastName: "", email: "", role: "admin" },
  });

  const onSubmit = (values: FormValues) => {
    setStatus(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("email", values.email);
      formData.append("role", values.role);

      const result = await invitePlatformUser(formData);

      if (result.ok) {
        form.reset({ firstName: "", lastName: "", email: "", role: values.role });
        onSuccess?.();
      } else {
        setStatus(result.message);
      }
    });
  };

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="invite-firstName">First name</Label>
          <Input id="invite-firstName" placeholder="Jane" {...form.register("firstName")} />
          {form.formState.errors.firstName ? (
            <p className="text-sm text-destructive">{form.formState.errors.firstName.message}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="invite-lastName">Last name</Label>
          <Input id="invite-lastName" placeholder="Smith" {...form.register("lastName")} />
          {form.formState.errors.lastName ? (
            <p className="text-sm text-destructive">{form.formState.errors.lastName.message}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="invite-email">Email</Label>
        <Input id="invite-email" type="email" placeholder="jane@example.com" {...form.register("email")} />
        {form.formState.errors.email ? (
          <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
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

      {status ? (
        <p className="text-sm text-destructive">{status}</p>
      ) : null}

      <div className="flex items-center justify-between gap-4">
        <p className="flex-1 text-sm text-muted-foreground">
          Recipients will receive a single-use sign-in link.
        </p>
        <Button disabled={isPending} type="submit">
          {isPending ? "Sending..." : "Send invite"}
        </Button>
      </div>
    </form>
  );
}
