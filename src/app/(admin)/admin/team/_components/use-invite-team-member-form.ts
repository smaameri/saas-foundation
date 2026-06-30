"use client";

import {useState, useTransition} from "react";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {z} from "zod";

import {ApiError} from "@/services/api/client";
import {invitationsApi} from "@/services/api/admin/invitationsApi";

const formSchema = z.object({
  email: z.string().email("Enter a valid email"),
  role: z.enum(["owner", "admin", "member"]),
});

export type InviteTeamMemberFormValues = z.infer<typeof formSchema>;

export function useInviteTeamMemberForm(organizationId: string, onSuccess: () => void) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<InviteTeamMemberFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {email: "", role: "member"},
  });

  const onSubmit = (values: InviteTeamMemberFormValues) => {
    setError(null);
    startTransition(async () => {
      try {
        await invitationsApi.sendInvitation(organizationId, values);
        onSuccess();
        router.refresh();
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Failed to send invite. Please try again.");
      }
    });
  };

  return {form, error, isPending, onSubmit};
}
