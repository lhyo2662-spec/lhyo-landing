import { NextResponse } from "next/server";

export const runtime = "edge";

const bookedSlotsRegistry = new Set<string>();

export async function GET() {
  return NextResponse.json({
    status: "ARKOS_WEBHOOK_ONLINE",
    bookedSlots: Array.from(bookedSlotsRegistry),
  }, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    if (body.triggerEvent === "PING") {
      return NextResponse.json({ status: "PING_OK", system: "ARKOS_ONLINE" }, { status: 200 });
    }

    const slotKey = body.payload?.slotKey || body.payload?.startTime || "";
    if (slotKey && bookedSlotsRegistry.has(slotKey)) {
      return NextResponse.json(
        { error: "SLOT_ALREADY_BOOKED", message: "Este horario ya fue reservado. Por favor selecciona otra hora." },
        { status: 409 }
      );
    }
    if (slotKey) {
      bookedSlotsRegistry.add(slotKey);
    }

    const responses = body.payload?.responses || {};
    const attendees = body.payload?.attendees || [];

    const extractVal = (keyName: string) => {
      const item = responses[keyName];
      if (item === undefined || item === null) return null;
      return typeof item === "object" && "value" in item ? item.value : item;
    };

    const rawRevenue = extractVal("facturacion_mensual") || "0";
    const rawCompany = extractVal("company_url") || "No especificada";
    const rawBottleneck = extractVal("cuello_botella") || "Sin especificar";
    const rawPlan = extractVal("plan_elegido") || body.payload?.metadata?.source_component || "AUDITORÍA GENERAL (Botón Principal)";

    const cleanRevenue = Number(String(rawRevenue).replace(/[^0-9.]/g, "")) || 0;
    const autoTier = cleanRevenue >= 5000 ? "VIP_QUALIFIED" : "LOW_QUALIFIED";

    const normalizedPayload = {
      timestamp: new Date().toISOString(),
      event_type: "BOOKING_CREATED",
      lead_data: {
        full_name: String(attendees[0]?.name || "Cliente Agendado"),
        email: String(attendees[0]?.email || "sin-email@lhyogroup.com"),
        company_url: String(rawCompany),
        monthly_revenue_usd: cleanRevenue,
        bottleneck: String(rawBottleneck),
        selected_plan: String(rawPlan),
        classification: autoTier,
      },
      booking_meta: {
        booking_uid: String(body.payload?.uid || `lhyo_${Date.now()}`),
        start_time: String(body.payload?.startTime || new Date().toISOString()),
        source_component: String(rawPlan),
      },
    };

    const targetMakeUrl = "https://hook.us2.make.com/hx3nve3zt02sp8wkejegujyb5pyxiy6l";

    const makeRes = await fetch(targetMakeUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(normalizedPayload),
    });

    return NextResponse.json({
      status: "PIPELINE_EXECUTED",
      makeStatus: makeRes.status,
      tier: autoTier,
      bookedSlot: slotKey,
    }, { status: 200 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "UNKNOWN_SYSTEM_ERROR";
    return NextResponse.json({ status: "ERROR", message: errorMessage }, { status: 500 });
  }
}
