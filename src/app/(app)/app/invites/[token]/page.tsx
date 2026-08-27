"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

/** Legacy invite links under /app/invites/:token redirect to the public invite page. */
export default function LegacyAcceptInviteRedirect() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const token = typeof params.token === "string" ? params.token : "";

  useEffect(() => {
    router.replace(token ? `/invites/${token}` : "/app");
  }, [router, token]);

  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
    </div>
  );
}
