import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { requireAdmin } from "@/lib/require-admin";

export const runtime = "nodejs";

export async function GET() {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const { env } = getCloudflareContext();
    const result = await env.umkm_website_generator_db.prepare(
      `SELECT w.id, w.business_name, w.slug, w.package, w.palette,
              w.status, w.published_at, w.created_at,
              c.name AS customer_name, c.email AS customer_email,
              o.amount AS order_amount, o.status AS order_status
       FROM websites w
       LEFT JOIN customers c ON c.id = w.customer_id
       LEFT JOIN orders o ON o.id = w.order_id
       ORDER BY w.created_at DESC
       LIMIT 200`
    ).all();

    return NextResponse.json({ success: true, websites: result.results ?? [] });
  } catch (error) {
    console.error("Admin websites error:", error);
    return NextResponse.json({ success: false, message: "Gagal mengambil data website." }, { status: 500 });
  }
}
