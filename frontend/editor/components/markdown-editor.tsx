"use client";

import { useEffect } from "react";
import { useDocumentStore } from "@/stores/document-store";
import { persistDocumentDraft } from "@/editor/sync/indexeddb";
import { createDocumentSyncSession } from "@/editor/sync/yjs-session";

interface MarkdownEditorProps {
  documentId: string;
  initialMarkdown: string;
}

export function MarkdownEditor({
  documentId,
  initialMarkdown,
}: MarkdownEditorProps) {
  const activeDocument = useDocumentStore((state) => state.activeDocument);
  const openDocument = useDocumentStore((state) => state.openDocument);
  const updateMarkdown = useDocumentStore((state) => state.updateMarkdown);

  useEffect(() => {
    openDocument({
      id: documentId,
      title: "CloudTypora 最小可用版本",
      markdown: initialMarkdown,
      updatedAt: new Date().toISOString(),
    });
  }, [documentId, initialMarkdown, openDocument]);

  useEffect(() => {
    const session = createDocumentSyncSession(documentId);
    return () => session.destroy();
  }, [documentId]);

  if (!activeDocument) {
    return null;
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-10 py-8">
      <header className="mb-6 flex items-center justify-between border-b border-line pb-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-moss">
            Markdown
          </p>
          <h2 className="mt-1 text-2xl font-semibold">{activeDocument.title}</h2>
        </div>
        <span className="rounded-md border border-line px-3 py-1 text-sm text-moss">
          自动保存
        </span>
      </header>
      <textarea
        className="editor-surface min-h-[70vh] resize-none border-0 bg-transparent font-mono text-base leading-7 outline-none"
        value={activeDocument.markdown}
        onChange={(event) => {
          const markdown = event.currentTarget.value;
          updateMarkdown(markdown);
          void persistDocumentDraft({
            ...activeDocument,
            markdown,
            updatedAt: new Date().toISOString(),
          });
        }}
        spellCheck={false}
      />
    </div>
  );
}
