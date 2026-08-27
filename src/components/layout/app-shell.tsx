"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { BrandLockup } from "@/components/brand/brand-lockup";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const isChat = pathname.startsWith("/app/chat");

  return (
    <div className="h-dvh overflow-hidden bg-background text-foreground">
      <div className="flex h-full w-full">
        <div className="hidden h-full shrink-0 lg:block">
          <AppSidebar />
        </div>

        {mobileSidebarOpen ? (
          <button
            type="button"
            aria-label="Close sidebar"
            className="fixed inset-0 z-40 bg-[var(--overlay)] lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        ) : null}

        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-[min(100%,18rem)] transition-transform duration-200 ease-out lg:hidden",
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <AppSidebar onNavigate={() => setMobileSidebarOpen(false)} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col bg-background">
          <header className="z-30 flex shrink-0 items-center justify-between gap-3 px-4 py-3 lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open sidebar"
              className="text-muted-foreground"
            >
              Menu
            </Button>
            <BrandLockup size="sm" />
            <span className="w-[3.25rem]" aria-hidden />
          </header>

          <main
            className={cn(
              "min-h-0 flex-1 overflow-hidden",
              isChat ? "p-0" : "overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8 xl:px-10",
            )}
          >
            <div
              className={cn(
                "w-full",
                isChat ? "flex h-full min-h-0 flex-col" : "pb-8",
              )}
            >
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
