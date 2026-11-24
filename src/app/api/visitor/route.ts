
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";

const COOKIE_NAME = "webumkm_visitor";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const FREE_QUOTA = 2;

function getVisitorToken(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";

  const cookie = cookieHeader
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${COOKIE_NAME}=`));

  const token = cookie?.slice(COOKIE_NAME.length + 1) ?? "";

  if (/^[a-f0-9]{64}$/i.test(token)) {
    return { token, isNew: false };
  }

  const bytes = crypto.getRandomValues(new Uint8Array(32));
  const newToken = Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return { token: newToken, isNew: true };
}

async function hashToken(token: string) {
  const data = new TextEncoder().encode(token);
  const hash = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function GET(request: Request) {
  try {
    const { token, isNew } = getVisitorToken(request);
    const visitorHash = await hashToken(token);
    const db = getDb();
    const now = new Date().toISOString();

    await db
      .prepare(`
        INSERT INTO anonymous_visitors (
          visitor_hash, created_at, last_seen_at
        )
        VALUES (?, ?, ?)
        ON CONFLICT(visitor_hash)
        DO UPDATE SET last_seen_at = excluded.last_seen_at
      `)
      .bind(visitorHash, now, now)
      .run();

    const usage = await db
      .prepare(`
        SELECT COUNT(*) AS used
        FROM anonymous_free_usage
        WHERE visitor_hash = ?
      `)
      .bind(visitorHash)
      .first<{ used: number }>();

    const used = Number(usage?.used ?? 0);

    const response = NextResponse.json(
      {
        success: true,
        used,
        remaining: Math.max(0, FREE_QUOTA - used),
        quota: FREE_QUOTA,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );

    if (isNew) {
      response.cookies.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: new URL(request.url).protocol === "https:",
        sameSite: "lax",
        path: "/",
        maxAge: COOKIE_MAX_AGE,
      });
    }

    return response;
  } catch (error) {
    console.error("Visitor identity error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal memeriksa identitas pengunjung.",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
