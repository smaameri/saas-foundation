import { OrganizationDetailView } from "./organization-detail-view";

export default async function OrganizationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <OrganizationDetailView organizationId={id} />;
}
