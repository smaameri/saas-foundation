"use client";

import { useState } from "react";
import { useOrganizationMembers } from "./members-provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { membersApi } from "@/services/api/admin/membersApi";
import { CancelButton } from "@/components/buttons/cancel-button";
import { PrimaryButton } from "@/components/buttons/primary-button";
import { MutationError } from "@/components/feedback/mutation-error";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DeleteUserDialog() {
  const { open, setOpen, currentRow, selectedMemberId, setSelectedMemberId } =
    useOrganizationMembers();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async () => {
      await membersApi.deleteMember(selectedMemberId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "organizations", "members"] });
      toast.success("Member removed.");
      setOpen(null);
    },
  });

  const handleOpenChange = (value: boolean) => {
    if (value) {
      if (currentRow && !selectedMemberId) {
        setSelectedMemberId(currentRow.organizations[0]?.memberId ?? "");
      }
      setErrorMessage(null);
    } else {
      setErrorMessage(null);
      setOpen(null);
    }
  };

  if (!currentRow) return null;

  const hasMultipleOrganizations = currentRow.organizations.length > 1;
  const selectedOrganization = currentRow.organizations.find(
    (membership) => membership.memberId === selectedMemberId,
  );

  return (
    <Dialog open={open === "delete"} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete user</DialogTitle>
          <DialogDescription>
            Remove this member from the selected organization. This will not delete their account.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {hasMultipleOrganizations ? (
            <div className="space-y-2">
              <Label>Organization</Label>
              <Select
                value={selectedMemberId}
                onValueChange={(value) => {
                  setSelectedMemberId(value);
                  setErrorMessage(null);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currentRow.organizations.map((membership) => (
                    <SelectItem key={membership.memberId} value={membership.memberId}>
                      {membership.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(errorMessage || (!selectedMemberId && isError)) && (
                <p className="text-sm text-destructive">
                  {errorMessage ?? "Select an organization."}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Remove {currentRow.name} from{" "}
              <strong>{selectedOrganization?.name ?? "this organization"}</strong>?
            </p>
          )}
        </div>

        <MutationError
          isError={isError && !errorMessage}
          error={error}
          fallback="Failed to remove this member. Please try again."
        />

        <DialogFooter className="flex justify-end gap-2">
          <CancelButton onClick={() => setOpen(null)} disabled={isPending} />
          <PrimaryButton
            type="button"
            onClick={() => {
              if (!selectedMemberId) {
                setErrorMessage("Select an organization to remove this member from.");
                return;
              }
              mutate();
            }}
            isPending={isPending}
            pendingLabel="Removing..."
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Remove member
          </PrimaryButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
