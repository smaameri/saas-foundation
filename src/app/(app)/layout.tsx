import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { fetchSession } from "@/lib/session";

export default async function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await fetchSession();

  if (!session?.session) {
    redirect("/login");
  }

  return <>{children}</>;
}
