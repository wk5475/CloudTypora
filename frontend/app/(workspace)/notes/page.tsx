import { WorkspaceShell } from "@/components/layout/workspace-shell";
import { MarkdownEditor } from "@/editor/components/markdown-editor";

const initialMarkdown = `# CloudTypora

保持 Markdown 优先，先写入本地缓存，再进行增量同步。

- 编辑体验优先
- 离线优先
- 同步稳定优先
`;

export default function NotesPage() {
  return (
    <WorkspaceShell>
      <MarkdownEditor documentId="welcome" initialMarkdown={initialMarkdown} />
    </WorkspaceShell>
  );
}
