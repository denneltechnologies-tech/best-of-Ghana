import { NextResponse } from "next/server";
import { DatabaseRepository } from "@/lib/db";
import { AnalyticsEvent } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const eventName = body.eventName as AnalyticsEvent["eventName"];
    const targetId = body.targetId;
    const metadata = body.metadata;

    if (!eventName) {
      return NextResponse.json({ success: false, error: "eventName is required" }, { status: 400 });
    }

    DatabaseRepository.recordAnalyticsEvent(eventName, targetId, metadata);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function GET() {
  const events = DatabaseRepository.getAnalyticsEvents();
  return NextResponse.json({ success: true, count: events.length, data: events });
}

