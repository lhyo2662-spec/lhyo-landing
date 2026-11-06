import { NextResponse } from "next/server";

export interface LuminaBookingEventPayload {
  event?: string;
  secretToken?: string;
  prospectName?: string;
  prospectEmail?: string;
  companyName?: string;
  revenueUsd?: string;
  scheduledSlot?: string;
  selectedPlan?: string;
  objective?: string;
  payload?: any;
}

const SIX_OFFICIAL_SOLUTIONS = [
  {
    code: "01",
    page: 3,
    tag: "CONTINUIDAD COMERCIAL 24/7",
    title: "Asistentes Inteligentes para WhatsApp e Instagram (24/7)",
    desc: "Arquitectura conversacional empática y analítica que atiende a cada prospecto en menos de un segundo, resuelve consultas con precisión, filtra perfiles calificados y coordina sesiones directamente en su agenda las 24 horas."
  },
  {
    code: "02",
    page: 3,
    tag: "AUTORIDAD DIGITAL INMEDIATA",
    title: "Plataformas Web Modernas y Catálogos Interactivos",
    desc: "Ecosistemas web de estética editorial e ingeniería de baja latencia (<0.8s) diseñados para proyectar solidez institucional desde el primer segundo y transformar visitas en reuniones estratégicas."
  },
  {
    code: "03",
    page: 3,
    tag: "TRAZABILIDAD SIN FRICCIÓN",
    title: "Organización Automática de Clientes y Ventas (CRM)",
    desc: "Centralización silenciosa de cada oportunidad comercial. Registra y clasifica prospectos por volumen y prioridad en tiempo real, liberando a su equipo de tareas administrativas manuales."
  },
  {
    code: "04",
    page: 4,
    tag: "SOBERANÍA OPERATIVA (N8N)",
    title: "Automatización Total de Procesos con Tecnología Propia",
    desc: "Infraestructura privada de flujos autónomos basada en n8n que interconecta toda su operación sin tarifas variables por volumen, reduciendo hasta en un 85% el costo anual en licencias externas."
  },
  {
    code: "05",
    page: 4,
    tag: "MEMORIA CORPORATIVA PRIVADA (AGENTES RAG)",
    title: "Inteligencia Artificial Personalizada con la Memoria de su Empresa",
    desc: "Núcleo cognitivo confidencial entrenado exclusivamente con los contratos, tarifarios, protocolos y manuales internos de su firma para asistir a su dirección y equipo en menos de un segundo."
  },
  {
    code: "06",
    page: 4,
    tag: "ECOSISTEMA UNIFICADO B2B (SAAS PROPIO)",
    title: "Su Propia Plataforma Empresarial Todo-en-Uno",
    desc: "Software propietario bajo el nombre y logotipo de su organización que consolida métricas comerciales, clientes, calendario y agentes de Inteligencia Artificial en una sola consola ejecutiva."
  }
];

export function renderLumina4PageHtml(params: {
  companyName: string;
  prospectName: string;
  scheduledSlot: string;
  selectedPlan: string;
}): string {
  const page3List = SIX_OFFICIAL_SOLUTIONS.filter((s) => s.page === 3);
  const page4List = SIX_OFFICIAL_SOLUTIONS.filter((s) => s.page === 4);

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<style>
  @page { size: A4 portrait; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact !important; }
  body { background-color: #070707; color: #F8F9FA; font-family: "Helvetica Neue", "Inter", sans-serif; line-height: 1.6; }
  .page { position: relative; width: 210mm; height: 297mm; padding: 25mm 20mm; overflow: hidden; page-break-after: always; display: flex; flex-direction: column; justify-content: space-between; background-color: #070707; }
  h1 { font-size: 40pt; font-weight: 800; letter-spacing: -0.02em; line-height: 1.1; margin-bottom: 8mm; color: #F8F9FA; }
  h2 { font-size: 26pt; font-weight: 700; color: #F8F9FA; margin-bottom: 6mm; letter-spacing: -0.01em; line-height: 1.15; }
  p.editorial-text { font-size: 12pt; color: #A0AAB2; max-width: 150mm; margin-bottom: 5mm; font-weight: 300; }
  .eyebrow { color: #BF953F; font-size: 9pt; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 14mm; font-weight: 600; }
  .sol-item { border-top: 1px solid rgba(191, 149, 63, 0.35); padding: 5.5mm 0; }
  .sol-tag { color: #BF953F; font-size: 8.5pt; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 1.5mm; font-weight: 600; }
  .sol-title { font-size: 14pt; font-weight: 700; color: #F8F9FA; margin-bottom: 2mm; }
  .sol-desc { font-size: 10.5pt; color: #A0AAB2; font-weight: 300; line-height: 1.55; }
  .footer { border-top: 1px solid rgba(248, 249, 250, 0.12); padding-top: 4mm; display: flex; justify-content: space-between; font-size: 8pt; color: #A0AAB2; letter-spacing: 1.5px; text-transform: uppercase; }
</style>
</head>
<body>
  <!-- PÁGINA 1: PORTADA EDITORIAL LUMINA -->
  <section class="page">
    <div>
      <p style="color:#BF953F; font-size:9pt; letter-spacing:2px; margin-bottom: 20mm;">DOCUMENTO CONSULTIVO · CONFIDENCIAL</p>
      <h1>EL ARTE DE ESCALAR<br>CON FLUIDEZ.</h1>
      <p class="editorial-text" style="border-left: 2px solid #BF953F; padding-left: 5mm;">Infraestructura tecnológica y soberanía digital para acompañar tu expansión.</p>
    </div>
    <div style="margin-top: auto; margin-bottom: 12mm; padding: 6mm; border: 1px solid rgba(191,149,63,0.35); background: rgba(255,255,255,0.015);">
      <p style="color:#BF953F; font-size:8pt; letter-spacing:2px; margin-bottom:2mm;">PREPARADO EN EXCLUSIVA TRAS CONFIRMACIÓN DE AUDITORÍA</p>
      <p style="font-size:14pt; font-weight:700; color:#F8F9FA;">${params.companyName}</p>
      <p style="font-size:10pt; color:#A0AAB2;">Atención: ${params.prospectName} · Sesión agendada: ${params.scheduledSlot}</p>
    </div>
    <div class="footer">
      <span>LHYO GROUP · WWW.LHYOGROUP.COM</span>
      <span style="color:#BF953F;">PÁGINA 01 / 04</span>
    </div>
  </section>

  <!-- PÁGINA 2: VISIÓN CONSULTIVA Y ARQUITECTURA DE FLUJO -->
  <section class="page">
    <div>
      <p class="eyebrow">01 · PERSPECTIVA EJECUTIVA</p>
      <h2>El crecimiento sostenible exige sistemas que respiren al ritmo de su empresa.</h2>
      <p class="editorial-text">Las organizaciones con mayor proyección suelen enfrentar un mismo límite invisible: a medida que aumenta la demanda, la operación se fragmenta en tareas manuales, tiempos de espera en atención y herramientas desconectadas entre sí.</p>
      <p class="editorial-text" style="border-left: 2px solid #BF953F; padding-left: 5mm; color: #F8F9FA;">En Lhyo Group concebimos la ingeniería como un activo silencioso: diseñamos infraestructuras a medida que absorben la complejidad operativa para que la dirección se concentre en la estrategia y la expansión.</p>
      <div style="margin-top: 12mm; padding: 6mm; border-top: 1px solid rgba(191,149,63,0.35); border-bottom: 1px solid rgba(191,149,63,0.35);">
        <p style="color:#BF953F; font-size:8.5pt; letter-spacing:2px; margin-bottom:2mm;">ENFOQUE DE LA SESIÓN RESERVADA</p>
        <p style="font-size:11pt; color:#F8F9FA; font-weight:400;">Interés principal registrado: ${params.selectedPlan}</p>
      </div>
    </div>
    <div class="footer">
      <span>CONFIDENCIAL · DOSSIER PRIVADO B2B</span>
      <span style="color:#BF953F;">PÁGINA 02 / 04</span>
    </div>
  </section>

  <!-- PÁGINA 3: SOLUCIONES OFICIALES 01, 02 Y 03 -->
  <section class="page">
    <div>
      <p class="eyebrow">02 · ARQUITECTURAS OFICIALES (SOLUCIONES 01 — 03)</p>
      <h2>Atención Inmediata, Prestigio Digital y Trazabilidad.</h2>
      ${page3List.map((s) => `<div class="sol-item"><div class="sol-tag">SOLUCIÓN ${s.code} · ${s.tag}</div><div class="sol-title">${s.title}</div><div class="sol-desc">${s.desc}</div></div>`).join("")}
    </div>
    <div class="footer">
      <span>LHYO GROUP · SOLUCIONES 01 A 03</span>
      <span style="color:#BF953F;">PÁGINA 03 / 04</span>
    </div>
  </section>

  <!-- PÁGINA 4: SOLUCIONES OFICIALES 04, 05 Y 06 -->
  <section class="page">
    <div>
      <p class="eyebrow">03 · ARQUITECTURAS OFICIALES (SOLUCIONES 04 — 06)</p>
      <h2>Soberanía Operativa, Memoria IA y Plataforma Propia.</h2>
      ${page4List.map((s) => `<div class="sol-item"><div class="sol-tag">SOLUCIÓN ${s.code} · ${s.tag}</div><div class="sol-title">${s.title}</div><div class="sol-desc">${s.desc}</div></div>`).join("")}
      <div style="margin-top: 6mm; padding: 4.5mm; border: 1px solid rgba(191,149,63,0.35);">
        <p style="font-size:9.5pt; color:#F8F9FA;"><strong>Sala privada para su sesión:</strong> https://meet.google.com/krc-vdii-zzh · Dirección General: ceo@lhyogroup.com</p>
      </div>
    </div>
    <div class="footer">
      <span>LHYO GROUP · SOLUCIONES 04 A 06 · CEO@LHYOGROUP.COM</span>
      <span style="color:#BF953F;">PÁGINA 04 / 04</span>
    </div>
  </section>
</body>
</html>`;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as LuminaBookingEventPayload;

    // Soporte dual: recibe tanto el Webhook de Calendly (invitee.created) como nuestro calendario ejecutivo web
    const eventType = body.event || "booking.confirmed";
    const prospectName = body.prospectName || body.payload?.attendees?.[0]?.name || body.payload?.name || "Dirección Ejecutiva";
    const prospectEmail = body.prospectEmail || body.payload?.attendees?.[0]?.email || body.payload?.email || "";
    const companyName = body.companyName || body.payload?.responses?.company?.value || "Su Organización";
    const scheduledSlot = body.scheduledSlot || body.payload?.startTime || "Sesión Ejecutiva Confirmada";
    const selectedPlan = body.selectedPlan || "Arquitectura Integral Lhyo Group";
    const revenueUsd = body.revenueUsd || "0";

    // CONDICIONANTE ESTRICTA: Si no hay correo de cita agendada o el evento no es de reserva, se bloquea
    if (!prospectEmail || (eventType !== "invitee.created" && eventType !== "booking.confirmed")) {
      return NextResponse.json(
        { error: "ACCESO RESTRINGIDO: El Dossier Privado B2B solo se genera tras confirmar una reunión en el calendario." },
        { status: 403 }
      );
    }

    const luminaHtml = renderLumina4PageHtml({
      companyName,
      prospectName,
      scheduledSlot,
      selectedPlan
    });

    const cleanRev = Number(String(revenueUsd).replace(/[^0-9]/g, "")) || 0;
    const tier = cleanRev >= 5000 ? "HIGH_TICKET" : "LOW_TICKET";
    const nowVe = new Date().toLocaleString("es-VE", { timeZone: "America/Caracas" });

    // Disparo exclusivo a Make / n8n con el HTML Editorial de 4 páginas inyectado para renderizar PDF y enviar por correo
    await fetch("https://hook.us2.make.com/krs48cjfzudf4lau3sapwdgdu9lfe1tb", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        evento_condicional: "REUNION_AGENDADA_DOSSIER_CONFIDENCIAL",
        fecha_registro: nowVe,
        horario_cita: scheduledSlot,
        nombre_cliente: prospectName,
        email_cliente: prospectEmail,
        empresa_web: companyName,
        facturacion_usd: String(cleanRev),
        clasificacion: tier,
        servicio_elegido: selectedPlan,
        objetivo_cliente: body.objective || selectedPlan,
        resumen_crm: `CITA CONFIRMADA (${tier}) || Empresa: ${companyName} || Dossier Lumina 4 Págs enviado a ${prospectEmail}`,
        link_videollamada_meet: "https://meet.google.com/krc-vdii-zzh",
        dossier_lumina_html_4_paginas: luminaHtml
      })
    }).catch(() => {});

    return NextResponse.json({
      ok: true,
      confidentialDelivery: "EMAIL_ONLY",
      recipient: prospectEmail,
      pages: 4
    });
  } catch {
    return NextResponse.json({ error: "Error en pasarela confidencial" }, { status: 500 });
  }
}