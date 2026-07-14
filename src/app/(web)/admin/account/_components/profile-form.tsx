"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { accountApi } from "@/services/api/admin/accountApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type UpdateAccountBody, updateAccountSchema } from "@/app/api/admin/account/schema";
import type { User } from "@/types/user";

export function ProfileForm({ user }: { user: User }) {
  const form = useForm<UpdateAccountBody>({
    resolver: zodResolver(updateAccountSchema),
    defaultValues: {
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      image: user.image ?? "",
    },
  });

  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: (values: UpdateAccountBody) => accountApi.updateAccount(values),
  });

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Update your name and avatar.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={form.handleSubmit((values) => mutate(values))}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" placeholder="Jane" {...form.register("firstName")} />
              {form.formState.errors.firstName ? (
                <p className="text-sm text-destructive">
                  {form.formState.errors.firstName.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" placeholder="Smith" {...form.register("lastName")} />
              {form.formState.errors.lastName ? (
                <p className="text-sm text-destructive">{form.formState.errors.lastName.message}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="image">Avatar URL</Label>
            <Input
              id="image"
              type="url"
              placeholder="https://example.com/avatar.jpg"
              {...form.register("image")}
            />
            {form.formState.errors.image ? (
              <p className="text-sm text-destructive">{form.formState.errors.image.message}</p>
            ) : null}
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className={`text-sm ${isError ? "text-destructive" : "text-muted-foreground"}`}>
              {isSuccess ? "Profile updated." : null}
              {isError ? "Failed to update profile. Please try again." : null}
            </div>
            <Button disabled={isPending} type="submit">
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
