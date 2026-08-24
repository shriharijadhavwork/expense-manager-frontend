"use client";

import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Card } from "@/components/ui/card";

export default function SettlementsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settlements"
        description="Balances and settlement history will display values calculated by the backend."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <p className="text-sm text-muted-foreground">You are owed</p>
          <p className="mt-3 font-mono text-2xl font-semibold tracking-tight">
            —
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Waiting for settlement data from the API
          </p>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">You owe</p>
          <p className="mt-3 font-mono text-2xl font-semibold tracking-tight">
            —
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            No client-side balance calculations
          </p>
        </Card>
      </div>

      <EmptyState
        title="No settlements yet"
        description="Shared expenses and settlement history will appear here when the backend settlement endpoints are available. This screen never invents balances."
      />
    </div>
  );
}
