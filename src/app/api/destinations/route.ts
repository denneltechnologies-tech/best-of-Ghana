import { NextResponse } from "next/server";
import { DatabaseRepository } from "@/lib/db";
import { Destination } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "published";
  const categorySlug = searchParams.get("category") || undefined;
  const query = searchParams.get("q") || undefined;

  const destinations = DatabaseRepository.getDestinations({
    status: status as any,
    categorySlug,
    query,
  });

  return NextResponse.json({ success: true, count: destinations.length, data: destinations });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const actor = body.actor || "admin_editor";

    const newDest = DatabaseRepository.createDestination(body.destination, actor);
    return NextResponse.json({ success: true, data: newDest }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

