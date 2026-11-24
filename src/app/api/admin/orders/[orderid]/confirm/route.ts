
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";

function json(
  body: { success: boolean; message: string },
  status = 200
) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ orderid: string }> }
) {
  try {
    // Validasi session menggunakan helper terpusat.
    const admin = await requireAdmin();

    if (!admin) {
      return json(
        { success: false, message: "Session admin tidak valid atau kedaluwarsa." },
        401
      );
    }

    const { orderid } = await params;

    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        orderid
      )
    ) {
      return json(
        { success: false, message: "ID pesanan tidak valid." },
        400
      );
    }

    const db = getDb();

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
         ORDER BY
           CASE p.status
             WHEN 'pending' THEN 0
             WHEN 'paid' THEN 1
             ELSE 2
           END,
           p.created_at DESC
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
      return json(
        { success: false, message: "Pesanan tidak ditemukan." },
        404
      );
    }

    if (
      order.order_status === "cancelled" ||
      order.order_status === "refunded"
    ) {
      return json(
        {
          success: false,
          message: "Pesanan dibatalkan atau dikembalikan dan tidak bisa diterbitkan.",
        },
        409
      );
    }

    if (!order.payment_id || !order.payment_status) {
      return json(
        { success: false, message: "Data pembayaran tidak ditemukan." },
        404
      );
    }

    if (
      order.payment_status !== "pending" &&
      order.payment_status !== "paid"
    ) {
      return json(
        {
          success: false,
          message: `Pembayaran tidak bisa dikonfirmasi karena statusnya ${order.payment_status}.`,
        },
        409
      );
    }

    if (!order.website_id || !order.website_status) {
      return json(
        { success: false, message: "Data website pesanan tidak ditemukan." },
        404
      );
    }

    if (order.website_status === "published") {
      if (
        order.order_status === "paid" &&
        order.payment_status === "paid"
      ) {
        return json({
          success: true,
          message: "Pembayaran sudah dikonfirmasi dan website sudah diterbitkan.",
        });
      }

      return json(
        {
          success: false,
          message: "Status website sudah terbit, tetapi status order atau pembayaran belum konsisten. Perlu pemeriksaan admin.",
        },
        409
      );
    }

    if (
      order.website_status !== "draft" &&
      order.website_status !== "preview"
    ) {
      return json(
        {
          success: false,
          message: `Website tidak bisa diterbitkan karena statusnya ${order.website_status}.`,
        },
        409
      );
    }

    const now = new Date().toISOString();

    // Ketiga perubahan dijalankan dalam satu batch D1.
    // Migration 0004 dan 0005 memasang trigger yang membatalkan
    // seluruh batch jika salah satu transisi status tidak valid.
    await db.batch([
      db
        .prepare(
          `UPDATE payments
           SET status = 'paid',
               paid_at = COALESCE(paid_at, ?),
               updated_at = ?
           WHERE id = ?
             AND status IN ('pending', 'paid')`
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
             AND status <> 'published'`
        )
        .bind(now, now, order.website_id),
    ]);

    // Baca ulang keadaan akhir dari database.
    const finalState = await db
      .prepare(
        `SELECT
           o.status AS order_status,
           p.status AS payment_status,
           w.status AS website_status
         FROM orders o
         INNER JOIN payments p ON p.id = ?
         INNER JOIN websites w ON w.id = ?
         WHERE o.id = ?
           AND p.order_id = o.id
           AND w.order_id = o.id
         LIMIT 1`
      )
      .bind(order.payment_id, order.website_id, orderid)
      .first<{
        order_status: string;
        payment_status: string;
        website_status: string;
      }>();

    if (
      !finalState ||
      finalState.order_status !== "paid" ||
      finalState.payment_status !== "paid" ||
      finalState.website_status !== "published"
    ) {
      return json(
        {
          success: false,
          message: "Konfirmasi belum berhasil. Status pesanan, pembayaran, dan website tidak konsisten.",
        },
        409
      );
    }

    return json({
      success: true,
      message: "Pembayaran dikonfirmasi dan website berhasil diterbitkan!",
    });
  } catch (error) {
    console.error("Confirm payment error:", error);

    return json(
      {
        success: false,
        message: "Gagal mengonfirmasi pembayaran. Tidak ada konfirmasi sukses yang diberikan.",
      },
      500
    );
  }
}
