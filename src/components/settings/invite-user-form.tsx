"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { invitePlatformUser } from "@/app/platform/settings/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

export function InviteUserForm() {
  const [status, setStatus] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "admin",
    },
  });

  const onSubmit = (values: FormValues) => {
    setStatus(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("role", values.role);

      const result = await invitePlatformUser(formData);
      setStatus(result.message);

      if (result.ok) {
        form.reset({ name: "", email: "", role: values.role });
      }
    });
  };

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Invite a platform user</CardTitle>
        <CardDescription>Send a magic link invite so teammates can access the platform.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Jane Smith" {...form.register("name")}/>
            {form.formState.errors.name ? (
              <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="jane@example.com" {...form.register("email")}/>
            {form.formState.errors.email ? (
              <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
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

          <div className="flex items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              {status ? status : "Recipients will receive a single-use sign-in link."}
            </div>
            <Button disabled={isPending} type="submit">
              {isPending ? "Sending..." : "Send invite"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
