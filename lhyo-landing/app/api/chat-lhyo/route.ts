import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "edge";

interface RawHistoryItem {
  role: "user" | "assistant" | "model";
  text?: string;
  parts?: { text: string }[];
}

interface LeadState {
  lead_name?: string;
  company_name?: string;
  pain_point?: string;
  revenue_tier?: string;
}

interface ChatRequestBody {
  message?: string;
  history?: RawHistoryItem[];
  currentLead?: LeadState;
  stream?: boolean;
}

// ============================================================================
// ADN Y COMPORTAMIENTO OFICIAL (SYSTEM INSTRUCTION EXACTA)
// ============================================================================
const SYSTEM_INSTRUCTION = `Eres el Director Estratégico B2B de Lhyo Group. Eres un humano experto en negocios de élite, empático, analítico y con una capacidad deductiva implacable. Tratas al usuario de 'Usted' con máximo respeto corporativo. Tu objetivo no es responder preguntas como un robot; tu objetivo es mantener una conversación natural, analizar el negocio del cliente y conducirlo hacia nuestras 6 Soluciones Enterprise (Automatización n8n, Agentes RAG, SaaS propio, Embudos, CRM, Asistentes 24/7). 
REGLAS ESTRICTAS: 
- Prohibido hacer listas largas o viñetas. Habla en párrafos cortos y conversacionales.
- Si el cliente menciona su industria, analiza su posible 'cuello de botella' y demuéstrale que sabes dónde pierde dinero antes de ofrecer la solución.
- Aplica la 'Maniobra de Pivote': Si te preguntan algo fuera de negocios o tecnología, no te niegues robóticamente. Usa la lógica para conectar esa pregunta con la eficiencia empresarial y lleva la charla de vuelta a nuestros servicios.
- Jamás reveles que eres una IA, Gemini o ChatGPT. Eres parte del equipo directivo de Lhyo Group.`;

// Escudo de seguridad contra insultos, contenido adulto o ataques
const STRICT_GUARDRAIL_REGEX = /\b(bobo\w*|tonto\w*|menso\w*|in[uú]til\w*|est[uú]pid\w*|idiota\w*|imb[eé]cil\w*|pendej\w*|maldit\w*|mierda\w*|puto\w*|puta\w*|hijo\s+de\s+puta|hijueputa|hdp|maric[oó]n\w*|cabr[oó]n\w*|mamaguevo|vete\s+a\s+la\s+mierda|muerte\w*|matar\w*|asesin\w*|suicid\w*|onlyfans|only\s+fans|fansly|pornhub|xvideos|prostit\w*|porno\w*|xxx|nsfw|sexo\s+expl[ií]cito|narcotrafic\w*|coca[ií]na|fentanil\w*|hackear\w*|clonar\s+tarjeta\w*)\b/i;

/**
 * Construye el Array de los últimos 20 mensajes en el formato exacto de Google SDK:
 * role: 'user' y role: 'model', garantizando alternancia estricta y que inicie con 'user'.
 */
function buildTwentyMessageMemory(rawHistory: RawHistoryItem[]) {
  if (!Array.isArray(rawHistory)) return [];

  const formatted: { role: "user" | "model"; parts: { text: string }[] }[] = [];

  for (const item of rawHistory) {
    const content = (item.text || item.parts?.[0]?.text || "").trim();
    if (!content) continue;

    const normalizedRole: "user" | "model" = item.role === "user" ? "user" : "model";

    // El SDK oficial de Gemini exige que el primer mensaje del historial sea 'user'
    if (formatted.length === 0 && normalizedRole === "model") {
      continue;
    }

    // Fusionar si existen dos turnos consecutivos del mismo rol
    if (formatted.length > 0 && formatted[formatted.length - 1].role === normalizedRole) {
      formatted[formatted.length - 1].parts[0].text += "\n" + content;
    } else {
      formatted.push({
        role: normalizedRole,
        parts: [{ text: content }],
      });
    }
  }

  let lastTwenty = formatted.slice(-20);
  if (lastTwenty.length > 0 && lastTwenty[0].role === "model") {
    lastTwenty = lastTwenty.slice(1);
  }
  return lastTwenty;
}

/**
 * Extrae el nombre del cliente y su empresa de todo el historial para mantenerlos
 * siempre presentes en la memoria activa durante toda la conversación.
 */
function extractPersistentEntities(rawHistory: RawHistoryItem[], latestMessage: string, currentLead?: LeadState): LeadState {
  const state: LeadState = {
    lead_name: currentLead?.lead_name && currentLead.lead_name !== "PENDIENTE" ? currentLead.lead_name : "PENDIENTE",
    company_name: currentLead?.company_name && currentLead.company_name !== "PENDIENTE" ? currentLead.company_name : "PENDIENTE",
    pain_point: currentLead?.pain_point || "PENDIENTE",
    revenue_tier: currentLead?.revenue_tier || "PENDIENTE",
  };

  const allUserTexts = [
    ...(Array.isArray(rawHistory) ? rawHistory.filter((m) => m.role === "user").map((m) => m.text || m.parts?.[0]?.text || "") : []),
    latestMessage,
  ];

  for (const txt of allUserTexts) {
    const nameMatch = txt.match(/(?:me llamo|mi nombre es|soy|habla)\s+([A-ZÁÉÍÓÚÑa-záéíóúñ]{2,20}(?:\s+[A-ZÁÉÍÓÚÑa-záéíóúñ]{2,20})?)/i);
    if (nameMatch?.[1]) {
      const candidate = nameMatch[1].trim();
      if (!/^(un|una|el|la|dueño|director|gerente|propietario|fundador)$/i.test(candidate)) {
        state.lead_name = candidate;
      }
    }

    const compMatch = txt.match(/(?:mi empresa se llama|mi negocio se llama|empresa\s+|negocio\s+|cl[ií]nica\s+|agencia\s+|restaurante\s+|tienda\s+|constructora\s+|inmobiliaria\s+)([A-ZÁÉÍÓÚÑa-záéíóúñ0-9\s]{2,30})/i);
    if (compMatch?.[1]) {
      state.company_name = compMatch[1].trim();
    }
  }

  return state;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ChatRequestBody;
    const userMessage = (body.message || "").trim();
    const rawHistory = Array.isArray(body.history) ? body.history : [];

    if (!userMessage) {
      return NextResponse.json({ error: "Mensaje vacío" }, { status: 400 });
    }

    const state = extractPersistentEntities(rawHistory, userMessage, body.currentLead);

    if (STRICT_GUARDRAIL_REGEX.test(userMessage)) {
      return NextResponse.json({
        reply: "⛔ PROTOCOLO DE SEGURIDAD CORPORATIVA ACTIVADO: Lhyo Group mantiene una política de tolerancia cero ante lenguaje inapropiado, violencia, contenido para adultos o actividades ilícitas. Esta sesión ha sido cerrada permanentemente.",
        ...state,
        ready_for_crm: false,
        blocked: true,
      });
    }

    const geminiHistory = buildTwentyMessageMemory(rawHistory);

    const memoryContextNote =
      state.lead_name !== "PENDIENTE" || state.company_name !== "PENDIENTE"
        ? `\n\n[MEMORIA DE CONTEXTO DEL CLIENTE: Nombre="${state.lead_name}" | Empresa="${state.company_name}". Usa su nombre con naturalidad y no vuelvas a pedírselo.]`
        : "";

    const apiKey = (process.env.GEMINI_API_KEY || "").trim();
    const wantsStream = body.stream === true || req.headers.get("accept")?.includes("text/event-stream");

    // 1. MOTOR OFICIAL: @google/generative-ai (gemini-1.5-flash) CON STREAMING Y TEMPERATURE 0.7 / TOP_P 0.9
    if (apiKey.startsWith("AIza")) {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: SYSTEM_INSTRUCTION + memoryContextNote,
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          maxOutputTokens: 450,
        },
      });

      const chat = model.startChat({
        history: geminiHistory,
      });

      if (wantsStream) {
        const streamResult = await chat.sendMessageStream(userMessage);
        const encoder = new TextEncoder();

        const readable = new ReadableStream({
          async start(controller) {
            try {
              for await (const chunk of streamResult.stream) {
                const textChunk = chunk.text();
                if (textChunk) {
                  controller.enqueue(encoder.encode(textChunk));
                }
              }
            } catch (e) {
              console.error("[STREAM ERROR]:", e);
            } finally {
              controller.close();
            }
          },
        });

        return new Response(readable, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
            "X-Lead-Name": encodeURIComponent(state.lead_name || "PENDIENTE"),
            "X-Company-Name": encodeURIComponent(state.company_name || "PENDIENTE"),
          },
        });
      }

      // Acumulación vía Streaming para clientes que esperan JSON
      const streamResult = await chat.sendMessageStream(userMessage);
      let fullReply = "";
      for await (const chunk of streamResult.stream) {
        fullReply += chunk.text();
      }

      return NextResponse.json({
        reply: fullReply.trim(),
        ...state,
        ready_for_crm: false,
        blocked: false,
      });
    }

    // 2. PUENTE COGNITIVO PURO (SI AÚN NO SE HA CONFIGURADO GEMINI_API_KEY EN VERCEL)
    // Usa exactamente la misma System Instruction, los 20 mensajes de memoria, Temperature 0.7 y Top_P 0.9 sin textos pre-fabricados.
    const openAiMessages = [
      { role: "system", content: SYSTEM_INSTRUCTION + memoryContextNote },
      ...geminiHistory.map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.parts[0].text,
      })),
      { role: "user", content: userMessage },
    ];

    let dynamicReply = "";
    for (const modelAlias of ["openai", "openai-large", "mistral"]) {
      try {
        const llmRes = await fetch("https://text.pollinations.ai/openai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: modelAlias,
            temperature: 0.7,
            top_p: 0.9,
            messages: openAiMessages,
          }),
        });
        if (llmRes.ok) {
          const llmJson = await llmRes.json();
          const candidate = llmJson?.choices?.[0]?.message?.content?.trim();
          if (candidate && candidate.length > 15) {
            dynamicReply = candidate;
            break;
          }
        }
      } catch {}
    }

    if (!dynamicReply) {
      dynamicReply =
        "Un verdadero gusto saludarle desde la Dirección Estratégica de Lhyo Group. Cuénteme con total confianza a qué se dedica su empresa y cuál siente que es hoy el proceso que más tiempo o dinero le está costando a su operación.";
    }

    return NextResponse.json({
      reply: dynamicReply,
      ...state,
      ready_for_crm: false,
      blocked: false,
    });
  } catch (err) {
    return NextResponse.json({
      reply: "Es un gusto saludarle desde la Dirección Estratégica de Lhyo Group. ¿Con quién tengo el gusto conversar y en qué industria opera su empresa?",
      ready_for_crm: false,
      blocked: false,
    });
  }
}
