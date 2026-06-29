"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { cancelInvitation } from "@/app/(admin)/admin/organizations/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { listAdminInvitations, listAdminUsers } from "@/repositories/admin/adminOrganizationRepository";

type User = Awaited<ReturnType<typeof listAdminUsers>>[number];
type Invitation = Awaited<ReturnType<typeof listAdminInvitations>>[number];

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "default",
  accepted: "secondary",
  rejected: "outline",
  canceled: "destructive",
};

function CancelButton({ invitationId }: { invitationId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await cancelInvitation(invitationId);
          router.refresh();
        })
      }
    >
      {isPending ? "Canceling..." : "Cancel"}
    </Button>
  );
}

export function UsersTabs({
  users,
  invitations = [],
}: {
  users: User[];
  invitations?: Invitation[];
}) {
  return (
    <Tabs defaultValue="users">
      <TabsList variant="line">
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="invitations">Invitations</TabsTrigger>
      </TabsList>

      <TabsContent value="users" className="mt-6">
        {users.length === 0 ? (
          <p className="text-sm text-muted-foreground">No users yet.</p>
        ) : (
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3">First name</th>
                  <th className="px-4 py-3">Last name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Organizations</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{user.firstName ?? user.name}</td>
                    <td className="px-4 py-3">{user.lastName ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                    <td className="px-4 py-3">
                      {user.members.length === 0 ? (
                        <span className="text-muted-foreground">—</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {user.members.map(({ organization }) => (
                            <span
                              key={organization.id}
                              className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                            >
                              {organization.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 capitalize text-muted-foreground">
                      {user.role ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {user.createdAt.toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </TabsContent>

      <TabsContent value="invitations" className="mt-6">
        {invitations.length === 0 ? (
          <p className="text-sm text-muted-foreground">No invitations sent yet.</p>
        ) : (
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Sent</th>
                  <th className="px-4 py-3">Expires</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {invitations.map((inv) => (
                  <tr key={inv.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{inv.email}</td>
                    <td className="px-4 py-3 capitalize text-muted-foreground">{inv.role}</td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant[inv.status] ?? "outline"} className="capitalize">
                        {inv.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {inv.createdAt.toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {inv.expiresAt.toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {inv.status === "pending" && <CancelButton invitationId={inv.id} />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
