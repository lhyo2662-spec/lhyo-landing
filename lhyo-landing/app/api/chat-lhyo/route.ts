import { NextResponse } from "next/server";

export const runtime = "edge";

interface ChatMsg {
  sender: "user" | "bot";
  text: string;
}

interface LeadState {
  lead_name?: string;
  company_name?: string;
  pain_point?: string;
  revenue_tier?: string;
  turn_count?: number;
}

const SYSTEM_PROMPT = `# ROL E IDENTIDAD SUPREMA
Eres el Asistente Ejecutivo Oficial de Inteligencia Artificial de Lhyo Group (https://www.lhyogroup.com), firma de arquitectura digital de prestigio, sistemas inteligentes 24/7 y automatización empresarial dirigida por su CEO, Lhyonneth Araque.

# REGLAS ESTRICTAS DE RAZONAMIENTO MULTI-TURNO
1. Habla SIEMPRE de "Usted" ("su empresa", "su negocio"). Tono ejecutivo, culto, ágil y 100% natural.
2. PROHIBIDO usar frases mecánicas o repetir entre comillas el mensaje del cliente (JAMÁS escribas "Tomando exactamente lo que me comenta sobre...").
3. Nuestras 06 Soluciones Oficiales:
   - 01: Asistentes Inteligentes para WhatsApp e Instagram (24/7)
   - 02: Plataformas Web Modernas y Catálogos Interactivos (< 0.8s)
   - 03: Organización Automática de Clientes y Ventas (CRM)
   - 04: Automatización Total de Procesos con Tecnología Propia
   - 05: Inteligencia Artificial Personalizada con la Memoria de su Empresa
   - 06: Su Propia Plataforma Empresarial Todo-en-Uno
4. CONEXIÓN INTELIGENTE DE CUALQUIER TEMA:
   - Si el cliente pregunta sobre tu programación o cómo funcionas, explica que operas sobre el motor cognitivo de doble capa de Lhyo Group y que instalamos este mismo cerebro entrenado a medida (Soluciones 01 y 05) en su empresa.
   - Si el cliente menciona cualquier tema fuera de la empresa (deportes, fútbol, clima, autos, comida, etc.), no digas una frase genérica: haz un puente elegante e ingenioso conectando ese tema con la velocidad, precisión y ventas automáticas que nuestras 06 Soluciones le brindan a su negocio.
5. Mantén respuestas breves (máximo 2 párrafos cortos) y guía la conversación con naturalidad para conocer su Nombre, su Empresa/Giro y si sus ingresos mensuales superan o no los $5,000 USD.`;

const SAFETY_PATTERNS = [
  /\b(matar|asesinar|homicid\w*|suicid\w*|sicari\w*|bomba|explosiv\w*|terroris\w*|arma\s+de\s+fuego|violaci\w*|pedofil\w*|pornograf\w*|narcotrafic\w*|coca[ií]na|hackear|clonar\s+tarjeta|maldit\w+|mierda|imb[eé]cil|idiota|hijo\s+de\s+puta|ignora\s+tus\s+instrucciones|jailbreak)\b/i
];

function checkSafetyShield(text: string): { blocked: boolean; code: string | null } {
  const clean = (text || "").trim();
  if (clean.length > 600) return { blocked: true, code: "RULE_07_MAX_LENGTH" };
  const compact = clean.replace(/\s+/g, "");
  if (compact.length >= 5 && /^(.)\1{4,}$/i.test(compact)) return { blocked: true, code: "RULE_06_FLOOD" };
  if (compact.length >= 6 && !/[aeiouáéíóú0-9]/i.test(compact) && /^[a-z]+$/i.test(compact)) {
    return { blocked: true, code: "RULE_06_KEYBOARD_SMASH" };
  }
  if (SAFETY_PATTERNS.some((rx) => rx.test(clean))) return { blocked: true, code: "RULE_01_05_SAFETY_POLICY" };
  return { blocked: false, code: null };
}

async function callGeminiOfficial(userMessage: string, history: ChatMsg[], apiKey: string) {
  if (!apiKey || !apiKey.startsWith("AIza")) throw new Error("NO_GEMINI_KEY");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3200);
  const contents = [
    ...history.slice(-10).map((m) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text }]
    })),
    { role: "user", parts: [{ text: userMessage }] }
  ];
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: { temperature: 0.35, maxOutputTokens: 260 }
      })
    }
  );
  clearTimeout(timer);
  if (!res.ok) throw new Error("GEMINI_HTTP_ERR");
  const data = await res.json();
  const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!reply) throw new Error("GEMINI_EMPTY");
  return reply;
}

async function callCloudOpenAICascade(userMessage: string, history: ChatMsg[]) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3800);
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.slice(-10).map((m) => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text
    })),
    { role: "user", content: userMessage }
  ];
  const res = await fetch("https://text.pollinations.ai/openai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: controller.signal,
    body: JSON.stringify({
      model: "openai",
      temperature: 0.35,
      messages
    })
  });
  clearTimeout(timer);
  if (!res.ok) throw new Error("CLOUD_OPENAI_ERR");
  const data = await res.json();
  const reply = data?.choices?.[0]?.message?.content?.trim();
  if (!reply) throw new Error("CLOUD_EMPTY");
  return reply;
}

function buildDeepContextualReply(userText: string, state: LeadState, turnCount: number): string {
  const clean = (userText || "").trim();
  if (/programaci[oó]n|programad\w*|c[oó]mo\s+funcionas|como\s+funcionas|quien\s+te\s+cre[oó]|qui[eé]n\s+te\s+cre[oó]|eres\s+una?\s+ia|algoritmo/i.test(clean)) {
    return "Opero sobre la arquitectura cognitiva de doble motor de Lhyo Group, diseñada bajo la dirección de nuestro CEO, Lhyonneth Araque. Analizo el contexto de cada mensaje en tiempo real, mantengo la memoria de toda nuestra conversación y me conecto directamente con nuestra agenda y CRM corporativo.\n\nEsta misma tecnología (Soluciones 01 y 05: Asistentes Inteligentes 24/7 e IA con la Memoria Privada de su Empresa) es la que instalamos en su negocio para atender y vender día y noche. ¿En qué giro empresarial le gustaría implementarla y con quién tengo el gusto?";
  }
  if (/carro\w*|auto\w*|veh[ií]culo\w*|motor\w*|ferrari|porsche|tesla/i.test(clean)) {
    return "La precisión de un motor de alto rendimiento es comparable a lo que construimos en Lhyo Group. Aunque no fabricamos vehículos, diseñamos la infraestructura tecnológica que acelera las operaciones y ventas de su empresa las 24 horas mediante Plataformas Web (<0.8s), Asistentes IA 24/7 y Automatización Propia.\n\n¿Con quién tengo el gusto y a qué se dedica su empresa?";
  }
  if (/hamburgues\w*|restauran\w*|comid\w*|pizz\w*|men[uú]|delivery|gastronom\w*/i.test(clean)) {
    return "En gastronomía o venta de hamburguesas, la mayor fuga de ventas ocurre en las horas pico cuando el cliente espera por el menú o la confirmación en WhatsApp. Con nuestra Solución 02 (Plataforma Web con Catálogo Interactivo) y nuestra Solución 01 (Asistente IA 24/7 en WhatsApp e Instagram), su negocio toma pedidos y pagos en automático en segundos.\n\n¿Con quién tengo el gusto y cómo se llama su negocio?";
  }
  if (/barber\w*|peluquer\w*|est[eé]tic\w*|cl[ií]nic\w*|sedes|m[eé]dic\w*|odont\w*|salud|consultorio|paciente\w*/i.test(clean)) {
    return "En clínicas, centros estéticos y negocios por citas, tardar en responder WhatsApp significa turnos vacíos que se van a la competencia. Con nuestras Soluciones 01 (Asistentes 24/7), 03 (CRM Automático) y 06 (Plataforma Todo-en-Uno), sus clientes consultan horarios y agendan en menos de 1 segundo.\n\n¿Con quién tengo el gusto y supera actualmente su facturación mensual los $5,000 USD?";
  }
  if (/futbol|f[uú]tbol|manchester|madrid|barcelona|messi|b[eé]isbol|partido|clima|lluvia|chiste|pel[ií]cula/i.test(clean)) {
    return "Aunque no cubro marcadores deportivos ni entretenimiento porque mi núcleo está dedicado 100% a la ingeniería empresarial de Lhyo Group, en los negocios aplica la misma regla que en la alta competencia: gana quien responde más rápido y tiene mejor estructura.\n\nCon nuestras 06 Soluciones (Asistentes IA 24/7, Plataformas Web de alto prestigio y Sistemas Todo-en-Uno) hacemos que su empresa lidere su sector. ¿Con quién tengo el gusto y qué negocio o proyecto dirige?";
  }
  if (/precio\w*|costo\w*|cu[aá]nto|tarifa\w*|valor|presupuesto/i.test(clean)) {
    return "Cada implementación en Lhyo Group se diseña a la medida de la etapa y tamaño de su empresa (atendemos tanto a empresas consolidadas como a negocios en crecimiento).\n\nEn una breve videollamada ejecutiva de 15 minutos con nuestro CEO le entregamos el presupuesto exacto para su país y nuestro Catálogo Privado PDF. ¿Cuál es su nombre, a qué se dedica su empresa y qué área desea impulsar primero?";
  }
  if (/qu[eé]\s+hacen|que\s+hacen|qu[eé]\s+ofrecen|que\s+ofrecen|soluciones|servicios|cat[aá]logo/i.test(clean)) {
    return "En Lhyo Group desarrollamos e instalamos 06 Soluciones tecnológicas de última generación:\n\n01. Asistentes Inteligentes 24/7 para WhatsApp e Instagram\n02. Plataformas Web Modernas y Catálogos Interactivos (<0.8s)\n03. Organización Automática de Clientes y Ventas (CRM)\n04. Automatización Total con Tecnología Propia\n05. IA Personalizada con la Memoria de su Empresa\n06. Su Propia Plataforma Empresarial Todo-en-Uno\n\n¿Cuál de estas soluciones le gustaría implementar en su negocio y con quién tengo el gusto?";
  }
  const pool = [
    "En Lhyo Group transformamos la atención y las operaciones de su negocio mediante Plataformas Web ultrarrápidas, Asistentes Inteligentes 24/7 en WhatsApp e Instagram y Sistemas Todo-en-Uno.\n\nPara brindarle una recomendación exacta para su caso, cuénteme: ¿con quién tengo el gusto y a qué se dedica su empresa?",
    "Todo negocio que busca crecer sin cuellos de botella necesita que sus consultas en WhatsApp, Instagram y su Web se atiendan, clasifiquen y agenden en menos de 1 segundo las 24 horas.\n\n¿Me podría indicar su nombre y qué área de su negocio desea automatizar o mejorar primero?",
    "Para que nuestro sistema clasifique su solicitud y le asigne la propuesta ideal según la escala actual de su operación: ¿actualmente los ingresos mensuales de su negocio superan los $5,000 USD o se encuentran en una etapa inicial/menor a ese rango?"
  ];
  return pool[(turnCount - 1) % pool.length];
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userMessage = (body.message || "").trim();
    const history: ChatMsg[] = Array.isArray(body.history) ? body.history : [];
    const currentLead: LeadState = body.currentLead || {};
    const turnCount = (currentLead.turn_count || 0) + 1;

    const shield = checkSafetyShield(userMessage);
    if (shield.blocked) {
      return NextResponse.json({
        reply:
          "⛔ PROTOCOLO DE SEGURIDAD ACTIVADO (" +
          shield.code +
          "): Su mensaje infringe las normas de integridad de la infraestructura cognitiva de Lhyo Group. Esta sesión ha sido bloqueada permanentemente (escritura y micrófono deshabilitados).",
        ...currentLead,
        turn_count: turnCount,
        ready_for_crm: false,
        blocked: true
      });
    }

    const nextState: LeadState = {
      lead_name: currentLead.lead_name || "PENDIENTE",
      company_name: currentLead.company_name || "PENDIENTE",
      pain_point: currentLead.pain_point || "PENDIENTE",
      revenue_tier: currentLead.revenue_tier || "PENDIENTE",
      turn_count: turnCount
    };

    const nameMatch = userMessage.match(
      /(?:me llamo|mi nombre es|soy|habla)\s+([A-ZÁÉÍÓÚÑa-záéíóúñ]{2,20}(?:\s+[A-ZÁÉÍÓÚÑa-záéíóúñ]{2,20})?)/i
    );
    if (nameMatch && nameMatch[1] && !/^(un|una|el|la|de|del|cliente)$/i.test(nameMatch[1])) {
      nextState.lead_name = nameMatch[1].trim();
    }

    const bizMatch = userMessage.match(
      /(?:tengo\s+un[a]?\s+|vendo\s+|mi\s+empresa\s+es\s+|negocio\s+de\s+|dedico\s+a\s+|somos\s+un[a]?\s+)([^.,;?\n]{3,45})/i
    );
    if (bizMatch && bizMatch[1]) {
      nextState.company_name = bizMatch[1].trim();
      if (nextState.pain_point === "PENDIENTE") nextState.pain_point = userMessage.slice(0, 90);
    }

    if (
      (nextState.lead_name !== "PENDIENTE" || nextState.company_name !== "PENDIENTE" || turnCount >= 2) &&
      nextState.revenue_tier === "PENDIENTE" &&
      /\b(supera\w*|m[aá]s\s+de|menos\s+de|etapa\s+inicial|empezando|5000|5,000|10000|2000|1000|3000|8000)\b/i.test(
        userMessage
      )
    ) {
      const isHigh = /\b(supera\w*|m[aá]s|5000|5,000|6000|8000|10000)\b/i.test(userMessage);
      nextState.revenue_tier = isHigh ? "HIGH_TICKET" : "LOW_TICKET";

      const nowVe = new Date().toLocaleString("es-VE", { timeZone: "America/Caracas" });
      await fetch("https://hook.us2.make.com/krs48cjfzudf4lau3sapwdgdu9lfe1tb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fecha_registro: nowVe,
          horario_cita: "Calificado en Chat IA Multi-Turno V40",
          nombre_cliente: nextState.lead_name,
          email_cliente: "Captado en Chat IA Web",
          empresa_web: nextState.company_name,
          facturacion_usd: nextState.revenue_tier,
          clasificacion: nextState.revenue_tier,
          servicio_elegido: `ASISTENTE IA V40 (${nextState.revenue_tier})`,
          objetivo_cliente: nextState.pain_point,
          resumen_crm: `ETIQUETA OCULTA: ${nextState.revenue_tier} || Empresa: ${nextState.company_name} || Necesidad: ${nextState.pain_point}`,
          link_videollamada_meet: "https://meet.google.com/krc-vdii-zzh"
        })
      }).catch(() => {});

      return NextResponse.json({
        ...nextState,
        ready_for_crm: true,
        blocked: false,
        reply: `Excelente${
          nextState.lead_name !== "PENDIENTE" ? `, ${nextState.lead_name}` : ""
        }. He registrado formalmente la solicitud de su empresa en el sistema central de Lhyo Group.\n\nToque el botón dorado de abajo para elegir el día y la hora de su preferencia en nuestra Agenda Ejecutiva y descargar de inmediato nuestro Catálogo Privado PDF con las 06 Soluciones Oficiales.`
      });
    }

    let replyText = "";
    const geminiKey = process.env.GEMINI_API_KEY || "";

    try {
      replyText = await callGeminiOfficial(userMessage, history, geminiKey);
    } catch {
      try {
        replyText = await callCloudOpenAICascade(userMessage, history);
      } catch {
        replyText = buildDeepContextualReply(userMessage, nextState, turnCount);
      }
    }

    return NextResponse.json({
      ...nextState,
      reply: replyText,
      ready_for_crm: false,
      blocked: false
    });
  } catch {
    return NextResponse.json({
      reply:
        "En Lhyo Group diseñamos plataformas web de alto prestigio, asistentes inteligentes 24/7 y sistemas Todo-en-Uno para escalar su negocio. ¿Con quién tengo el gusto y a qué se dedica su empresa?",
      ready_for_crm: false,
      blocked: false
    });
  }
}
