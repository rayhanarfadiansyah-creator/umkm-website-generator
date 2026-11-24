
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function hashToken(token: string) {
  const data = new TextEncoder().encode(token);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return toHex(hash);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ websiteId: string }> }
) {
  try {
    const { websiteId } = await params;

    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        websiteId
      )
    ) {
      return NextResponse.json(
        { success: false, message: "Website tidak ditemukan." },
        { status: 404 }
      );
    }

    const cookieName = `webumkm_preview_${websiteId}`;
    const cookieHeader = request.headers.get("cookie") || "";

    const token = cookieHeader
      .split(";")
      .map((item) => item.trim())
      .find((item) => item.startsWith(`${cookieName}=`))
      ?.slice(cookieName.length + 1);

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Akses preview tidak tersedia atau sudah berakhir.",
        },
        { status: 401 }
      );
    }

    const tokenHash = await hashToken(decodeURIComponent(token));
    const now = new Date().toISOString();
    const db = getDb();

    const website = await db
      .prepare(`
        SELECT
          w.id,
          w.order_id,
          w.business_name,
          w.package,
          w.palette,
          w.status,
          w.slug,
          w.published_at,
          w.content_json
        FROM websites w
        INNER JOIN customer_access_tokens t
          ON t.website_id = w.id
        WHERE
          w.id = ?
          AND t.token_hash = ?
          AND t.revoked_at IS NULL
          AND t.expires_at > ?
        LIMIT 1
      `)
      .bind(websiteId, tokenHash, now)
      .first<{
        id: string;
        order_id: string;
        business_name: string;
        package: string;
        palette: string;
        status: string;
        slug: string;
        published_at: string | null;
        content_json: string;
      }>();

    if (!website) {
      return NextResponse.json(
        { success: false, message: "Preview tidak ditemukan." },
        { status: 404 }
      );
    }

    let content: Record<string, unknown>;

    try {
      content = JSON.parse(website.content_json || "{}");
    } catch {
      content = {};
    }

    return NextResponse.json({
      success: true,
      website: {
        id: website.id,
        orderId: website.order_id,
        businessName: website.business_name,
        package: website.package,
        palette: website.palette,
        status: website.status,
        slug: website.slug,
        publishedAt: website.published_at,
        content,
      },
    });
  } catch (error) {
    console.error("Get website preview error:", error);

    return NextResponse.json(
      { success: false, message: "Gagal mengambil data preview." },
      { status: 500 }
    );
  }
}
