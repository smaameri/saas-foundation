"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiKeysApi } from "@/services/api/admin/apiKeysApi";
import { DeleteButton } from "@/components/buttons/delete-button";

interface DeleteApiKeyButtonProps {
  id: string;
}

export function DeleteApiKeyButton({ id }: DeleteApiKeyButtonProps) {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => apiKeysApi.deleteApiKey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "api-keys"] });
    },
  });

  return (
    <DeleteButton
      title="Revoke API key"
      description="This API key will immediately be disabled. API requests made using this key will be rejected, which could cause any systems still depending on it to break. Once revoked, you'll no longer be able to view or modify this API key."
      onDelete={mutateAsync}
      isPending={isPending}
      confirmLabel="Revoke"
      confirmPendingLabel="Revoking..."
    />
  );
}
