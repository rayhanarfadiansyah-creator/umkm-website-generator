
import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { hashPassword } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { env } = getCloudflareContext();
    const bootstrapSecret = env.ADMIN_BOOTSTRAP_SECRET;

    if (!bootstrapSecret) {
      return NextResponse.json(
        { success: false, message: "Bootstrap tidak dikonfigurasi." },
        { status: 503 }
      );
    }

    const providedSecret = request.headers.get("x-bootstrap-secret") || "";
    const encoder = new TextEncoder();
    const providedBytes = encoder.encode(providedSecret);
    const expectedBytes = encoder.encode(bootstrapSecret);

    let secretMatches = providedBytes.length === expectedBytes.length;

    if (secretMatches) {
      let difference = 0;

      for (let i = 0; i < expectedBytes.length; i++) {
        difference |= providedBytes[i] ^ expectedBytes[i];
      }

      secretMatches = difference === 0;
    }

    if (!secretMatches) {
      return NextResponse.json(
        { success: false, message: "Akses ditolak." },
        { status: 401 }
      );
    }

    const db = env.umkm_website_generator_db;

    const existingAdmin = await db
      .prepare("SELECT id FROM admins LIMIT 1")
      .first();

    if (existingAdmin) {
      return NextResponse.json(
        { success: false, message: "Admin sudah pernah dibuat." },
        { status: 409 }
      );
    }

    const body = (await request.json()) as {
      email?: unknown;
      password?: unknown;
    };

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const password =
      typeof body.password === "string" ? body.password : "";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: "Format email tidak valid." },
        { status: 400 }
      );
    }

    if (password.length < 12 || password.length > 72) {
      return NextResponse.json(
        {
          success: false,
          message: "Password harus 12 sampai 72 karakter.",
        },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);
    const adminId = crypto.randomUUID();

    const result = await db
      .prepare(`
        INSERT INTO admins (id, email, password_hash)
        SELECT ?, ?, ?
        WHERE NOT EXISTS (SELECT 1 FROM admins)
      `)
      .bind(adminId, email, passwordHash)
      .run();

    if (!result.success || result.meta.changes !== 1) {
      return NextResponse.json(
        { success: false, message: "Admin gagal dibuat atau sudah ada." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Admin pertama berhasil dibuat." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin bootstrap error:", error);

    return NextResponse.json(
      { success: false, message: "Gagal membuat admin." },
      { status: 500 }
    );
  }
}
