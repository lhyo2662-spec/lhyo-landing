import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get("secret");

    if (token !== "LHYO_SYS_994810_ARKOS_KEY" && token !== process.env.WEBHOOK_SECRET_KEY) {
      return NextResponse.json({ error: "UNAUTHORIZED_ACCESS" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));

    // Respuesta inmediata 200 OK cuando Cal.com ejecuta "Prueba Ping"
    if (body.triggerEvent === "PING") {
      return NextResponse.json({ status: "PING_OK", system: "ARKOS_ONLINE" }, { status: 200 });
    }

    const normalizedPayload = {
      timestamp: new Date().toISOString(),
      event_type: body.triggerEvent || "BOOKING_CREATED",
      lead_data: {
        full_name: body.payload?.attendees?.[0]?.name || body.payload?.responses?.name?.value || "Lead Cal.com",
        email: body.payload?.attendees?.[0]?.email || body.payload?.responses?.email?.value || "sin-email@lhyogroup.com",
        company_url: body.payload?.responses?.company_url?.value || "No especificada",
        monthly_revenue_usd: Number(body.payload?.responses?.facturacion_mensual?.value || 0),
        bottleneck: body.payload?.responses?.cuello_botella?.value || "No especificado",
      },
      booking_meta: {
        booking_uid: body.payload?.uid || "uid_auto",
        start_time: body.payload?.startTime || new Date().toISOString(),
        source_component: body.payload?.metadata?.source_component || "cal_webhook",
      },
    };

    const targetMakeUrl = process.env.MAKE_WEBHOOK_URL || "https://hook.us2.make.com/hx3nve3zt02sp8wkejegujyb5pyxiy6l";

    const makeResponse = await fetch(targetMakeUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(normalizedPayload),
    });

    if (!makeResponse.ok) {
      return NextResponse.json({ status: "MAKE_WARN", code: makeResponse.status }, { status: 200 });
    }

    return NextResponse.json({ status: "PIPELINE_EXECUTED", latency: "EDGE_OK" }, { status: 200 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "UNKNOWN_SYSTEM_ERROR";
    return NextResponse.json({ status: "HANDLED_ERROR", message: errorMessage }, { status: 200 });
  }
}
