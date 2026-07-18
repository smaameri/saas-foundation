import type { ReactNode } from "react";
import { NavTabs } from "@/components/navigation/nav-tabs";
import { ContentLayout } from "@/components/platform/content-layout";

const tabs = [
  { label: "Organizations", href: "/admin/customers/organizations" },
  { label: "People", href: "/admin/customers/people" },
];

export default function CustomersLayout({ children }: { children: ReactNode }) {
  return (
    <ContentLayout title="Customers" description="Manage customer organizations and members.">
      <NavTabs tabs={tabs} />
      {children}
    </ContentLayout>
  );
}
