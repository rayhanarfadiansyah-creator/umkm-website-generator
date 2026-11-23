
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const runtime = "edge";

function toHex(bytes: Uint8Array) {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function hashToken(token: string) {
  const data = new TextEncoder().encode(token);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return toHex(new Uint8Array(hash));
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    const businessName =
      typeof body.businessName === "string" ? body.businessName.trim() : "";
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const whatsapp =
      typeof body.whatsapp === "string" ? body.whatsapp.trim() : "";
    const packageName = body.packageName;
    const palette =
      typeof body.palette === "string" ? body.palette.trim() : "";

    const prices = {
      basic: 0,
      pro: 75000,
      premium: 100000,
    } as const;

    if (!businessName || !whatsapp || !palette) {
      return NextResponse.json(
        { success: false, message: "Data bisnis belum lengkap." },
        { status: 400 }
      );
    }

    if (
      typeof packageName !== "string" ||
      !Object.hasOwn(prices, packageName)
    ) {
      return NextResponse.json(
        { success: false, message: "Paket website tidak valid." },
        { status: 400 }
      );
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: "Format email tidak valid." },
        { status: 400 }
      );
    }

    const paletteTiers: Record<string, string[]> = {
      basic: ["forest", "terracotta", "ocean"],
      pro: ["forest", "terracotta", "ocean", "deep-teal", "sunset"],
      premium: ["forest", "terracotta", "ocean", "deep-teal", "sunset", "lavender", "midnight"],
    };

    if (!paletteTiers[String(packageName)]?.includes(palette)) {
      return NextResponse.json(
        { success: false, message: "Pilihan warna tidak valid." },
        { status: 400 }
      );
    }

    const db = getDb();

    const customerId = crypto.randomUUID();
    const orderId = crypto.randomUUID();
    const websiteId = crypto.randomUUID();
    const accessTokenId = crypto.randomUUID();
    const paymentId = crypto.randomUUID();

    const randomBytes = crypto.getRandomValues(new Uint8Array(32));
    const previewToken = toHex(randomBytes);
    const tokenHash = await hashToken(previewToken);

    const now = new Date();
    const createdAt = now.toISOString();
    const expiresAt = new Date(
      now.getTime() + 24 * 60 * 60 * 1000
    ).toISOString();

    const amount = prices[packageName as keyof typeof prices];
    const isFreePackage = packageName === "basic";

    const statements = [
      db.prepare(`
        INSERT INTO customers (
          id, name, email, whatsapp, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(
        customerId,
        businessName,
        email,
        whatsapp,
        createdAt,
        createdAt
      ),

      db.prepare(`
        INSERT INTO orders (
          id, customer_id, package, amount, status, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(
        orderId,
        customerId,
        packageName,
        amount,
        isFreePackage ? "paid" : "pending_payment",
        createdAt,
        createdAt
      ),

      db.prepare(`
        INSERT INTO payments (
          id, order_id, provider, amount, status, paid_at, created_at, updated_at
        )
        VALUES (?, ?, 'manual', ?, ?, ?, ?, ?)
      `).bind(
        paymentId,
        orderId,
        amount,
        isFreePackage ? "paid" : "pending",
        isFreePackage ? createdAt : null,
        createdAt,
        createdAt
      ),

      db.prepare(`
        INSERT INTO websites (
          id, customer_id, order_id, business_name, slug,
          package, palette, status, content_json, published_at, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        websiteId,
        customerId,
        orderId,
        businessName,
        `${businessName
  .toLowerCase()
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "")
  .slice(0, 40)}-${websiteId.slice(0, 8)}`,
        packageName,
        palette,
        isFreePackage ? "published" : "draft",
        JSON.stringify(body),
        isFreePackage ? createdAt : null,
        createdAt,
        createdAt
      ),

      db.prepare(`
        INSERT INTO customer_access_tokens (
          id, customer_id, website_id, token_hash, expires_at, created_at
        )
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(
        accessTokenId,
        customerId,
        websiteId,
        tokenHash,
        expiresAt,
        createdAt
      ),
    ];

    await db.batch(statements);

    const response = NextResponse.json(
      {
        success: true,
        message: isFreePackage ? "Website Basic berhasil dibuat dan langsung diterbitkan." : "Pesanan berhasil disimpan dan menunggu pembayaran.",
        orderId,
        websiteId,
      },
      { status: 201 }
    );

    response.cookies.set({
      name: `webumkm_preview_${websiteId}`,
      value: previewToken,
      httpOnly: true,
      secure: new URL(request.url).protocol === "https:",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    console.error("Create order error:", error);

    return NextResponse.json(
      { success: false, message: "Gagal menyimpan pesanan." },
      { status: 500 }
    );
  }
}
