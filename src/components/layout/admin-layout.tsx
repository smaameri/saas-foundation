"use client";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { BaseAuthenticatedLayout } from "@/components/layout/authenticated-layout";

type AdminLayoutProps = {
  children?: React.ReactNode;
};

export function AdminLayout({ children }: AdminLayoutProps) {
  return <BaseAuthenticatedLayout sidebar={<AppSidebar />}>{children}</BaseAuthenticatedLayout>;
}
