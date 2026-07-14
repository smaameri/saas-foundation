"use client";

import { getCookie } from "@/lib/cookies";
import { cn } from "@/lib/utils";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { LayoutProvider } from "@/context/layout-provider";

type BaseAuthenticatedLayoutProps = {
  sidebar: React.ReactNode;
  header?: React.ReactNode;
  children?: React.ReactNode;
};

export function BaseAuthenticatedLayout({
  header,
  sidebar,
  children,
}: BaseAuthenticatedLayoutProps) {
  const defaultOpen = getCookie("sidebar_state") !== "false";
  return (
    <LayoutProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        {sidebar}
        <SidebarInset
          className={cn(
            "@container/content",
            "has-data-[layout=fixed]:h-svh",
            "peer-data-[variant=inset]:has-data-[layout=fixed]:h-[calc(100svh-(var(--spacing)*4))]",
          )}
        >
          {header}
          {children}
        </SidebarInset>
      </SidebarProvider>
    </LayoutProvider>
  );
}
