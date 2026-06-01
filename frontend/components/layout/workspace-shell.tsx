"use client";

import { FilePlus2, FileText, Folder, ImageUp, Search } from "lucide-react";
import type { ChangeEvent, ReactNode } from "react";
import { useMemo, useRef, useState } from "react";
import { persistDocumentDraft } from "@/editor/sync/indexeddb";
import { useDocumentStore } from "@/stores/document-store";
import type { DocumentItem } from "@/types/document";
import { insertMarkdownImage } from "@/utils/document-library";

interface WorkspaceShellProps {
  children: ReactNode;
  activeDocumentId: string | null;
  documents: DocumentItem[];
  onCreateDocument: () => void;
  onSelectDocument: (document: DocumentItem) => void;
}

function readImageAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("图片读取失败"));
    });
    reader.addEventListener("error", () => reject(new Error("图片读取失败")));
    reader.readAsDataURL(file);
  });
}

export function WorkspaceShell({
  children,
  activeDocumentId,
  documents,
  onCreateDocument,
  onSelectDocument,
}: WorkspaceShellProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [keyword, setKeyword] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const activeDocument = useDocumentStore((state) => state.activeDocument);
  const replaceActiveDocument = useDocumentStore(
    (state) => state.replaceActiveDocument,
  );

  const filteredDocuments = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    if (!normalizedKeyword) {
      return documents;
    }

    return documents.filter((document) =>
      `${document.title} ${document.folder}`.toLowerCase().includes(
        normalizedKeyword,
      ),
    );
  }, [documents, keyword]);

  const documentsByFolder = useMemo(() => {
    return filteredDocuments.reduce<Record<string, DocumentItem[]>>(
      (folders, document) => {
        const folderDocuments = folders[document.folder] ?? [];
        return {
          ...folders,
          [document.folder]: [...folderDocuments, document],
        };
      },
      {},
    );
  }, [filteredDocuments]);

  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";

    if (!file || !activeDocument) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setUploadError("请选择图片文件");
      return;
    }

    try {
      const source = await readImageAsDataUrl(file);
      const insertPosition = activeDocument.markdown.length;
      const prefix = activeDocument.markdown.endsWith("\n\n") ? "" : "\n\n";
      const result = insertMarkdownImage({
        markdown: `${activeDocument.markdown}${prefix}`,
        selectionStart: insertPosition + prefix.length,
        selectionEnd: insertPosition + prefix.length,
        altText: file.name.replace(/\.[^.]+$/, "") || "image",
        source,
      });
      const nextDocument = {
        ...activeDocument,
        markdown: result.markdown,
        updatedAt: new Date().toISOString(),
      };

      replaceActiveDocument(nextDocument);
      await persistDocumentDraft(nextDocument);
      setUploadError(null);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "图片上传失败");
    }
  }

  return (
    <main className="grid min-h-screen grid-cols-[280px_1fr] bg-paper text-ink">
      <aside className="flex min-h-screen flex-col border-r border-line bg-[#f4f1ea] p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">CloudTypora</h1>
          <div className="flex items-center gap-1">
            <button
              className="rounded-md p-2 text-moss hover:bg-white"
              type="button"
              title="新建 Markdown"
              aria-label="新建 Markdown"
              onClick={onCreateDocument}
            >
              <FilePlus2 size={18} />
            </button>
            <button
              className="rounded-md p-2 text-moss hover:bg-white"
              type="button"
              title="上传图片"
              aria-label="上传图片"
              onClick={() => fileInputRef.current?.click()}
              disabled={!activeDocument}
            >
              <ImageUp size={18} />
            </button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          className="hidden"
          type="file"
          accept="image/*"
          onChange={(event) => void handleImageUpload(event)}
        />

        <div className="mt-5 flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm">
          <Search size={16} className="text-moss" aria-hidden />
          <input
            className="w-full bg-transparent outline-none"
            placeholder="搜索笔记"
            value={keyword}
            onChange={(event) => setKeyword(event.currentTarget.value)}
          />
        </div>

        {uploadError ? (
          <p className="mt-3 rounded-md border border-clay/30 bg-white px-3 py-2 text-xs text-clay">
            {uploadError}
          </p>
        ) : null}

        <nav className="mt-6 flex-1 space-y-5 overflow-y-auto">
          {Object.entries(documentsByFolder).map(([folder, folderDocuments]) => (
            <section key={folder}>
              <div className="mb-1 flex items-center gap-2 px-3 text-xs font-medium text-moss">
                <Folder size={15} aria-hidden />
                <span>{folder}</span>
              </div>
              <div className="space-y-1">
                {folderDocuments.map((document) => {
                  const isActive = document.id === activeDocumentId;

                  return (
                    <button
                      key={document.id}
                      className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition ${
                        isActive
                          ? "bg-white font-medium text-clay shadow-sm"
                          : "hover:bg-white"
                      }`}
                      type="button"
                      onClick={() => onSelectDocument(document)}
                    >
                      <FileText size={16} aria-hidden />
                      <span className="truncate">{document.title}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </nav>
      </aside>
      <section className="min-w-0">{children}</section>
    </main>
  );
}
