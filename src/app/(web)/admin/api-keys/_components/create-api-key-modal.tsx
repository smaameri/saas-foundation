"use client";

import {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {KeyRound} from "lucide-react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {ApiError} from "@/api/client";
import {apiKeysApi} from "@/api/admin/apiKeysApi";
import {createApiKeySchema, type CreateApiKeyBody} from "@/app/api/admin/api-keys/schema";
import {CopyButton} from "@/components/buttons/copy-button";
import {PrimaryButton} from "@/components/buttons/primary-button";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";


export function CreateApiKeyModal() {
  const [open, setOpen] = useState(false);
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const form = useForm<CreateApiKeyBody>({
    resolver: zodResolver(createApiKeySchema),
    defaultValues: {name: ""},
  });

  const {mutate, isPending, error} = useMutation({
    mutationFn: (values: CreateApiKeyBody) => apiKeysApi.createApiKey(values),
    onSuccess: (result) => {
      setCreatedKey(result.key);
      queryClient.invalidateQueries({queryKey: ["admin", "api-keys"]});
    },
  });

  const handleClose = (val: boolean) => {
    setOpen(val);
    if (!val) {
      form.reset();
      setCreatedKey(null);
    }
  };

  const errorMessage = error instanceof ApiError ? error.message : error ? "Failed to create API key. Please try again." : null;

  return (
    <>
      <PrimaryButton onClick={() => setOpen(true)}>
        <KeyRound className="h-4 w-4"/>
        Create API key
      </PrimaryButton>

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{createdKey ? "API key created" : "Create API key"}</DialogTitle>
            <DialogDescription>
              {createdKey
                ? "Copy your key now — it won't be shown again."
                : "Give your API key a name to identify it later."}
            </DialogDescription>
          </DialogHeader>

          {createdKey ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 rounded-md border bg-muted px-3 py-2">
                <code className="flex-1 break-all text-sm">{createdKey}</code>
                <CopyButton value={createdKey}/>
              </div>
              <PrimaryButton className="w-full" onClick={() => handleClose(false)}>
                Done
              </PrimaryButton>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={form.handleSubmit((values) => mutate(values))}>
              <div className="space-y-1.5">
                <Label htmlFor="api-key-name">Name</Label>
                <Input
                  id="api-key-name"
                  placeholder="e.g. Production"
                  {...form.register("name")}
                />
                {form.formState.errors.name ? (
                  <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                ) : null}
              </div>

              {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}

              <div className="flex justify-end">
                <PrimaryButton type="submit" isPending={isPending} pendingLabel="Creating...">
                  Create key
                </PrimaryButton>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
