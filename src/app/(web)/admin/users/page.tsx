import { UsersPageClient } from "./_components/users-page-client";
import { requireSession } from "@/lib/auth/session";
import { ContentLayout } from "@/components/platform/content-layout";

export default async function UsersPage() {
  const { user } = await requireSession();

  return (
    <ContentLayout title="Users" description="Manage all user accounts across the platform.">
      <UsersPageClient currentUserId={user.id} />
    </ContentLayout>
  );
}
