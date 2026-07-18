"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMembers } from "./members-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { teamApi } from "@/services/api/admin/teamApi";
import { CancelButton } from "@/components/buttons/cancel-button";
import { PrimaryButton } from "@/components/buttons/primary-button";
import { MutationError } from "@/components/feedback/mutation-error";
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
import { Textarea } from "@/components/ui/textarea";

const banUserSchema = z.object({
  banReason: z.string().trim().max(255, "Reason must be 255 characters or fewer").optional(),
});

type BanUserValues = z.infer<typeof banUserSchema>;

export function BanUserDialog() {
  const { open, setOpen, currentRow, currentUserId } = useMembers();
  const queryClient = useQueryClient();

  const form = useForm<BanUserValues>({
    resolver: zodResolver(banUserSchema),
    defaultValues: { banReason: "" },
  });

  useEffect(() => {
    if (open === "ban") {
      form.reset({ banReason: "" });
    }
  }, [open, form]);

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (values: BanUserValues) => {
      return teamApi.banUser(currentRow!.id, {
        banReason: values.banReason || undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "team"] });
      toast.success("User banned.");
      setOpen(null);
    },
  });

  const handleOpenChange = (val: boolean) => {
    if (!val) setOpen(null);
  };

  if (!currentRow || currentRow.id === currentUserId) return null;

  return (
    <Dialog open={open === "ban"} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ban user</DialogTitle>
          <DialogDescription>
            Prevent {currentRow?.name} from signing in. You can optionally provide a reason for the
            ban.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-5" onSubmit={form.handleSubmit((values) => mutate(values))}>
            <FormField
              control={form.control}
              name="banReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason (optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Reason for banning the user" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <MutationError
              isError={isError}
              error={error}
              fallback="Failed to ban user. Please try again."
            />

            <div className="flex justify-end gap-2">
              <CancelButton onClick={() => setOpen(null)} disabled={isPending} />
              <PrimaryButton type="submit" isPending={isPending} pendingLabel="Banning...">
                Ban user
              </PrimaryButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
