import { openDB } from "idb";
import type { DocumentItem } from "@/types/document";

const databaseName = "cloudtypora-cache";
const storeName = "document-drafts";

async function getDatabase() {
  return openDB(databaseName, 1, {
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

export async function readDocumentDraft(
  documentId: string,
): Promise<DocumentItem | undefined> {
  const database = await getDatabase();
  return database.get(storeName, documentId);
}
