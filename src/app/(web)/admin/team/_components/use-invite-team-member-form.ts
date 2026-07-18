"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { z } from "zod";
import { teamApi } from "@/services/api/admin/teamApi";
import { createAdminPortalInvitationSchema } from "@/app/api/admin/team/invitations/schema";

export type InviteTeamMemberFormValues = z.infer<typeof createAdminPortalInvitationSchema>;

export function useInviteTeamMemberForm(onSuccess: () => void) {
  const queryClient = useQueryClient();

  const form = useForm<InviteTeamMemberFormValues>({
    resolver: zodResolver(createAdminPortalInvitationSchema),
    defaultValues: { email: "", role: "user" },
  });

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (values: InviteTeamMemberFormValues) => teamApi.inviteMember(values),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "team"] });
      toast.success("Invitation sent.");
      form.reset();
      onSuccess();
    },
  });

  return { form, mutate, isPending, isError, error };
}
