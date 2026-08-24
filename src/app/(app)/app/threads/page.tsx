"use client";

import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ThreadsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Threads"
        description="Browse conversations grouped by recency once the threads API is connected."
        actions={
          <Button disabled title="Requires backend threads API">
            New thread
          </Button>
        }
      />

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Today
            </h2>
          </div>
        </div>
        <EmptyState
          title="No threads yet"
          description="When conversations exist, they’ll appear here under Today, Yesterday, and earlier groups — with last activity and status."
          className="border-0 bg-transparent px-0 py-8"
        />
      </Card>
    </div>
  );
}
