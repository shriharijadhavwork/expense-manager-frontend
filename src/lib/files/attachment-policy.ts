/**
 * Receipt / chat attachment policy.
 *
 * Allowed: images (not GIF), PDF, Word DOC/DOCX
 * Blocked: video, audio, GIF, stickers, archives, executables, etc.
 */

export const MAX_ATTACHMENT_BYTES = 8 * 1024 * 1024;

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

const DOCUMENT_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const BLOCKED_EXPLICIT = new Set([
  "image/gif",
  "image/apng",
  "image/svg+xml",
]);

const ACCEPT_ATTR = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".heic",
  ".heif",
  ".pdf",
  ".doc",
  ".docx",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
].join(",");

export const attachmentPolicy = {
  acceptAttr: ACCEPT_ATTR,
  maxBytes: MAX_ATTACHMENT_BYTES,
  allowedLabel: "Images (JPG, PNG, WebP, HEIC), PDF, or Word (DOC, DOCX)",
  blockedLabel: "GIF, video, audio, stickers, and other formats are not supported",
} as const;

export type AttachmentKind = "image" | "pdf" | "doc";

export function getAttachmentKind(type: string, fileName = ""): AttachmentKind | null {
  const lowerName = fileName.toLowerCase();

  if (
    BLOCKED_EXPLICIT.has(type) ||
    lowerName.endsWith(".gif") ||
    type.startsWith("video/") ||
    type.startsWith("audio/")
  ) {
    return null;
  }

  if (
    IMAGE_TYPES.has(type) ||
    lowerName.endsWith(".jpg") ||
    lowerName.endsWith(".jpeg") ||
    lowerName.endsWith(".png") ||
    lowerName.endsWith(".webp") ||
    lowerName.endsWith(".heic") ||
    lowerName.endsWith(".heif")
  ) {
    return "image";
  }

  // Reject other image/* types (gif already handled; svg/bmp/etc. blocked)
  if (type.startsWith("image/")) {
    return null;
  }

  if (type === "application/pdf" || lowerName.endsWith(".pdf")) {
    return "pdf";
  }

  if (
    DOCUMENT_TYPES.has(type) ||
    lowerName.endsWith(".doc") ||
    lowerName.endsWith(".docx")
  ) {
    return "doc";
  }

  return null;
}

export function isAllowedAttachment(file: File): {
  ok: boolean;
  kind: AttachmentKind | null;
  error?: string;
} {
  if (file.type.startsWith("video/") || file.type.startsWith("audio/")) {
    return {
      ok: false,
      kind: null,
      error: "Video and audio files are not supported. Use an image, PDF, or Word document.",
    };
  }

  if (
    file.type === "image/gif" ||
    file.name.toLowerCase().endsWith(".gif")
  ) {
    return {
      ok: false,
      kind: null,
      error: "GIFs and stickers are not supported. Use JPG, PNG, WebP, or HEIC.",
    };
  }

  const kind = getAttachmentKind(file.type, file.name);
  if (!kind) {
    return {
      ok: false,
      kind: null,
      error: `Unsupported file. ${attachmentPolicy.allowedLabel}. ${attachmentPolicy.blockedLabel}.`,
    };
  }

  if (file.size > MAX_ATTACHMENT_BYTES) {
    return {
      ok: false,
      kind,
      error: "File is too large. Keep uploads under 8 MB.",
    };
  }

  return { ok: true, kind };
}

export function formatBytes(size: number): string {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(0)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}
