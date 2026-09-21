import { createClient, type SupabaseClient } from "@supabase/supabase-js";
export type Member = { user_id: string; username: "nora" | "sara" };
export type Item = {
  id: string;
  kind: "note" | "case" | "task" | "resource" | "shopping";
  title: string;
  body: string;
  status: "idea" | "doing" | "done";
  color: string;
  due_date: string | null;
  url: string;
  parent_id: string | null;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  version: number;
  board_section?: "ideas" | "subideas" | "resources" | "coding" | null;
  board_order?: number;
  deleted: boolean;
};
export type Edge = {
  id: string;
  source_id: string;
  target_id: string;
  created_by: string;
  deleted: boolean;
};
let client: SupabaseClient | undefined;
export async function labClient() {
  if (client) return client;
  const response = await fetch("/api/lab?action=config", { cache: "no-store" });
  const config = await response.json();
  if (!response.ok)
    throw new Error(config.error || "The Lab is not connected yet.");
  client = createClient(config.url, config.key, {
    auth: {
      storageKey: "nora-sara-lab-auth",
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });
  return client;
}
export async function labApi(action: string, body: unknown, token?: string) {
  const response = await fetch(`/api/lab?action=${action}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const result = await response.json();
  if (!response.ok)
    throw new Error(result.error || "Something went wrong. Please try again.");
  return result;
}
export function safeUrl(value: string) {
  try {
    const u = new URL(value);
    return ["https:", "http:"].includes(u.protocol) ? u.href : "";
  } catch {
    return "";
  }
}
