import type { Metadata } from "next";
import { OrganizationDetailView } from "./organization-detail-view";

export const metadata: Metadata = {
  title: "Organization",
};

export default function OrganizationDetailPage({ params }: { params: { id: string } }) {
  return <OrganizationDetailView organizationId={params.id} />;
}
