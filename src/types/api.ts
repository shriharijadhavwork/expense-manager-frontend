export type User = {
  id: string;
  name: string;
  email: string;
  preferences: UserPreferences;
};

export type UserPreferences = {
  theme: "light" | "dark" | "system";
  timezone: string;
  defaultCurrency: string;
};

export type AuthResult = {
  user: User;
  token: string;
};

export type Expense = {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  /** Locale-grouped amount without symbol, e.g. "50,000". */
  formattedAmount: string;
  category: string;
  note: string;
  date: string;
  sourceThreadId?: string;
  sourceMessageId?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateExpenseInput = {
  amount: number;
  currency: string;
  category: string;
  note?: string;
  date: string;
};

export type UpdateExpenseInput = {
  amount?: number;
  currency?: string;
  category?: string;
  note?: string;
  date?: string;
};

export type SearchExpensesInput = {
  category?: string;
  from?: string;
  to?: string;
};

export type MessageRole = "user" | "assistant" | "system" | "tool";

export type ThreadLastMessage = {
  content: string;
  role: MessageRole;
  createdAt: string;
  hasAttachments: boolean;
};

export type Thread = {
  id: string;
  userId: string;
  title: string;
  lastActivityAt: string;
  readAt: string | null;
  unread?: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  lastMessage?: ThreadLastMessage | null;
};

export type CreateThreadInput = {
  title?: string;
};

export type UpdateThreadInput = {
  title?: string;
};

export type Message = {
  id: string;
  threadId: string;
  userId: string;
  role: MessageRole;
  content: string;
  attachmentIds: string[];
  expenseIds: string[];
  createdAt: string;
};

export type MessageListResult = {
  items: Message[];
  hasMore: boolean;
  nextCursor: string | null;
};

export type CreateMessageInput = {
  content: string;
  attachmentIds?: string[];
};

export type ListMessagesQuery = {
  limit?: number;
  before?: string;
};

export type UploadedFile = {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  kind: "image" | "pdf" | "doc";
  url: string;
  thumbnailUrl?: string;
  createdAt: string;
};

export type ApiErrorBody = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export type ApiSuccessBody<T> = {
  success: true;
  data: T;
};
