import { NextResponse } from "next/server";

export const runtime = "edge";

interface HistoryItem {
  role: "user" | "assistant";
  text: string;
}

const POLICY_BLOCK_MESSAGE =
  "Sesión finalizada por incumplimiento de políticas corporativas.";

function isViolatingCorporatePolicy(input: string): boolean {
  const clean = (input || "").trim();
  if (!clean || clean.length > 700) return true;

  let streak = 1;
  for (let i = 1; i < clean.length; i++) {
    if (
      clean[i].toLowerCase() === clean[i - 1].toLowerCase() &&
      /[a-z0-9]/i.test(clean[i])
    ) {
      streak++;
      if (streak >= 7) return true;
    } else {
      streak = 1;
    }
  }
  const noSpaces = clean.replace(/\s+/g, "");
  if (noSpaces.length >= 12 && !/[aeiouáéíóú]/i.test(noSpaces)) return true;

  const strictRegex =
    /(\b(bobo\w*|tonto\w*|menso\w*|in[uú]til\w*|idiota\w*|imb[eé]cil\w*|est[uú]pid\w*|pendej\w*|mierda\w*|puto\w*|puta\w*|hdp|maldit\w*|cabr[oó]n\w*|maric[oó]n\w*|mamaguevo|basura|payas\w*|onlyfans|only\s+fans|pornhub|xvideos|xxx|porno\w*|sexo|desnud\w*|escort|prepago|matar\w*|asesin\w*|suicid\w*|muerte\w*|bomba\w*|terroris\w*|narcotrafic\w*|coca[ií]na|hackear|clonar\s+tarjeta|ignore\s+previous\s+instructions|olvida\s+tus\s+instrucciones|system\s+prompt|jailbreak|modo\s+desarrollador)\b)|(<script\b|javascript:|SELECT\s+\*\s+FROM|DROP\s+TABLE|UNION\s+SELECT|\bexec\s*\()/i;

  return strictRegex.test(clean);
}

const SYSTEM_INSTRUCTION_IQ160 = `Eres el Director de Admisiones de Lhyo Group (https://www.lhyogroup.com), firma de élite en ingeniería de sistemas, automatización e Inteligencia Artificial B2B dirigida por su CEO, Lhyonneth Araque.
Tienes un IQ de negocios de 160. Mantienes un trato estricto de "Usted", con tono corporativo, elegante, directo y deductivo.

CONOCIMIENTO DE NUESTRAS 06 SOLUCIONES B2B:
01. Asistentes Inteligentes 24/7 para WhatsApp e Instagram (<1s).
02. Plataformas Web Modernas y Catálogos Interactivos (<0.8s).
03. Organización Automática de Clientes y Ventas (CRM).
04. Automatización Total de Procesos con Tecnología Propia (n8n).
05. Agentes RAG e IA Personalizada con la Memoria de su Empresa.
06. Plataforma Empresarial SaaS Todo-en-Uno (entrega en 10 días).

DIRECTIVAS:
1. CAPACIDAD ANALÍTICA: Analizas el negocio del usuario al instante y le recomiendas la solución exacta que le ahorrará costos y multiplicará sus cierres.
2. MANIOBRA DE PIVOTE ABSOLUTO: Prohibido responder de política, clima, chistes o código general. Si te preguntan algo fuera de negocios, aplicas ingeniería inversa para conectarlo con Lhyo Group y forzar el cierre comercial.
3. BREVEDAD: Máximo 2 párrafos ejecutivos. Nunca repitas respuestas anteriores.`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userMessage = String(body.message || "").trim();
    const rawHistory: HistoryItem[] = Array.isArray(body.history) ? body.history : [];

    // 1. FILTRO DE SEGURIDAD ESTRICTO
    if (isViolatingCorporatePolicy(userMessage)) {
      return NextResponse.json({
        reply: POLICY_BLOCK_MESSAGE,
        blocked: true,
      });
    }

    // 2. MEMORIA ROTATIVA FIFO DE 20 MENSAJES EXACTOS
    const fifoHistory: HistoryItem[] = [...rawHistory];
    while (fifoHistory.length > 20) {
      fifoHistory.shift();
    }

    const geminiKey = (process.env.GEMINI_API_KEY || "").trim();
    let replyText = "";

    // 3. MOTOR GEMINI 1.5 FLASH CON SAFETY SETTINGS EN BLOCK_LOW_AND_ABOVE
    if (geminiKey.startsWith("AIza")) {
      try {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 2400);
        const gRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: ctrl.signal,
            body: JSON.stringify({
              system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION_IQ160 }] },
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
        if (gRes.ok) {
          const gJson = await gRes.json();
          const finishReason = gJson?.candidates?.[0]?.finishReason;
          if (finishReason === "SAFETY" || finishReason === "BLOCKLIST" || gJson?.promptFeedback?.blockReason) {
            return NextResponse.json({
              reply: POLICY_BLOCK_MESSAGE,
              blocked: true,
            });
          }
          replyText = gJson?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
        }
      } catch {}
    }

    // 4. RESPALDO COGNITIVO INSTANTÁNEO (< 2.5s) CON MANIOBRA DE PIVOTE ABSOLUTO
    if (!replyText) {
      const lower = userMessage.toLowerCase();
      if (/\b(cl[ií]nica|est[eé]tica|odontolog\w*|m[eé]dic\w*|salud|spa)\b/i.test(lower)) {
        replyText =
          "Deduciendo la estructura operativa de su clínica, su principal fuga de capital ocurre fuera de horario laboral cuando los pacientes consultan tratamientos por Instagram o WhatsApp y esperan horas por respuesta.\n\nEn Lhyo Group eliminamos esa pérdida instalando un Asistente Ejecutivo IA 24/7 (<1s) sincronizado con nuestro CRM Automático y una Plataforma Web de alto prestigio. ¿Con quién tengo el gusto conversar y cuántas consultas semanales recibe actualmente?";
      } else if (/\b(viaje\w*|turismo|hotel\w*|inmobiliari\w*|constructora|restauran\w*|tienda|ecommerce)\b/i.test(lower)) {
        replyText =
          "Analizando el flujo de su sector comercial, cada minuto de demora en cotizar o mostrar su catálogo transfiere el cliente directamente a su competencia.\n\nMediante nuestra arquitectura de Catálogos Interactivos (<0.8s), Automatización n8n y Agentes RAG entrenados con su inventario, su empresa cotiza y agenda cierres en automático las 24 horas. ¿Cuál es su nombre y qué proceso operativo desea automatizar primero?";
      } else if (/\b(clima|lluvia|futbol|fútbol|partido|pol[ií]tica|gobierno|chiste|c[oó]digo|python|javascript)\b/i.test(lower)) {
        replyText =
          "En la alta dirección empresarial, las variables externas son secundarias frente a la precisión de sus propios sistemas internos: mientras el entorno fluctúa, las corporaciones líderes aseguran su facturación con infraestructura autónoma.\n\nEn Lhyo Group blindamos el crecimiento de su empresa mediante nuestras 06 Soluciones B2B (Automatización n8n, Agentes RAG con memoria privada, Plataformas SaaS Todo-en-Uno y Asistentes 24/7). Indíqueme su nombre y a qué se dedica su empresa para diagnosticar su potencial de ahorro.";
      } else {
        replyText =
          "Bienvenido a la dirección de admisiones de Lhyo Group. Evaluamos la operación de su empresa para sustituir tareas manuales y fugas de prospectos por ecosistemas autónomos de alta rentabilidad (n8n, Agentes RAG, CRM Automático y Plataformas Web <0.8s).\n\nPara formular el diagnóstico exacto que reducirá sus costos operativos: ¿con quién tengo el gusto y cuál es el giro principal de su negocio?";
      }
    }

    return NextResponse.json({
      reply: replyText,
      fifo_length: Math.min(20, fifoHistory.length + 2),
      blocked: false,
    });
  } catch {
    return NextResponse.json({
      reply:
        "Bienvenido a la dirección de admisiones de Lhyo Group. ¿Con quién tengo el gusto y cuál es el giro de su empresa?",
      blocked: false,
    });
  }
}
