import { apiRequest } from "@/lib/api/client";
import type {
  CreateMessageInput,
  ListMessagesQuery,
  Message,
  MessageListResult,
} from "@/types/api";

function buildQuery(query: ListMessagesQuery = {}): string {
  const params = new URLSearchParams();

  if (query.limit !== undefined) {
    params.set("limit", String(query.limit));
  }

  if (query.before) {
    params.set("before", query.before);
  }

  const serialized = params.toString();
  return serialized ? `?${serialized}` : "";
}

export const messagesApi = {
  list(threadId: string, query?: ListMessagesQuery): Promise<MessageListResult> {
    return apiRequest<MessageListResult>(
      `/threads/${threadId}/messages${buildQuery(query)}`,
    );
  },

  create(threadId: string, input: CreateMessageInput): Promise<Message> {
    return apiRequest<Message>(`/threads/${threadId}/messages`, {
      method: "POST",
      body: input,
    });
  },
};
