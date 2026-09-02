export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
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

export type ExpenseDirection = "debit" | "credit";

export type ExpenseCategoryOption = {
  slug: string;
  title: string;
  subCategorySuggestions: string[];
};

export type Expense = {
  id: string;
  userId: string;
  groupId?: string;
  amount: number;
  currency: string;
  /** Locale-grouped amount without symbol, e.g. "50,000". */
  formattedAmount: string;
  direction: ExpenseDirection;
  /** Canonical slug — use categoryLabel in the UI. */
  category: string;
  categoryLabel: string;
  subCategory: string;
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
  direction?: ExpenseDirection;
  category: string;
  subCategory?: string;
  note?: string;
  date: string;
};

export type UpdateExpenseInput = {
  amount?: number;
  currency?: string;
  direction?: ExpenseDirection;
  category?: string;
  subCategory?: string;
  note?: string;
  date?: string;
};

export type SearchExpensesInput = {
  category?: string;
  subCategory?: string;
  direction?: ExpenseDirection;
  from?: string;
  to?: string;
};

export type MessageRole = "user" | "assistant" | "system" | "tool";

export type ThreadType = "personal" | "group";

export type ThreadLastMessage = {
  content: string;
  role: MessageRole;
  createdAt: string;
  hasAttachments: boolean;
};

export type Thread = {
  id: string;
  type: ThreadType;
  userId: string | null;
  groupId: string | null;
  createdBy: string;
  dayKey: string;
  sequence: number;
  title: string;
  lastActivityAt: string;
  readAt: string | null;
  unread?: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  lastMessage?: ThreadLastMessage | null;
  canManageRecycle?: boolean;
};

export type GroupMemberRole = "owner" | "member";

export type UserRelation =
  | "friend"
  | "family"
  | "partner"
  | "roommate"
  | "colleague"
  | "other";

export type GroupMember = {
  id: string;
  groupId: string;
  userId: string;
  name: string;
  email: string;
  role: GroupMemberRole;
  relation: UserRelation | null;
  addedBy: string | null;
  joinedAt: string;
};

export type Group = {
  id: string;
  name: string;
  createdBy: string;
  members: GroupMember[];
  createdAt: string;
  updatedAt: string;
};

export type GroupInviteStatus =
  | "pending"
  | "accepted"
  | "revoked"
  | "expired";

export type GroupInvite = {
  id: string;
  groupId: string;
  email: string;
  invitedBy: string;
  relation: UserRelation;
  status: GroupInviteStatus;
  expiresAt: string;
  inviteUrl: string | null;
  acceptedAt: string | null;
  acceptedBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export type InvitePreview = {
  email: string;
  groupName: string;
  status: GroupInviteStatus;
  expiresAt: string;
  relation: UserRelation;
  relationLabel: string;
  invitedByName: string;
  invitedByEmail: string;
};

export type LeaveGroupResult = {
  message: string;
  dissolved: boolean;
};

export type ResolveGroupInput = {
  emails?: string[];
  memberIds?: string[];
  name?: string;
  title?: string;
};

export type ResolveGroupResult = {
  group: Group;
  thread: Thread;
  created: boolean;
};

export type CreateGroupThreadInput = {
  title?: string;
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
