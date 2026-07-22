import { OrganizationMembersTable } from "@/app/(web)/admin/organizations/[id]/members/_components/organization-members-table";

export default async function OrganizationMembersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <OrganizationMembersTable organizationId={id} />;
}
