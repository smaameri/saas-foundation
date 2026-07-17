"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { membersApi } from "@/services/api/admin/membersApi";

const formSchema = z.object({
  email: z.string().email("Enter a valid email"),
  platformRole: z.enum(["admin", "user"]),
});

export type InviteTeamMemberFormValues = z.infer<typeof formSchema>;

export function useInviteTeamMemberForm(onSuccess: () => void) {
  const queryClient = useQueryClient();

  const form = useForm<InviteTeamMemberFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", platformRole: "user" },
  });

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (values: InviteTeamMemberFormValues) => membersApi.inviteMember(values),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "invitations"] });
      toast.success("Invitation sent.");
      form.reset();
      onSuccess();
    },
  });

  return { form, mutate, isPending, isError, error };
}
