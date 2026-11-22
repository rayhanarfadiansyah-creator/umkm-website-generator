
import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { verifyPassword } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: unknown;
      password?: unknown;
    };

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const password =
      typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email dan password wajib diisi." },
        { status: 400 }
      );
    }

    const { env } = getCloudflareContext();
    const db = env.umkm_website_generator_db;

    const admin = await db
      .prepare(
        "SELECT id, email, password_hash FROM admins WHERE email = ? LIMIT 1"
      )
      .bind(email)
      .first<{
        id: string;
        email: string;
        password_hash: string;
      }>();

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Email atau password salah." },
        { status: 401 }
      );
    }

    const passwordValid = await verifyPassword(
      password,
      admin.password_hash
    );

    if (!passwordValid) {
      return NextResponse.json(
        { success: false, message: "Email atau password salah." },
        { status: 401 }
      );
    }

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
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toISOString();

    await db
      .prepare(
        `INSERT INTO admin_sessions
          (id, admin_id, token_hash, expires_at)
         VALUES (?, ?, ?, ?)`
      )
      .bind(sessionId, admin.id, tokenHash, expiresAt)
      .run();

    const response = NextResponse.json({
      success: true,
      message: "Login berhasil.",
    });

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

    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan saat login." },
      { status: 500 }
    );
  }
}
