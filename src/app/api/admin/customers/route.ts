import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { requireAdmin } from "@/lib/require-admin";

export const runtime = "edge";

export async function GET() {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const { env } = getCloudflareContext();
    const result = await env.umkm_website_generator_db.prepare(
      `SELECT c.id, c.name, c.email, c.whatsapp, c.created_at,
              COUNT(DISTINCT o.id) AS total_orders,
              COUNT(DISTINCT w.id) AS total_websites
       FROM customers c
       LEFT JOIN orders o ON o.customer_id = c.id
       LEFT JOIN websites w ON w.customer_id = c.id
       GROUP BY c.id
       ORDER BY c.created_at DESC
       LIMIT 200`
    ).all();

    return NextResponse.json({ success: true, customers: result.results ?? [] });
  } catch (error) {
    console.error("Admin customers error:", error);
    return NextResponse.json({ success: false, message: "Gagal mengambil data pelanggan." }, { status: 500 });
  }
}
