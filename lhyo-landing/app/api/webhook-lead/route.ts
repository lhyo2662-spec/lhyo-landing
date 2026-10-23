import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  return NextResponse.json({ status: "ARKOS_WEBHOOK_ONLINE" }, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    if (body.triggerEvent === "PING") {
      return NextResponse.json({ status: "PING_OK", system: "ARKOS_ONLINE" }, { status: 200 });
    }

    const responses = body.payload?.responses || {};
    const attendees = body.payload?.attendees || [];

    const extractVal = (keyName: string) => {
      const item = responses[keyName];
      if (item === undefined || item === null) return null;
      return typeof item === "object" && "value" in item ? item.value : item;
    };

    let rawRevenue = extractVal("facturacion_mensual");
    let rawCompany = extractVal("company_url");
    let rawBottleneck = extractVal("cuello_botella");
    let rawPlan = extractVal("plan_elegido") || extractVal("notes");

    for (const [k, v] of Object.entries(responses)) {
      const val = typeof v === "object" && v !== null && "value" in v ? (v as { value: unknown }).value : v;
      const label = typeof v === "object" && v !== null && "label" in v ? String((v as { label: unknown }).label).toLowerCase() : k.toLowerCase();
      if (!rawRevenue && (label.includes("facturaci") || label.includes("usd") || label.includes("mensual"))) {
        rawRevenue = val;
      }
      if (!rawCompany && (label.includes("web") || label.includes("instagram") || label.includes("empresa") || label.includes("sitio"))) {
        rawCompany = val;
      }
      if (!rawBottleneck && (label.includes("objetivo") || label.includes("mejorar") || label.includes("lograr") || label.includes("cuello") || label.includes("negocio"))) {
        rawBottleneck = val;
      }
      if (!rawPlan && (label.includes("plan") || label.includes("servicio") || label.includes("catálogo") || label.includes("catalogo") || label.includes("selección") || label.includes("seleccion"))) {
        rawPlan = val;
      }
    }

    const cleanRevenue = Number(String(rawRevenue || "0").replace(/[^0-9.]/g, "")) || 0;
    const autoTier = cleanRevenue >= 5000 ? "VIP_QUALIFIED" : "LOW_QUALIFIED";

    const selectedPlanFinal = String(
      rawPlan || 
      body.payload?.metadata?.source_component || 
      body.payload?.description || 
      "AUDITORÍA GENERAL (Botón Principal)"
    );

    const normalizedPayload = {
      timestamp: new Date().toISOString(),
      event_type: body.triggerEvent || "BOOKING_CREATED",
      lead_data: {
        full_name: attendees[0]?.name || extractVal("name") || "Cliente Agendado",
        email: attendees[0]?.email || extractVal("email") || "sin-email@lhyogroup.com",
        company_url: String(rawCompany || "No especificada"),
        monthly_revenue_usd: cleanRevenue,
        bottleneck: String(rawBottleneck || "Sin especificar"),
        selected_plan: selectedPlanFinal,
        classification: autoTier
      },
      booking_meta: {
        booking_uid: body.payload?.uid || "cal_uid_live",
        start_time: body.payload?.startTime || new Date().toISOString(),
        source_component: selectedPlanFinal,
      },
    };

    const targetMakeUrl = "https://hook.us2.make.com/hx3nve3zt02sp8wkejegujyb5pyxiy6l";

    await fetch(targetMakeUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(normalizedPayload),
    });

    return NextResponse.json({ status: "PIPELINE_EXECUTED", tier: autoTier }, { status: 200 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "UNKNOWN_SYSTEM_ERROR";
    return NextResponse.json({ status: "HANDLED", message: errorMessage }, { status: 200 });
  }
}
