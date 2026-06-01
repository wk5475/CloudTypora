import { create } from "zustand";
import type { DocumentItem } from "@/types/document";

interface DocumentState {
  activeDocument: DocumentItem | null;
  openDocument: (document: DocumentItem) => void;
  updateMarkdown: (markdown: string) => void;
}

export const useDocumentStore = create<DocumentState>((set) => ({
  activeDocument: null,
  openDocument: (document) => set({ activeDocument: document }),
  updateMarkdown: (markdown) =>
    set((state) => {
      if (!state.activeDocument) {
        return state;
      }

      return {
        activeDocument: {
          ...state.activeDocument,
          markdown,
          updatedAt: new Date().toISOString(),
        },
      };
    }),
}));
