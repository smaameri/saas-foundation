"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  image: z.string().url("Enter a valid URL").or(z.literal("")).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function ProfileForm({
  defaultName,
  defaultImage,
}: {
  defaultName: string;
  defaultImage: string;
}) {
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultName,
      image: defaultImage,
    },
  });

  const onSubmit = (values: FormValues) => {
    setStatus(null);

    startTransition(async () => {
      const { error } = await authClient.updateUser({
        name: values.name,
        image: values.image || undefined,
      });

      if (error) {
        setStatus({ ok: false, message: error.message ?? "Failed to update profile." });
      } else {
        setStatus({ ok: true, message: "Profile updated." });
      }
    });
  };

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Update your display name and avatar.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Jane Smith" {...form.register("name")} />
            {form.formState.errors.name ? (
              <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
            ) : null}
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
            <div className={`text-sm ${status && !status.ok ? "text-destructive" : "text-muted-foreground"}`}>
              {status ? status.message : null}
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
