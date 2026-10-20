import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get("secret");

    if (token !== process.env.WEBHOOK_SECRET_KEY) {
      return NextResponse.json({ error: "UNAUTHORIZED_ACCESS" }, { status: 401 });
    }

    const body = await request.json();

    const normalizedPayload = {
      timestamp: new Date().toISOString(),
      event_type: body.triggerEvent || "LEAD_CAPTURED",
      lead_data: {
        full_name: body.payload?.attendees?.[0]?.name || "UNKNOWN",
        email: body.payload?.attendees?.[0]?.email || "UNKNOWN",
        company_url: body.payload?.responses?.company_url?.value || null,
        monthly_revenue_usd: Number(body.payload?.responses?.facturacion_mensual?.value || 0),
        bottleneck: body.payload?.responses?.cuello_botella?.value || "NO_SPECIFIED",
      },
      booking_meta: {
        booking_uid: body.payload?.uid,
        start_time: body.payload?.startTime,
        source_component: body.payload?.metadata?.source_component || "direct",
      },
    };

    const makeResponse = await fetch(process.env.MAKE_WEBHOOK_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(normalizedPayload),
    });

    if (!makeResponse.ok) {
      throw new Error(`MAKE_WEBHOOK_FAILED: ${makeResponse.status}`);
    }

    return NextResponse.json({ status: "PIPELINE_EXECUTED", latency: "EDGE_OK" }, { status: 200 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "UNKNOWN_SYSTEM_ERROR";
    return NextResponse.json({ status: "SYSTEM_ERROR", message: errorMessage }, { status: 500 });
  }
}