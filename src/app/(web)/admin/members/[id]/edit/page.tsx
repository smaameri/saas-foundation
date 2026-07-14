"use client";

import { useRouter } from "next/navigation";
import { use } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { membersApi } from "@/services/api/admin/membersApi";
import { PrimaryButton } from "@/components/buttons/primary-button";
import { MutationError } from "@/components/feedback/mutation-error";
import { ContentLayout } from "@/components/platform/content-layout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type UpdateMemberBody, updateMemberSchema } from "@/app/api/admin/members/[id]/schema";

const platformRoleOptions = [
  { value: "user", label: "User" },
  { value: "admin", label: "Admin" },
] as const;

const orgRoleOptions = [
  { value: "member", label: "Member" },
  { value: "admin", label: "Admin" },
  { value: "owner", label: "Owner" },
] as const;

export default function EditMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: member, isLoading } = useQuery({
    queryKey: ["admin", "members", id],
    queryFn: () => membersApi.getMember(id),
  });

  const form = useForm<UpdateMemberBody>({
    resolver: zodResolver(updateMemberSchema),
    values: member
      ? {
          firstName: member.user.firstName ?? "",
          lastName: member.user.lastName ?? "",
          platformRole: (member.user.role as UpdateMemberBody["platformRole"]) ?? "user",
          role: member.role as UpdateMemberBody["role"],
        }
      : undefined,
  });

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (values: UpdateMemberBody) => membersApi.updateMember(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "members"] });
      toast.success("Member updated.");
      router.push("/admin/members");
    },
  });

  if (isLoading) return null;
  if (!member) return <p className="p-6 text-muted-foreground">Member not found.</p>;

  const fullName =
    [member.user.firstName, member.user.lastName].filter(Boolean).join(" ") || member.user.name;

  return (
    <ContentLayout title={`Edit ${fullName}`} description="Update this member's name and roles.">
      <Form {...form}>
        <form
          className="mt-6 max-w-md space-y-6"
          onSubmit={form.handleSubmit((values) => mutate(values))}
        >
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="platformRole"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Admin portal role</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {platformRoleOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer portal role</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {orgRoleOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <MutationError
            isError={isError}
            error={error}
            fallback="Failed to update member. Please try again."
          />

          <div className="flex items-center gap-3">
            <PrimaryButton type="submit" isPending={isPending} pendingLabel="Saving...">
              Save changes
            </PrimaryButton>
            <Button type="button" variant="outline" onClick={() => router.push("/admin/members")}>
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </ContentLayout>
  );
}
