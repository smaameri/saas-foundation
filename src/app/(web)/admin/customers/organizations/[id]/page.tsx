import type { Metadata } from "next";
import { OrganizationDetailView } from "./organization-detail-view";

export const metadata: Metadata = {
  title: "Organization",
};

export default async function OrganizationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <OrganizationDetailView organizationId={id} />;
}
