import type { Message } from "@/types/api";

export type AttachmentStatus =
  | "ready"
  | "uploading"
  | "uploaded"
  | "error";

export type ChatAttachment = {
  id: string;
  name: string;
  type: string;
  size: number;
  previewUrl: string;
  fileUrl?: string;
  status: AttachmentStatus;
  progress: number;
  error?: string;
};

export type DisplayMessage = Message & {
  clientKey: string;
  sendStatus?: "sending" | "sent" | "failed";
  attachments: ChatAttachment[];
  errorMessage?: string;
};
