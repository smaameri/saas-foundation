import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { fetchSession } from "@/lib/session";
import { AdminLayout } from "@/components/layout/admin-layout";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await fetchSession();

  if (!session?.session) {
    redirect("/login");
  }

  const user = session.user;

  return (
    <AdminLayout user={{ name: user.name ?? "", email: user.email, image: user.image ?? "" }}>
      {children}
    </AdminLayout>
  );
}
