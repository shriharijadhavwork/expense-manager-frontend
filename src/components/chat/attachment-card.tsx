"use client";

import { useState } from "react";
import { AttachmentPreviewModal } from "@/components/chat/attachment-preview-modal";
import type { ChatAttachment } from "@/components/chat/types";
import { cn } from "@/utils/cn";
import {
  formatBytes,
  getAttachmentKind,
  type AttachmentKind,
} from "@/lib/files/attachment-policy";

export type { AttachmentStatus, ChatAttachment } from "@/components/chat/types";

type AttachmentCardProps = {
  attachment: ChatAttachment;
  variant?: "composer" | "bubble";
  onRemove?: () => void;
  onRetry?: () => void;
  className?: string;
};

export function AttachmentCard({
  attachment,
  variant = "composer",
  onRemove,
  onRetry,
  className,
}: AttachmentCardProps) {
  const [previewOpen, setPreviewOpen] = useState(false);

  const kind =
    getAttachmentKind(attachment.type, attachment.name) ??
    ("doc" as AttachmentKind);
  const uploading = attachment.status === "uploading";
  const uploaded = attachment.status === "uploaded";
  const errored = attachment.status === "error";
  const canOpenFile =
    Boolean(attachment.fileUrl ?? attachment.previewUrl) &&
    (uploaded || attachment.status === "ready") &&
    !uploading &&
    !errored;

  const openPreview = () => {
    if (canOpenFile) {
      setPreviewOpen(true);
    }
  };

  return (
    <>
      <div
        className={cn(
          "relative overflow-hidden rounded-xl",
          variant === "composer" &&
            "max-w-xs border border-border/60 bg-muted/40",
          variant === "bubble" && "max-w-[240px] border-0 sm:max-w-[280px]",
          className,
        )}
      >
        {kind === "image" ? (
          <div className="relative aspect-[4/3] bg-muted">
            {canOpenFile ? (
              <button
                type="button"
                onClick={openPreview}
                aria-label={`View ${attachment.name}`}
                className="block h-full w-full cursor-pointer text-left"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={attachment.previewUrl}
                  alt={attachment.name}
                  className={cn(
                    "h-full w-full object-cover transition-opacity hover:opacity-95",
                    uploading && "opacity-70",
                  )}
                />
              </button>
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={attachment.previewUrl}
                alt={attachment.name}
                className={cn(
                  "h-full w-full object-cover transition-opacity",
                  uploading && "opacity-70",
                )}
              />
            )}
            {uploading ? <UploadOverlay progress={attachment.progress} /> : null}
            {uploaded ? <DoneBadge /> : null}
            {errored ? (
              <ErrorOverlay
                message={attachment.error ?? "Upload failed"}
                onRetry={onRetry}
              />
            ) : null}
          </div>
        ) : null}

        {kind === "pdf" ? (
          <DocumentPreview
            attachment={attachment}
            label="PDF"
            tone="pdf"
            showFrame
            uploading={uploading}
            uploaded={uploaded}
            errored={errored}
            onRetry={onRetry}
            canPreview={canOpenFile}
            onPreview={openPreview}
          />
        ) : null}

        {kind === "doc" ? (
          <DocumentPreview
            attachment={attachment}
            label="DOC"
            tone="doc"
            showFrame={false}
            uploading={uploading}
            uploaded={uploaded}
            errored={errored}
            onRetry={onRetry}
            canPreview={canOpenFile}
            onPreview={openPreview}
          />
        ) : null}

        {kind === "image" ? (
          <div className="flex items-center justify-between gap-2 border-t border-border px-3 py-2">
            <div className="min-w-0">
              <p className="truncate text-xs font-medium">{attachment.name}</p>
              <p className="text-[11px] text-muted-foreground">
                {formatBytes(attachment.size)}
                {uploaded ? " · Uploaded" : null}
                {uploading ? ` · Uploading ${attachment.progress}%` : null}
                {attachment.status === "ready" ? " · Ready to send" : null}
              </p>
            </div>
            {canOpenFile ? (
              <button
                type="button"
                onClick={openPreview}
                className="shrink-0 cursor-pointer text-[11px] font-medium text-flux-accent hover:underline"
              >
                View
              </button>
            ) : null}
          </div>
        ) : null}

        {onRemove && attachment.status !== "uploading" ? (
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remove attachment"
            className="absolute right-2 top-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-foreground/80 text-xs text-background backdrop-blur hover:bg-foreground"
          >
            ✕
          </button>
        ) : null}
      </div>

      <AttachmentPreviewModal
        attachment={attachment}
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />
    </>
  );
}

function DocumentPreview({
  attachment,
  label,
  tone,
  showFrame,
  uploading,
  uploaded,
  errored,
  onRetry,
  canPreview,
  onPreview,
}: {
  attachment: ChatAttachment;
  label: string;
  tone: "pdf" | "doc";
  showFrame: boolean;
  uploading: boolean;
  uploaded: boolean;
  errored: boolean;
  onRetry?: () => void;
  canPreview: boolean;
  onPreview: () => void;
}) {
  const previewBody = showFrame ? (
    <div className="relative h-40 overflow-hidden bg-muted">
      <iframe
        title={attachment.name}
        src={`${attachment.previewUrl}#toolbar=0&navpanes=0&scrollbar=0`}
        className={cn(
          "pointer-events-none h-[140%] w-full origin-top scale-[0.85] border-0 bg-white",
          uploading && "opacity-60",
        )}
      />
      {uploading ? <UploadOverlay progress={attachment.progress} /> : null}
      {uploaded ? <DoneBadge /> : null}
      {errored ? (
        <ErrorOverlay
          message={attachment.error ?? "Upload failed"}
          onRetry={onRetry}
        />
      ) : null}
    </div>
  ) : (
    <div className="relative flex h-28 items-center justify-center bg-muted">
      <div
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-2xl text-sm font-bold",
          tone === "doc" && "bg-flux-accent-soft text-flux-accent",
          tone === "pdf" && "bg-destructive/10 text-destructive",
        )}
      >
        {label}
      </div>
      {uploading ? <UploadOverlay progress={attachment.progress} /> : null}
      {uploaded ? <DoneBadge /> : null}
      {errored ? (
        <ErrorOverlay
          message={attachment.error ?? "Upload failed"}
          onRetry={onRetry}
        />
      ) : null}
    </div>
  );

  return (
    <div className="relative">
      {canPreview ? (
        <button
          type="button"
          onClick={onPreview}
          aria-label={`View ${attachment.name}`}
          className="block w-full cursor-pointer text-left"
        >
          {previewBody}
        </button>
      ) : (
        previewBody
      )}

      <div className="flex items-start gap-3 border-t border-border px-3 py-2.5">
        <div
          className={cn(
            "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
            tone === "pdf" && "bg-destructive/10 text-destructive",
            tone === "doc" && "bg-flux-accent-soft text-flux-accent",
          )}
        >
          {label}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{attachment.name}</p>
          <p className="text-xs text-muted-foreground">
            {formatBytes(attachment.size)}
            {uploaded ? " · Uploaded" : null}
            {uploading ? ` · ${attachment.progress}%` : null}
            {attachment.status === "ready" ? " · Ready to send" : null}
          </p>
          {canPreview ? (
            <button
              type="button"
              onClick={onPreview}
              className="mt-1 inline-block cursor-pointer text-xs font-medium text-flux-accent hover:underline"
            >
              View file
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function UploadOverlay({ progress }: { progress: number }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/45 px-4">
      <div
        className="relative flex h-12 w-12 items-center justify-center"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Upload progress"
      >
        <svg className="h-12 w-12 -rotate-90" viewBox="0 0 48 48" aria-hidden>
          <circle
            cx="24"
            cy="24"
            r="18"
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="3"
          />
          <circle
            cx="24"
            cy="24"
            r="18"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 18}`}
            strokeDashoffset={`${2 * Math.PI * 18 * (1 - progress / 100)}`}
          />
        </svg>
        <span className="absolute text-[10px] font-semibold text-white">
          {progress}%
        </span>
      </div>
      <p className="text-xs font-medium text-white">Uploading…</p>
    </div>
  );
}

function DoneBadge() {
  return (
    <div className="absolute bottom-2 left-2 flex h-7 w-7 items-center justify-center rounded-full bg-success text-xs font-bold text-success-foreground shadow">
      ✓
    </div>
  );
}

function ErrorOverlay({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/55 px-4 text-center">
      <p className="text-xs font-medium text-white">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="cursor-pointer rounded-full bg-card px-3 py-1 text-xs font-medium text-foreground"
        >
          Retry
        </button>
      ) : null}
    </div>
  );
}
