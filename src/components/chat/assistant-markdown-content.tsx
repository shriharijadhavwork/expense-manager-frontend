"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import { useEffect } from "react";

import { useTheme } from "@/lib/theme/theme-provider";
import { cn } from "@/utils/cn";

type AssistantMarkdownContentProps = {
  markdown: string;
  className?: string;
};

/**
 * Read-only BlockNote renderer for FLUX assistant Markdown replies.
 * Converts stored Markdown via editor.tryParseMarkdownToBlocks() — never renders raw syntax.
 */
export function AssistantMarkdownContent({
  markdown,
  className,
}: AssistantMarkdownContentProps) {
  const { resolvedTheme } = useTheme();

  const editor = useCreateBlockNote({
    animations: false,
  });

  useEffect(() => {
    const trimmed = markdown.trim();

    if (!trimmed) {
      editor.replaceBlocks(editor.document, []);
      return;
    }

    try {
      const blocks = editor.tryParseMarkdownToBlocks(trimmed);
      editor.replaceBlocks(editor.document, blocks);
    } catch {
      editor.replaceBlocks(editor.document, [
        {
          type: "paragraph",
          content: trimmed,
        },
      ]);
    }
  }, [editor, markdown]);

  return (
    <BlockNoteView
      editor={editor}
      editable={false}
      theme={resolvedTheme}
      formattingToolbar={false}
      linkToolbar={false}
      slashMenu={false}
      sideMenu={false}
      filePanel={false}
      tableHandles={false}
      emojiPicker={false}
      comments={false}
      className={cn("assistant-blocknote", className)}
      aria-label="Assistant message"
    />
  );
}
