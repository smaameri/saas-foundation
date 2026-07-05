"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteButton } from "@/components/buttons/delete-button";
import { apiKeysApi } from "@/services/api/admin/apiKeysApi";

interface DeleteApiKeyButtonProps {
  id: string;
}

export function DeleteApiKeyButton({ id }: DeleteApiKeyButtonProps) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => apiKeysApi.deleteApiKey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "api-keys"] });
    },
  });

  return (
    <DeleteButton
      title="Delete API key?"
      description="This action cannot be undone. Any integrations using this key will stop working."
      onDelete={() => mutate()}
      isPending={isPending}
    />
  );
}
