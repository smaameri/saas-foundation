"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { invitePlatformUser } from "@/app/platform/users/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const roleOptions = [
  { value: "admin", label: "Admin" },
  { value: "owner", label: "Owner" },
  { value: "member", label: "Member" },
] as const;

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  role: z.enum(["owner", "admin", "member"]),
});

type FormValues = z.infer<typeof formSchema>;

export function InviteUserForm({ onSuccess }: { onSuccess?: () => void }) {
  const [status, setStatus] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", role: "admin" },
  });

  const onSubmit = (values: FormValues) => {
    setStatus(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("role", values.role);

      const result = await invitePlatformUser(formData);

      if (result.ok) {
        form.reset({ name: "", email: "", role: values.role });
        onSuccess?.();
      } else {
        setStatus(result.message);
      }
    });
  };

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-1.5">
        <Label htmlFor="invite-name">Name</Label>
        <Input id="invite-name" placeholder="Jane Smith" {...form.register("name")} />
        {form.formState.errors.name ? (
          <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
        ) : null}
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
        {form.formState.errors.role ? (
          <p className="text-sm text-destructive">{form.formState.errors.role.message}</p>
        ) : null}
      </div>

      {status ? (
        <p className="text-sm text-destructive">{status}</p>
      ) : null}

      <div className="flex justify-end gap-3">
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
