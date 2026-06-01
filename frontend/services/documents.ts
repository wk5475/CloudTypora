import { apiBaseUrl } from "@/lib/env";
import type { DocumentItem } from "@/types/document";

interface ApiResponse<TData> {
  code: number;
  message: string;
  data: TData;
}

export async function fetchDocuments(): Promise<DocumentItem[]> {
  const response = await fetch(`${apiBaseUrl}/documents`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error("获取文档列表失败");
  }

  const payload = (await response.json()) as ApiResponse<DocumentItem[]>;
  return payload.data;
}
