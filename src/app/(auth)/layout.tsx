import { Suspense } from "react";
import { GuestGuard } from "@/components/shared/guest-guard";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
        </div>
      }
    >
      <GuestGuard>
        <div className="relative min-h-screen bg-background">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-24 top-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -right-16 bottom-10 h-72 w-72 rounded-full bg-accent/40 blur-3xl dark:bg-accent/20" />
          </div>
          <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-10">
            {children}
          </div>
        </div>
      </GuestGuard>
    </Suspense>
  );
}
