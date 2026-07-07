"use client";

import { AppSidebar } from "@/components/layout/admin-sidebar";
import { BaseAuthenticatedLayout } from "@/components/layout/authenticated-layout";

type NavUser = {
  name: string;
  email: string;
  image: string;
};

type AdminLayoutProps = {
  user: NavUser;
  children?: React.ReactNode;
};

export function AdminLayout({ user, children }: AdminLayoutProps) {
  return (
    <BaseAuthenticatedLayout sidebar={<AppSidebar user={user} />}>
      {children}
    </BaseAuthenticatedLayout>
  );
}
