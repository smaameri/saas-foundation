import type {Metadata} from "next";
import Link from "next/link";
import {
  LayoutDashboard,
  Settings,
} from "lucide-react";

import {LogoutButton} from "@/components/dashboard/logout-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {cn} from "@/lib/utils";
import {fetchSession} from "@/lib/session";

export const metadata: Metadata = {
  title: "Dashboard",
};

const sidebarItems = [
  {label: "Overview", href: "/dashboard", icon: LayoutDashboard},
  {label: "Organizations", href: "#", icon: LayoutDashboard},
  {label: "Settings", href: "#", icon: Settings},
];

export default async function DashboardPage() {
  const session = await fetchSession();
  const rawName = session?.user?.name ?? "";
  const userName = rawName
    ? rawName
        .split(/\s+/)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ")
    : "there";
  const userEmail = session?.user?.email ?? "";

  return (
    <main className="flex min-h-screen bg-background">
      <aside className="hidden w-64 flex-col border-r bg-background px-6 py-6 md:flex">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            SAAS Foundation
          </p>
          <h2 className="mt-2 text-xl font-semibold">Control Center</h2>
        </div>

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === "/dashboard";

            return (
              <Link
                key={item.label}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                href={item.href}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-10 text-xs text-muted-foreground">
          <p>Signed in as {userEmail || "admin"}</p>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b bg-background px-6 py-5">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back, {userName}</h1>
            {userEmail ? (
              <p className="text-sm text-muted-foreground">Signed in as {userEmail}</p>
            ) : null}
          </div>

          <LogoutButton />
        </header>

        <div className="flex flex-1 flex-col gap-6 px-6 py-6">
          <section>
            <Card size="sm">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>Start building your workspace from here.</CardDescription>
              </CardHeader>
              <CardContent className="py-6 text-sm text-muted-foreground">
                No insights yet. Once you connect data sources, key metrics will appear in this area.
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </main>
  );
}
