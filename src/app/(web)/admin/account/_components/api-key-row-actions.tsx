"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { apiKeysApi } from "@/services/api/admin/apiKeysApi";
import { CancelButton } from "@/components/buttons/cancel-button";
import { DestructiveButton } from "@/components/buttons/destructive-button";
import { PrimaryButton } from "@/components/buttons/primary-button";
import { RowActionsDropdown } from "@/components/connected-data-table/row-actions-dropdown";
import { MutationError } from "@/components/feedback/mutation-error";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const editSchema = z.object({ name: z.string().trim().min(1, "Name is required") });
type EditFormValues = z.infer<typeof editSchema>;

const QUERY_KEY = ["admin", "account", "api-keys"];

export function ApiKeyRowActions({ id, name }: { id: string; name: string | null }) {
  const [dialog, setDialog] = useState<"edit" | "delete" | null>(null);
  const queryClient = useQueryClient();

  const form = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
    values: { name: name ?? "" },
  });

  const editMutation = useMutation({
    mutationFn: (values: EditFormValues) => apiKeysApi.updateAccountApiKey(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success("API key updated.");
      setDialog(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => apiKeysApi.deleteApiKey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success("API key deleted.");
      setDialog(null);
    },
  });

  return (
    <>
      <RowActionsDropdown>
        <DropdownMenuItem onClick={() => setDialog("edit")}>
          Edit name
          <Pencil size={16} className="ml-auto" />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => setDialog("delete")}
        >
          Delete
          <Trash2 size={16} className="ml-auto" />
        </DropdownMenuItem>
      </RowActionsDropdown>

      <Dialog open={dialog === "edit"} onOpenChange={(val) => !val && setDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit API key name</DialogTitle>
            <DialogDescription>Update the name for this API key.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit((values) => editMutation.mutate(values))}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <MutationError
                isError={editMutation.isError}
                error={editMutation.error}
                fallback="Failed to update. Please try again."
              />

              <div className="flex justify-end gap-2">
                <CancelButton onClick={() => setDialog(null)} disabled={editMutation.isPending} />
                <PrimaryButton
                  type="submit"
                  isPending={editMutation.isPending}
                  pendingLabel="Saving..."
                >
                  Save
                </PrimaryButton>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={dialog === "delete"} onOpenChange={(val) => !val && setDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete API key?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Any integrations using this key will stop working.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <CancelButton onClick={() => setDialog(null)} disabled={deleteMutation.isPending} />
            <DestructiveButton
              onClick={() => deleteMutation.mutate()}
              isPending={deleteMutation.isPending}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
