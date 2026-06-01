import { openDB } from "idb";
import type { DocumentItem } from "@/types/document";
import { buildInitialDocuments, sortDocumentsByUpdatedTime } from "@/utils/document-library";

const databaseName = "cloudtypora-cache";
const storeName = "document-drafts";

async function getDatabase() {
  return openDB(databaseName, 2, {
    upgrade(database) {
      if (!database.objectStoreNames.contains(storeName)) {
        database.createObjectStore(storeName, { keyPath: "id" });
      }
    },
  });
}

export async function persistDocumentDraft(document: DocumentItem): Promise<void> {
  const database = await getDatabase();
  await database.put(storeName, document);
}

export async function listDocumentDrafts(): Promise<DocumentItem[]> {
  const database = await getDatabase();
  const documents = await database.getAll(storeName);

  if (documents.length > 0) {
    return sortDocumentsByUpdatedTime(documents as DocumentItem[]);
  }

  const initialDocuments = buildInitialDocuments();
  await Promise.all(
    initialDocuments.map((document) => database.put(storeName, document)),
  );

  return sortDocumentsByUpdatedTime(initialDocuments);
}

export async function readDocumentDraft(
  documentId: string,
): Promise<DocumentItem | undefined> {
  const database = await getDatabase();
  return database.get(storeName, documentId);
}
