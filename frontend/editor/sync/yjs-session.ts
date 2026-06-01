import * as Y from "yjs";

export interface DocumentSyncSession {
  document: Y.Doc;
  destroy: () => void;
}

export function createDocumentSyncSession(documentId: string): DocumentSyncSession {
  const document = new Y.Doc({ guid: documentId });

  return {
    document,
    destroy: () => document.destroy(),
  };
}
