import { NextResponse } from "next/server";
import { DatabaseRepository } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const dest = DatabaseRepository.getDestinationById(params.id);
  if (!dest) {
    return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: dest });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const actor = body.actor || "editorial_staff";
    const updates = body.updates || {};

    const result = DatabaseRepository.updateDestination(params.id, updates, actor);

    if (result.error) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 422 }
      );
    }

    return NextResponse.json({ success: true, data: result.destination });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

