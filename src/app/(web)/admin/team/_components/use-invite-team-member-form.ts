"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { invitationsApi } from "@/services/api/admin/invitationsApi";

const formSchema = z.object({
  email: z.string().email("Enter a valid email"),
  role: z.enum(["owner", "admin", "member"]),
  platformRole: z.enum(["admin", "user"]),
});

export type InviteTeamMemberFormValues = z.infer<typeof formSchema>;

export function useInviteTeamMemberForm(organizationId: string, onSuccess: () => void) {
  const queryClient = useQueryClient();

  const form = useForm<InviteTeamMemberFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", role: "member", platformRole: "user" },
  });

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (values: InviteTeamMemberFormValues) =>
      invitationsApi.sendInvitation(organizationId, values),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "invitations"] });
      toast.success("Invitation sent.");
      form.reset();
      onSuccess();
    },
  });

  return { form, mutate, isPending, isError, error };
}
