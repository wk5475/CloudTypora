import { FileText, Folder, Search, UploadCloud } from "lucide-react";
import type { ReactNode } from "react";

interface WorkspaceShellProps {
  children: ReactNode;
}

const documents = [
  { id: "welcome", title: "CloudTypora 最小可用版本", folder: "收件箱" },
  { id: "sync", title: "同步架构", folder: "设计" },
];

export function WorkspaceShell({ children }: WorkspaceShellProps) {
  return (
    <main className="grid min-h-screen grid-cols-[280px_1fr] bg-paper text-ink">
      <aside className="border-r border-line bg-[#f4f1ea] p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">CloudTypora</h1>
          <button
            className="rounded-md p-2 text-moss hover:bg-white"
            type="button"
            title="上传图片"
            aria-label="上传图片"
          >
            <UploadCloud size={18} />
          </button>
        </div>
        <div className="mt-5 flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm">
          <Search size={16} className="text-moss" aria-hidden />
          <input className="w-full outline-none" placeholder="搜索笔记" />
        </div>
        <nav className="mt-6 space-y-1">
          <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium text-moss hover:bg-white">
            <Folder size={16} aria-hidden />
            收件箱
          </button>
          {documents.map((document) => (
            <button
              key={document.id}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-white"
            >
              <FileText size={16} aria-hidden />
              <span className="truncate">{document.title}</span>
            </button>
          ))}
        </nav>
      </aside>
      <section className="min-w-0">{children}</section>
    </main>
  );
}
