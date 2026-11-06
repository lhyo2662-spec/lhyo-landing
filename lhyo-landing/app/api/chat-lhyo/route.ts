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
  turn_count?: number;
}

const MAX_HISTORY_MESSAGES = 20;

// ============================================================================
// 1. EL "SYSTEM PROMPT" MAESTRO (ADN DEL CONSULTOR ESTRATÉGICO JEFE)
// ============================================================================
const MASTER_SYSTEM_PROMPT = `Eres el Consultor Estratégico Jefe y Director de Admisiones de Lhyo Group (https://www.lhyogroup.com), firma de arquitectura tecnológica empresarial y automatización dirigida por su CEO, Lhyonneth Araque.

DIRECTIVAS ABSOLUTAS:
1. IDENTIDAD Y TONO: Tu tono es quirúrgico, corporativo, de élite y siempre tratas al usuario de "Usted". Hablas como un experto en negocios implacable. Jamás revelas que eres una IA de Google u OpenAI.
2. CONOCIMIENTO ANALÍTICO DE NUESTRAS 06 SOLUCIONES:
   - Solución 01: Asistentes Inteligentes para WhatsApp e Instagram (24/7) — Respuesta en < 1s y agendamiento automático.
   - Solución 02: Plataformas Web Modernas y Catálogos Interactivos — Carga ultrarrápida (< 0.8s) y autoridad corporativa.
   - Solución 03: Organización Automática de Clientes y Ventas (CRM) — Clasificación automática sin anotar nada a mano.
   - Solución 04: Automatización Total de Procesos con Tecnología Propia — Ecosistemas autónomos sin tarifas mensuales por volumen.
   - Solución 05: Inteligencia Artificial Personalizada con la Memoria de su Empresa — Cerebros privados entrenados con los documentos y precios del negocio.
   - Solución 06: Su Propia Plataforma Empresarial Todo-en-Uno — Ventas, clientes, agenda y finanzas unificadas en una sola pantalla.
   Si un cliente describe su negocio, analízalo al instante y recomienda la solución exacta que mitigará su fuga de capital.
3. LA MANIOBRA DE PIVOTE (CRÍTICO):
   Tienes estrictamente prohibido responder dudas ajenas a negocios, tecnología o escalabilidad. Si te preguntan algo irrelevante (recetas, deportes, clima, chistes, cine), DEBES conectar esa pregunta con nuestros servicios de forma natural y elegante en máximo 2 párrafos cortos.
   Ejemplo: Si preguntan "¿Cuál es el mejor equipo de fútbol?", respondes: "La sincronización de un equipo de élite es exactamente lo que construimos en Lhyo Group. Nosotros no analizamos deportes, pero diseñamos Asistentes Inteligentes 24/7 y Plataformas Empresariales Todo-en-Uno que hacen que su empresa opere con esa misma precisión. ¿Qué proceso está frenando las ventas de su negocio hoy?"
4. RECOLECCIÓN EJECUTIVA:
   Durante la charla, identifica de forma natural: Nombre del cliente, Empresa/Giro, Necesidad principal y si sus ingresos mensuales superan o no los $5,000 USD.
5. FORMATO: Máximo 2 párrafos cortos y contundentes por mensaje. Nunca repitas entre comillas lo que dijo el cliente.`;

// ============================================================================
// 2. BLINDAJE Y SEGURIDAD (SAFETY GUARDRAILS — 7 REGLAS ESTRICTAS)
// ============================================================================
const STRICT_SAFETY_PATTERNS: { code: string; regex: RegExp }[] = [
  {
    code: "RULE_01_VIOLENCE",
    regex: /\b(matar|asesinar|homicid\w*|suicid\w*|bomba|explosiv\w*|terroris\w*|sicari\w*|pistola|fusil|secuestrar|extorsion\w*)\b/i
  },
  {
    code: "RULE_02_EXPLICIT",
    regex: /\b(violaci\w*|violar|pedofil\w*|abuso\s+sexual|pornograf\w*|porno|sexo\s+expl[ií]cito|prostituci\w*)\b/i
  },
  {
    code: "RULE_03_ILLEGAL",
    regex: /\b(narcotrafic\w*|coca[ií]na|hero[ií]na|fentanil\w*|metanfetamina|hackear|clonar\s+tarjeta|lavado\s+de\s+dinero)\b/i
  },
  {
    code: "RULE_04_HARASSMENT",
    regex: /\b(maldit\w+|mierda|imb[eé]cil|est[uú]pid\w+|idiota|pendej\w+|hijo\s+de\s+puta|puto|puta|cabr[oó]n|maric[oó]n|mamaguevo|vete\s+a\s+la\s+mierda)\b/i
  },
  {
    code: "RULE_05_PROMPT_INJECTION",
    regex: /\b(ignore\s+previous\s+instructions|olvida\s+tus\s+instrucciones|revela\s+tu\s+system\s+prompt|modo\s+desarrollador|jailbreak)\b/i
  },
  {
    code: "RULE_06_SPAM_FLOOD",
    regex: /(.)\1{6,}|^[asdfghjklqwertyuiopzxcvbnm]{12,}$/i
  }
];

function checkSecurityViolation(text: string): string | null {
  const clean = (text || "").trim();
  if (clean.length > 650) return "RULE_07_MAX_LENGTH";
  for (const item of STRICT_SAFETY_PATTERNS) {
    if (item.regex.test(clean)) return item.code;
  }
  return null;
}

// ============================================================================
// 3. MOTOR DUAL PRE-ARMADO (GEMINI FLASH + OPENAI CLOUD ZERO-KEY + PIVOTE LOCAL)
// ============================================================================
async function executeDualEngineBrain(
  userMessage: string,
  slidingHistory: HistoryItem[],
  leadState: LeadState
): Promise<{ reply: string; engine: string }> {
  const geminiKey = (process.env.GEMINI_API_KEY || "").trim();
  const openaiKey = (process.env.OPENAI_API_KEY || "").trim();

  const contextSummary = `Estado actual del prospecto: Nombre=${leadState.lead_name}, Empresa=${leadState.company_name}, Necesidad=${leadState.pain_point}, Nivel=${leadState.revenue_tier}.`;

  // CAPA 1: Google Gemini 1.5 Flash Oficial (si existe llave estándar AIzaSy...)
  if (geminiKey.startsWith("AIza")) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2200);

      const contents = [
        ...slidingHistory.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.text }]
        })),
        {
          role: "user",
          parts: [{ text: `[Contexto interno: ${contextSummary}]\nMensaje del cliente: ${userMessage}` }]
        }
      ];

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            system_instruction: { parts: [{ text: MASTER_SYSTEM_PROMPT }] },
            contents,
            safetySettings: [
              { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_LOW_AND_ABOVE" },
              { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_LOW_AND_ABOVE" },
              { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_LOW_AND_ABOVE" },
              { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_LOW_AND_ABOVE" }
            ],
            generationConfig: { temperature: 0.35, maxOutputTokens: 320 }
          })
        }
      );
      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (text) return { reply: text, engine: "GEMINI_1.5_FLASH_OFFICIAL" };
      }
    } catch {
      // Conmutación automática a Capa 2
    }
  }

  // CAPA 2: OpenAI Oficial (si existe llave sk-...)
  if (openaiKey.startsWith("sk-")) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2400);
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.35,
          max_tokens: 320,
          messages: [
            { role: "system", content: `${MASTER_SYSTEM_PROMPT}\n${contextSummary}` },
            ...slidingHistory.map((m) => ({ role: m.role, content: m.text })),
            { role: "user", content: userMessage }
          ]
        })
      });
      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        const text = data?.choices?.[0]?.message?.content?.trim();
        if (text) return { reply: text, engine: "OPENAI_GPT4O_MINI_OFFICIAL" };
      }
    } catch {
      // Conmutación automática a Capa 3
    }
  }

  // CAPA 3: Motor Neuronal Cloud Pre-Armado (Zero-Key OpenAI Compatible — Funciona sin llaves a $0.00 USD)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2600);
    const cloudRes = await fetch("https://text.pollinations.ai/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: "openai",
        temperature: 0.35,
        messages: [
          { role: "system", content: `${MASTER_SYSTEM_PROMPT}\n${contextSummary}` },
          ...slidingHistory.map((m) => ({ role: m.role, content: m.text })),
          { role: "user", content: userMessage }
        ]
      })
    });
    clearTimeout(timeout);

    if (cloudRes.ok) {
      const cloudJson = await cloudRes.json();
      const cloudText = cloudJson?.choices?.[0]?.message?.content?.trim();
      if (cloudText && cloudText.length > 15) {
        return { reply: cloudText, engine: "DUAL_CLOUD_NEURAL_ENGINE" };
      }
    }
  } catch {
    // Conmutación instantánea al Núcleo Determinista de Admisiones
  }

  // CAPA 4: Núcleo Determinista de Respuesta Inmediata (< 1ms) con Maniobra de Pivote
  return {
    reply: buildDeterministicStrategicReply(userMessage, leadState),
    engine: "LHYO_STRATEGIC_CORE_0MS"
  };
}

function buildDeterministicStrategicReply(userMessage: string, state: LeadState): string {
  const lower = userMessage.toLowerCase();

  // Maniobra de Pivote para temas irrelevantes (deportes, cocina, clima, chistes, etc.)
  if (
    /\b(futbol|fútbol|manchester|real madrid|barcelona|messi|cristiano|deporte|partido|clima|lluvia|receta|cocinar|chiste|pelicula|película|juego|musica|música)\b/i.test(
      lower
    )
  ) {
    return "La sincronización y precisión de alto rendimiento es exactamente lo que construimos en Lhyo Group. Nosotros no analizamos temas de entretenimiento o deportes, pero implementamos Asistentes Inteligentes 24/7, Plataformas Web de alto prestigio y Sistemas Todo-en-Uno que hacen que su empresa opere con precisión milimétrica día y noche.\n\n¿Qué proceso o área está frenando el crecimiento de las ventas de su negocio hoy?";
  }

  // Consultas de precios o tarifas
  if (/\b(precio|precios|costo|cuanto|cuánto|vale|tarifa|presupuesto|planes)\b/i.test(lower)) {
    return "En Lhyo Group cada arquitectura tecnológica se estructura a la medida de la escala operativa de su empresa, contando con líneas tanto para empresas consolidadas como para negocios en fase de crecimiento.\n\nEn una breve sesión ejecutiva de 15 minutos con nuestro CEO le entregamos el presupuesto exacto para su país y nuestro Catálogo Privado PDF. ¿Con quién tengo el gusto y a qué se dedica su empresa?";
  }

  // Negocios gastronómicos / restaurantes / comida
  if (/\b(hamburgues\w*|restauran\w*|comida\w*|pizz\w*|panader\w*|cafeter\w*|delivery)\b/i.test(lower)) {
    return "En el sector gastronómico la fuga de capital ocurre cuando los clientes escriben en horas pico y tardan en recibir respuesta o el menú. En Lhyo Group lo resolvemos instalando un Catálogo Web Interactivo de carga instantánea conectado a un Asistente Inteligente 24/7 en su WhatsApp e Instagram que toma pedidos y reservas en menos de 1 segundo.\n\n¿Con quién tengo el gusto y en qué ciudad opera su negocio gastronómico?";
  }

  if (state.lead_name && state.lead_name !== "PENDIENTE" && state.revenue_tier === "PENDIENTE") {
    return `Excelente, ${state.lead_name}. Para que nuestro sistema de admisiones clasifique su solicitud y prepare la arquitectura exacta según la escala actual de su operación: ¿actualmente los ingresos mensuales de su negocio superan los $5,000 USD o se encuentran en una etapa inicial/menor a ese rango?`;
  }

  return "En Lhyo Group eliminamos los cuellos de botella de su operación mediante nuestras 06 Soluciones Oficiales: Asistentes Inteligentes 24/7 para WhatsApp e Instagram, Plataformas Web de alto prestigio, CRM Automatizado, Automatización Propia, IA con la Memoria de su Empresa y Plataformas Todo-en-Uno.\n\n¿Con quién tengo el gusto, cuál es el giro de su negocio y qué área desea escalar hoy?";
}

// ============================================================================
// 4. ENDPOINT POST PRINCIPAL DE LA WEB
// ============================================================================
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ChatRequestBody;
    const userMessage = (body.message || "").trim();
    const rawHistory = Array.isArray(body.history) ? body.history : [];
    const slidingHistory = rawHistory.slice(-MAX_HISTORY_MESSAGES);

    const state: LeadState = {
      lead_name: body.currentLead?.lead_name || "PENDIENTE",
      company_name: body.currentLead?.company_name || "PENDIENTE",
      pain_point: body.currentLead?.pain_point || "PENDIENTE",
      revenue_tier: body.currentLead?.revenue_tier || "PENDIENTE"
    };

    // 1. Verificar Safety Guardrails
    const violationCode = checkSecurityViolation(userMessage);
    if (violationCode) {
      return NextResponse.json({
        reply: `⛔ PROTOCOLO DE SEGURIDAD ACTIVADO (${violationCode}): Por políticas de integridad corporativa de Lhyo Group, esta sesión ha sido cerrada y bloqueada permanentemente.`,
        ...state,
        ready_for_crm: false,
        blocked: true,
        violation_code: violationCode
      });
    }

    // 2. Extracción inteligente de variables en segundo plano
    const nameMatch = userMessage.match(
      /(?:me llamo|mi nombre es|soy|habla)\s+([A-ZÁÉÍÓÚÑa-záéíóúñ]{2,20}(?:\s+[A-ZÁÉÍÓÚÑa-záéíóúñ]{2,20})?)/i
    );
    if (nameMatch?.[1]) state.lead_name = nameMatch[1].trim();

    const companyMatch = userMessage.match(
      /(?:empresa se llama|mi empresa es|negocio de|tengo una?|tenemos una?|venta de)\s+([A-ZÁÉÍÓÚÑa-záéíóúñ0-9\s]{3,35})/i
    );
    if (companyMatch?.[1]) state.company_name = companyMatch[1].trim();

    if (state.pain_point === "PENDIENTE" && userMessage.length > 8) {
      state.pain_point = userMessage.slice(0, 100);
    }

    const lower = userMessage.toLowerCase();
    let readyForCrm = false;
    if (
      state.lead_name !== "PENDIENTE" &&
      state.revenue_tier === "PENDIENTE" &&
      /\b(si|sí|supera|mas|más|no|menos|inicial|empezando|5000|5,000)\b/i.test(lower)
    ) {
      const isHigh = /\b(si|sí|supera|mas|más)\b/i.test(lower) && !/\bno\b/i.test(lower);
      state.revenue_tier = isHigh ? "HIGH_TICKET" : "LOW_TICKET";
      readyForCrm = true;
    }

    // 3. Ejecutar el Motor Dual Pre-Armado con Memoria de 20 Mensajes
    const { reply, engine } = await executeDualEngineBrain(userMessage, slidingHistory, state);

    // 4. Inyección automática en CRM Oficial si completó calificación
    if (readyForCrm && (state.revenue_tier === "HIGH_TICKET" || state.revenue_tier === "LOW_TICKET")) {
      const nowVe = new Date().toLocaleString("es-VE", { timeZone: "America/Caracas" });
      await fetch("https://hook.us2.make.com/krs48cjfzudf4lau3sapwdgdu9lfe1tb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fecha_registro: nowVe,
          horario_cita: "Calificado por Consultor Estratégico IA",
          nombre_cliente: state.lead_name,
          email_cliente: "Captado en Chat IA Lhyo Group",
          empresa_web: state.company_name,
          facturacion_usd: state.revenue_tier,
          clasificacion: state.revenue_tier,
          servicio_elegido: `ADMISIONES IA (${state.revenue_tier})`,
          objetivo_cliente: state.pain_point,
          resumen_crm: `MOTOR: ${engine} || ETIQUETA: ${state.revenue_tier} || Empresa: ${state.company_name} || Dolor: ${state.pain_point}`,
          link_videollamada_meet: "https://meet.google.com/krc-vdii-zzh"
        })
      }).catch(() => {});
    }

    return NextResponse.json({
      reply,
      engine_used: engine,
      ...state,
      ready_for_crm: readyForCrm,
      blocked: false
    });
  } catch {
    return NextResponse.json({
      reply: "Bienvenido al canal de Admisiones Estratégicas de Lhyo Group. ¿Con quién tengo el gusto y qué proceso de su empresa busca escalar hoy?",
      ready_for_crm: false,
      blocked: false
    });
  }
}