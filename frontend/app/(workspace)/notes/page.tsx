import { Suspense } from "react";
import { NotesWorkspace } from "./notes-workspace";

export default function NotesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-paper text-moss">
          正在读取本地 Markdown...
        </div>
      }
    >
      <NotesWorkspace />
    </Suspense>
  );
}
