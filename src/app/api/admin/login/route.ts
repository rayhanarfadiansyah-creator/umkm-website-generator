
import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { verifyPassword } from "@/lib/auth";

export const runtime = "nodejs";

const MAX_BODY_SIZE = 4096;
const MAX_FAILED_ATTEMPTS = 5;
const WINDOW_MINUTES = 15;
const SESSION_DAYS = 7;

function jsonResponse(
  body: { success: boolean; message: string },
  status: number
) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

async function createAttemptKey(
  secret: string,
  email: string,
  ip: string
) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${email}|${ip}`)
  );

  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function POST(request: Request) {
  try {
    const contentLength = Number(
      request.headers.get("content-length") ?? 0
    );

    if (contentLength > MAX_BODY_SIZE) {
      return jsonResponse(
        { success: false, message: "Ukuran request terlalu besar." },
        413
      );
    }

    const rawBody = await request.text();

    if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_SIZE) {
      return jsonResponse(
        { success: false, message: "Ukuran request terlalu besar." },
        413
      );
    }

    let body: { email?: unknown; password?: unknown };

    try {
      body = JSON.parse(rawBody);
    } catch {
      return jsonResponse(
        { success: false, message: "Format request tidak valid." },
        400
      );
    }

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const password =
      typeof body.password === "string" ? body.password : "";

    if (
      !email ||
      !password ||
      email.length > 254 ||
      password.length > 128
    ) {
      return jsonResponse(
        { success: false, message: "Email atau password tidak valid." },
        400
      );
    }

    const { env } = getCloudflareContext();

    const db = env.umkm_website_generator_db;

    const secret = (
      env as typeof env & { ADMIN_RATE_LIMIT_SECRET?: string }
    ).ADMIN_RATE_LIMIT_SECRET;

    if (!secret || secret.length < 32) {
      console.error("ADMIN_RATE_LIMIT_SECRET belum dikonfigurasi.");

      return jsonResponse(
        { success: false, message: "Konfigurasi keamanan server belum siap." },
        500
      );
    }

    // CF-Connecting-IP disediakan Cloudflare.
    // Pada development lokal, gunakan identitas fallback.
    const ip =
      request.headers.get("cf-connecting-ip")?.trim() || "local";

    const attemptKey = await createAttemptKey(secret, email, ip);

    const now = new Date();
    const nowIso = now.toISOString();
    const windowStart = new Date(
      now.getTime() - WINDOW_MINUTES * 60 * 1000
    ).toISOString();

    const existingAttempt = await db
      .prepare(
        `SELECT blocked_until
         FROM admin_login_attempts
         WHERE attempt_key = ?
         LIMIT 1`
      )
      .bind(attemptKey)
      .first<{ blocked_until: string | null }>();

    if (
      existingAttempt?.blocked_until &&
      existingAttempt.blocked_until > nowIso
    ) {
      return jsonResponse(
        {
          success: false,
          message: "Terlalu banyak percobaan login. Coba lagi nanti.",
        },
        429
      );
    }

    const admin = await db
      .prepare(
        `SELECT id, email, password_hash
         FROM admins
         WHERE email = ?
         LIMIT 1`
      )
      .bind(email)
      .first<{
        id: string;
        email: string;
        password_hash: string;
      }>();

    const passwordValid = admin
      ? await verifyPassword(password, admin.password_hash)
      : false;

    if (!admin || !passwordValid) {
      const blockedUntil = new Date(
        now.getTime() + WINDOW_MINUTES * 60 * 1000
      ).toISOString();

      // UPSERT atomik: reset window yang sudah kedaluwarsa,
      // atau tambahkan jumlah percobaan dalam window aktif.
      await db
        .prepare(
          `INSERT INTO admin_login_attempts (
             attempt_key,
             failed_attempts,
             window_started_at,
             last_attempt_at,
             blocked_until
           )
           VALUES (?, 1, ?, ?, NULL)
           ON CONFLICT(attempt_key) DO UPDATE SET
             failed_attempts = CASE
               WHEN window_started_at <= ? THEN 1
               ELSE failed_attempts + 1
             END,
             window_started_at = CASE
               WHEN window_started_at <= ? THEN excluded.window_started_at
               ELSE window_started_at
             END,
             last_attempt_at = excluded.last_attempt_at,
             blocked_until = CASE
               WHEN (
                 CASE
                   WHEN window_started_at <= ? THEN 1
                   ELSE failed_attempts + 1
                 END
               ) >= ? THEN ?
               ELSE NULL
             END`
        )
        .bind(
          attemptKey,
          nowIso,
          nowIso,
          windowStart,
          windowStart,
          windowStart,
          MAX_FAILED_ATTEMPTS,
          blockedUntil
        )
        .run();

      const updatedAttempt = await db
        .prepare(
          `SELECT blocked_until
           FROM admin_login_attempts
           WHERE attempt_key = ?
           LIMIT 1`
        )
        .bind(attemptKey)
        .first<{ blocked_until: string | null }>();

      if (
        updatedAttempt?.blocked_until &&
        updatedAttempt.blocked_until > nowIso
      ) {
        return jsonResponse(
          {
            success: false,
            message: "Terlalu banyak percobaan login. Coba lagi nanti.",
          },
          429
        );
      }

      return jsonResponse(
        { success: false, message: "Email atau password salah." },
        401
      );
    }

    // Login berhasil: bersihkan catatan kegagalan kombinasi ini.
    await db
      .prepare(
        "DELETE FROM admin_login_attempts WHERE attempt_key = ?"
      )
      .bind(attemptKey)
      .run();

    const sessionToken = crypto.randomUUID() + crypto.randomUUID();

    const tokenHashBuffer = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(sessionToken)
    );

    const tokenHash = Array.from(new Uint8Array(tokenHashBuffer))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

    const sessionId = crypto.randomUUID();

    const expiresAt = new Date(
      Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000
    ).toISOString();

    await db
      .prepare(
        `INSERT INTO admin_sessions
          (id, admin_id, token_hash, expires_at)
         VALUES (?, ?, ?, ?)`
      )
      .bind(sessionId, admin.id, tokenHash, expiresAt)
      .run();

    const response = jsonResponse(
      { success: true, message: "Login berhasil." },
      200
    );

    response.cookies.set("webumkm_admin_session", sessionToken, {
      httpOnly: true,
      secure: new URL(request.url).protocol === "https:",
      sameSite: "strict",
      path: "/",
      expires: new Date(expiresAt),
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);

    return jsonResponse(
      { success: false, message: "Terjadi kesalahan saat login." },
      500
    );
  }
}
