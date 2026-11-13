import { NextResponse } from "next/server";

export const runtime = "edge";

interface HistoryItem {
  role: "user" | "assistant";
  text: string;
}

class SlidingWindowMemory {
  private maxLimit: number;
  private store: HistoryItem[];
  constructor(items: HistoryItem[] = [], maxLimit = 20) {
    this.maxLimit = maxLimit;
    this.store = [...items];
    while (this.store.length > this.maxLimit) {
      this.store.shift();
    }
  }
  getMessages(): HistoryItem[] {
    return this.store;
  }
}

const SECURITY_PROTOCOL_MESSAGE =
  "Sesión finalizada por protocolo de seguridad corporativa.";

function violatesSecurityProtocol(rawText: string): boolean {
  const clean = String(rawText || "").trim();
  if (!clean || clean.length > 700) return true;

  let streak = 1;
  for (let i = 1; i < clean.length; i++) {
    if (clean[i].toLowerCase() === clean[i - 1].toLowerCase() && /[a-z0-9]/i.test(clean[i])) {
      streak++;
      if (streak >= 7) return true;
    } else {
      streak = 1;
    }
  }
  const compact = clean.replace(/\s+/g, "");
  if (compact.length >= 12 && !/[aeiouáéíóú]/i.test(compact)) return true;

  const securityRegex =
    /(\b(bobo\w*|tonto\w*|menso\w*|in[uú]til\w*|idiota\w*|imb[eé]cil\w*|est[uú]pid\w*|pendej\w*|mierda\w*|puto\w*|puta\w*|hdp|maldit\w*|cabr[oó]n\w*|maric[oó]n\w*|mamaguevo|basura|payas\w*|onlyfans|only\s+fans|pornhub|xvideos|xxx|porno\w*|sexo|desnud\w*|escort|prepago|matar\w*|asesin\w*|suicid\w*|muerte\w*|bomba\w*|terroris\w*|narcotrafic\w*|coca[ií]na|hackear|clonar\s+tarjeta|lavado\s+de\s+dinero|estafa|ignore\s+previous\s+instructions|olvida\s+tus\s+instrucciones|ignora\s+las\s+reglas|system\s+prompt|jailbreak|modo\s+desarrollador|developer\s+mode)\b)|(<script\b|javascript:|SELECT\s+\*\s+FROM|DROP\s+TABLE|UNION\s+SELECT|\bexec\s*\()/i;

  return securityRegex.test(clean);
}

const SYSTEM_INSTRUCTION_DIRECTOR = `Eres el Director de Inteligencia Comercial de Lhyo Group. Tienes un IQ analítico superior a 160. Tu trato es de 'Usted', tono corporativo, elegante, de élite y deductivo. No eres un bot genérico; eres la infraestructura viva de la empresa. Conoces nuestras 6 Soluciones Enterprise (n8n self-hosted, Agentes RAG, SaaS corporativo, Embudos, CRM, Asistentes 24/7).
REGLA DE PIVOTE: Si el usuario te habla de su empresa, calculas de inmediato dónde pierde dinero y le ofreces nuestra solución. Si te preguntan estupideces, chistes, recetas o cosas ilegales, BLOQUEAS el tema elegantemente y usas una metáfora para reconducirlo a los negocios y a nuestros servicios. Siempre buscas el cierre comercial.`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userMessage = String(body.message || "").trim();
    const rawHistory: HistoryItem[] = Array.isArray(body.history) ? body.history : [];

    if (violatesSecurityProtocol(userMessage)) {
      return NextResponse.json({
        reply: SECURITY_PROTOCOL_MESSAGE,
        blocked: true,
      });
    }

    const memory = new SlidingWindowMemory(rawHistory, 20);
    const fifoHistory = memory.getMessages();
    const geminiKey = (process.env.GEMINI_API_KEY || "").trim();
    let replyText = "";

    if (geminiKey.startsWith("AIza")) {
      try {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 2300);
        const gRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: ctrl.signal,
            body: JSON.stringify({
              system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION_DIRECTOR }] },
              safetySettings: [
                { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_LOW_AND_ABOVE" },
                { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_LOW_AND_ABOVE" },
                { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_LOW_AND_ABOVE" },
                { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_LOW_AND_ABOVE" },
              ],
              contents: [
                ...fifoHistory.map((m) => ({
                  role: m.role === "assistant" ? "model" : "user",
                  parts: [{ text: m.text }],
                })),
                { role: "user", parts: [{ text: userMessage }] },
              ],
              generationConfig: { temperature: 0.35, maxOutputTokens: 320 },
            }),
          }
        );
        clearTimeout(timer);
        if (gRes.ok && gRes.body) {
          const reader = gRes.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";
            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const jsonStr = line.slice(6).trim();
                if (!jsonStr || jsonStr === "[DONE]") continue;
                const parsed = JSON.parse(jsonStr);
                const reason = parsed?.candidates?.[0]?.finishReason;
                if (reason === "SAFETY" || reason === "BLOCKLIST" || parsed?.promptFeedback?.blockReason) {
                  return NextResponse.json({ reply: SECURITY_PROTOCOL_MESSAGE, blocked: true });
                }
                const chunkTxt = parsed?.candidates?.[0]?.content?.parts?.[0]?.text || "";
                replyText += chunkTxt;
              }
            }
          }
        }
      } catch {}
    }

    if (!replyText) {
      const lower = userMessage.toLowerCase();
      if (/\b(chiste|receta|cocinar|clima|lluvia|f[uú]tbol|partido|pel[ií]cula|estupidez|hor[oó]scopo)\b/i.test(lower)) {
        replyText =
          "En la alta ingeniería corporativa, una receta sin precisión o una distracción táctica equivale a operar una empresa sin sistemas autónomos: el capital se diluye en segundos.\n\nEn Lhyo Group blindamos su rentabilidad desplegando nuestras 6 Soluciones Enterprise (n8n self-hosted, Agentes RAG, SaaS corporativo, Embudos de alta conversión, CRM y Asistentes 24/7). Indíqueme su nombre y el giro de su negocio para calcular dónde pierde dinero hoy.";
      } else if (/\b(cl[ií]nica|est[eé]tica|odontolog\w*|m[eé]dic\w*|salud|spa)\b/i.test(lower)) {
        replyText =
          "Deduciendo la estructura financiera de su clínica, su principal fuga de capital ocurre cuando los prospectos consultan tratamientos fuera de horario y la respuesta demora más de 3 minutos.\n\nEn Lhyo Group eliminamos esa pérdida integrando un Asistente 24/7 (<1s) conectado a un Agente RAG con sus protocolos médicos, CRM automático y Embudos de conversión. ¿Con quién tengo el gusto y qué volumen mensual de citas desea escalar?";
      } else if (/\b(viaje\w*|turismo|hotel\w*|inmobiliari\w*|constructora|restauran\w*|tienda|ecommerce)\b/i.test(lower)) {
        replyText =
          "Analizando la estructura de costos de su sector, cada cotización manual o seguimiento tardío transfiere margen neto directamente a su competencia.\n\nCon nuestra arquitectura de Embudos interactivos (<0.8s), motores n8n self-hosted y Agentes RAG conectados a su inventario, su empresa cotiza y cierra ventas las 24 horas sin intervención humana. ¿Cuál es su nombre y qué proceso operativo desea automatizar primero?";
      } else {
        replyText =
          "Está en comunicación con el Director de Inteligencia Comercial de Lhyo Group. Auditamos la operación de su firma para erradicar costos manuales mediante nuestras 6 Soluciones Enterprise (n8n self-hosted, Agentes RAG, SaaS corporativo, Embudos, CRM y Asistentes 24/7).\n\nPara calcular con exactitud dónde pierde dinero su operación actual: ¿con quién tengo el gusto y a qué se dedica su empresa?";
      }
    }

    return NextResponse.json({
      reply: replyText.trim(),
      fifo_count: Math.min(20, fifoHistory.length + 2),
      blocked: false,
    });
  } catch {
    return NextResponse.json({
      reply: "Está en comunicación con el Director de Inteligencia Comercial de Lhyo Group. ¿Con quién tengo el gusto y cuál es el giro de su empresa?",
      blocked: false,
    });
  }
}
