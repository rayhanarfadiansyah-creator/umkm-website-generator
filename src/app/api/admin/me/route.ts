
import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const sessionToken = request.headers
      .get("cookie")
      ?.split(";")
      .map((cookie) => cookie.trim())
      .find((cookie) =>
        cookie.startsWith("webumkm_admin_session=")
      )
      ?.slice("webumkm_admin_session=".length);

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, message: "Belum login." },
        { status: 401 }
      );
    }

    const tokenHashBuffer = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(decodeURIComponent(sessionToken))
    );

    const tokenHash = Array.from(new Uint8Array(tokenHashBuffer))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

    const { env } = getCloudflareContext();
    const db = env.umkm_website_generator_db;

    const admin = await db
      .prepare(`
        SELECT
          admins.id,
          admins.email,
          admin_sessions.id AS session_id
        FROM admin_sessions
        INNER JOIN admins ON admins.id = admin_sessions.admin_id
        WHERE admin_sessions.token_hash = ?
          AND admin_sessions.expires_at > ?
        LIMIT 1
      `)
      .bind(tokenHash, new Date().toISOString())
      .first<{
        id: string;
        email: string;
        session_id: string;
      }>();

    if (!admin) {
      const response = NextResponse.json(
        { success: false, message: "Session tidak valid atau kedaluwarsa." },
        { status: 401 }
      );

      response.cookies.delete("webumkm_admin_session");
      return response;
    }

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Admin session check error:", error);

    return NextResponse.json(
      { success: false, message: "Gagal memeriksa session." },
      { status: 500 }
    );
  }
}
