import { prisma } from "@/lib/prisma";
import { fetchSession } from "@/lib/session";
import { AcceptInvitationForm } from "@/components/auth/accept-invitation-form";
import { LoginForm } from "@/components/auth/login-form";
import { SignOutButton } from "@/components/auth/sign-out-button";

export default async function AcceptInvitationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [session, invitation] = await Promise.all([
    fetchSession(),
    prisma.invitation.findUnique({
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
    }),
  ]);

  if (!invitation) {
    return (
      <InvitationShell>
        <p className="text-sm text-muted-foreground">
          This invitation link is invalid or has expired.
        </p>
      </InvitationShell>
    );
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
    return (
      <InvitationShell>
        <p className="text-sm text-muted-foreground">This invitation has expired.</p>
      </InvitationShell>
    );
  }

  const inviterName =
    invitation.inviter.firstName && invitation.inviter.lastName
      ? `${invitation.inviter.firstName} ${invitation.inviter.lastName}`
      : invitation.inviter.name;

  const invitationDetails = (
    <p className="text-sm text-muted-foreground">
      <span className="font-medium text-foreground">{inviterName}</span> has invited you to join{" "}
      <span className="font-medium text-foreground">{invitation.organization.name}</span> as a{" "}
      <span className="font-medium text-foreground capitalize">{invitation.role}</span>.
    </p>
  );

  if (!session?.user) {
    return (
      <InvitationShell>
        {invitationDetails}
        <hr className="border-border" />
        <p className="text-sm text-muted-foreground">Sign in to accept this invitation.</p>
        <LoginForm redirectTo={`/accept-invitation/${id}`} />
      </InvitationShell>
    );
  }

  if (session.user.email !== invitation.email) {
    return (
      <InvitationShell>
        {invitationDetails}
        <hr className="border-border" />
        <p className="text-sm text-muted-foreground">
          This invitation was sent to{" "}
          <span className="font-medium text-foreground">{invitation.email}</span>, but you&apos;re
          signed in as <span className="font-medium text-foreground">{session.user.email}</span>.
        </p>
        <p className="text-sm text-muted-foreground">Sign out to accept this invitation.</p>
        <SignOutButton redirectTo={`/accept-invitation/${id}`}>Sign out</SignOutButton>
      </InvitationShell>
    );
  }

  return (
    <InvitationShell>
      {invitationDetails}
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
