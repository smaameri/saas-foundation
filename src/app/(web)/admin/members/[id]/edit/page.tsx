"use client";

import { useRouter } from "next/navigation";
import { use } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { membersApi } from "@/services/api/admin/membersApi";
import { ContentLayout } from "@/components/platform/content-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (values: UpdateMemberBody) => membersApi.updateMember(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "members"] });
      router.push("/admin/members");
    },
  });

  if (isLoading) return null;
  if (!member) return <p className="p-6 text-muted-foreground">Member not found.</p>;

  const fullName =
    [member.user.firstName, member.user.lastName].filter(Boolean).join(" ") || member.user.name;

  return (
    <ContentLayout title={`Edit ${fullName}`} description="Update this member's name and roles.">
      <form
        className="mt-6 max-w-md space-y-6"
        onSubmit={form.handleSubmit((values) => mutate(values))}
      >
        <div className="space-y-1.5">
          <Label htmlFor="firstName">First name</Label>
          <Input id="firstName" {...form.register("firstName")} />
          {form.formState.errors.firstName && (
            <p className="text-sm text-destructive">{form.formState.errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="lastName">Last name</Label>
          <Input id="lastName" {...form.register("lastName")} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="platformRole">Admin portal role</Label>
          <Controller
            control={form.control}
            name="platformRole"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="platformRole">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {platformRoleOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="role">Customer portal role</Label>
          <Controller
            control={form.control}
            name="role"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {orgRoleOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {isError && (
          <p className="text-sm text-destructive">Failed to update member. Please try again.</p>
        )}

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save changes"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/members")}>
            Cancel
          </Button>
        </div>
      </form>
    </ContentLayout>
  );
}
