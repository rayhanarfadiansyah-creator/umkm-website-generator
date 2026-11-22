
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
        { success: false, message: "Akses ditolak." },
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

    const adminSession = await db
      .prepare(`
        SELECT id
        FROM admin_sessions
        WHERE token_hash = ?
          AND expires_at > ?
        LIMIT 1
      `)
      .bind(tokenHash, new Date().toISOString())
      .first<{ id: string }>();

    if (!adminSession) {
      const response = NextResponse.json(
        { success: false, message: "Session tidak valid atau kedaluwarsa." },
        { status: 401 }
      );

      response.cookies.delete("webumkm_admin_session");
      return response;
    }

    const [ordersResult, revenueResult, pendingResult, websitesResult] =
      await Promise.all([
        db.prepare(`
          SELECT COUNT(*) AS total
          FROM orders
        `).first<{ total: number }>(),

        db.prepare(`
          SELECT COALESCE(SUM(amount), 0) AS total
          FROM orders
          WHERE status = 'paid'
        `).first<{ total: number }>(),

        db.prepare(`
          SELECT COUNT(*) AS total
          FROM orders
          WHERE status = 'pending_payment'
        `).first<{ total: number }>(),

        db.prepare(`
          SELECT COUNT(*) AS total
          FROM websites
          WHERE status = 'published'
        `).first<{ total: number }>(),
      ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalOrders: Number(ordersResult?.total ?? 0),
        totalRevenue: Number(revenueResult?.total ?? 0),
        pendingPayments: Number(pendingResult?.total ?? 0),
        publishedWebsites: Number(websitesResult?.total ?? 0),
      },
    });
  } catch (error) {
    console.error("Admin dashboard API error:", error);

    return NextResponse.json(
      { success: false, message: "Gagal mengambil statistik dashboard." },
      { status: 500 }
    );
  }
}
