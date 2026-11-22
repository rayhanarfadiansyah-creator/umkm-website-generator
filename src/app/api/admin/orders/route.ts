import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const sessionToken = request.headers.get("cookie")
      ?.split(";").map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith("webumkm_admin_session="))
      ?.slice("webumkm_admin_session=".length);

    if (!sessionToken) {
      return NextResponse.json({ success: false, message: "Akses ditolak." }, { status: 401 });
    }

    const tokenHashBuffer = await crypto.subtle.digest(
      "SHA-256", new TextEncoder().encode(decodeURIComponent(sessionToken))
    );
    const tokenHash = Array.from(new Uint8Array(tokenHashBuffer))
      .map((byte) => byte.toString(16).padStart(2, "0")).join("");

    const { env } = getCloudflareContext();
    const db = env.umkm_website_generator_db;
    const adminSession = await db.prepare(
      `SELECT id FROM admin_sessions WHERE token_hash = ? AND expires_at > ? LIMIT 1`
    ).bind(tokenHash, new Date().toISOString()).first<{ id: string }>();

    if (!adminSession) {
      const response = NextResponse.json({ success: false, message: "Session tidak valid atau kedaluwarsa." }, { status: 401 });
      response.cookies.delete("webumkm_admin_session");
      return response;
    }

    const result = await db.prepare(
      `SELECT o.id, o.package, o.amount,
              CASE
                WHEN o.status IN ('cancelled', 'refunded') THEN o.status
                WHEN p.status = 'paid' THEN 'paid'
                WHEN p.status = 'pending' THEN 'pending_payment'
                ELSE o.status
              END AS status,
              o.created_at,
              c.name AS customer_name, c.email AS customer_email,
              c.whatsapp AS customer_whatsapp, w.business_name
       FROM orders o
       INNER JOIN customers c ON c.id = o.customer_id
       LEFT JOIN websites w ON w.order_id = o.id
       LEFT JOIN payments p ON p.order_id = o.id
       ORDER BY o.created_at DESC
       LIMIT 100`
    ).all();

    return NextResponse.json({ success: true, orders: result.results });
  } catch (error) {
    console.error("Admin orders API error:", error);
    return NextResponse.json({ success: false, message: "Gagal mengambil daftar pesanan." }, { status: 500 });
  }
}
