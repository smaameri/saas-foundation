"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const formSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

export function ChangePasswordForm() {
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    setStatus(null);

    startTransition(async () => {
      const { error } = await authClient.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        revokeOtherSessions: false,
      });

      if (error) {
        setStatus({ ok: false, message: error.message ?? "Failed to change password." });
      } else {
        setStatus({ ok: true, message: "Password changed successfully." });
        form.reset();
      }
    });
  };

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Change password</CardTitle>
        <CardDescription>Update your account password.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-1.5">
            <Label htmlFor="currentPassword">Current password</Label>
            <Input id="currentPassword" type="password" {...form.register("currentPassword")} />
            {form.formState.errors.currentPassword ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.currentPassword.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="newPassword">New password</Label>
            <Input id="newPassword" type="password" {...form.register("newPassword")} />
            {form.formState.errors.newPassword ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.newPassword.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirm new password</Label>
            <Input id="confirmPassword" type="password" {...form.register("confirmPassword")} />
            {form.formState.errors.confirmPassword ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.confirmPassword.message}
              </p>
            ) : null}
          </div>

          <div className="flex items-center justify-between gap-4">
            <div
              className={`text-sm ${status && !status.ok ? "text-destructive" : "text-muted-foreground"}`}
            >
              {status ? status.message : null}
            </div>
            <Button disabled={isPending} type="submit">
              {isPending ? "Saving..." : "Change password"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
