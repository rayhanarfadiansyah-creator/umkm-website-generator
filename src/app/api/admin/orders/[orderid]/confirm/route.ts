
import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const runtime = "edge";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orderid: string }> }
) {
  try {
    const sessionToken = request.headers
      .get("cookie")
      ?.split(";")
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith("webumkm_admin_session="))
      ?.slice("webumkm_admin_session=".length);

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, message: "Akses ditolak." },
        { status: 401 }
      );
    }

    let decodedToken: string;

    try {
      decodedToken = decodeURIComponent(sessionToken);
    } catch {
      return NextResponse.json(
        { success: false, message: "Session admin tidak valid." },
        { status: 401 }
      );
    }

    const digest = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(decodedToken)
    );

    const tokenHash = Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

    const { orderid } = await params;

    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        orderid
      )
    ) {
      return NextResponse.json(
        { success: false, message: "ID pesanan tidak valid." },
        { status: 400 }
      );
    }

    const { env } = getCloudflareContext();
    const db = env.umkm_website_generator_db;

    const admin = await db
      .prepare(
        `SELECT id FROM admin_sessions
         WHERE token_hash = ? AND expires_at > ?
         LIMIT 1`
      )
      .bind(tokenHash, new Date().toISOString())
      .first<{ id: string }>();

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Session admin tidak valid atau kedaluwarsa.",
        },
        { status: 401 }
      );
    }

    const order = await db
      .prepare(
        `SELECT
           o.id,
           o.status AS order_status,
           p.id AS payment_id,
           p.status AS payment_status,
           w.id AS website_id,
           w.status AS website_status
         FROM orders o
         LEFT JOIN payments p ON p.order_id = o.id
         LEFT JOIN websites w ON w.order_id = o.id
         WHERE o.id = ?
         LIMIT 1`
      )
      .bind(orderid)
      .first<{
        id: string;
        order_status: string;
        payment_id: string | null;
        payment_status: string | null;
        website_id: string | null;
        website_status: string | null;
      }>();

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Pesanan tidak ditemukan." },
        { status: 404 }
      );
    }

    if (!order.payment_id || !order.payment_status) {
      return NextResponse.json(
        { success: false, message: "Data pembayaran tidak ditemukan." },
        { status: 404 }
      );
    }

    if (!order.website_id || !order.website_status) {
      return NextResponse.json(
        { success: false, message: "Data website pesanan tidak ditemukan." },
        { status: 404 }
      );
    }

    if (
      order.order_status === "cancelled" ||
      order.order_status === "refunded"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Pesanan dibatalkan atau dikembalikan dan tidak bisa diterbitkan.",
        },
        { status: 409 }
      );
    }

    if (
      order.payment_status !== "pending" &&
      order.payment_status !== "paid"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: `Pembayaran tidak bisa dikonfirmasi karena statusnya ${order.payment_status}.`,
        },
        { status: 409 }
      );
    }

    if (order.website_status === "published") {
      return NextResponse.json({
        success: true,
        message: "Pembayaran sudah dikonfirmasi dan website sudah diterbitkan.",
      });
    }

    if (
      order.website_status !== "draft" &&
      order.website_status !== "preview"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: `Website tidak bisa diterbitkan karena statusnya ${order.website_status}.`,
        },
        { status: 409 }
      );
    }

    const now = new Date().toISOString();

    const result = await db.batch([
      db
        .prepare(
          `UPDATE payments
           SET status = 'paid',
               paid_at = COALESCE(paid_at, ?),
               updated_at = ?
           WHERE id = ? AND status IN ('pending', 'paid')`
        )
        .bind(now, now, order.payment_id),

      db
        .prepare(
          `UPDATE orders
           SET status = 'paid',
               updated_at = ?
           WHERE id = ?
             AND status NOT IN ('cancelled', 'refunded')`
        )
        .bind(now, orderid),

      db
        .prepare(
          `UPDATE websites
           SET status = 'published',
               published_at = COALESCE(published_at, ?),
               updated_at = ?
           WHERE id = ?
             AND status IN ('draft', 'preview')`
        )
        .bind(now, now, order.website_id),
    ]);

    if (
      !result[0]?.meta?.changes ||
      !result[1]?.meta?.changes ||
      !result[2]?.meta?.changes
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Perubahan status tidak berhasil. Muat ulang data pesanan dan periksa kembali.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Pembayaran dikonfirmasi dan website berhasil diterbitkan!",
    });
  } catch (error) {
    console.error("Confirm payment error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengonfirmasi pembayaran.",
      },
      { status: 500 }
    );
  }
}
