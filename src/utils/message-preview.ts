import type { ThreadLastMessage } from "@/types/api";

function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1).trimEnd()}…`;
}

export function formatMessagePreview(
  lastMessage: ThreadLastMessage | null | undefined,
): string {
  if (!lastMessage) {
    return "No messages yet";
  }

  const content = lastMessage.content.trim();
  const hasAttachment = lastMessage.hasAttachments;

  if (hasAttachment && (!content || content === "Receipt attached")) {
    return "Receipt attached";
  }

  if (hasAttachment) {
    return truncate(`Attachment · ${content}`, 96);
  }

  if (lastMessage.role === "assistant") {
    return truncate(content, 96);
  }

  return truncate(content, 96);
}

export { isValidChatThreadId as isValidThreadId } from "@/lib/chat/local-thread";
