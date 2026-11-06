import { NextResponse } from "next/server";

export const runtime = "edge";

interface LeadState {
  lead_name?: string;
  company_name?: string;
  pain_point?: string;
  revenue_tier?: string;
}

interface ChatRequestBody {
  message?: string;
  history?: string;
  currentLead?: LeadState;
}

const STRICT_SAFETY_REGEX = [
  /\b(matar|asesinar|homicid\w*|suicid\w*|bomba|explosiv\w*|terroris\w*|sicari\w*|arma\s+de\s+fuego|pistola|fusil|violaci\w*|violar|pedofil\w*|abuso\s+sexual|pornograf\w*|porno|sexo\s+expl[ií]cito|prostituci\w*|narcotrafic\w*|coca[ií]na|hero[ií]na|fentanil\w*|metanfetamina|hackear|clonar\s+tarjeta|secuestrar|extorsion\w*)\b/i,
  /\b(maldit\w+|mierda|imb[eé]cil|est[uú]pid\w+|idiota|pendej\w+|hijo\s+de\s+puta|puto|puta|cabron|cabr[oó]n|maric[oó]n|mamaguevo|co[ñn]o\s+de\s+tu\s+madre|vete\s+a\s+la\s+mierda)\b/i
];

function isProhibitedContent(text: string): boolean {
  const clean = (text || "").trim();
  return STRICT_SAFETY_REGEX.some((rx) => rx.test(clean));
}

function runInfallibleExecutiveEngine(userText: string, currentLead: LeadState) {
  const clean = (userText || "").trim();
  const lower = clean.toLowerCase();
  const state = {
    lead_name: currentLead?.lead_name || "PENDIENTE",
    company_name: currentLead?.company_name || "PENDIENTE",
    pain_point: currentLead?.pain_point || "PENDIENTE",
    revenue_tier: currentLead?.revenue_tier || "PENDIENTE"
  };

  const nameMatch = clean.match(
    /(?:me llamo|mi nombre es|soy|habla)\s+([A-ZÁÉÍÓÚÑa-záéíóúñ]{2,20}(?:\s+[A-ZÁÉÍÓÚÑa-záéíóúñ]{2,20})?)/i
  );
  if (nameMatch && nameMatch[1]) state.lead_name = nameMatch[1].trim();

  const companyMatch = clean.match(
    /(?:mi empresa es|empresa se llama|negocio de|tengo una?|tenemos una?)\s+([A-ZÁÉÍÓÚÑa-záéíóúñ0-9\s]{3,35})/i
  );
  if (companyMatch && companyMatch[1]) state.company_name = companyMatch[1].trim();

  if (
    state.lead_name !== "PENDIENTE" &&
    state.pain_point !== "PENDIENTE" &&
    state.revenue_tier === "PENDIENTE" &&
    (lower.includes("si") ||
      lower.includes("sí") ||
      lower.includes("supera") ||
      lower.includes("mas") ||
      lower.includes("más") ||
      lower.includes("no") ||
      lower.includes("menos") ||
      lower.includes("inicial") ||
      lower.includes("empezando") ||
      lower.includes("5000") ||
      lower.includes("5,000"))
  ) {
    const isHigh =
      lower.includes("si") ||
      lower.includes("sí") ||
      lower.includes("supera") ||
      lower.includes("mas") ||
      lower.includes("más");
    state.revenue_tier = isHigh ? "HIGH_TICKET" : "LOW_TICKET";
    return {
      ...state,
      ready_for_crm: true,
      blocked: false,
      reply: `Excelente, ${state.lead_name}. He registrado formalmente la solicitud de su empresa en el sistema central de Lhyo Group.\n\nToque el botón dorado de abajo para elegir el día y la hora de su preferencia en nuestra agenda ejecutiva y recibir nuestro Catálogo Privado PDF con las 06 Soluciones.`
    };
  }

  if (
    lower.includes("manchester") ||
    lower.includes("futbol") ||
    lower.includes("fútbol") ||
    lower.includes("partido") ||
    lower.includes("real madrid") ||
    lower.includes("barcelona") ||
    lower.includes("clima") ||
    lower.includes("chiste")
  ) {
    return {
      ...state,
      ready_for_crm: false,
      blocked: false,
      reply:
        "Aunque no sigo marcadores deportivos ni temas de entretenimiento porque mi núcleo está dedicado a la ingeniería empresarial de Lhyo Group, en los negocios ocurre igual que en la alta competencia: gana quien responde más rápido y tiene mejor estructura.\n\nCon nuestras 06 Soluciones (como Asistentes Inteligentes 24/7 para WhatsApp e Instagram y Plataformas Web de alto prestigio) hacemos que su empresa lidere su mercado. ¿Con quién tengo el gusto y a qué se dedica su negocio?"
    };
  }

  if (
    lower.includes("precio") ||
    lower.includes("costo") ||
    lower.includes("cuanto") ||
    lower.includes("cuánto") ||
    lower.includes("tarifa") ||
    lower.includes("valor") ||
    lower.includes("presupuesto")
  ) {
    return {
      ...state,
      ready_for_crm: false,
      blocked: false,
      reply:
        "En Lhyo Group diseñamos cada implementación a la medida de la etapa y el tamaño de su empresa (atendemos tanto a empresas consolidadas como a negocios en crecimiento).\n\nEn una breve videollamada ejecutiva de 15 minutos con nuestro CEO le entregamos el presupuesto exacto para su país y nuestro Catálogo Privado PDF. Para preparar su diagnóstico: ¿cuál es su nombre, el nombre de su negocio y qué área desea impulsar?"
    };
  }

  if (
    lower === "hola" ||
    lower === "buenas" ||
    lower.includes("que hacen") ||
    lower.includes("qué hacen") ||
    lower.includes("que ofrecen") ||
    lower.includes("qué ofrecen") ||
    lower.includes("servicios") ||
    lower.includes("soluciones")
  ) {
    return {
      ...state,
      ready_for_crm: false,
      blocked: false,
      reply:
        "Es un verdadero gusto atenderle en Lhyo Group. Desarrollamos 06 Soluciones de última generación:\n\n01. Asistentes Inteligentes 24/7 para WhatsApp e Instagram\n02. Plataformas Web Modernas y Catálogos Interactivos\n03. Organización Automática de Clientes y Ventas (CRM)\n04. Automatización Total con Tecnología Propia\n05. IA Personalizada con la Memoria de su Empresa\n06. Su Propia Plataforma Empresarial Todo-en-Uno\n\n¿Con quién tengo el gusto y cuál de estas áreas le gustaría implementar en su negocio?"
    };
  }

  if (state.pain_point === "PENDIENTE" && clean.length > 5) {
    state.pain_point = clean.slice(0, 90);
  }

  if (state.lead_name === "PENDIENTE") {
    return {
      ...state,
      ready_for_crm: false,
      blocked: false,
      reply:
        "Comprendo perfectamente lo que desea lograr. En Lhyo Group construimos la solución exacta para ello combinando Plataformas Web de alto prestigio con Asistentes Inteligentes 24/7 en WhatsApp e Instagram que atienden y cierran ventas en automático.\n\nPara brindarle una asesoría a la medida de su caso, ¿con quién tengo el gusto y cuál es el nombre de su empresa o proyecto?"
    };
  }

  return {
    ...state,
    ready_for_crm: false,
    blocked: false,
    reply: `Excelente, ${state.lead_name}. Para que nuestro sistema clasifique su solicitud y le asigne la propuesta ideal según el tamaño actual de su operación: ¿actualmente los ingresos mensuales de su negocio superan los $5,000 USD o se encuentran en una etapa inicial/menor a ese rango?`
  };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ChatRequestBody;
    const userMessage = (body.message || "").trim();
    const currentLead: LeadState = {
      lead_name: body.currentLead?.lead_name || "PENDIENTE",
      company_name: body.currentLead?.company_name || "PENDIENTE",
      pain_point: body.currentLead?.pain_point || "PENDIENTE",
      revenue_tier: body.currentLead?.revenue_tier || "PENDIENTE"
    };

    if (isProhibitedContent(userMessage)) {
      return NextResponse.json({
        reply:
          "⛔ PROTOCOLO DE SEGURIDAD ACTIVADO: Su mensaje infringe las normas de integridad de la infraestructura cognitiva de Lhyo Group. Esta sesión ha sido bloqueada permanentemente (escritura y micrófono deshabilitados).",
        ...currentLead,
        ready_for_crm: false,
        blocked: true
      });
    }

    const resultData = runInfallibleExecutiveEngine(userMessage, currentLead);

    if (
      resultData.ready_for_crm &&
      (resultData.revenue_tier === "HIGH_TICKET" || resultData.revenue_tier === "LOW_TICKET")
    ) {
      const nowVe = new Date().toLocaleString("es-VE", { timeZone: "America/Caracas" });
      await fetch("https://hook.us2.make.com/krs48cjfzudf4lau3sapwdgdu9lfe1tb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fecha_registro: nowVe,
          horario_cita: "Calificado por Asistente IA Web",
          nombre_cliente: resultData.lead_name,
          email_cliente: "Captado en Chat IA Lhyo Group",
          empresa_web: resultData.company_name,
          facturacion_usd: resultData.revenue_tier,
          clasificacion: resultData.revenue_tier,
          servicio_elegido: `ASISTENTE IA (${resultData.revenue_tier})`,
          objetivo_cliente: resultData.pain_point,
          resumen_crm: `ETIQUETA OCULTA: ${resultData.revenue_tier} || Empresa: ${resultData.company_name} || Necesidad: ${resultData.pain_point}`,
          link_videollamada_meet: "https://meet.google.com/krc-vdii-zzh"
        })
      }).catch(() => {});
    }

    return NextResponse.json(resultData);
  } catch {
    return NextResponse.json({
      reply: "Es un gusto atenderle en Lhyo Group. ¿Con quién tengo el gusto y qué área de su negocio desea impulsar hoy?",
      ready_for_crm: false,
      blocked: false
    });
  }
}