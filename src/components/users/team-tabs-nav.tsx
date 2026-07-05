"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { tabsListVariants } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Users", href: "/admin/team/users" },
  { label: "Invitations", href: "/admin/team/invitations" },
];

export function TeamTabsNav() {
  const pathname = usePathname();

  return (
    <div className={cn(tabsListVariants({ variant: "line" }))}>
      {tabs.map((tab) => {
        const isActive = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            data-slot="tabs-trigger"
            data-active={isActive ? "" : undefined}
            className={cn(
              "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-1.5 py-0.5 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all hover:text-foreground",
              "after:absolute after:bg-foreground after:opacity-0 after:transition-opacity after:inset-x-0 after:bottom-[-5px] after:h-0.5",
              "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-active:bg-transparent",
              isActive && "text-foreground after:opacity-100",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
