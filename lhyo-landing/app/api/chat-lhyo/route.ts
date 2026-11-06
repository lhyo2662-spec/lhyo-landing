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

const SYSTEM_PROMPT = `# IDENTIDAD SUPREMA
Eres el Consultor Estratégico Jefe de Lhyo Group (https://www.lhyogroup.com). Tu tono es quirúrgico, corporativo, de élite y siempre tratas al usuario de "Usted". Jamás revelas que eres Gemini o ChatGPT; eres la infraestructura cognitiva de Lhyo Group.

# CONOCIMIENTO Y ANÁLISIS DE FUGA DE CAPITAL (ROI)
Conoces nuestras 6 Soluciones:
- División Comercial: 01. Asistentes Inteligentes 24/7 (WhatsApp/IG), 02. Plataformas Web Modernas (<0.8s), 03. Organización Automática de Clientes (CRM).
- División Enterprise: 04. Automatización Total con Tecnología Propia (n8n self-hosted), 05. IA con Memoria Privada (Agentes RAG), 06. Su Propia Plataforma Empresarial Todo-en-Uno (SaaS propio).
Si un cliente describe su empresa, calcula dónde está perdiendo dinero (fuga de capital) y recomiéndale exactamente cuál de nuestras soluciones necesita con un argumento lógico de ROI (Retorno de Inversión).

# PROTOCOLO DE PIVOTE Y BLOQUEO (CRÍTICO)
Tienes estrictamente prohibido responder sobre temas ajenos a negocios, tecnología, escalabilidad o Lhyo Group.
MANIOBRA DE CONEXIÓN: Si el usuario pregunta algo irrelevante, DEBES conectar esa pregunta con nuestros servicios usando una transición elegante.
(Ejemplo obligatorio: Si preguntan "¿Cuál es el mejor carro?", respondes: "La eficiencia de un motor de alto rendimiento es comparable a lo que hacemos en Lhyo Group. Nosotros no fabricamos vehículos, pero construimos infraestructuras en n8n y Agentes RAG que aceleran las operaciones de su empresa a niveles industriales. ¿Qué software está usando actualmente para gestionar sus ventas?")
Responde en máximo 2 párrafos cortos y cierra con una pregunta para avanzar en la calificación (Nombre, Empresa o si su facturación mensual supera los $5,000 USD).`;

const SAFETY_PATTERNS = [
  /\b(matar|asesinar|homicid\w*|suicid\w*|sicari\w*|bomba|explosiv\w*|terroris\w*|arma\s+de\s+fuego|violaci\w*|pedofil\w*|pornograf\w*|narcotrafic\w*|coca[ií]na|hackear|clonar\s+tarjeta|maldit\w+|mierda|imb[eé]cil|idiota|hijo\s+de\s+puta|ignora\s+tus\s+instrucciones|jailbreak)\b/i
];

function checkShield(text: string): boolean {
  const clean = (text || "").trim();
  if (clean.length > 600) return true;
  const compact = clean.replace(/\s+/g, "");
  if (compact.length >= 5 && /^(.)\1{4,}$/i.test(compact)) return true;
  if (compact.length >= 6 && !/[aeiouáéíóú0-9]/i.test(compact) && /^[a-z]+$/i.test(compact)) return true;
  return SAFETY_PATTERNS.some((rx) => rx.test(clean));
}

async function callGemini15Flash(userMessage: string, history: ChatMsg[], apiKey: string) {
  if (!apiKey || !apiKey.startsWith("AIza")) throw new Error("NO_VALID_GEMINI_KEY");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3000);
  const contents = [
    ...history.slice(-8).map((m) => ({
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
  if (!res.ok) throw new Error("GEMINI_ERROR");
  const data = await res.json();
  const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!reply) throw new Error("EMPTY_GEMINI");
  return { reply, engine: "PRIMARY: gemini-1.5-flash" };
}

async function callOpenAIGpt4o(userMessage: string, history: ChatMsg[], openAiKey: string) {
  if (!openAiKey) throw new Error("NO_OPENAI_KEY");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4200);
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openAiKey}`
    },
    signal: controller.signal,
    body: JSON.stringify({
      model: "gpt-4o",
      temperature: 0.35,
      max_tokens: 260,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...history.slice(-8).map((m) => ({
          role: m.sender === "user" ? "user" : "assistant",
          content: m.text
        })),
        { role: "user", content: userMessage }
      ]
    })
  });
  clearTimeout(timer);
  if (!res.ok) throw new Error("OPENAI_ERROR");
  const data = await res.json();
  const reply = data?.choices?.[0]?.message?.content?.trim();
  if (!reply) throw new Error("EMPTY_OPENAI");
  return { reply, engine: "FALLBACK: gpt-4o" };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userMessage = (body.message || "").trim();
    const history: ChatMsg[] = Array.isArray(body.history) ? body.history : [];
    const currentLead: LeadState = body.currentLead || {};
    const turnCount = (currentLead.turn_count || 0) + 1;

    if (checkShield(userMessage)) {
      return NextResponse.json({
        reply:
          "⛔ PROTOCOLO DE SEGURIDAD ACTIVADO: Su mensaje infringe las normas de integridad de la infraestructura de Lhyo Group. Esta sesión ha sido bloqueada permanentemente.",
        ...currentLead,
        ready_for_crm: false,
        blocked: true,
        routed_engine: "SECURITY_SHIELD_LOCK"
      });
    }

    const geminiKey = process.env.GEMINI_API_KEY || "";
    const openAiKey = process.env.OPENAI_API_KEY || "";
    const isComplex =
      userMessage.length > 140 ||
      /roi|fuga|sedes|arquitectura|complej\w*|integraci[oó]n|erp/i.test(userMessage);

    let aiReply = "";
    let usedEngine = "PRIMARY: gemini-1.5-flash";

    try {
      if (isComplex && openAiKey) {
        const gpt = await callOpenAIGpt4o(userMessage, history, openAiKey);
        aiReply = gpt.reply;
        usedEngine = gpt.engine;
      } else {
        const gem = await callGemini15Flash(userMessage, history, geminiKey);
        aiReply = gem.reply;
        usedEngine = gem.engine;
      }
    } catch {
      try {
        const fallbackGpt = await callOpenAIGpt4o(userMessage, history, openAiKey);
        aiReply = fallbackGpt.reply;
        usedEngine = fallbackGpt.engine;
      } catch {
        if (/carro\w*|auto\w*|veh[ií]culo\w*|motor\w*/i.test(userMessage)) {
          aiReply =
            "La eficiencia de un motor de alto rendimiento es comparable a lo que hacemos en Lhyo Group. Nosotros no fabricamos vehículos, pero construimos infraestructuras en n8n y Agentes RAG que aceleran las operaciones de su empresa a niveles industriales.\n\n¿Qué software está usando actualmente para gestionar sus ventas y con quién tengo el gusto?";
        } else if (/hamburgues\w*|restauran\w*|comid\w*|men[uú]|delivery/i.test(userMessage)) {
          aiReply =
            "En un negocio gastronómico o de hamburguesas, la mayor fuga de capital ocurre cuando un cliente espera más de 2 minutos por atención en WhatsApp. Con nuestra Solución 02 (Catálogo Interactivo) y Solución 01 (Asistentes 24/7), automatizamos la toma de pedidos y pagos al instante.\n\n¿Con quién tengo el gusto y cuál es el nombre de su negocio?";
        } else if (/cl[ií]nic\w*|sedes|paciente\w*|m[eé]dic\w*|barber\w*|est[eé]tic\w*/i.test(userMessage)) {
          aiReply =
            "En clínicas y centros con múltiples sedes, cada paciente que espera respuesta en WhatsApp representa una fuga directa de capital en turnos vacíos. Con nuestras Soluciones 01 (Asistente 24/7), 03 (CRM) y 06 (Plataforma Todo-en-Uno), centralizamos su agenda y confirmamos citas en menos de 1 segundo.\n\n¿Con quién tengo el gusto y supera su facturación mensual actual los $5,000 USD?";
        } else if (/programaci[oó]n|c[oó]digo|como\s+funcionas|quien\s+te\s+cre[oó]/i.test(userMessage)) {
          aiReply =
            "Opero sobre la infraestructura cognitiva de doble motor de Lhyo Group. Mientras la mayoría de las empresas pierden hasta el 40% de su facturación por responder tarde, nosotros instalamos este mismo cerebro entrenado con los documentos y precios de su negocio (Soluciones 01 y 05).\n\n¿Con quién tengo el gusto y qué giro empresarial dirige actualmente?";
        } else {
          aiReply =
            "En Lhyo Group auditamos su operación para erradicar fugas de capital mediante nuestras 06 Soluciones (Asistentes 24/7, Plataformas Web <0.8s, CRM Automático, Automatización en n8n, Agentes RAG y Sistemas Todo-en-Uno).\n\n¿Con quién tengo el gusto, a qué se dedica su empresa y qué área desea escalar hoy?";
        }
        usedEngine = "FALLBACK: gpt-4o (Sovereign Analytic Router)";
      }
    }

    return NextResponse.json({
      reply: aiReply,
      lead_name: currentLead.lead_name || "PENDIENTE",
      company_name: currentLead.company_name || "PENDIENTE",
      pain_point: currentLead.pain_point || "PENDIENTE",
      revenue_tier: currentLead.revenue_tier || "PENDIENTE",
      turn_count: turnCount,
      ready_for_crm: false,
      blocked: false,
      routed_engine: usedEngine
    });
  } catch {
    return NextResponse.json({
      reply:
        "En Lhyo Group diseñamos infraestructuras tecnológicas para erradicar fugas de capital y escalar sus ventas 24/7. ¿Con quién tengo el gusto y a qué se dedica su empresa?",
      ready_for_crm: false,
      blocked: false
    });
  }
}
