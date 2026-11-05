import { NextResponse } from "next/server";
import { DatabaseRepository } from "@/lib/db";
import fs from "fs";
import path from "path";
import { initialDatabase } from "@/data/seed";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const action = body.action || "publish_sample";

    if (action === "reset_seed") {
      const DATA_DIR = path.join(process.cwd(), "data");
      const DB_FILE = path.join(DATA_DIR, "db.json");
      fs.writeFileSync(DB_FILE, JSON.stringify(initialDatabase, null, 2), "utf-8");
      return NextResponse.json({
        success: true,
        message: "Database reset to initial unverified seed state.",
      });
    }

    DatabaseRepository.publishVerifiedSample("admin_quick_action");
    return NextResponse.json({
      success: true,
      message: "Sample verified records successfully published.",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

