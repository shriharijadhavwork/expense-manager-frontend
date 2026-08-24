"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth/auth-provider";
import { useTheme } from "@/lib/theme/theme-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

const navItems = [
  { href: "/app", label: "Overview", match: (path: string) => path === "/app" },
  {
    href: "/app/expenses",
    label: "Expenses",
    match: (path: string) => path.startsWith("/app/expenses"),
  },
  {
    href: "/app/chat",
    label: "Chat",
    match: (path: string) => path.startsWith("/app/chat"),
  },
  {
    href: "/app/threads",
    label: "Threads",
    match: (path: string) => path.startsWith("/app/threads"),
  },
  {
    href: "/app/settlements",
    label: "Settlements",
    match: (path: string) => path.startsWith("/app/settlements"),
  },
  {
    href: "/app/settings",
    label: "Settings",
    match: (path: string) => path.startsWith("/app/settings"),
  },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const cycleTheme = () => {
    const order = ["system", "light", "dark"] as const;
    const index = order.indexOf(theme);
    setTheme(order[(index + 1) % order.length] ?? "system");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar px-4 py-5 lg:flex">
          <div className="mb-8 px-2">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Expense Manager
            </p>
            <p className="mt-1 text-sm text-sidebar-foreground/80">
              Personal finance, clearly
            </p>
          </div>

          <nav className="flex flex-1 flex-col gap-1">
            {navItems.map((item) => {
              const active = item.match(pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-sidebar-accent text-foreground"
                      : "text-muted-foreground hover:bg-sidebar-accent/70 hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto space-y-3 border-t border-sidebar-border pt-4">
            <div className="px-2">
              <p className="truncate text-sm font-medium">{user?.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {user?.email}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={cycleTheme}
              >
                Theme
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1"
                onClick={() => void logout()}
              >
                Log out
              </Button>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-border bg-background/90 px-4 py-3 backdrop-blur lg:hidden">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">Expense Manager</p>
                <p className="text-xs text-muted-foreground">{user?.name}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMobileOpen((open) => !open)}
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav"
              >
                Menu
              </Button>
            </div>
            {mobileOpen ? (
              <nav
                id="mobile-nav"
                className="mt-3 grid gap-1 rounded-[var(--radius-md)] border border-border bg-card p-2"
              >
                {navItems.map((item) => {
                  const active = item.match(pathname);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "rounded-[var(--radius-sm)] px-3 py-2.5 text-sm font-medium",
                        active
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
                <div className="mt-1 grid grid-cols-2 gap-2 border-t border-border pt-2">
                  <Button variant="outline" size="sm" onClick={cycleTheme}>
                    Theme
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => void logout()}
                  >
                    Log out
                  </Button>
                </div>
              </nav>
            ) : null}
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div className="mx-auto w-full max-w-5xl pb-20 lg:pb-0">
              {children}
            </div>
          </main>

          <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur lg:hidden">
            <div className="mx-auto grid max-w-lg grid-cols-4 gap-1 px-2 py-2">
              {navItems.slice(0, 4).map((item) => {
                const active = item.match(pathname);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-[var(--radius-sm)] px-2 py-2 text-center text-xs font-medium",
                      active
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
