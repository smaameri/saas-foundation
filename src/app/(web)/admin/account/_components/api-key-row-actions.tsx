"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { z } from "zod";
import { apiKeysApi } from "@/services/api/admin/apiKeysApi";
import { CancelButton } from "@/components/buttons/cancel-button";
import { DestructiveButton } from "@/components/buttons/destructive-button";
import { RowActionsDropdown } from "@/components/connected-data-table/row-actions-dropdown";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
      setDialog(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => apiKeysApi.deleteApiKey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
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
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit((values) => editMutation.mutate(values))}
          >
            <div className="space-y-1.5">
              <Label htmlFor="api-key-name">Name</Label>
              <Input id="api-key-name" {...form.register("name")} />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>
            {editMutation.isError && (
              <p className="text-sm text-destructive">Failed to update. Please try again.</p>
            )}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDialog(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={editMutation.isPending}>
                {editMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
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
