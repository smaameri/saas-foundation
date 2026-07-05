import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { fetchSession } from "@/lib/session";
import { AppSidebar } from "@/components/app/app-sidebar";
import { HeaderUserButton } from "@/components/app/header-user-button";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await fetchSession();

  if (!session?.session) {
    redirect("/login");
  }

  const user = session.user;

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar name={user.name} email={user.email} role={user.role} image={user.image} />
      <div className="flex flex-1 flex-col">
        <header className="flex h-12 shrink-0 items-center justify-end border-b px-4">
          <HeaderUserButton />
        </header>
        {children}
      </div>
    </div>
  );
}
