export interface EditorShortcut {
  key: string;
  commandId: string;
}

export const editorShortcuts: EditorShortcut[] = [
  { key: "Mod+Alt+1", commandId: "heading-1" },
];
