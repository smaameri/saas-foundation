import type { Metadata } from "next";

import { HeaderUserButton } from "@/components/app/header-user-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Dashboard",
};

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
    <main className="flex flex-1 flex-col bg-background">
      <header className="flex items-center justify-between border-b px-6 py-5">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back, {userName}</h1>
          {userEmail ? (
            <p className="text-sm text-muted-foreground">Signed in as {userEmail}</p>
          ) : null}
        </div>

        <HeaderUserButton />
      </header>

      <section className="flex flex-1 flex-col gap-6 px-6 py-6">
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
    </main>
  );
}
