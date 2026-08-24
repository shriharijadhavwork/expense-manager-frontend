import { Suspense } from "react";
import { ChatPageContent } from "@/app/(app)/app/chat/chat-page-content";
import { Skeleton } from "@/components/ui/skeleton";

function ChatPageFallback() {
  return (
    <div className="flex min-h-0 flex-1 flex-col px-4 py-6 sm:px-6">
      <div className="mx-auto w-full max-w-3xl space-y-4">
        <Skeleton className="mx-auto h-5 w-40" />
        <Skeleton className="ml-auto h-12 w-2/3 max-w-sm rounded-[1.25rem]" />
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<ChatPageFallback />}>
      <ChatPageContent />
    </Suspense>
  );
}
