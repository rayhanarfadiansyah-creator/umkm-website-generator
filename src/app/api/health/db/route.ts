
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const db = getDb();

    const result = await db
      .prepare("SELECT COUNT(*) AS total FROM sqlite_master WHERE type = 'table'")
      .first<{ total: number }>();

    return NextResponse.json({
      success: true,
      message: "D1 connected successfully",
      tables: result?.total ?? 0,
    });
  } catch (error) {
    console.error("D1 connection error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "D1 connection failed",
      },
      { status: 500 }
    );
  }
}
