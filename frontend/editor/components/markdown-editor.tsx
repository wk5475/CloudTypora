"use client";

import { useEffect, useRef, useState } from "react";
import { persistDocumentDraft } from "@/editor/sync/indexeddb";
import { createDocumentSyncSession } from "@/editor/sync/yjs-session";
import { useDocumentStore } from "@/stores/document-store";

export function MarkdownEditor() {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const activeDocument = useDocumentStore((state) => state.activeDocument);
  const updateMarkdown = useDocumentStore((state) => state.updateMarkdown);
  const [saveState, setSaveState] = useState("已保存到本地");

  useEffect(() => {
    if (!activeDocument) {
      return undefined;
    }

    const session = createDocumentSyncSession(activeDocument.id);
    return () => session.destroy();
  }, [activeDocument?.id]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [activeDocument?.id]);

  if (!activeDocument) {
    return (
      <div className="flex min-h-screen items-center justify-center text-moss">
        请选择或新建一份 Markdown 笔记
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-10 py-8">
      <header className="mb-6 flex items-center justify-between border-b border-line pb-4">
        <div>
          <p className="text-xs font-medium uppercase text-moss">Markdown</p>
          <h2 className="mt-1 text-2xl font-semibold">{activeDocument.title}</h2>
        </div>
        <span className="rounded-md border border-line px-3 py-1 text-sm text-moss">
          {saveState}
        </span>
      </header>
      <textarea
        ref={textareaRef}
        className="editor-surface min-h-[70vh] resize-none border-0 bg-transparent font-mono text-base leading-7 outline-none"
        value={activeDocument.markdown}
        onChange={(event) => {
          const markdown = event.currentTarget.value;
          const nextDocument = {
            ...activeDocument,
            markdown,
            updatedAt: new Date().toISOString(),
          };

          updateMarkdown(markdown);
          setSaveState("保存中...");
          void persistDocumentDraft(nextDocument)
            .then(() => setSaveState("已保存到本地"))
            .catch(() => setSaveState("本地保存失败"));
        }}
        spellCheck={false}
      />
    </div>
  );
}
