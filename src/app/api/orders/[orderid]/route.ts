
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const runtime = "edge";

type OrderRow = {
  id: string;
  package: "basic" | "pro" | "premium";
  amount: number;
  status: string;
  business_name: string;
  website_id: string;
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orderid: string }> }
) {
  try {
    const { orderid: orderId } = await params;

    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        orderId
      )
    ) {
      return NextResponse.json(
        { success: false, message: "ID pesanan tidak valid." },
        { status: 400 }
      );
    }

    const db = getDb();

    const order = await db
      .prepare(`
        SELECT
          o.id,
          o.package,
          o.amount,
          o.status,
          w.id AS website_id,
          w.business_name
        FROM orders o
        JOIN websites w ON w.order_id = o.id
        WHERE o.id = ?
        LIMIT 1
      `)
      .bind(orderId)
      .first<OrderRow>();

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Pesanan tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: {
        orderId: order.id,
        websiteId: order.website_id,
        businessName: order.business_name,
        package: order.package,
        amount: order.amount,
        status: order.status,
      },
    });
  } catch (error) {
    console.error("Get order error:", error);

    return NextResponse.json(
      { success: false, message: "Gagal mengambil data pesanan." },
      { status: 500 }
    );
  }
}
