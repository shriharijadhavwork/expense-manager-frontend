"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { XIcon } from "@/components/ui/icons";
import {
  formatBytes,
  getAttachmentKind,
  type AttachmentKind,
} from "@/lib/files/attachment-policy";
import { cn } from "@/utils/cn";
import type { ChatAttachment } from "@/components/chat/types";

type AttachmentPreviewModalProps = {
  attachment: ChatAttachment | null;
  open: boolean;
  onClose: () => void;
};

function getDocumentEmbedUrl(kind: AttachmentKind, viewUrl: string): string {
  if (kind === "pdf") {
    return viewUrl;
  }

  return `https://docs.google.com/gview?url=${encodeURIComponent(viewUrl)}&embedded=true`;
}

export function AttachmentPreviewModal({
  attachment,
  open,
  onClose,
}: AttachmentPreviewModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || !attachment || typeof document === "undefined") {
    return null;
  }

  const kind =
    getAttachmentKind(attachment.type, attachment.name) ??
    ("doc" as AttachmentKind);
  const viewUrl = attachment.fileUrl ?? attachment.previewUrl;

  return createPortal(
    <div className="fixed inset-0 z-[110] flex flex-col">
      <button
        type="button"
        aria-label="Close preview"
        className="absolute inset-0 bg-[var(--overlay)]"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="attachment-preview-title"
        className={cn(
          "relative z-10 mx-auto flex min-h-0 w-full flex-1 flex-col",
          "mt-auto max-h-[100dvh] sm:my-auto sm:max-h-[min(92dvh,920px)]",
          "sm:max-w-[min(960px,calc(100vw-2rem))]",
          "rounded-t-[var(--radius-lg)] border border-border bg-card shadow-[var(--shadow-md)]",
          "sm:rounded-[var(--radius-lg)]",
        )}
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-4 py-3 sm:px-5">
          <div className="min-w-0">
            <h2
              id="attachment-preview-title"
              className="truncate text-sm font-semibold tracking-tight sm:text-base"
            >
              {attachment.name}
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {formatBytes(attachment.size)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 shrink-0 px-0"
            onClick={onClose}
            aria-label="Close"
          >
            <XIcon />
          </Button>
        </header>

        <div className="min-h-0 flex-1 overflow-auto overscroll-contain bg-muted/30">
          {kind === "image" ? (
            <div className="flex min-h-[min(70dvh,640px)] items-start justify-center p-4 sm:p-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={viewUrl}
                alt={attachment.name}
                className="max-h-none w-auto max-w-full rounded-md object-contain"
              />
            </div>
          ) : null}

          {kind === "pdf" || kind === "doc" ? (
            <div className="flex min-h-[min(75dvh,720px)] flex-col p-3 sm:p-4">
              <iframe
                title={attachment.name}
                src={getDocumentEmbedUrl(kind, viewUrl)}
                className="min-h-[min(72dvh,680px)] w-full flex-1 rounded-md border border-border bg-background"
              />
              {kind === "doc" ? (
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Word preview is rendered in-browser when supported. Scroll to
                  read multiple pages.
                </p>
              ) : (
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Scroll inside the preview to read additional pages.
                </p>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>,
    document.body,
  );
}
