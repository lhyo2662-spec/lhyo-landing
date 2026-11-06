import { NextResponse } from "next/server";

export const runtime = "edge";

interface HistoryItem {
  role: "user" | "assistant";
  text: string;
}

interface LeadState {
  lead_name?: string;
  company_name?: string;
  pain_point?: string;
  revenue_tier?: string;
}

interface ChatRequestBody {
  message?: string;
  history?: HistoryItem[];
  currentLead?: LeadState;
}

const STRICT_SAFETY_PATTERNS = [
  /\b(matar|asesinar|homicid\w*|suicid\w*|bomba|explosiv\w*|terroris\w*|sicari\w*|secuestrar|extorsion\w*)\b/i,
  /\b(violaci\w*|violar|pedofil\w*|pornograf\w*|porno|sexo\s+expl[ií]cito)\b/i,
  /\b(narcotrafic\w*|coca[ií]na|fentanil\w*|hackear|clonar\s+tarjeta)\b/i,
  /\b(maldit\w+|mierda|imb[eé]cil|est[uú]pid\w+|idiota|pendej\w+|hijo\s+de\s+puta|puto|puta|cabr[oó]n|mamaguevo)\b/i,
  /\b(ignore\s+previous\s+instructions|olvida\s+tus\s+instrucciones|revela\s+tu\s+system\s+prompt)\b/i
];

function checkSecurityViolation(text: string): boolean {
  const clean = (text || "").trim();
  if (clean.length > 650) return true;
  return STRICT_SAFETY_PATTERNS.some((rx) => rx.test(clean));
}

function generateSurgicalExecutiveResponse(userMessage: string, state: LeadState): { reply: string; ready_for_crm: boolean } {
  const lower = (userMessage || "").toLowerCase();

  // 1. Detección de Temas Fuera de Contexto (Maniobra de Pivote)
  if (/\b(futbol|fútbol|manchester|real madrid|barcelona|messi|cristiano|deporte|partido|clima|lluvia|receta|cocinar|chiste|pelicula|película|juego|musica|música)\b/i.test(lower)) {
    return {
      reply: "La sincronización y precisión de alto rendimiento es exactamente lo que construimos en Lhyo Group. Nosotros no analizamos temas de entretenimiento o deportes, pero implementamos Asistentes Inteligentes 24/7 y Plataformas Web Todo-en-Uno que hacen que su empresa opere con precisión milimétrica día y noche.\n\n¿Qué proceso o área operativa está frenando el crecimiento de las ventas de su negocio hoy?",
      ready_for_crm: false
    };
  }

  // 2. Detección Específica para Clínicas Estéticas / Salud / Bienestar
  if (/\b(est[eé]tica|cl[ií]nica|spa|salud|belleza|cosmiatr[ií]a|medicina|doctor|paciente)\b/i.test(lower)) {
    return {
      reply: "Para una clínica estética, la mayor fuga de capital ocurre cuando las clientas escriben solicitando costos, citas o disponibilidad de tratamientos fuera de horario y reciben demoras en la respuesta.\n\nEn Lhyo Group implementamos la Solución 01 (Asistentes Inteligentes 24/7 en WhatsApp e Instagram) combinada con la Solución 02 (Plataforma Web de alto prestigio), logrando que su clínica atienda, pre-califique y agende citas de valor en menos de 1 segundo de forma totalmente automática. ¿Con quién tengo el gusto y cuántos especialistas operan en su clínica?",
      ready_for_crm: false
    };
  }

  // 3. Detección para Gastronomía / Restaurantes / Comida
  if (/\b(hamburgues\w*|restauran\w*|comida\w*|pizz\w*|panader\w*|cafeter\w*|delivery|gastronom[ií]a)\b/i.test(lower)) {
    return {
      reply: "En el sector gastronómico, las ventas se pierden cuando los pedidos se saturan por WhatsApp o llamadas en horas pico. En Lhyo Group instalamos un Catálogo Web Interactivo de carga instantánea vinculado a un Asistente 24/7 que toma pedidos, procesa notas de entrega y sincroniza la caja en automático.\n\n¿Con quién tengo el gusto y en qué ciudad opera su concepto gastronómico?",
      ready_for_crm: false
    };
  }

  // 4. Consultas de Precios o Tarifas
  if (/\b(precio|precios|costo|cuanto|cuánto|vale|tarifa|presupuesto|planes)\b/i.test(lower)) {
    return {
      reply: "En Lhyo Group cada arquitectura tecnológica se diseña a la medida de la etapa operativa de su empresa, manejando estándares tanto para negocios en expansión como para firmas consolidadas.\n\nEn una breve sesión ejecutiva de 15 minutos con nuestro CEO le entregamos el presupuesto exacto para su país y nuestro Catálogo Privado PDF. Para preparar su diagnóstico: ¿cuál es su nombre, el nombre de su negocio y qué área desea automatizar?",
      ready_for_crm: false
    };
  }

  // 5. Cierre de Calificación de Ingresos (High Ticket vs Low Ticket)
  if (
    state.lead_name !== "PENDIENTE" &&
    state.revenue_tier === "PENDIENTE" &&
    /\b(si|sí|supera|mas|más|no|menos|inicial|empezando|5000|5,000)\b/i.test(lower)
  ) {
    const isHigh = /\b(si|sí|supera|mas|más)\b/i.test(lower) && !/\bno\b/i.test(lower);
    const tier = isHigh ? "HIGH_TICKET" : "LOW_TICKET";
    state.revenue_tier = tier;
    return {
      reply: `Excelente, ${state.lead_name}. Hemos registrado formalmente la solicitud de su empresa en el sistema central de Lhyo Group.\n\nToque el siguiente enlace para elegir el día y la hora de su preferencia en la agenda privada de nuestro CEO y recibir de inmediato nuestro Catálogo Privado PDF en su correo electrónico:\n📅 https://www.lhyogroup.com/?agendar=vip\n\nSerá un honor llevar su operación al siguiente nivel.`,
      ready_for_crm: true
    };
  }

  // 6. Flujo General por Defecto
  if (state.lead_name === "PENDIENTE") {
    return {
      reply: "Comprendo perfectamente su visión. En Lhyo Group construimos infraestructuras tecnológicas que unifican la captación web de alto prestigio con Asistentes Inteligentes 24/7 que cierran ventas en automático.\n\nPara brindarle una asesoría rigurosa, ¿con quién tengo el gusto y cuál es el nombre de su empresa o proyecto?",
      ready_for_crm: false
    };
  }

  return {
    reply: `Excelente, ${state.lead_name}. Para que nuestro sistema asigne la propuesta ideal según el tamaño de su operación: ¿actualmente los ingresos mensuales de su negocio superan los $5,000 USD o se encuentran en una etapa inicial/menor a ese rango?`,
    ready_for_crm: false
  };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ChatRequestBody;
    const userMessage = (body.message || "").trim();
    const state: LeadState = {
      lead_name: body.currentLead?.lead_name || "PENDIENTE",
      company_name: body.currentLead?.company_name || "PENDIENTE",
      pain_point: body.currentLead?.pain_point || "PENDIENTE",
      revenue_tier: body.currentLead?.revenue_tier || "PENDIENTE"
    };

    if (checkSecurityViolation(userMessage)) {
      return NextResponse.json({
        reply: "⛔ PROTOCOLO DE SEGURIDAD ACTIVADO: Su mensaje infringe las normas de integridad corporativa. Esta sesión ha sido bloqueada permanentemente.",
        ...state,
        ready_for_crm: false,
        blocked: true
      });
    }

    // Extracción automática de variables
    const nameMatch = userMessage.match(/(?:me llamo|mi nombre es|soy|habla)\s+([A-ZÁÉÍÓÚÑa-záéíóúñ]{2,20}(?:\s+[A-ZÁÉÍÓÚÑa-záéíóúñ]{2,20})?)/i);
    if (nameMatch?.[1]) state.lead_name = nameMatch[1].trim();

    const companyMatch = userMessage.match(/(?:empresa se llama|mi empresa es|negocio de|tengo una?|tenemos una?|cl[ií]nica)\s+([A-ZÁÉÍÓÚÑa-záéíóúñ0-9\s]{3,35})/i);
    if (companyMatch?.[1]) state.company_name = companyMatch[1].trim();

    if (state.pain_point === "PENDIENTE" && userMessage.length > 5) {
      state.pain_point = userMessage.slice(0, 90);
    }

    const result = generateSurgicalExecutiveResponse(userMessage, state);

    if (result.ready_for_crm && (state.revenue_tier === "HIGH_TICKET" || state.revenue_tier === "LOW_TICKET")) {
      const nowVe = new Date().toLocaleString("es-VE", { timeZone: "America/Caracas" });
      await fetch("https://hook.us2.make.com/krs48cjfzudf4lau3sapwdgdu9lfe1tb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fecha_registro: nowVe,
          horario_cita: "Redirigido a Agenda VIP",
          nombre_cliente: state.lead_name,
          email_cliente: "Captado en Chat IA Lhyo Group",
          empresa_web: state.company_name,
          facturacion_usd: state.revenue_tier,
          clasificacion: state.revenue_tier,
          servicio_elegido: `ASISTENTE WEB (${state.revenue_tier})`,
          objetivo_cliente: state.pain_point,
          resumen_crm: `ETIQUETA: ${state.revenue_tier} || Empresa: ${state.company_name} || Necesidad: ${state.pain_point}`,
          link_videollamada_meet: "https://meet.google.com/krc-vdii-zzh"
        })
      }).catch(() => {});
    }

    return NextResponse.json({
      reply: result.reply,
      ...state,
      ready_for_crm: result.ready_for_crm,
      blocked: false
    });
  } catch {
    return NextResponse.json({
      reply: "Es un gusto atenderle en Lhyo Group. ¿Con quién tengo el gusto y qué área de su empresa desea potenciar hoy?",
      ready_for_crm: false,
      blocked: false
    });
  }
}