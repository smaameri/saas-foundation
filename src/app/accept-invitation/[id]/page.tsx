import { redirect } from "next/navigation";

import { AcceptInvitationForm } from "@/components/auth/accept-invitation-form";
import { prisma } from "@/lib/prisma";
import { fetchSession } from "@/lib/session";

export default async function AcceptInvitationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await fetchSession();
  if (!session?.user) {
    redirect(`/login?redirect=/accept-invitation/${id}`);
  }

  const invitation = await prisma.invitation.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      expiresAt: true,
      organization: { select: { name: true } },
      inviter: { select: { name: true, firstName: true, lastName: true } },
    },
  });

  if (!invitation) {
    return <InvitationShell><p className="text-sm text-muted-foreground">This invitation link is invalid or has expired.</p></InvitationShell>;
  }

  if (invitation.status !== "pending") {
    return (
      <InvitationShell>
        <p className="text-sm text-muted-foreground capitalize">
          This invitation has already been {invitation.status}.
        </p>
      </InvitationShell>
    );
  }

  if (invitation.expiresAt < new Date()) {
    return <InvitationShell><p className="text-sm text-muted-foreground">This invitation has expired.</p></InvitationShell>;
  }

  if (session.user.email !== invitation.email) {
    return (
      <InvitationShell>
        <p className="text-sm text-muted-foreground">
          This invitation was sent to <span className="font-medium text-foreground">{invitation.email}</span>, but you&apos;re signed in as <span className="font-medium text-foreground">{session.user.email}</span>. Please sign in with the correct account to accept.
        </p>
      </InvitationShell>
    );
  }

  const inviterName =
    invitation.inviter.firstName && invitation.inviter.lastName
      ? `${invitation.inviter.firstName} ${invitation.inviter.lastName}`
      : invitation.inviter.name;

  return (
    <InvitationShell>
      <p className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{inviterName}</span> has invited you to join{" "}
        <span className="font-medium text-foreground">{invitation.organization.name}</span> as a{" "}
        <span className="font-medium text-foreground capitalize">{invitation.role}</span>.
      </p>
      <AcceptInvitationForm invitationId={invitation.id} />
    </InvitationShell>
  );
}

function InvitationShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6 rounded-lg border p-8">
        <div>
          <h1 className="text-xl font-semibold">You&apos;ve been invited</h1>
          <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            SaaS Foundation
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
