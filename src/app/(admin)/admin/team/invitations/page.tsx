import { Badge } from "@/components/ui/badge";
import { CancelInvitationButton } from "@/components/users/cancel-invitation-button";
import { listAdminInvitations } from "@/repositories/admin/adminOrganizationRepository";

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "default",
  accepted: "secondary",
  rejected: "outline",
  canceled: "destructive",
};

export default async function TeamInvitationsPage() {
  const invitations = await listAdminInvitations();

  return (
    <div className="mt-6">
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
                    {inv.status === "pending" && <CancelInvitationButton invitationId={inv.id} />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
