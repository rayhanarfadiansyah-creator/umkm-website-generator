import { cookies } from "next/headers";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("webumkm_admin_session")?.value;
  if (!token) return null;

  const { env } = getCloudflareContext();
  const db = env.umkm_website_generator_db;
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(token)
  );
  const tokenHash = Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return await db.prepare(
    `SELECT a.id, a.email
     FROM admin_sessions s
     JOIN admins a ON a.id = s.admin_id
     WHERE s.token_hash = ? AND s.expires_at > ?
     LIMIT 1`
  ).bind(tokenHash, new Date().toISOString())
    .first<{ id: string; email: string }>();
}
