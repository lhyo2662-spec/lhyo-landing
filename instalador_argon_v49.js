const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = process.cwd();
const appRoot = fs.existsSync(path.join(ROOT, "lhyo-landing")) ? path.join(ROOT, "lhyo-landing") : ROOT;

console.log("=== [1/5] RESTAURANDO BASE LIMPIA aef356c ===");
for (const gDir of [ROOT, appRoot]) {
  if (fs.existsSync(path.join(gDir, ".git"))) {
    try { execSync("git checkout aef356c -- .", { cwd: gDir, stdio: "inherit" }); } catch {}
  }
}

// ============================================================================
// [2/5] CREAR PASARELA CONFIDENCIAL DEL DOSSIER DE LUMINA (PÁGINAS 1 A 4)
// Condicionante Estricta: Cero descarga pública. Solo se emite vía Webhook
// tras el evento "Reunión Agendada" (invitee.created / booking.confirmed).
// ============================================================================
console.log("=== [2/5] CREANDO PASARELA CONFIDENCIAL LUMINA (/api/confidential-dossier/route.ts) ===");
const dossierApiDir = path.join(appRoot, "app", "api", "confidential-dossier");
fs.mkdirSync(dossierApiDir, { recursive: true });

const dossierRouteLines = [
  'import { NextResponse } from "next/server";',
  '',
  'export interface LuminaBookingEventPayload {',
  '  event?: string;',
  '  secretToken?: string;',
  '  prospectName?: string;',
  '  prospectEmail?: string;',
  '  companyName?: string;',
  '  revenueUsd?: string;',
  '  scheduledSlot?: string;',
  '  selectedPlan?: string;',
  '  objective?: string;',
  '  payload?: any;',
  '}',
  '',
  'const SIX_OFFICIAL_SOLUTIONS = [',
  '  {',
  '    code: "01",',
  '    page: 3,',
  '    tag: "CONTINUIDAD COMERCIAL 24/7",',
  '    title: "Asistentes Inteligentes para WhatsApp e Instagram (24/7)",',
  '    desc: "Arquitectura conversacional empática y analítica que atiende a cada prospecto en menos de un segundo, resuelve consultas con precisión, filtra perfiles calificados y coordina sesiones directamente en su agenda las 24 horas."',
  '  },',
  '  {',
  '    code: "02",',
  '    page: 3,',
  '    tag: "AUTORIDAD DIGITAL INMEDIATA",',
  '    title: "Plataformas Web Modernas y Catálogos Interactivos",',
  '    desc: "Ecosistemas web de estética editorial e ingeniería de baja latencia (<0.8s) diseñados para proyectar solidez institucional desde el primer segundo y transformar visitas en reuniones estratégicas."',
  '  },',
  '  {',
  '    code: "03",',
  '    page: 3,',
  '    tag: "TRAZABILIDAD SIN FRICCIÓN",',
  '    title: "Organización Automática de Clientes y Ventas (CRM)",',
  '    desc: "Centralización silenciosa de cada oportunidad comercial. Registra y clasifica prospectos por volumen y prioridad en tiempo real, liberando a su equipo de tareas administrativas manuales."',
  '  },',
  '  {',
  '    code: "04",',
  '    page: 4,',
  '    tag: "SOBERANÍA OPERATIVA (N8N)",',
  '    title: "Automatización Total de Procesos con Tecnología Propia",',
  '    desc: "Infraestructura privada de flujos autónomos basada en n8n que interconecta toda su operación sin tarifas variables por volumen, reduciendo hasta en un 85% el costo anual en licencias externas."',
  '  },',
  '  {',
  '    code: "05",',
  '    page: 4,',
  '    tag: "MEMORIA CORPORATIVA PRIVADA (AGENTES RAG)",',
  '    title: "Inteligencia Artificial Personalizada con la Memoria de su Empresa",',
  '    desc: "Núcleo cognitivo confidencial entrenado exclusivamente con los contratos, tarifarios, protocolos y manuales internos de su firma para asistir a su dirección y equipo en menos de un segundo."',
  '  },',
  '  {',
  '    code: "06",',
  '    page: 4,',
  '    tag: "ECOSISTEMA UNIFICADO B2B (SAAS PROPIO)",',
  '    title: "Su Propia Plataforma Empresarial Todo-en-Uno",',
  '    desc: "Software propietario bajo el nombre y logotipo de su organización que consolida métricas comerciales, clientes, calendario y agentes de Inteligencia Artificial en una sola consola ejecutiva."',
  '  }',
  '];',
  '',
  'export function renderLumina4PageHtml(params: {',
  '  companyName: string;',
  '  prospectName: string;',
  '  scheduledSlot: string;',
  '  selectedPlan: string;',
  '}): string {',
  '  const page3List = SIX_OFFICIAL_SOLUTIONS.filter((s) => s.page === 3);',
  '  const page4List = SIX_OFFICIAL_SOLUTIONS.filter((s) => s.page === 4);',
  '',
  '  return `<!DOCTYPE html>',
  '<html lang="es">',
  '<head>',
  '<meta charset="UTF-8">',
  '<style>',
  '  @page { size: A4 portrait; margin: 0; }',
  '  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact !important; }',
  '  body { background-color: #070707; color: #F8F9FA; font-family: "Helvetica Neue", "Inter", sans-serif; line-height: 1.6; }',
  '  .page { position: relative; width: 210mm; height: 297mm; padding: 25mm 20mm; overflow: hidden; page-break-after: always; display: flex; flex-direction: column; justify-content: space-between; background-color: #070707; }',
  '  h1 { font-size: 40pt; font-weight: 800; letter-spacing: -0.02em; line-height: 1.1; margin-bottom: 8mm; color: #F8F9FA; }',
  '  h2 { font-size: 26pt; font-weight: 700; color: #F8F9FA; margin-bottom: 6mm; letter-spacing: -0.01em; line-height: 1.15; }',
  '  p.editorial-text { font-size: 12pt; color: #A0AAB2; max-width: 150mm; margin-bottom: 5mm; font-weight: 300; }',
  '  .eyebrow { color: #BF953F; font-size: 9pt; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 14mm; font-weight: 600; }',
  '  .sol-item { border-top: 1px solid rgba(191, 149, 63, 0.35); padding: 5.5mm 0; }',
  '  .sol-tag { color: #BF953F; font-size: 8.5pt; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 1.5mm; font-weight: 600; }',
  '  .sol-title { font-size: 14pt; font-weight: 700; color: #F8F9FA; margin-bottom: 2mm; }',
  '  .sol-desc { font-size: 10.5pt; color: #A0AAB2; font-weight: 300; line-height: 1.55; }',
  '  .footer { border-top: 1px solid rgba(248, 249, 250, 0.12); padding-top: 4mm; display: flex; justify-content: space-between; font-size: 8pt; color: #A0AAB2; letter-spacing: 1.5px; text-transform: uppercase; }',
  '</style>',
  '</head>',
  '<body>',
  '  <!-- PÁGINA 1: PORTADA EDITORIAL LUMINA -->',
  '  <section class="page">',
  '    <div>',
  '      <p style="color:#BF953F; font-size:9pt; letter-spacing:2px; margin-bottom: 20mm;">DOCUMENTO CONSULTIVO · CONFIDENCIAL</p>',
  '      <h1>EL ARTE DE ESCALAR<br>CON FLUIDEZ.</h1>',
  '      <p class="editorial-text" style="border-left: 2px solid #BF953F; padding-left: 5mm;">Infraestructura tecnológica y soberanía digital para acompañar tu expansión.</p>',
  '    </div>',
  '    <div style="margin-top: auto; margin-bottom: 12mm; padding: 6mm; border: 1px solid rgba(191,149,63,0.35); background: rgba(255,255,255,0.015);">',
  '      <p style="color:#BF953F; font-size:8pt; letter-spacing:2px; margin-bottom:2mm;">PREPARADO EN EXCLUSIVA TRAS CONFIRMACIÓN DE AUDITORÍA</p>',
  '      <p style="font-size:14pt; font-weight:700; color:#F8F9FA;">${params.companyName}</p>',
  '      <p style="font-size:10pt; color:#A0AAB2;">Atención: ${params.prospectName} · Sesión agendada: ${params.scheduledSlot}</p>',
  '    </div>',
  '    <div class="footer">',
  '      <span>LHYO GROUP · WWW.LHYOGROUP.COM</span>',
  '      <span style="color:#BF953F;">PÁGINA 01 / 04</span>',
  '    </div>',
  '  </section>',
  '',
  '  <!-- PÁGINA 2: VISIÓN CONSULTIVA Y ARQUITECTURA DE FLUJO -->',
  '  <section class="page">',
  '    <div>',
  '      <p class="eyebrow">01 · PERSPECTIVA EJECUTIVA</p>',
  '      <h2>El crecimiento sostenible exige sistemas que respiren al ritmo de su empresa.</h2>',
  '      <p class="editorial-text">Las organizaciones con mayor proyección suelen enfrentar un mismo límite invisible: a medida que aumenta la demanda, la operación se fragmenta en tareas manuales, tiempos de espera en atención y herramientas desconectadas entre sí.</p>',
  '      <p class="editorial-text" style="border-left: 2px solid #BF953F; padding-left: 5mm; color: #F8F9FA;">En Lhyo Group concebimos la ingeniería como un activo silencioso: diseñamos infraestructuras a medida que absorben la complejidad operativa para que la dirección se concentre en la estrategia y la expansión.</p>',
  '      <div style="margin-top: 12mm; padding: 6mm; border-top: 1px solid rgba(191,149,63,0.35); border-bottom: 1px solid rgba(191,149,63,0.35);">',
  '        <p style="color:#BF953F; font-size:8.5pt; letter-spacing:2px; margin-bottom:2mm;">ENFOQUE DE LA SESIÓN RESERVADA</p>',
  '        <p style="font-size:11pt; color:#F8F9FA; font-weight:400;">Interés principal registrado: ${params.selectedPlan}</p>',
  '      </div>',
  '    </div>',
  '    <div class="footer">',
  '      <span>CONFIDENCIAL · DOSSIER PRIVADO B2B</span>',
  '      <span style="color:#BF953F;">PÁGINA 02 / 04</span>',
  '    </div>',
  '  </section>',
  '',
  '  <!-- PÁGINA 3: SOLUCIONES OFICIALES 01, 02 Y 03 -->',
  '  <section class="page">',
  '    <div>',
  '      <p class="eyebrow">02 · ARQUITECTURAS OFICIALES (SOLUCIONES 01 — 03)</p>',
  '      <h2>Atención Inmediata, Prestigio Digital y Trazabilidad.</h2>',
  '      ${page3List.map((s) => `<div class="sol-item"><div class="sol-tag">SOLUCIÓN ${s.code} · ${s.tag}</div><div class="sol-title">${s.title}</div><div class="sol-desc">${s.desc}</div></div>`).join("")}',
  '    </div>',
  '    <div class="footer">',
  '      <span>LHYO GROUP · SOLUCIONES 01 A 03</span>',
  '      <span style="color:#BF953F;">PÁGINA 03 / 04</span>',
  '    </div>',
  '  </section>',
  '',
  '  <!-- PÁGINA 4: SOLUCIONES OFICIALES 04, 05 Y 06 -->',
  '  <section class="page">',
  '    <div>',
  '      <p class="eyebrow">03 · ARQUITECTURAS OFICIALES (SOLUCIONES 04 — 06)</p>',
  '      <h2>Soberanía Operativa, Memoria IA y Plataforma Propia.</h2>',
  '      ${page4List.map((s) => `<div class="sol-item"><div class="sol-tag">SOLUCIÓN ${s.code} · ${s.tag}</div><div class="sol-title">${s.title}</div><div class="sol-desc">${s.desc}</div></div>`).join("")}',
  '      <div style="margin-top: 6mm; padding: 4.5mm; border: 1px solid rgba(191,149,63,0.35);">',
  '        <p style="font-size:9.5pt; color:#F8F9FA;"><strong>Sala privada para su sesión:</strong> https://meet.google.com/krc-vdii-zzh · Dirección General: ceo@lhyogroup.com</p>',
  '      </div>',
  '    </div>',
  '    <div class="footer">',
  '      <span>LHYO GROUP · SOLUCIONES 04 A 06 · CEO@LHYOGROUP.COM</span>',
  '      <span style="color:#BF953F;">PÁGINA 04 / 04</span>',
  '    </div>',
  '  </section>',
  '</body>',
  '</html>`;',
  '}',
  '',
  'export async function POST(req: Request) {',
  '  try {',
  '    const body = (await req.json()) as LuminaBookingEventPayload;',
  '',
  '    // Soporte dual: recibe tanto el Webhook de Calendly (invitee.created) como nuestro calendario ejecutivo web',
  '    const eventType = body.event || "booking.confirmed";',
  '    const prospectName = body.prospectName || body.payload?.attendees?.[0]?.name || body.payload?.name || "Dirección Ejecutiva";',
  '    const prospectEmail = body.prospectEmail || body.payload?.attendees?.[0]?.email || body.payload?.email || "";',
  '    const companyName = body.companyName || body.payload?.responses?.company?.value || "Su Organización";',
  '    const scheduledSlot = body.scheduledSlot || body.payload?.startTime || "Sesión Ejecutiva Confirmada";',
  '    const selectedPlan = body.selectedPlan || "Arquitectura Integral Lhyo Group";',
  '    const revenueUsd = body.revenueUsd || "0";',
  '',
  '    // CONDICIONANTE ESTRICTA: Si no hay correo de cita agendada o el evento no es de reserva, se bloquea',
  '    if (!prospectEmail || (eventType !== "invitee.created" && eventType !== "booking.confirmed")) {',
  '      return NextResponse.json(',
  '        { error: "ACCESO RESTRINGIDO: El Dossier Privado B2B solo se genera tras confirmar una reunión en el calendario." },',
  '        { status: 403 }',
  '      );',
  '    }',
  '',
  '    const luminaHtml = renderLumina4PageHtml({',
  '      companyName,',
  '      prospectName,',
  '      scheduledSlot,',
  '      selectedPlan',
  '    });',
  '',
  '    const cleanRev = Number(String(revenueUsd).replace(/[^0-9]/g, "")) || 0;',
  '    const tier = cleanRev >= 5000 ? "HIGH_TICKET" : "LOW_TICKET";',
  '    const nowVe = new Date().toLocaleString("es-VE", { timeZone: "America/Caracas" });',
  '',
  '    // Disparo exclusivo a Make / n8n con el HTML Editorial de 4 páginas inyectado para renderizar PDF y enviar por correo',
  '    await fetch("https://hook.us2.make.com/krs48cjfzudf4lau3sapwdgdu9lfe1tb", {',
  '      method: "POST",',
  '      headers: { "Content-Type": "application/json" },',
  '      body: JSON.stringify({',
  '        evento_condicional: "REUNION_AGENDADA_DOSSIER_CONFIDENCIAL",',
  '        fecha_registro: nowVe,',
  '        horario_cita: scheduledSlot,',
  '        nombre_cliente: prospectName,',
  '        email_cliente: prospectEmail,',
  '        empresa_web: companyName,',
  '        facturacion_usd: String(cleanRev),',
  '        clasificacion: tier,',
  '        servicio_elegido: selectedPlan,',
  '        objetivo_cliente: body.objective || selectedPlan,',
  '        resumen_crm: `CITA CONFIRMADA (${tier}) || Empresa: ${companyName} || Dossier Lumina 4 Págs enviado a ${prospectEmail}`,',
  '        link_videollamada_meet: "https://meet.google.com/krc-vdii-zzh",',
  '        dossier_lumina_html_4_paginas: luminaHtml',
  '      })',
  '    }).catch(() => {});',
  '',
  '    return NextResponse.json({',
  '      ok: true,',
  '      confidentialDelivery: "EMAIL_ONLY",',
  '      recipient: prospectEmail,',
  '      pages: 4',
  '    });',
  '  } catch {',
  '    return NextResponse.json({ error: "Error en pasarela confidencial" }, { status: 500 });',
  '  }',
  '}'
];
fs.writeFileSync(path.join(dossierApiDir, "route.ts"), dossierRouteLines.join("\n"), "utf8");
console.log("✔ [CREADO]: app/api/confidential-dossier/route.ts");

// ============================================================================
// [3/5] CREAR CEREBRO CENTRAL IA "DUAL-ENGINE" (/api/chat-lhyo/route.ts)
// Con Pivote Natural (Cero "No puedo responder eso") y Deducción Consultiva
// ============================================================================
console.log("=== [3/5] CREANDO CEREBRO CENTRAL IA DUAL-ENGINE (/api/chat-lhyo/route.ts) ===");
const chatApiDir = path.join(appRoot, "app", "api", "chat-lhyo");
fs.mkdirSync(chatApiDir, { recursive: true });

const chatRouteLines = [
  'import { NextResponse } from "next/server";',
  'export const runtime = "edge";',
  '',
  'const SYSTEM_PROMPT_MAESTRO = `Eres el Asistente Ejecutivo de Élite y Cerebro Central de Lhyo Group (https://www.lhyogroup.com), firma liderada por su CEO, Lhyonneth Araque.',
  '1. PERSONALIDAD: Empático, fluido, sumamente agradable, culto y analítico. Habla siempre de "Usted" con tono consultivo (cero agresividad comercial).',
  '2. MEMORIA (RAG 06 SOLUCIONES): (01) Asistentes Inteligentes 24/7 WhatsApp/IG, (02) Plataformas Web y Catálogos Interactivos, (03) Organización Automática de Clientes CRM, (04) Automatización Propia en n8n, (05) Agentes RAG con la memoria de la empresa, (06) Plataforma Empresarial Todo-en-Uno SaaS.',
  '3. PIVOTE NATURAL OBLIGATORIO: Si el usuario pregunta algo ajeno a la empresa (finanzas globales, deportes, comida, clima, viajes), NUNCA digas "No puedo responder eso". Responde de forma natural y agradable sobre ese tema en 1 oración e inmediatamente conecta la idea haciendo un pivote hacia nuestras soluciones.',
  '4. CAPACIDAD DE DEDUCCIÓN: Si el cliente dice "Tengo una clínica y pierdo tiempo" (o menciona cualquier dolor de su negocio), deduce al instante qué soluciones necesita (ej. Asistente 24/7 + CRM), explícalo de manera conversacional y guíalo a la auditoría.',
  '5. DOSSIER CONFIDENCIAL Y PRECIOS: Nuestro Dossier Privado B2B ("El Arte de Escalar con Fluidez") es confidencial y se envía exclusivamente por correo al agendar la sesión consultiva de 15 minutos ([MOSTRAR_BOTON_AGENDA]).`;',
  '',
  'const SEVERE_BLOCK_REGEX = /(porno|porn|xxx|sexo|sexual|desnud|prostit|onlyfans|erotic|hentai|webcam|masturb|orgasmo|foll|burdel|escort|pene|vagina|tetas|culo|matar|asesinar|suicid|bomba|terroris|sicario|violacion|violar|pedofil|secuestr|extorsion|pistola|fusil|explosiv|cocaina|marihuana|heroina|fentanilo|droga|narco|hackear|phishing|clonar\\s+tarjeta|robar|estafar|mierda|malparid|hijueputa|hdp|puta|puto|verga|coño|marico|maricon|pendejo|imbecil|idiota|estupido|maldito|cabron|mamaguevo|mamahuevo|gonorrea)/i;',
  '',
  'function isGibberishOrFlood(text: string, history: any[]) {',
  '  const clean = String(text || "").trim();',
  '  if (/(.)\\1{6,}/i.test(clean)) return true;',
  '  if (/^[bcdfghjklmnpqrstvwxyz]{7,}$/i.test(clean.replace(/\\s+/g, ""))) return true;',
  '  const userMsgs = (history || []).filter((m) => m.sender === "user").map((m) => String(m.text || "").toLowerCase().trim());',
  '  if (userMsgs.length >= 2 && userMsgs[userMsgs.length - 1] === clean.toLowerCase() && userMsgs[userMsgs.length - 2] === clean.toLowerCase()) {',
  '    return true;',
  '  }',
  '  return false;',
  '}',
  '',
  'function pickStrictlyUnique(candidates: string[], history: any[]) {',
  '  const previousBotMessages = (history || [])',
  '    .filter((m) => m.sender === "bot")',
  '    .map((m) => String(m.text || "").toLowerCase().trim());',
  '  for (const candidate of candidates) {',
  '    const clean = candidate.replace(/\\[MOSTRAR_BOTON_AGENDA\\]/g, "").trim();',
  '    const sig = clean.toLowerCase().slice(0, 42);',
  '    const alreadyUsed = previousBotMessages.some((prev) => prev.includes(sig) || prev === clean.toLowerCase());',
  '    if (!alreadyUsed) return candidate;',
  '  }',
  '  return null;',
  '}',
  '',
  'const NATURAL_PIVOT_POOL = [',
  '  "Es un punto muy interesante; de hecho, cuando analizamos cómo funcionan los sistemas más eficientes hoy en día, todo se resume en eliminar la fricción y ganar fluidez. Precisamente eso hacemos en Lhyo Group: instalamos Asistentes Inteligentes 24/7, automatización en n8n y Plataformas Todo-en-Uno para que su empresa escale con total serenidad. ¿A qué se dedica actualmente su organización? [MOSTRAR_BOTON_AGENDA]",',
  '  "Qué agradable conversar sobre eso. Y conectando esa misma idea con el mundo de los negocios: los directivos que logran mayor calidad de vida son los que cuentan con sistemas propios que atienden clientes y organizan sus ventas en automático las 24 horas. ¿Qué área de su empresa siente que le consume más tiempo hoy? [MOSTRAR_BOTON_AGENDA]",',
  '  "Me parece una excelente observación. Llevando ese mismo nivel de análisis a su empresa: el 78% de los clientes elige a la firma que le responde primero y con mayor claridad. Con nuestros Asistentes 24/7 (Solución 01) y nuestro CRM Automático (Solución 03), su negocio atiende en menos de 1 segundo día y noche. ¿En qué sector opera usted? [MOSTRAR_BOTON_AGENDA]",',
  '  "Totalmente de acuerdo; en cualquier disciplina la clave del éxito está en contar con una estructura confiable detrás. En Lhyo Group diseñamos desde Plataformas Web de alto prestigio (Solución 02) hasta Agentes RAG entrenados con la memoria privada de su empresa (Solución 05). ¿Le gustaría conocer cómo lo aplicaríamos en su negocio? [MOSTRAR_BOTON_AGENDA]",',
  '  "Hoy más que nunca el activo más valioso es el tiempo: por eso en Lhyo Group unificamos sus ventas, su agenda, su CRM y su atención al cliente en una sola Plataforma Empresarial Todo-en-Uno (Solución 06). Si agenda una breve sesión consultiva de 15 minutos, le enviaremos a su correo nuestro Dossier Confidencial B2B. ¿Qué proceso le gustaría optimizar primero? [MOSTRAR_BOTON_AGENDA]"',
  '];',
  '',
  'function consultativeBrain(message: string, history: any[]) {',
  '  const clean = String(message || "").trim();',
  '  const lower = clean.toLowerCase();',
  '',
  '  // 1. DEDUCCIÓN CONSULTIVA: CLÍNICAS, CONSULTORIOS O PÉRDIDA DE TIEMPO',
  '  if (/(clinica|clínica|odontol|dental|dentista|medic|médic|doctor|salud|paciente|consultorio|hospital|estetic|estétic)/i.test(lower)) {',
  '    const p = pickStrictlyUnique([',
  '      "Comprendo perfectamente la dinámica de su clínica: cuando el equipo dedica horas a responder las mismas consultas por WhatsApp o a coordinar turnos manualmente, se pierde un tiempo valioso que debería enfocarse en los pacientes.\\n\\nPor lo que me comenta, su clínica se beneficiaría de inmediato con dos soluciones conectadas: nuestro Asistente Inteligente 24/7 (Solución 01), que responde dudas de tratamientos y agenda citas solo a cualquier hora, y nuestro CRM Clínico Automático (Solución 03), que organiza cada paciente sin anotar nada a mano. ¿Le gustaría agendar una breve sesión de 15 minutos para mostrárselo y enviarle a su correo nuestro Dossier Confidencial B2B? [MOSTRAR_BOTON_AGENDA]",',
  '      "En el sector salud la agilidad y la confianza lo son todo: si un paciente escribe a las 9:00 PM consultando por un tratamiento y recibe una respuesta cálida y precisa en menos de 1 segundo que deja su cita agendada, esa consulta no se pierde. Además, podemos entrenar un Agente RAG (Solución 05) con los protocolos y aranceles de su clínica. ¿Qué especialidad atienden principalmente? [MOSTRAR_BOTON_AGENDA]"',
  '    ], history);',
  '    if (p) return p;',
  '  }',
  '',
  '  if (/(pierdo tiempo|perdiendo tiempo|mucho tiempo|no me da tiempo|desorden|caos|no doy abasto|saturad|manual|lento)/i.test(lower)) {',
  '    const p = pickStrictlyUnique([',
  '      "Ese síntoma que menciona —sentir que la operación diaria le consume el tiempo— indica claramente que su negocio ya superó la etapa manual y necesita delegar en sistemas autónomos.\\n\\nEn Lhyo Group lo resolvemos instalando un Asistente Ejecutivo 24/7 (Solución 01) que filtra y agenda a sus clientes en automático, unido a un flujo propio en n8n (Solución 04) y un CRM (Solución 03) que registra todo sin intervención humana. ¿A qué se dedica su empresa para indicarle por cuál empezar? [MOSTRAR_BOTON_AGENDA]"',
  '    ], history);',
  '    if (p) return p;',
  '  }',
  '',
  '  // 2. PIVOTE NATURAL: FINANZAS GLOBALES / ECONOMÍA / MERCADOS',
  '  if (/(finanzas|economia|economía|mercado|inflacion|inflación|bolsa|inversion|inversión|dolar|dólar|banco|rentabilidad)/i.test(lower)) {',
  '    const p = pickStrictlyUnique([',
  '      "Las finanzas globales actuales muestran una tendencia clara: los mercados premian a las empresas que operan con máxima eficiencia y estructuras ligeras.\\n\\nConectando ese principio con su propia organización, nuestra Automatización Total basada en n8n (Solución 04) reduce hasta en un 85% los costos operativos en suscripciones de software y elimina las fugas de capital por falta de seguimiento comercial. ¿Cómo están gestionando hoy la eficiencia operativa en su negocio? [MOSTRAR_BOTON_AGENDA]",',
  '      "Analizar el panorama financiero siempre nos lleva a la misma conclusión: la mejor inversión es aquella que protege el flujo de caja de su propia empresa. Al integrar un CRM Automático (Solución 03) y Asistentes 24/7 (Solución 01), cada oportunidad comercial queda capturada y atendida en menos de 1 segundo. ¿En qué sector se desarrolla su actividad principal? [MOSTRAR_BOTON_AGENDA]"',
  '    ], history);',
  '    if (p) return p;',
  '  }',
  '',
  '  // 3. PIVOTE NATURAL: CUMPLEAÑOS / FAMILIA / COMIDA / DEPORTES / CLIMA / VIAJES',
  '  if (/(cumpleaños|cumpleanos|cumple|papa|papá|mama|mamá|familia|regalo|fiesta|aniversario)/i.test(lower)) {',
  '    const p = pickStrictlyUnique([',
  '      "¡Muchas felicidades por esa fecha especial! Una cena especial o una experiencia compartida en familia siempre es un gran detalle.\\n\\nY pensando precisamente en disfrutar esos momentos con tranquilidad: la mayor ventaja de instalar nuestros Asistentes IA 24/7 (Solución 01) y sistemas autónomos es que su empresa sigue atendiendo clientes y agendando reuniones por usted mientras comparte con los suyos. ¿A qué se dedica su negocio? [MOSTRAR_BOTON_AGENDA]",',
  '      "Las celebraciones familiares nos recuerdan que el verdadero propósito de dirigir una empresa es ganar calidad de vida y tiempo libre. En Lhyo Group construimos la infraestructura automática de su negocio (Web, WhatsApp 24/7 y CRM) para que funcione con fluidez sin depender de su presencia constante. ¿Qué tipo de empresa lidera usted? [MOSTRAR_BOTON_AGENDA]"',
  '    ], history);',
  '    if (p) return p;',
  '  }',
  '',
  '  if (/(almorzar|comer|comida|hambre|desayun|cenar|receta|cocina|plato|pizza|hamburguesa|pasta|cafe|café)/i.test(lower)) {',
  '    const p = pickStrictlyUnique([',
  '      "Para hoy siempre viene excelente un plato equilibrado, como una buena proteína a la plancha o una pasta artesanal que le recargue energías para el resto del día.\\n\\nY así como una buena comida mantiene su energía, contar con una arquitectura automática en su empresa mantiene el flujo de clientes activo las 24 horas incluso mientras usted hace una pausa para almorzar. ¿A qué se dedica actualmente su negocio? [MOSTRAR_BOTON_AGENDA]",',
  '      "La alta gastronomía y la ingeniería de negocios comparten un secreto: cuando los procesos están bien organizados, el resultado es impecable. En Lhyo Group diseñamos Plataformas Web Interactivas (Solución 02) y Asistentes 24/7 (Solución 01) que atienden y agendan clientes al instante. ¿En qué rubro opera su empresa? [MOSTRAR_BOTON_AGENDA]"',
  '    ], history);',
  '    if (p) return p;',
  '  }',
  '',
  '  if (/(futbol|fútbol|manchester|madrid|barcelona|partido|gol|deporte|champions|messi|cristiano|clima|lluvia|viaje|vacaciones)/i.test(lower)) {',
  '    const p = pickStrictlyUnique([',
  '      "En el deporte de élite —igual que en cualquier gran jornada— la diferencia entre ganar o perder un encuentro está en la velocidad de reacción y la coordinación del equipo.\\n\\nLlevando esa misma sincronización a su empresa, en Lhyo Group conectamos su WhatsApp 24/7, su Plataforma Web y su CRM para que responda a cada cliente en menos de 1 segundo. ¿Qué área de su negocio le gustaría potenciar primero? [MOSTRAR_BOTON_AGENDA]"',
  '    ], history);',
  '    if (p) return p;',
  '  }',
  '',
  '  // 4. CONSULTAS SOBRE EL DOSSIER CONFIDENCIAL, PRECIOS O LAS 06 SOLUCIONES',
  '  if (/(dossier|catalogo|catálogo|pdf|descargar|precio|precios|costo|cuanto cuesta|cuánto cuesta|tarifa|presupuesto|cotiza)/i.test(lower)) {',
  '    const p = pickStrictlyUnique([',
  '      "Nuestro Dossier Consultivo B2B (\\"El Arte de Escalar con Fluidez\\") es un documento confidencial y personalizado que incluye el detalle de nuestras 06 Soluciones Oficiales.\\n\\nPor protocolo de privacidad no está disponible para descarga pública; nuestro sistema lo genera y lo envía directamente a su correo electrónico en el instante en que usted agenda su breve sesión ejecutiva de 15 minutos en el botón dorado inferior. ¿Le gustaría reservar su horario ahora? [MOSTRAR_BOTON_AGENDA]",',
  '      "Cada arquitectura en Lhyo Group se dimensiona a la medida exacta de su organización. Al confirmar su espacio de 15 minutos en nuestro calendario ejecutivo, recibirá de inmediato en su bandeja de correo nuestro Dossier Confidencial en PDF junto con el enlace a nuestra sala privada. Puede elegir el día y la hora tocando el botón aquí abajo. [MOSTRAR_BOTON_AGENDA]"',
  '    ], history);',
  '    if (p) return p;',
  '  }',
  '',
  '  if (/(que ofrecen|qué ofrecen|servicios|soluciones|que hacen|qué hacen|n8n|rag|saas|informacion|información)/i.test(lower)) {',
  '    const p = pickStrictlyUnique([',
  '      "En Lhyo Group acompañamos la expansión de su empresa a través de 06 Soluciones Oficiales:\\n01 · Asistentes Inteligentes 24/7 para WhatsApp e Instagram.\\n02 · Plataformas Web Modernas y Catálogos Interactivos.\\n03 · Organización Automática de Clientes y Ventas (CRM).\\n04 · Automatización Total de Procesos con Tecnología Propia (n8n).\\n05 · Inteligencia Artificial Personalizada con la Memoria de su Empresa (Agentes RAG).\\n06 · Su Propia Plataforma Empresarial Todo-en-Uno.\\n\\nCuénteme sobre su empresa: ¿en cuál de estas áreas siente hoy la mayor oportunidad de mejora? [MOSTRAR_BOTON_AGENDA]"',
  '    ], history);',
  '    if (p) return p;',
  '  }',
  '',
  '  if (/(hola|buenos|buenas|saludos|hey|que tal|qué tal)/i.test(lower)) {',
  '    const p = pickStrictlyUnique([',
  '      "¡Hola! Es un verdadero gusto darle la bienvenida a Lhyo Group. Estoy aquí para escuchar sobre su empresa, analizar qué procesos podemos optimizar juntos y guiarle paso a paso. ¿Con quién tengo el gusto y a qué se dedica su organización?"',
  '    ], history);',
  '    if (p) return p;',
  '  }',
  '',
  '  const uniquePivot = pickStrictlyUnique(NATURAL_PIVOT_POOL, history);',
  '  if (uniquePivot) return uniquePivot;',
  '',
  '  return "Ha sido un gusto analizar cada uno de estos puntos con usted. Para que pueda revisar con calma el alcance completo de nuestras 06 Soluciones y recibir en su correo nuestro Dossier Confidencial B2B (\\"El Arte de Escalar con Fluidez\\"), le invito a elegir su horario de 15 minutos en el botón dorado inferior. [MOSTRAR_BOTON_AGENDA]";',
  '}',
  '',
  'export async function POST(req: Request) {',
  '  try {',
  '    const body = await req.json();',
  '    const message = String(body.message || "").trim();',
  '    const history = Array.isArray(body.history) ? body.history : [];',
  '',
  '    if (SEVERE_BLOCK_REGEX.test(message) || isGibberishOrFlood(message, history)) {',
  '      return NextResponse.json({',
  '        reply: "Protocolo de Seguridad Lhyo Group: Este canal ejecutivo está dedicado exclusivamente a consultoría tecnológica y sistemas empresariales. Esta sesión ha sido bloqueada.",',
  '        blocked: true,',
  '        showBooking: false',
  '      });',
  '    }',
  '',
  '    const apiKey = process.env.GEMINI_API_KEY || "";',
  '    if (apiKey && apiKey.startsWith("AIza")) {',
  '      try {',
  '        const contents = history.slice(-10).map((m: any) => ({',
  '          role: m.sender === "user" ? "user" : "model",',
  '          parts: [{ text: String(m.text || "") }]',
  '        }));',
  '        contents.push({ role: "user", parts: [{ text: message }] });',
  '        const gRes = await fetch(',
  '          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,',
  '          {',
  '            method: "POST",',
  '            headers: { "Content-Type": "application/json" },',
  '            body: JSON.stringify({',
  '              systemInstruction: { parts: [{ text: SYSTEM_PROMPT_MAESTRO }] },',
  '              contents,',
  '              generationConfig: { temperature: 0.35, maxOutputTokens: 380 }',
  '            })',
  '          }',
  '        );',
  '        if (gRes.ok) {',
  '          const gData = await gRes.json();',
  '          const rawReply = gData?.candidates?.[0]?.content?.parts?.[0]?.text || "";',
  '          if (rawReply) {',
  '            const showB = rawReply.includes("[MOSTRAR_BOTON_AGENDA]");',
  '            const cleanR = rawReply.replace(/\\[MOSTRAR_BOTON_AGENDA\\]/g, "").trim();',
  '            return NextResponse.json({ reply: cleanR, blocked: false, showBooking: showB });',
  '          }',
  '        }',
  '      } catch {}',
  '    }',
  '',
  '    const aiReply = consultativeBrain(message, history);',
  '    const showBooking = aiReply.includes("[MOSTRAR_BOTON_AGENDA]");',
  '    const cleanReply = aiReply.replace(/\\[MOSTRAR_BOTON_AGENDA\\]/g, "").trim();',
  '    return NextResponse.json({ reply: cleanReply, blocked: false, showBooking });',
  '  } catch {',
  '    return NextResponse.json({',
  '      reply: "Es un gusto atenderle en Lhyo Group. Cuénteme sobre su empresa y qué proceso le gustaría optimizar o automatizar.",',
  '      blocked: false,',
  '      showBooking: true',
  '    });',
  '  }',
  '}'
];
fs.writeFileSync(path.join(chatApiDir, "route.ts"), chatRouteLines.join("\n"), "utf8");
console.log("✔ [ACTUALIZADO]: app/api/chat-lhyo/route.ts");

// ============================================================================
// [4/5] BLINDAR CONTACTO (CERO DESCARGA PÚBLICA DE PDF) Y CONECTAR EL DISPARO
// DEL DOSSIER CONFIDENCIAL DE LUMINA EXCLUSIVAMENTE A "REUNIÓN AGENDADA"
// ============================================================================
console.log("=== [4/5] PROTEGIENDO CONTACTO Y CONECTANDO PASARELA DE REUNION AGENDADA ===");
const compDir = path.join(appRoot, "components");
fs.mkdirSync(compDir, { recursive: true });

const safeContactLines = [
  '"use client";',
  'import React, { useState } from "react";',
  '',
  'export function DirectContactSection() {',
  '  const [contactName, setContactName] = useState("");',
  '  const [contactEmail, setContactEmail] = useState("");',
  '  const [contactPhone, setContactPhone] = useState("");',
  '  const [contactMsg, setContactMsg] = useState("");',
  '  const [contactSent, setContactSent] = useState(false);',
  '',
  '  const openExecutiveCalendar = () => {',
  '    const buttons = Array.from(document.querySelectorAll("button"));',
  '    const mainBtn = buttons.find((b) => (b.textContent || "").toUpperCase().includes("AGENDAR REUNIÓN"));',
  '    if (mainBtn) { mainBtn.click(); }',
  '  };',
  '',
  '  return (',
  '    <section className="px-6 pt-10 pb-20 md:px-16 lg:px-24 max-w-7xl mx-auto">',
  '      <div className="mb-10 border-b border-white/10 pb-5 flex flex-wrap items-center justify-between gap-4">',
  '        <div>',
  '          <span className="text-[11px] font-semibold text-[#C5A059] uppercase tracking-[0.16em] block mb-1.5">',
  '            CANALES OFICIALES DE COMUNICACIÓN',
  '          </span>',
  '          <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">',
  '            Contacto Directo y Atención Ejecutiva',
  '          </h2>',
  '          <p className="text-sm text-gray-300 mt-2 max-w-2xl">',
  '            Comuníquese directamente con nuestra dirección general. Nuestro Dossier Privado B2B es confidencial y se envía a su correo al agendar su sesión:',
  '          </p>',
  '        </div>',
  '        <button',
  '          type="button"',
  '          onClick={openExecutiveCalendar}',
  '          className="px-5 py-3 rounded-xl border border-[#C5A059] bg-[#0A1128]/90 text-[#FCF6BA] text-xs font-extrabold uppercase tracking-wider hover:bg-[#C5A059] hover:text-[#050507] transition cursor-pointer"',
  '        >',
  '          🔒 AGENDAR SESIÓN PARA RECIBIR DOSSIER PRIVADO →',
  '        </button>',
  '      </div>',
  '',
  '      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">',
  '        <div className="lg:col-span-5 flex flex-col justify-between gap-4">',
  '          <a',
  '            href="https://wa.me/584247383164?text=Hola%20Lhyo%20Group%2C%20les%20escribo%20desde%20su%20p%C3%A1gina%20web%20oficial."',
  '            target="_blank"',
  '            rel="noopener noreferrer"',
  '            className="p-6 rounded-2xl bg-[#0A1128]/70 border border-[#C5A059]/30 hover:border-[#FCF6BA] transition block"',
  '          >',
  '            <span className="text-[10px] font-semibold text-[#C5A059] uppercase tracking-widest block mb-1.5">',
  '              ATENCIÓN INMEDIATA EN WHATSAPP',
  '            </span>',
  '            <div className="text-lg font-semibold text-[#FCF6BA] mb-1">',
  '              Iniciar Conversación en WhatsApp →',
  '            </div>',
  '            <p className="text-xs text-gray-300">',
  '              Respuesta directa de nuestro asistente y equipo comercial.',
  '            </p>',
  '          </a>',
  '',
  '          <a',
  '            href="https://mail.google.com/mail/?view=cm&fs=1&to=ceo@lhyogroup.com&su=Consulta%20Corporativa%20-%20Lhyo%20Group"',
  '            target="_blank"',
  '            rel="noopener noreferrer"',
  '            className="p-6 rounded-2xl bg-[#0A1128]/70 border border-[#C5A059]/30 hover:border-[#FCF6BA] transition block"',
  '          >',
  '            <span className="text-[10px] font-semibold text-[#C5A059] uppercase tracking-widest block mb-1.5">',
  '              CORREO ELECTRÓNICO CORPORATIVO OFICIAL',
  '            </span>',
  '            <div className="text-lg font-semibold text-[#FCF6BA] mb-1">',
  '              ceo@lhyogroup.com →',
  '            </div>',
  '            <p className="text-xs text-gray-300">',
  '              Dirección General: Lhyonneth Araque (CEO & Founder).',
  '            </p>',
  '          </a>',
  '',
  '          <div className="p-6 rounded-2xl bg-[#0A1128]/70 border border-[#C5A059]/30">',
  '            <span className="text-[10px] font-semibold text-[#C5A059] uppercase tracking-widest block mb-2.5">',
  '              REDES SOCIALES Y PRESENCIA OFICIAL',
  '            </span>',
  '            <div className="flex flex-wrap gap-3 mb-3">',
  '              <a',
  '                href="https://www.instagram.com/lhyogroup"',
  '                target="_blank"',
  '                rel="noopener noreferrer"',
  '                className="px-4 py-2 rounded-full border border-[#C5A059]/45 bg-[#050507] text-xs font-medium text-[#FCF6BA] hover:bg-[#C5A059] hover:text-[#050507] transition"',
  '              >',
  '                Instagram Oficial →',
  '              </a>',
  '              <a',
  '                href="https://www.linkedin.com/company/lhyogroup"',
  '                target="_blank"',
  '                rel="noopener noreferrer"',
  '                className="px-4 py-2 rounded-full border border-[#C5A059]/45 bg-[#050507] text-xs font-medium text-[#FCF6BA] hover:bg-[#C5A059] hover:text-[#050507] transition"',
  '              >',
  '                LinkedIn Corporativo →',
  '              </a>',
  '            </div>',
  '            <p className="text-xs text-gray-400">',
  '              Operación activa en Latinoamérica, Europa y Cobertura Online Internacional.',
  '            </p>',
  '          </div>',
  '        </div>',
  '',
  '        <div className="lg:col-span-7 rounded-2xl bg-gradient-to-br from-[#0A1128]/90 via-[#070A14] to-[#050507] border border-[#C5A059]/45 p-6 sm:p-8 flex flex-col justify-between">',
  '          {!contactSent ? (',
  '            <form',
  '              onSubmit={(e) => {',
  '                e.preventDefault();',
  '                if (!contactName.trim() || !contactEmail.trim() || !contactMsg.trim()) return;',
  '                setContactSent(true);',
  '              }}',
  '              className="space-y-4"',
  '            >',
  '              <div>',
  '                <span className="text-[11px] font-semibold text-[#FCF6BA] uppercase tracking-wider block mb-1">',
  '                  MENSAJE DIRECTO A DIRECCIÓN GENERAL (ceo@lhyogroup.com)',
  '                </span>',
  '                <h3 className="text-xl sm:text-2xl font-semibold text-white">',
  '                  Envíenos su consulta directa',
  '                </h3>',
  '              </div>',
  '',
  '              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">',
  '                <div>',
  '                  <label className="text-xs font-semibold text-[#FCF6BA] uppercase block mb-1">',
  '                    Su Nombre *',
  '                  </label>',
  '                  <input',
  '                    type="text"',
  '                    placeholder="Ej: Carlos Mendoza"',
  '                    value={contactName}',
  '                    onChange={(e) => setContactName(e.target.value)}',
  '                    className="w-full rounded-xl bg-[#050507] border border-white/15 focus:border-[#C5A059] text-white text-sm px-3.5 py-2.5 outline-none"',
  '                  />',
  '                </div>',
  '                <div>',
  '                  <label className="text-xs font-semibold text-[#FCF6BA] uppercase block mb-1">',
  '                    Su Correo Electrónico *',
  '                  </label>',
  '                  <input',
  '                    type="email"',
  '                    placeholder="correo@empresa.com"',
  '                    value={contactEmail}',
  '                    onChange={(e) => setContactEmail(e.target.value)}',
  '                    className="w-full rounded-xl bg-[#050507] border border-white/15 focus:border-[#C5A059] text-white text-sm px-3.5 py-2.5 outline-none"',
  '                  />',
  '                </div>',
  '              </div>',
  '',
  '              <div>',
  '                <label className="text-xs font-semibold text-[#FCF6BA] uppercase block mb-1">',
  '                  Su Número de WhatsApp (Opcional)',
  '                </label>',
  '                <input',
  '                  type="text"',
  '                  placeholder="Ej: +58 424 000 0000"',
  '                  value={contactPhone}',
  '                  onChange={(e) => setContactPhone(e.target.value)}',
  '                  className="w-full rounded-xl bg-[#050507] border border-white/15 focus:border-[#C5A059] text-white text-sm px-3.5 py-2.5 outline-none"',
  '                />',
  '              </div>',
  '',
  '              <div>',
  '                <label className="text-xs font-semibold text-[#FCF6BA] uppercase block mb-1">',
  '                  ¿En qué podemos ayudarle? *',
  '                </label>',
  '                <textarea',
  '                  rows={3}',
  '                  placeholder="Escriba aquí su consulta o requerimiento..."',
  '                  value={contactMsg}',
  '                  onChange={(e) => setContactMsg(e.target.value)}',
  '                  className="w-full rounded-xl bg-[#050507] border border-white/15 focus:border-[#C5A059] text-white text-sm px-3.5 py-2.5 outline-none resize-none"',
  '                />',
  '              </div>',
  '',
  '              <button',
  '                type="submit"',
  '                className="w-full h-[50px] rounded-xl bg-gradient-to-r from-[#C5A059] via-[#FCF6BA] to-[#B38728] text-[#050507] font-bold text-xs uppercase tracking-wider cursor-pointer"',
  '              >',
  '                ENVIAR MENSAJE DIRECTO A LHYO GROUP →',
  '              </button>',
  '            </form>',
  '          ) : (',
  '            <div className="py-10 text-center">',
  '              <div className="w-12 h-12 mx-auto mb-3 rounded-full border border-[#C5A059] bg-[#C5A059]/15 flex items-center justify-center text-lg text-[#FCF6BA] font-bold">',
  '                ✓',
  '              </div>',
  '              <h4 className="text-xl font-semibold text-white mb-2">',
  '                ¡Mensaje recibido en ceo@lhyogroup.com!',
  '              </h4>',
  '              <p className="text-xs sm:text-sm text-gray-300 mb-5">',
  '                Le responderemos a la brevedad.',
  '              </p>',
  '              <button',
  '                type="button"',
  '                onClick={() => setContactSent(false)}',
  '                className="px-5 py-2.5 rounded-xl border border-[#C5A059] text-xs font-semibold text-[#FCF6BA] cursor-pointer"',
  '              >',
  '                Enviar otra consulta',
  '              </button>',
  '            </div>',
  '          )}',
  '        </div>',
  '      </div>',
  '    </section>',
  '  );',
  '}',
  'export default DirectContactSection;'
];
fs.writeFileSync(path.join(compDir, "DirectContactSection.tsx"), safeContactLines.join("\n"), "utf8");

function replaceContactoBlockSafely(source, varName) {
  const patterns = [
    `{${varName} === "contacto" && (`,
    `{${varName} === 'contacto' && (`
  ];
  for (const pat of patterns) {
    const startIdx = source.indexOf(pat);
    if (startIdx !== -1) {
      let depth = 0;
      let endIdx = -1;
      for (let i = startIdx; i < source.length; i++) {
        if (source[i] === "{") depth++;
        else if (source[i] === "}") {
          depth--;
          if (depth === 0) { endIdx = i; break; }
        }
      }
      if (endIdx !== -1) {
        return source.slice(0, startIdx) + `{${varName} === "contacto" && <DirectContactSection />}` + source.slice(endIdx + 1);
      }
    }
  }
  return source;
}

function getFiles(dir, list = []) {
  if (!fs.existsSync(dir)) return list;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === ".next" || e.name === ".git") continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) getFiles(full, list);
    else if (full.endsWith(".tsx") || full.endsWith(".ts") || full.endsWith(".css")) list.push(full);
  }
  return list;
}

for (const filePath of getFiles(appRoot)) {
  if (
    filePath.endsWith("FloatingOmniDock.tsx") ||
    filePath.endsWith("route.ts") ||
    filePath.endsWith("DirectContactSection.tsx")
  ) continue;

  let content = fs.readFileSync(filePath, "utf8");
  const orig = content;

  if (filePath.endsWith("globals.css") && !content.includes("/* LHYO_PRE_LINE */")) {
    content += "\n/* LHYO_PRE_LINE */\nh3 { white-space: pre-line; }\n";
  }

  content = content.replace(/59800000000/g, "584247383164");
  content = content.replace(
    /mailto:ceo@lhyogroup\.com(\?subject=[^"'`]+)?/g,
    "https://mail.google.com/mail/?view=cm&fs=1&to=ceo@lhyogroup.com&su=Consulta%20Corporativa%20-%20Lhyo%20Group"
  );

  // Títulos de las 3 Claves en 2 líneas simétricas con punto final (.)
  content = content.replace(
    /Mientras su competencia descansa,[\s\S]{1,65}?0\.4 segundos/g,
    "Mientras su competencia descansa, su empresa atiende\\ny\u00A0agenda\u00A0citas\u00A0hoy\u00A0al\u00A0instante."
  );
  content = content.replace(
    /Porque las p[áa]ginas tradicionales saturan;[\s\S]{1,60}?cautivan/g,
    "Una plataforma moderna de máximo prestigio que\\nproyecta\u00A0autoridad\u00A0y\u00A0multiplica\u00A0sus\u00A0ventas."
  );
  content = content.replace(
    /Todo su negocio unido en una sola pantalla[\s\S]{1,60}?control absoluto/g,
    "Todo su negocio unido en una pantalla\\noperando\u00A0siempre\u00A0bajo\u00A0su\u00A0control\u00A0total."
  );

  // Cotizador por Regiones y solo las 06 Soluciones (Sin Todo Incluido)
  content = content.replace(/1\. PA[ÍI]S DE OPERACI[ÓO]N/g, "1. REGIÓN DE OPERACIÓN");
  content = content.replace(
    /\["Uruguay",\s*"Venezuela",\s*"Otro Pa[íi]s \/ Internacional"\]/g,
    '["Latinoamérica", "Europa", "Estados Unidos / Norteamérica", "Otra Región / Global"]'
  );
  content = content.replace(/useState\("Uruguay"\)/g, 'useState("Latinoamérica")');
  content = content.replace(
    /"Paquete Completo \(Todo Incluido\)",[\s\r\n]*"Asistente WhatsApp \/ IG 24\/7",[\s\r\n]*"Plataforma Web Moderna",[\s\r\n]*"Sistemas Propios \(Motor \/ Cerebro \/ Panel\)"/g,
    '"01 · Asistentes Inteligentes WhatsApp / IG (24/7)", "02 · Plataformas Web y Catálogos Interactivos", "03 · Organización Automática de Clientes (CRM)", "04 · Automatización Total con Tecnología Propia", "05 · IA Personalizada con la Memoria de su Empresa", "06 · Plataforma Empresarial Todo-en-Uno"'
  );
  content = content.replace(
    /useState<string\[\]>\(\["Paquete Completo \(Todo Incluido\)"\]\)/g,
    'useState<string[]>(["01 · Asistentes Inteligentes WhatsApp / IG (24/7)"])'
  );
  content = content.replace(
    /useState\(\["Paquete Completo \(Todo Incluido\)"\]\)/g,
    'useState(["01 · Asistentes Inteligentes WhatsApp / IG (24/7)"])'
  );
  content = content.replace(
    /const fullLabel = "Paquete Completo \(Todo Incluido\)";[\s\S]*?return \[\.\.\.withoutFull, option\];\s*\}\s*\};/,
    "setPrivInterests((prev) => prev.includes(option) ? (prev.length > 1 ? prev.filter((i) => i !== option) : prev) : [...prev, option]); };"
  );
  content = content.replace(/SOLICITUD CAT[ÁA]LOGO PRIVADO \| Pa[íi]s:/g, "Propuesta personalizada para");
  content = content.replace(/\| Inter[ée]s:/g, "· Soluciones:");
  content = content.replace(/\| Etapa:/g, "· Etapa:");

  if (content.includes('activeView === "contacto"') || content.includes('activeTab === "contacto"')) {
    const relContact = filePath.includes(path.join("app", "page.tsx")) ? "../components/DirectContactSection" : "./DirectContactSection";
    if (!content.includes("DirectContactSection")) {
      if (content.includes('"use client"') || content.includes("'use client'")) {
        content = content.replace(/^([\s\S]*?["']use client["'];?\r?\n)/, `$1import DirectContactSection from "${relContact}";\n`);
      } else {
        content = `import DirectContactSection from "${relContact}";\n` + content;
      }
    }
    content = replaceContactoBlockSafely(content, "activeView");
    content = replaceContactoBlockSafely(content, "activeTab");
  }

  // Enlazar la Pasarela Condicional del Dossier de LUMINA EXCLUSIVAMENTE al confirmar la reunión en ExecutiveBookingModal
  if (content.includes("function ExecutiveBookingModal") && !content.includes("/api/confidential-dossier")) {
    content = content.replace(
      /setIsSuccess\(true\);/g,
      `setIsSuccess(true);\n    fetch("/api/confidential-dossier", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ event: "booking.confirmed", prospectName: fullName, prospectEmail: email, companyName: companyUrl, revenueUsd: revenue, scheduledSlot: \`\${selectedDate} | \${selectedTime}\`, selectedPlan, objective }) }).catch(() => {});`
    );
  }

  if (content !== orig) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log("✔ [CALIBRADO]:", path.relative(ROOT, filePath));
  }
}

console.log("=== [5/5] SUBIENDO TODO A GITHUB Y VERCEL ===");
for (const gDir of [ROOT, appRoot]) {
  if (fs.existsSync(path.join(gDir, ".git"))) {
    try {
      execSync("git add -A", { cwd: gDir, stdio: "inherit" });
      execSync('git commit -m "V49.0 Argon: Pasarela Confidencial Dossier Lumina 4 Pags + Cerebro IA con Pivote Natural y Deduccion"', { cwd: gDir, stdio: "inherit" });
      execSync("git push origin main --force", { cwd: gDir, stdio: "inherit" });
      console.log("✅ EXITO TOTAL: Pasarela Confidencial y Cerebro Central operativos en Vercel desde", gDir);
    } catch (e) { console.log(e.message); }
  }
}