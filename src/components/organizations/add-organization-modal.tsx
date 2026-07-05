"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createOrganization } from "@/app/(web)/admin/(customers)/organizations/actions";

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase letters, numbers, and hyphens only"),
});

type FormValues = z.infer<typeof formSchema>;

function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function AddOrganizationModal() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", slug: "" },
  });

  const handleClose = (val: boolean) => {
    setOpen(val);
    if (!val) {
      form.reset();
      setSlugManuallyEdited(false);
      setStatus(null);
    }
  };

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue("name", e.target.value);
    if (!slugManuallyEdited) {
      form.setValue("slug", toSlug(e.target.value), { shouldValidate: true });
    }
  };

  const onSubmit = (values: FormValues) => {
    setStatus(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("slug", values.slug);

      const result = await createOrganization(formData);

      if (result.ok) {
        handleClose(false);
        router.refresh();
      } else {
        setStatus(result.message ?? "Something went wrong.");
      }
    });
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        Add organization
      </Button>

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add organization</DialogTitle>
            <DialogDescription>
              Create a new customer organization on the platform.
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-1.5">
              <Label htmlFor="org-name">Name</Label>
              <Input
                id="org-name"
                placeholder="Acme Inc."
                {...form.register("name")}
                onChange={onNameChange}
              />
              {form.formState.errors.name ? (
                <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="org-slug">Slug</Label>
              <Input
                id="org-slug"
                placeholder="acme-inc"
                {...form.register("slug")}
                onChange={(e) => {
                  setSlugManuallyEdited(true);
                  form.setValue("slug", e.target.value, { shouldValidate: true });
                }}
              />
              {form.formState.errors.slug ? (
                <p className="text-sm text-destructive">{form.formState.errors.slug.message}</p>
              ) : null}
            </div>

            {status ? <p className="text-sm text-destructive">{status}</p> : null}

            <div className="flex justify-end">
              <Button disabled={isPending} type="submit">
                {isPending ? "Creating..." : "Create organization"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
