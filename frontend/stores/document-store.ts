import { create } from "zustand";
import type { DocumentItem } from "@/types/document";
import { sortDocumentsByUpdatedTime, upsertDocument } from "@/utils/document-library";

interface DocumentState {
  documents: DocumentItem[];
  activeDocument: DocumentItem | null;
  setDocuments: (documents: DocumentItem[]) => void;
  openDocument: (document: DocumentItem) => void;
  updateMarkdown: (markdown: string) => void;
  replaceActiveDocument: (document: DocumentItem) => void;
}

export const useDocumentStore = create<DocumentState>((set) => ({
  documents: [],
  activeDocument: null,
  setDocuments: (documents) =>
    set((state) => {
      const sortedDocuments = sortDocumentsByUpdatedTime(documents);
      const activeDocument =
        state.activeDocument &&
        sortedDocuments.find((document) => document.id === state.activeDocument?.id);

      return {
        documents: sortedDocuments,
        activeDocument: activeDocument ?? sortedDocuments[0] ?? null,
      };
    }),
  openDocument: (document) =>
    set((state) => ({
      documents: upsertDocument(state.documents, document),
      activeDocument: document,
    })),
  updateMarkdown: (markdown) =>
    set((state) => {
      if (!state.activeDocument) {
        return state;
      }

      const activeDocument = {
        ...state.activeDocument,
        markdown,
        updatedAt: new Date().toISOString(),
      };

      return {
        documents: upsertDocument(state.documents, activeDocument),
        activeDocument,
      };
    }),
  replaceActiveDocument: (document) =>
    set((state) => ({
      documents: upsertDocument(state.documents, document),
      activeDocument: document,
    })),
}));
