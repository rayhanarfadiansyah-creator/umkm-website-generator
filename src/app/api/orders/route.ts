
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";

const VISITOR_COOKIE = "webumkm_visitor";
const VISITOR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const FREE_QUOTA = 2;

const MAX_REQUEST_BYTES = 3 * 1024 * 1024;
const MAX_IMAGE_BYTES = 900 * 1024;
const MAX_IMAGE_COUNT = 10;

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

function getVisitorToken(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";

  const cookie = cookieHeader
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${VISITOR_COOKIE}=`));

  const token = cookie?.slice(VISITOR_COOKIE.length + 1) ?? "";

  if (/^[a-f0-9]{64}$/i.test(token)) {
    return { token, isNew: false };
  }

  const bytes = crypto.getRandomValues(new Uint8Array(32));

  return {
    token: toHex(bytes),
    isNew: true,
  };
}

function setVisitorCookie(
  response: NextResponse,
  token: string,
  request: Request
) {
  response.cookies.set({
    name: VISITOR_COOKIE,
    value: token,
    httpOnly: true,
    secure: new URL(request.url).protocol === "https:",
    sameSite: "lax",
    path: "/",
    maxAge: VISITOR_COOKIE_MAX_AGE,
  });
}

function errorResponse(
  message: string,
  status: number,
  request: Request,
  visitorToken?: string
) {
  const response = NextResponse.json(
    { success: false, message },
    {
      status,
      headers: { "Cache-Control": "no-store" },
    }
  );

  if (visitorToken) {
    setVisitorCookie(response, visitorToken, request);
  }

  return response;
}

function validateImages(value: unknown) {
  let imageCount = 0;
  let error: string | null = null;

  function visit(item: unknown, depth = 0) {
    if (error || depth > 10) return;

    if (typeof item === "string") {
      if (!item.startsWith("data:image/")) return;

      imageCount += 1;

      if (imageCount > MAX_IMAGE_COUNT) {
        error = "Jumlah foto melebihi batas maksimum.";
        return;
      }

      const match = item.match(
        /^data:image\/(jpeg|jpg|png|webp|gif);base64,([a-zA-Z0-9+/]*={0,2})$/
      );

      if (!match) {
        error = "Format foto tidak valid.";
        return;
      }

      const base64 = match[2];
      const estimatedBytes = Math.floor((base64.length * 3) / 4);

      if (estimatedBytes > MAX_IMAGE_BYTES) {
        error = "Ukuran salah satu foto terlalu besar.";
      }

      return;
    }

    if (Array.isArray(item)) {
      for (const child of item) visit(child, depth + 1);
      return;
    }

    if (item && typeof item === "object") {
      for (const child of Object.values(item)) {
        visit(child, depth + 1);
      }
    }
  }

  visit(value);

  return error;
}

export async function POST(request: Request) {
  let visitorToken: string | undefined;

  try {
    // Batasi ukuran request sebelum memproses JSON.
    const contentLength = Number(request.headers.get("content-length") ?? 0);

    if (contentLength > MAX_REQUEST_BYTES) {
      return errorResponse(
        "Ukuran data terlalu besar. Kurangi ukuran foto dan coba lagi.",
        413,
        request
      );
    }

    const rawBody = await request.text();
    const actualBytes = new TextEncoder().encode(rawBody).byteLength;

    if (actualBytes > MAX_REQUEST_BYTES) {
      return errorResponse(
        "Ukuran data terlalu besar. Kurangi ukuran foto dan coba lagi.",
        413,
        request
      );
    }

    let body: Record<string, unknown>;

    try {
      const parsed: unknown = JSON.parse(rawBody);

      if (
        !parsed ||
        typeof parsed !== "object" ||
        Array.isArray(parsed)
      ) {
        return errorResponse("Format data tidak valid.", 400, request);
      }

      body = parsed as Record<string, unknown>;
    } catch {
      return errorResponse("Format JSON tidak valid.", 400, request);
    }

    // Identitas anonim persisten.
    const visitor = getVisitorToken(request);
    visitorToken = visitor.token;

    const visitorHash = await hashToken(visitorToken);

    const businessName =
      typeof body.businessName === "string"
        ? body.businessName.trim()
        : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const whatsapp =
      typeof body.whatsapp === "string"
        ? body.whatsapp.trim()
        : "";

    const packageName = body.packageName;

    const palette =
      typeof body.palette === "string"
        ? body.palette.trim()
        : "";

    const prices = {
      basic: 0,
      pro: 75000,
      premium: 100000,
    } as const;

    if (!businessName || !whatsapp || !palette) {
      return errorResponse(
        "Data bisnis belum lengkap.",
        400,
        request,
        visitorToken
      );
    }

    if (businessName.length > 120 || whatsapp.length > 30) {
      return errorResponse(
        "Nama bisnis atau nomor WhatsApp terlalu panjang.",
        400,
        request,
        visitorToken
      );
    }

    if (email.length > 254) {
      return errorResponse(
        "Alamat email terlalu panjang.",
        400,
        request,
        visitorToken
      );
    }

    if (
      typeof packageName !== "string" ||
      !Object.hasOwn(prices, packageName)
    ) {
      return errorResponse(
        "Paket website tidak valid.",
        400,
        request,
        visitorToken
      );
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return errorResponse(
        "Format email tidak valid.",
        400,
        request,
        visitorToken
      );
    }

    const paletteTiers: Record<string, string[]> = {
      basic: ["forest", "terracotta", "ocean"],
      pro: ["forest", "terracotta", "ocean", "deep-teal", "sunset"],
      premium: [
        "forest",
        "terracotta",
        "ocean",
        "deep-teal",
        "sunset",
        "lavender",
        "midnight",
      ],
    };

    if (!paletteTiers[packageName]?.includes(palette)) {
      return errorResponse(
        "Pilihan warna tidak valid.",
        400,
        request,
        visitorToken
      );
    }

    // Validasi ukuran dan format semua foto dalam payload.
    const imageError = validateImages(body);

    if (imageError) {
      return errorResponse(
        imageError,
        400,
        request,
        visitorToken
      );
    }

    const db = getDb();

    const customerId = crypto.randomUUID();
    const orderId = crypto.randomUUID();
    const websiteId = crypto.randomUUID();
    const accessTokenId = crypto.randomUUID();
    const paymentId = crypto.randomUUID();

    const previewToken = toHex(
      crypto.getRandomValues(new Uint8Array(32))
    );

    const tokenHash = await hashToken(previewToken);

    const now = new Date();
    const createdAt = now.toISOString();

    const expiresAt = new Date(
      now.getTime() + 24 * 60 * 60 * 1000
    ).toISOString();

    const amount = prices[packageName as keyof typeof prices];
    const isFreePackage = packageName === "basic";

    const slugBase = businessName
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40);

    const slug = `${slugBase || "website"}-${websiteId.slice(0, 8)}`;

    // Pastikan identitas anonim tercatat.
    await db.prepare(`
      INSERT INTO anonymous_visitors (
        visitor_hash, created_at, last_seen_at
      )
      VALUES (?, ?, ?)
      ON CONFLICT(visitor_hash)
      DO UPDATE SET last_seen_at = excluded.last_seen_at
    `).bind(visitorHash, createdAt, createdAt).run();

    const statements = [];

    // Reservasi kuota dilakukan dalam batch yang sama dengan
    // pembuatan website. Jika kuota habis, seluruh INSERT berikutnya
    // tidak akan menghasilkan data.
    if (isFreePackage) {
      statements.push(
        db.prepare(`
          INSERT INTO anonymous_free_usage (
            website_id, visitor_hash, created_at
          )
          SELECT ?, ?, ?
          WHERE (
            SELECT COUNT(*)
            FROM anonymous_free_usage
            WHERE visitor_hash = ?
          ) < ?
        `).bind(
          websiteId,
          visitorHash,
          createdAt,
          visitorHash,
          FREE_QUOTA
        )
      );
    }

    const customerInsert = isFreePackage
      ? db.prepare(`
          INSERT INTO customers (
            id, name, email, whatsapp, created_at, updated_at
          )
          SELECT ?, ?, ?, ?, ?, ?
          WHERE EXISTS (
            SELECT 1 FROM anonymous_free_usage
            WHERE website_id = ? AND visitor_hash = ?
          )
        `).bind(
          customerId,
          businessName,
          email,
          whatsapp,
          createdAt,
          createdAt,
          websiteId,
          visitorHash
        )
      : db.prepare(`
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
        );

    const orderInsert = isFreePackage
      ? db.prepare(`
          INSERT INTO orders (
            id, customer_id, package, amount, status, created_at, updated_at
          )
          SELECT ?, ?, ?, ?, ?, ?, ?
          WHERE EXISTS (
            SELECT 1 FROM anonymous_free_usage
            WHERE website_id = ? AND visitor_hash = ?
          )
        `).bind(
          orderId,
          customerId,
          packageName,
          amount,
          "paid",
          createdAt,
          createdAt,
          websiteId,
          visitorHash
        )
      : db.prepare(`
          INSERT INTO orders (
            id, customer_id, package, amount, status, created_at, updated_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).bind(
          orderId,
          customerId,
          packageName,
          amount,
          "pending_payment",
          createdAt,
          createdAt
        );

    const paymentInsert = isFreePackage
      ? db.prepare(`
          INSERT INTO payments (
            id, order_id, provider, amount, status,
            paid_at, created_at, updated_at
          )
          SELECT ?, ?, 'manual', ?, 'paid', ?, ?, ?
          WHERE EXISTS (
            SELECT 1 FROM anonymous_free_usage
            WHERE website_id = ? AND visitor_hash = ?
          )
        `).bind(
          paymentId,
          orderId,
          amount,
          createdAt,
          createdAt,
          createdAt,
          websiteId,
          visitorHash
        )
      : db.prepare(`
          INSERT INTO payments (
            id, order_id, provider, amount, status,
            paid_at, created_at, updated_at
          )
          VALUES (?, ?, 'manual', ?, 'pending', NULL, ?, ?)
        `).bind(
          paymentId,
          orderId,
          amount,
          createdAt,
          createdAt
        );

    const websiteInsert = isFreePackage
      ? db.prepare(`
          INSERT INTO websites (
            id, customer_id, order_id, business_name, slug,
            package, palette, status, content_json, published_at,
            created_at, updated_at
          )
          SELECT ?, ?, ?, ?, ?, ?, ?, 'published', ?, ?, ?, ?
          WHERE EXISTS (
            SELECT 1 FROM anonymous_free_usage
            WHERE website_id = ? AND visitor_hash = ?
          )
        `).bind(
          websiteId,
          customerId,
          orderId,
          businessName,
          slug,
          packageName,
          palette,
          JSON.stringify(body),
          createdAt,
          createdAt,
          createdAt,
          websiteId,
          visitorHash
        )
      : db.prepare(`
          INSERT INTO websites (
            id, customer_id, order_id, business_name, slug,
            package, palette, status, content_json, published_at,
            created_at, updated_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, 'draft', ?, NULL, ?, ?)
        `).bind(
          websiteId,
          customerId,
          orderId,
          businessName,
          slug,
          packageName,
          palette,
          JSON.stringify(body),
          createdAt,
          createdAt
        );

    const accessTokenInsert = isFreePackage
      ? db.prepare(`
          INSERT INTO customer_access_tokens (
            id, customer_id, website_id, token_hash, expires_at, created_at
          )
          SELECT ?, ?, ?, ?, ?, ?
          WHERE EXISTS (
            SELECT 1 FROM anonymous_free_usage
            WHERE website_id = ? AND visitor_hash = ?
          )
        `).bind(
          accessTokenId,
          customerId,
          websiteId,
          tokenHash,
          expiresAt,
          createdAt,
          websiteId,
          visitorHash
        )
      : db.prepare(`
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
        );

    statements.push(
      customerInsert,
      orderInsert,
      paymentInsert,
      websiteInsert,
      accessTokenInsert
    );

    const results = await db.batch(statements);

    // Hasil statement pertama adalah hasil reservasi kuota.
    if (isFreePackage && Number(results[0]?.meta?.changes ?? 0) !== 1) {
      return errorResponse(
        "Kuota gratis 2 website untuk perangkat ini sudah habis. Pilih paket Pro atau Premium untuk membuat website berikutnya.",
        429,
        request,
        visitorToken
      );
    }

    const response = NextResponse.json(
      {
        success: true,
        message: isFreePackage
          ? "Website Basic berhasil dibuat dan langsung diterbitkan."
          : "Pesanan berhasil disimpan dan menunggu pembayaran.",
        orderId,
        websiteId,
      },
      {
        status: 201,
        headers: { "Cache-Control": "no-store" },
      }
    );

    setVisitorCookie(response, visitorToken, request);

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

    return errorResponse(
      "Gagal menyimpan pesanan. Silakan coba lagi.",
      500,
      request,
      visitorToken
    );
  }
}
