
import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const sessionToken = request.headers
      .get("cookie")
      ?.split(";")
      .map((cookie) => cookie.trim())
      .find((cookie) =>
        cookie.startsWith("webumkm_admin_session=")
      )
      ?.slice("webumkm_admin_session=".length);

    if (sessionToken) {
      const tokenHashBuffer = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(decodeURIComponent(sessionToken))
      );

      const tokenHash = Array.from(new Uint8Array(tokenHashBuffer))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");

      const { env } = getCloudflareContext();

      await env.umkm_website_generator_db
        .prepare("DELETE FROM admin_sessions WHERE token_hash = ?")
        .bind(tokenHash)
        .run();
    }

    const response = NextResponse.json({
      success: true,
      message: "Logout berhasil.",
    });

    response.cookies.delete("webumkm_admin_session");

    return response;
  } catch (error) {
    console.error("Admin logout error:", error);

    return NextResponse.json(
      { success: false, message: "Logout gagal." },
      { status: 500 }
    );
  }
}
