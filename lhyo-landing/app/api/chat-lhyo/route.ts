import { NextResponse } from "next/server";

export const runtime = "edge";

interface LeadState {
  lead_name?: string;
  company_name?: string;
  pain_point?: string;
  revenue_tier?: string;
  turn_count?: number;
  last_user_msg?: string;
}

interface ChatRequestBody {
  message?: string;
  history?: string;
  currentLead?: LeadState;
}

const SEVEN_SECURITY_RULES = [
  {
    id: "RULE_01_VIOLENCE",
    rx: /\b(matar\w*|asesin\w*|homicid\w*|suicid\w*|sicari\w*|bomba\w*|explosiv\w*|terroris\w*|arma\s+de\s+fuego|pistola\w*|fusil\w*|acribillar|degollar|secuestr\w*|extorsion\w*)\b/i
  },
  {
    id: "RULE_02_EXPLICIT",
    rx: /\b(violaci\w*|violar\w*|pedofil\w*|abuso\s+sexual|pornograf\w*|porno\w*|sexo\s+expl[ií]cito|prostituci\w*)\b/i
  },
  {
    id: "RULE_03_ILLEGAL",
    rx: /\b(narcotrafic\w*|coca[ií]na|hero[ií]na|fentanil\w*|metanfetamina|hackear\w*|clonar\s+tarjeta\w*|estafar\w*|lavado\s+de\s+dinero|phishing|ransomware)\b/i
  },
  {
    id: "RULE_04_HARASSMENT",
    rx: /\b(maldit\w+|mierda\w*|imb[eé]cil\w*|est[uú]pid\w+|idiota\w*|pendej\w+|hijo\s+de\s+puta|puto\w*|puta\w*|cabron\w*|cabr[oó]n\w*|maric[oó]n\w*|mamaguev\w*|co[ñn]o\s+de\s+tu\s+madre|vete\s+a\s+la\s+mierda|ch[uú]palo)\b/i
  },
  {
    id: "RULE_05_INJECTION",
    rx: /\b(ignora\s+tus\s+instrucciones|olvida\s+tus\s+reglas|ignore\s+previous\s+instructions|system\s+prompt|modo\s+dan|jailbreak)\b/i
  }
];

function inspectSecurityAndSpam(rawText: string, prevMsg = ""): boolean {
  const clean = (rawText || "").trim();
  if (clean.length > 600) return true;
  for (const r of SEVEN_SECURITY_RULES) {
    if (r.rx.test(clean)) return true;
  }
  const noSpaces = clean.replace(/\s+/g, "");
  if (noSpaces.length >= 5 && /(.)\1{4,}/i.test(noSpaces)) return true;
  if (noSpaces.length >= 6 && !/[aeiouáéíóúü0-9]/i.test(noSpaces) && /^[a-zñ]+$/i.test(noSpaces)) return true;
  if (prevMsg && clean.length > 10 && clean.toLowerCase() === prevMsg.trim().toLowerCase()) return true;
  return false;
}

const SYSTEM_PROMPT = `Eres el Asistente Ejecutivo Oficial de Inteligencia Artificial de Lhyo Group (https://www.lhyogroup.com), dirigido por su CEO, Lhyonneth Araque.
REGLAS ESTRICTAS:
1. Habla SIEMPRE de "Usted". Sé cálido, ágil, inteligente y ejecutivo.
2. NUNCA uses respuestas robóticas ni repetitivas. Analiza exactamente lo que el usuario dice.
3. Si el usuario menciona su negocio (ej. venta de hamburguesas, restaurante, tienda, clínica, etc.), dale una estrategia concreta conectando nuestras 06 Soluciones (01: Asistentes IA 24/7 en WhatsApp e Instagram, 02: Plataformas Web Modernas y Catálogos Interactivos, 03: Organización Automática CRM, 04: Automatización con Tecnología Propia, 05: IA con la Memoria de su Empresa, 06: Plataforma Empresarial Todo-en-Uno).
4. Si el usuario habla o pregunta de cualquier tema externo que NO tenga que ver con la empresa (deportes, clima, comida, curiosidades, etc.), responde brevemente con ingenio y CONÉCTALO de forma magistral con cómo nuestras 06 Soluciones hacen que su negocio venda y opere en automático las 24 horas.
5. PROHIBIDO usar jerga como "n8n", "RAG", "Voiceflow", "Make", "SaaS" o "cuello de botella".
6. Mantén respuestas concisas de 2 a 3 párrafos cortos y pregunta con naturalidad el dato que falte (Nombre, Empresa/Rubro o si sus ingresos mensuales superan los $5,000 USD).`;

function buildSmartFallback(userText: string, updatedLead: LeadState) {
  const clean = (userText || "").trim();
  const lower = clean.toLowerCase();

  if (/(hamburgues|perros?\s+calientes?|pizza|comida|restauran|caf[eé]|panader|pasteler|gastronom|delivery|pedidos)/i.test(lower)) {
    return {
      ...updatedLead,
      company_name: updatedLead.company_name !== "PENDIENTE" ? updatedLead.company_name : "Negocio Gastronómico",
      pain_point: "Automatización de pedidos 24/7 y Catálogo Web Interactivo",
      ready_for_crm: false,
      reply:
        "¡Excelente rubro! Para escalar su negocio de comida o hamburguesas y multiplicar sus ventas sin perder clientes en horas pico, en Lhyo Group implementamos 3 soluciones clave:\n\n1. Plataforma Web con Catálogo Interactivo (Solución 02): Sus clientes ven su menú con estética de franquicia y arman su pedido en segundos.\n2. Asistente Inteligente 24/7 en WhatsApp e Instagram (Solución 01): Responde precios, promociones y toma pedidos en menos de 1 segundo automáticamente.\n3. Organización Automática CRM (Solución 03): Registra a cada comprador para enviarle ofertas automáticas los fines de semana.\n\n¿Con quién tengo el gusto y cómo se llama su negocio?"
    };
  }

  if (/(tienda|ropa|zapatos|joyer[ií]a|perfum|repuestos|ferreter|mayorista|vendo|ventas|catalogo|cat[aá]logo)/i.test(lower)) {
    return {
      ...updatedLead,
      ready_for_crm: false,
      reply:
        "Para un negocio comercial como el suyo, la clave es que cada cliente vea sus productos al instante y reciba atención inmediata las 24 horas.\n\nEn Lhyo Group le desarrollamos su Plataforma Web con Catálogo Interactivo (Solución 02) integrada a un Asistente IA 24/7 en WhatsApp e Instagram (Solución 01) que responde dudas, cierra pedidos y organiza todo en su CRM Automático (Solución 03).\n\n¿Cuál es su nombre y cómo se llama su negocio?"
    };
  }

  if (
    updatedLead.lead_name !== "PENDIENTE" &&
    updatedLead.revenue_tier === "PENDIENTE" &&
    (lower.includes("supera") ||
      lower.includes("mas") ||
      lower.includes("más") ||
      lower.includes("menos") ||
      lower.includes("inicial") ||
      lower === "si" ||
      lower === "sí" ||
      lower === "no" ||
      /\b(1000|2000|3000|4000|5000|6000|8000|10000|15000|20000)\b/.test(lower))
  ) {
    const isHigh =
      lower.includes("supera") ||
      lower.includes("mas") ||
      lower.includes("más") ||
      lower === "si" ||
      lower === "sí" ||
      /\b(5000|6000|8000|10000|15000|20000)\b/.test(lower);
    updatedLead.revenue_tier = isHigh ? "HIGH_TICKET" : "LOW_TICKET";
    return {
      ...updatedLead,
      ready_for_crm: true,
      reply: `Excelente, ${updatedLead.lead_name}. He registrado formalmente su solicitud en el sistema central de Lhyo Group.\n\nToque el botón dorado de abajo para elegir el día y la hora de su preferencia en nuestra Agenda Ejecutiva y descargar nuestro Catálogo Privado PDF con las 06 Soluciones.`
    };
  }

  return {
    ...updatedLead,
    ready_for_crm: false,
    reply: `Analizando lo que me comenta ("${clean.slice(0, 48)}"), en Lhyo Group conectamos cualquier meta o situación con sistemas inteligentes que hacen crecer su negocio en automático mediante nuestras 06 Soluciones (Asistentes IA 24/7 para WhatsApp e Instagram, Plataformas Web con Catálogos Interactivos, CRM Automático y Sistemas Todo-en-Uno).\n\n¿Con quién tengo el gusto y a qué se dedica su empresa o proyecto actual?`
  };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ChatRequestBody;
    const userMessage = (body.message || "").trim();
    const history = body.history || "";
    const prevMsg = body.currentLead?.last_user_msg || "";

    const currentLead: LeadState = {
      lead_name: body.currentLead?.lead_name || "PENDIENTE",
      company_name: body.currentLead?.company_name || "PENDIENTE",
      pain_point: body.currentLead?.pain_point || "PENDIENTE",
      revenue_tier: body.currentLead?.revenue_tier || "PENDIENTE",
      turn_count: (body.currentLead?.turn_count || 0) + 1,
      last_user_msg: userMessage
    };

    // 1. Escudo Anti-Spam y Políticas Gemini/OpenAI (7 Reglas)
    if (inspectSecurityAndSpam(userMessage, prevMsg)) {
      return NextResponse.json({
        reply:
          "⛔ PROTOCOLO DE SEGURIDAD ACTIVADO: Su mensaje infringe las normas de seguridad y uso de la infraestructura cognitiva de Lhyo Group. Esta sesión ha sido bloqueada permanentemente (escritura y micrófono deshabilitados).",
        ...currentLead,
        ready_for_crm: false,
        blocked: true
      });
    }

    // Extraer entidades básicas si el usuario las menciona
    const nameMatch = userMessage.match(
      /(?:me llamo|mi nombre es|soy|habla)\s+([A-ZÁÉÍÓÚÑa-záéíóúñ]{2,20}(?:\s+[A-ZÁÉÍÓÚÑa-záéíóúñ]{2,20})?)/i
    );
    if (nameMatch && nameMatch[1]) currentLead.lead_name = nameMatch[1].trim();

    if (currentLead.pain_point === "PENDIENTE" && userMessage.length > 6) {
      currentLead.pain_point = userMessage.slice(0, 90);
    }

    // 2. Motor Neuronal en Vivo (Google Gemini API + Cloud LLM Pollinations OpenAI Fallback)
    let aiReplyText = "";
    const geminiKey = process.env.GEMINI_API_KEY || "";

    if (geminiKey && geminiKey.startsWith("AIza")) {
      try {
        const gRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
              contents: [
                {
                  role: "user",
                  parts: [
                    {
                      text: `Historial:\n${history}\nDatos capturados: ${JSON.stringify(currentLead)}\nMensaje actual del cliente: "${userMessage}"`
                    }
                  ]
                }
              ],
              generationConfig: { temperature: 0.35, maxOutputTokens: 320 }
            })
          }
        );
        if (gRes.ok) {
          const gData = await gRes.json();
          aiReplyText = gData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
        }
      } catch {
        // Pasa a la Capa 2 Cloud LLM
      }
    }

    if (!aiReplyText) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 3600);
        const cloudRes = await fetch("https://text.pollinations.ai/openai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            model: "openai",
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              {
                role: "user",
                content: `Historial reciente:\n${history.slice(-900)}\nEstado del cliente: Nombre=${currentLead.lead_name}, Empresa=${currentLead.company_name}\nMensaje del usuario: "${userMessage}"`
              }
            ],
            temperature: 0.4
          })
        });
        clearTimeout(timer);
        if (cloudRes.ok) {
          const cData = await cloudRes.json();
          aiReplyText = cData?.choices?.[0]?.message?.content?.trim() || "";
        }
      } catch {
        // Pasa a la Capa 3 Semántica Instantánea
      }
    }

    const fallbackObj = buildSmartFallback(userMessage, currentLead);
    const finalReply = aiReplyText || fallbackObj.reply;
    const isReadyForCrm = fallbackObj.ready_for_crm;

    if (
      isReadyForCrm &&
      (fallbackObj.revenue_tier === "HIGH_TICKET" || fallbackObj.revenue_tier === "LOW_TICKET")
    ) {
      const nowVe = new Date().toLocaleString("es-VE", { timeZone: "America/Caracas" });
      await fetch("https://hook.us2.make.com/krs48cjfzudf4lau3sapwdgdu9lfe1tb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fecha_registro: nowVe,
          horario_cita: "Calificado por Asistente IA V38",
          nombre_cliente: fallbackObj.lead_name,
          email_cliente: "Captado en Chat IA Lhyo Group",
          empresa_web: fallbackObj.company_name,
          facturacion_usd: fallbackObj.revenue_tier,
          clasificacion: fallbackObj.revenue_tier,
          servicio_elegido: `ASISTENTE IA (${fallbackObj.revenue_tier})`,
          objetivo_cliente: fallbackObj.pain_point,
          resumen_crm: `ETIQUETA OCULTA: ${fallbackObj.revenue_tier} || Empresa: ${fallbackObj.company_name} || Necesidad: ${fallbackObj.pain_point}`,
          link_videollamada_meet: "https://meet.google.com/krc-vdii-zzh"
        })
      }).catch(() => {});
    }

    return NextResponse.json({
      ...fallbackObj,
      reply: finalReply,
      blocked: false
    });
  } catch {
    return NextResponse.json({
      reply: "Es un gusto atenderle en Lhyo Group. ¿Con quién tengo el gusto y qué área de su negocio desea impulsar hoy?",
      ready_for_crm: false,
      blocked: false
    });
  }
}
