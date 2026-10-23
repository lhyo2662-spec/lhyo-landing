import { NextResponse } from "next/server";

export const runtime = "edge";

const bookedSlotsRegistry = new Set<string>();

export async function GET() {
  return NextResponse.json({
    status: "ARKOS_V15_3_ONLINE",
    webhook: "https://hook.us2.make.com/krs48cjfzudf4lau3sapwdgdu9lfe1tb",
    meetRoom: "https://meet.google.com/krc-vdii-zzh",
    bookedSlots: Array.from(bookedSlotsRegistry),
  }, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    const slotKey = String(body.payload?.slotKey || body.payload?.startTime || "Horario por definir");
    if (slotKey !== "Horario por definir") {
      bookedSlotsRegistry.add(slotKey);
    }

    const responses = body.payload?.responses || {};
    const attendees = body.payload?.attendees || [];

    const extractVal = (keyName: string) => {
      const item = responses[keyName];
      if (item === undefined || item === null) return "";
      return typeof item === "object" && "value" in item ? String(item.value) : String(item);
    };

    const fullName = String(attendees[0]?.name || "Cliente Ejecutivo").trim();
    const rawEmail = String(attendees[0]?.email || "").trim();
    const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail) ? rawEmail : "lhyoaraque2662@gmail.com";
    const companyUrl = extractVal("company_url") || "No especificada";
    const rawRevenue = extractVal("facturacion_mensual") || "0";
    const bottleneck = extractVal("cuello_botella") || "Impulsar crecimiento comercial";
    const selectedPlan = extractVal("plan_elegido") || String(body.payload?.metadata?.source_component || "AUDITORÍA GENERAL");

    const cleanRevenue = Number(rawRevenue.replace(/[^0-9.]/g, "")) || 0;
    const classification = cleanRevenue >= 5000 ? "VIP_QUALIFIED" : "LOW_QUALIFIED";

    const nowFormatted = new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC";
    const meetLink = "https://meet.google.com/krc-vdii-zzh";

    const makePayload = {
      fecha_registro: nowFormatted,
      horario_cita: slotKey,
      nombre_cliente: fullName,
      email_cliente: email,
      empresa_web: companyUrl,
      facturacion_usd: cleanRevenue,
      clasificacion: classification,
      servicio_elegido: selectedPlan,
      objetivo_cliente: bottleneck,
      resumen_crm: `${selectedPlan} || Objetivo: ${bottleneck}`,
      link_videollamada_meet: meetLink,
      link_catalogo_pdf: `https://lhyogroup.vercel.app/api/dossier?ceo=${encodeURIComponent(fullName)}&empresa=${encodeURIComponent(companyUrl)}`,
      link_google_calendar: `https://lhyogroup.vercel.app/api/agendar-calendario?slot=${encodeURIComponent(slotKey)}&ceo=${encodeURIComponent(fullName)}&email=${encodeURIComponent(email)}&empresa=${encodeURIComponent(companyUrl)}&plan=${encodeURIComponent(selectedPlan)}`
    };

    const makeWebhookUrl = "https://hook.us2.make.com/krs48cjfzudf4lau3sapwdgdu9lfe1tb";

    const makeResponse = await fetch(makeWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(makePayload),
    });

    return NextResponse.json({
      status: "CONNECTED_OK",
      makeHttpCode: makeResponse.status,
      classification: classification,
      bookedSlot: slotKey,
      meetRoom: meetLink,
    }, { status: 200 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "INTERNAL_ERROR";
    return NextResponse.json({ status: "ERROR", message: msg }, { status: 500 });
  }
}
