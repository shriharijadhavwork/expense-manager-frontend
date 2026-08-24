"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/auth/auth-provider";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description="Your account details and signed-in identity."
      />

      <Card>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold">Account</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Information from your authenticated session.
            </p>
          </div>
          <Badge tone="success">Active</Badge>
        </div>

        <dl className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Name
            </dt>
            <dd className="mt-1 text-sm font-medium">{user?.name}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Email
            </dt>
            <dd className="mt-1 text-sm font-medium">{user?.email}</dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}
