export interface EditorCommand {
  id: string;
  label: string;
  run: (markdown: string) => string;
}

export const markdownCommands: EditorCommand[] = [
  {
    id: "heading-1",
    label: "一级标题",
    run: (markdown) => `# ${markdown}`,
  },
];
