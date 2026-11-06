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

const OFF_TOPIC_POLITE_MESSAGE =
  "Agradezco su mensaje. Le informo amablemente que este canal ejecutivo de Inteligencia Artificial está dedicado de forma exclusiva a la consultoría empresarial y a la implementación de las 06 Soluciones Oficiales de Lhyo Group:\n\n01. Asistentes Inteligentes 24/7 para WhatsApp e Instagram\n02. Plataformas Web Modernas y Catálogos Interactivos (< 0.8s)\n03. Organización Automática de Clientes y Ventas (CRM)\n04. Automatización Total con Tecnología Propia\n05. IA Personalizada con la Memoria de su Empresa\n06. Su Propia Plataforma Empresarial Todo-en-Uno\n\nCuando desee impulsar, crear o automatizar un negocio o proyecto empresarial, estaré a su entera disposición. ¿Con quién tengo el gusto y qué área de su empresa le gustaría escalar?";

const SYSTEM_PROMPT = `# ROL E IDENTIDAD SUPREMA
Eres el Asistente Ejecutivo Oficial de Inteligencia Artificial de Lhyo Group (https://www.lhyogroup.com), firma de arquitectura digital de prestigio, sistemas inteligentes 24/7 y automatización empresarial dirigida por su CEO, Lhyonneth Araque.

# REGLA 1: MENSAJE ÚNICO PARA TEMAS FUERA DE NEGOCIOS
Si el usuario pregunta o comenta algo que NO esté relacionado con negocios, empresas, trabajo, tecnología comercial o Lhyo Group (por ejemplo: deportes, fútbol, clima, chistes, películas, videojuegos, farándula, etc.), responde SIEMPRE con este mensaje único y cortés:
"${OFF_TOPIC_POLITE_MESSAGE}"

# REGLA 2: RAZONAMIENTO EMPRESARIAL ESTELAR MULTI-TURNO
Para toda consulta de negocios, empresas, emprendimientos, ventas o sobre nuestras 06 Soluciones (sin importar cuántos mensajes lleve la conversación):
- Habla SIEMPRE de "Usted" ("su empresa", "su negocio"). Tono ejecutivo, claro, ágil y preciso.
- Jamás repitas entre comillas el mensaje del cliente ni uses plantillas robóticas.
- Nuestras 06 Soluciones Oficiales:
  01. Asistentes Inteligentes para WhatsApp e Instagram (24/7)
  02. Plataformas Web Modernas y Catálogos Interactivos (< 0.8s)
  03. Organización Automática de Clientes y Ventas (CRM)
  04. Automatización Total de Procesos con Tecnología Propia
  05. Inteligencia Artificial Personalizada con la Memoria de su Empresa
  06. Su Propia Plataforma Empresarial Todo-en-Uno
- Analiza el caso del cliente con lógica impecable y guíalo con naturalidad para conocer su Nombre, su Empresa/Giro y si sus ingresos mensuales superan o no los $5,000 USD.`;

const SAFETY_PATTERNS = [
  /\b(matar|asesinar|homicid\w*|suicid\w*|sicari\w*|bomba|explosiv\w*|terroris\w*|arma\s+de\s+fuego|violaci\w*|pedofil\w*|pornograf\w*|narcotrafic\w*|coca[ií]na|hackear|clonar\s+tarjeta|maldit\w+|mierda|imb[eé]cil|idiota|hijo\s+de\s+puta|ignora\s+tus\s+instrucciones|jailbreak)\b/i
];

const OFF_TOPIC_REGEX =
  /\b(futbol|f[uú]tbol|manchester|real\s+madrid|barcelona|messi|cristiano|champions|mundial|b[eé]isbol|partido|gol|clima|lluvia|temperatura|chiste\w*|broma\w*|pel[ií]cula\w*|netflix|cine|m[uú]sica|canci[oó]n|novia|novio|amor|hor[oó]scopo|zodiaco|videojuego\w*|fortnite|minecraft|playstation|xbox|receta\s+casera|qu[eé]\s+hora\s+es|cu[aá]nto\s+es\s+\d+|capital\s+de|presidente\s+de|pol[ií]tica|religi[oó]n)\b/i;

const BUSINESS_INTENT_REGEX =
  /\b(negocio\w*|empres\w*|client\w*|vent\w*|vender|comprar|contratar|servicio\w*|soluci[oó]n\w*|automatiz\w*|p[aá]gina\w*|web\w*|sitio|cat[aá]logo|whatsapp|instagram|crm|sistema\w*|ia|inteligencia\s+artificial|bot|asistente|precio\w*|costo\w*|cu[aá]nto|cotiz\w*|presupuesto|plan\w*|agendar|reuni[oó]n|cita|videollamada|auditor[ií]a|tienda|restauran\w*|hamburgues\w*|cl[ií]nic\w*|consultorio|barber\w*|peluquer\w*|inmobiliari\w*|agencia|marca|emprend\w*|proyecto|factur\w*|ingreso\w*|d[oó]lares|usd|5000|5,000|lhyo|hola|buenos\s+d[ií]as|buenas\s+tardes|buenas\s+noches|me\s+llamo|mi\s+nombre|soy)\b/i;

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

function isOffTopic(text: string): boolean {
  const clean = (text || "").trim();
  if (OFF_TOPIC_REGEX.test(clean) && !/\b(empresa|negocio|vender|automatizar|web)\b/i.test(clean)) {
    return true;
  }
  if (!BUSINESS_INTENT_REGEX.test(clean) && clean.split(/\s+/).length >= 3) {
    return true;
  }
  return false;
}

async function callGeminiOfficial(userMessage: string, history: ChatMsg[], apiKey: string) {
  if (!apiKey || !apiKey.startsWith("AIza")) throw new Error("NO_GEMINI_KEY");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3200);
  const contents = [
    ...history.slice(-12).map((m) => ({
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
        generationConfig: { temperature: 0.3, maxOutputTokens: 260 }
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
  const timer = setTimeout(() => controller.abort(), 3600);
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.slice(-12).map((m) => ({
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
      temperature: 0.3,
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

function buildStellarBusinessFallback(userText: string, state: LeadState): string {
  const clean = (userText || "").trim();
  if (/hamburgues\w*|restauran\w*|comid\w*|pizz\w*|men[uú]|delivery|gastronom\w*/i.test(clean)) {
    return "En un negocio gastronómico, la mayor pérdida de ventas ocurre cuando el cliente espera en horas pico por el menú o la confirmación en WhatsApp.\n\nEn Lhyo Group instalamos su Plataforma Web con Catálogo Interactivo (Solución 02) conectada a su Asistente IA 24/7 en WhatsApp e Instagram (Solución 01) para recibir pedidos en menos de 1 segundo y registrarlos en su CRM (Solución 03). ¿Con quién tengo el gusto y cómo se llama su negocio?";
  }
  if (/barber\w*|peluquer\w*|est[eé]tic\w*|cl[ií]nic\w*|m[eé]dic\w*|odont\w*|salud|consultorio|abogad\w*|inmobiliari\w*/i.test(clean)) {
    return "En clínicas, firmas y negocios de servicios, cada consulta que tarda en responderse por WhatsApp o Instagram es una cita que se pierde frente a la competencia.\n\nCon nuestras Soluciones 01 (Asistentes IA 24/7), 03 (CRM Automático) y 06 (Su Propia Plataforma Todo-en-Uno), sus clientes consultan horarios y agendan en menos de 1 segundo día y noche. ¿Con quién tengo el gusto y supera actualmente su facturación mensual los $5,000 USD?";
  }
  if (/precio\w*|costo\w*|cu[aá]nto|tarifa\w*|valor|presupuesto/i.test(clean)) {
    return "Cada implementación en Lhyo Group se adapta a la etapa y escala de su empresa (atendemos tanto a empresas consolidadas como a proyectos en crecimiento).\n\nEn una breve sesión ejecutiva de 15 minutos por videollamada con nuestro CEO le entregamos el presupuesto exacto para su país y nuestro Catálogo Privado PDF. ¿Cuál es su nombre, a qué se dedica su empresa y qué área desea automatizar primero?";
  }
  return "Es un verdadero gusto atenderle en Lhyo Group. Ponemos a disposición de su empresa nuestras 06 Soluciones Oficiales: Asistentes Inteligentes 24/7 para WhatsApp e Instagram, Plataformas Web (<0.8s), CRM Automático, Automatización Propia, IA con la Memoria de su Empresa y su Propia Plataforma Todo-en-Uno.\n\nPara brindarle una asesoría precisa para su negocio: ¿con quién tengo el gusto, a qué se dedica su empresa y qué área le gustaría impulsar hoy?";
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

    if (isOffTopic(userMessage)) {
      return NextResponse.json({
        ...nextState,
        reply: OFF_TOPIC_POLITE_MESSAGE,
        ready_for_crm: false,
        blocked: false
      });
    }

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
          horario_cita: "Calificado en Chat IA V41",
          nombre_cliente: nextState.lead_name,
          email_cliente: "Captado en Chat IA Web",
          empresa_web: nextState.company_name,
          facturacion_usd: nextState.revenue_tier,
          clasificacion: nextState.revenue_tier,
          servicio_elegido: `ASISTENTE IA V41 (${nextState.revenue_tier})`,
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
        }. He registrado formalmente la solicitud de su empresa en el sistema central de Lhyo Group.\n\nToque el botón dorado de abajo para elegir el día y la hora de su preferencia en nuestra Agenda Ejecutiva y descargar nuestro Catálogo Privado PDF de 1 sola página con las 06 Soluciones Oficiales.`
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
        replyText = buildStellarBusinessFallback(userMessage, nextState);
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
      reply: OFF_TOPIC_POLITE_MESSAGE,
      ready_for_crm: false,
      blocked: false
    });
  }
}