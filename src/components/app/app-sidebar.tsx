"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, KeyRound, LayoutDashboard, Users, UsersRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserButton } from "@/components/app/user-button";

const navSections = [
  {
    items: [{ label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Customers",
    items: [
      { label: "Organizations", href: "/admin/organizations", icon: Building2 },
      { label: "Users", href: "/admin/users", icon: Users },
    ],
  },
  {
    label: "Administration",
    items: [
      { label: "Members", href: "/admin/members", icon: UsersRound },
      { label: "API Keys", href: "/admin/api-keys", icon: KeyRound },
    ],
  },
] as const;

export function AppSidebar({
  name,
  email,
  role,
  image,
}: {
  name: string;
  email: string;
  role?: string | null;
  image?: string | null;
}) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-col border-r bg-background px-4 py-6 md:flex">
      <div className="px-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          SAAS Foundation
        </p>
        <h2 className="mt-2 text-xl font-semibold">Admin Dashboard</h2>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-6">
        {navSections.map((section, i) => (
          <div key={i}>
            {section.label ? (
              <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                {section.label}
              </p>
            ) : null}
            <div className="flex flex-col gap-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin/dashboard" && pathname?.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                    href={item.href}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-4">
        <UserButton name={name} email={email} role={role} image={image} />
      </div>
    </aside>
  );
}
