import { NextResponse } from "next/server";

export const runtime = "edge";

interface LeadState {
  lead_name?: string;
  company_name?: string;
  pain_point?: string;
  revenue_tier?: string;
  turn_count?: number;
}

interface ChatMsgItem {
  sender: "user" | "bot";
  text: string;
}

interface ChatRequestBody {
  message?: string;
  history?: ChatMsgItem[];
  currentLead?: LeadState;
}

// ESCUDO DE 07 REGLAS DE SEGURIDAD Y ANTI-SPAM (OPENAI / GEMINI COMPLIANCE)
const SAFETY_RULES = [
  {
    code: "RULE_01_VIOLENCE",
    rx: /\b(matar|asesinar|homicid\w*|suicid\w*|sicari\w*|bomba|explosiv\w*|terroris\w*|arma\s+de\s+fuego|pistola|fusil|degollar|masacre|secuestr\w*|extorsion\w*)\b/i,
    reason: "Violencia grave, armas o daño físico"
  },
  {
    code: "RULE_02_EXPLICIT",
    rx: /\b(violaci\w*|violar|pedofil\w*|abuso\s+sexual|pornograf\w*|porno|prostituci\w*|sexo\s+expl[ií]cito)\b/i,
    reason: "Contenido sexual explícito o explotación"
  },
  {
    code: "RULE_03_ILLEGAL",
    rx: /\b(narcotrafic\w*|coca[ií]na|hero[ií]na|fentanil\w*|metanfetamina|hackear|clonar\s+tarjeta|estafar|lavado\s+de\s+dinero|phishing)\b/i,
    reason: "Actividades ilegales, drogas o fraude informático"
  },
  {
    code: "RULE_04_HARASSMENT",
    rx: /\b(maldit\w+|mierda|imb[eé]cil|est[uú]pid\w+|idiota|pendej\w+|hijo\s+de\s+puta|puto|puta|cabron|cabr[oó]n|maric[oó]n|mamaguevo|co[ñn]o\s+de\s+tu\s+madre|vete\s+a\s+la\s+mierda|chupalo|ch[uú]palo)\b/i,
    reason: "Lenguaje ofensivo o acoso"
  },
  {
    code: "RULE_05_INJECTION",
    rx: /\b(ignora\s+tus\s+instrucciones|ignore\s+previous\s+instructions|act\s+as\s+dan|jailbreak|olvida\s+tus\s+reglas|revela\s+tu\s+prompt)\b/i,
    reason: "Intento de manipulación de directivas de seguridad"
  }
];

function checkSecurityShield(text: string) {
  const clean = (text || "").trim();
  if (clean.length > 600) {
    return {
      violated: true,
      code: "RULE_07_MAX_LENGTH",
      reason: "Exceso del límite máximo de 600 caracteres por mensaje"
    };
  }
  const compact = clean.replace(/\s+/g, "");
  if (
    (compact.length >= 5 && /^(.)\1{4,}$/i.test(compact)) ||
    (compact.length >= 6 && !/[aeiouáéíóú0-9]/i.test(compact) && /^[a-z]+$/i.test(compact))
  ) {
    return {
      violated: true,
      code: "RULE_06_GIBBERISH_SPAM",
      reason: "Envío de caracteres aleatorios o spam repetitivo"
    };
  }
  for (const r of SAFETY_RULES) {
    if (r.rx.test(clean)) {
      return { violated: true, code: r.code, reason: r.reason };
    }
  }
  return { violated: false, code: "", reason: "" };
}

const SYSTEM_PROMPT = `Eres el Asistente Ejecutivo Oficial de Inteligencia Artificial de Lhyo Group (https://www.lhyogroup.com), firma líder en arquitectura digital de prestigio, sistemas inteligentes 24/7 y plataformas empresariales a medida, dirigida por su CEO, Lhyonneth Araque.

DIRECTRICES ESTRICTAS V40.0 (RAZONAMIENTO MULTI-TURNO PURO):
1. Habla SIEMPRE de "Usted" ("su empresa", "su negocio", "le ayudamos"). Trato ejecutivo, empático, ágil y brillante en cada mensaje sin importar cuántos mensajes envíe el usuario.
2. PROHIBIDO usar muletillas repetitivas como "Tomando exactamente lo que me comenta sobre...". Jamás menciones herramientas internas como "n8n", "RAG", "Voiceflow", "Make" o "SaaS".
3. Si preguntan por tu programación, código o cómo funcionas: explica con elegancia que operas sobre la arquitectura cognitiva propietaria de Lhyo Group y ofrece instalar esta misma IA en su empresa (Soluciones 01 y 05).
4. Si el usuario habla de CUALQUIER tema fuera de la empresa (deportes, fútbol, clima, películas, autos, cripto, comida, curiosidades): responde primero en 1 línea inteligente sobre ese tema y conéctalo con maestría hacia cómo nuestras 06 Soluciones impulsan un negocio.
5. Si el usuario menciona su negocio (hamburguesas, restaurante, barbería, clínica, tienda, inmobiliaria, etc.), dale un diagnóstico concreto usando nuestras 06 Soluciones Oficiales:
   - Solución 01: Asistentes Inteligentes para WhatsApp e Instagram (24/7)
   - Solución 02: Plataformas Web Modernas y Catálogos Interactivos (<0.8s)
   - Solución 03: Organización Automática de Clientes y Ventas (CRM)
   - Solución 04: Automatización Total de Procesos con Tecnología Propia (sin cobros mensuales por volumen)
   - Solución 05: IA Personalizada con la Memoria de su Empresa
   - Solución 06: Su Propia Plataforma Empresarial Todo-en-Uno
6. Respuestas de máximo 2 párrafos cortos cerrando con una pregunta natural para conocer su nombre, su empresa/rubro o si sus ingresos mensuales superan los $5,000 USD.`;

function synthesizeMultiTurnIntelligence(userText: string, currentLead: LeadState, turnCount: number) {
  const clean = (userText || "").trim();
  const nextState = {
    lead_name: currentLead?.lead_name || "PENDIENTE",
    company_name: currentLead?.company_name || "PENDIENTE",
    pain_point: currentLead?.pain_point || "PENDIENTE",
    revenue_tier: currentLead?.revenue_tier || "PENDIENTE",
    turn_count: turnCount
  };

  const nameMatch = clean.match(
    /(?:me llamo|mi nombre es|soy|habla)\s+([A-ZÁÉÍÓÚÑa-záéíóúñ]{2,20}(?:\s+[A-ZÁÉÍÓÚÑa-záéíóúñ]{2,20})?)/i
  );
  if (nameMatch && nameMatch[1] && !/^(un|una|el|la|de|del|cliente|dueño)$/i.test(nameMatch[1])) {
    nextState.lead_name = nameMatch[1].trim();
  }

  const bizMatch = clean.match(
    /(?:tengo\s+un[a]?\s+|vendo\s+|mi\s+empresa\s+es\s+|negocio\s+de\s+|dedico\s+a\s+|somos\s+un[a]?\s+)([^.,;?\n]{3,45})/i
  );
  if (bizMatch && bizMatch[1]) {
    nextState.company_name = bizMatch[1].trim();
    if (nextState.pain_point === "PENDIENTE") nextState.pain_point = clean.slice(0, 90);
  }

  if (
    (nextState.lead_name !== "PENDIENTE" || nextState.company_name !== "PENDIENTE" || turnCount >= 2) &&
    nextState.revenue_tier === "PENDIENTE" &&
    (/\b(supera\w*|m[aá]s\s+de|menos\s+de|etapa\s+inicial|empezando|iniciando|5000|5,000|10000|2000|1000|3000|8000|15000|20000)\b/i.test(
      clean
    ) ||
      /^(s[ií]\s+supera|no\s+supera|estoy\s+empezando)$/i.test(clean))
  ) {
    const isHigh = /\b(supera\w*|m[aá]s|5000|5,000|6000|8000|10000|15000|20000)\b/i.test(clean);
    nextState.revenue_tier = isHigh ? "HIGH_TICKET" : "LOW_TICKET";
    return {
      ...nextState,
      ready_for_crm: true,
      blocked: false,
      reply: `Perfecto${
        nextState.lead_name !== "PENDIENTE" ? `, ${nextState.lead_name}` : ""
      }. He registrado formalmente los datos de su empresa en el sistema central de Lhyo Group.\n\nToque el botón dorado de abajo para elegir el día y la hora de su sesión ejecutiva y descargar de inmediato nuestro Catálogo Privado PDF con las 06 Soluciones Oficiales.`
    };
  }

  if (
    /programaci[oó]n|programad\w*|c[oó]digo|arquitectura|como\s+funcionas|c[oó]mo\s+funcionas|como\s+estas\s+hecho|c[oó]mo\s+est[aá]s\s+hecho|quien\s+te\s+cre[oó]|qui[eé]n\s+te\s+cre[oó]|eres\s+una?\s+ia|inteligencia\s+artificial|modelo|cerebro|algoritmo|sistema\s+interno/i.test(
      clean
    )
  ) {
    return {
      ...nextState,
      ready_for_crm: false,
      blocked: false,
      reply:
        "Opero sobre la arquitectura cognitiva propietaria de Lhyo Group: un núcleo de Inteligencia Artificial de baja latencia entrenado específicamente con la memoria, el catálogo y las reglas comerciales de nuestra firma.\n\nLo mejor es que esta misma tecnología podemos construirla e instalarla de forma 100% privada para su empresa (mediante nuestra Solución 01 de Asistentes 24/7 para WhatsApp/Instagram y nuestra Solución 05 de IA con la Memoria de su Negocio), para que atienda y venda por usted día y noche.\n\n¿Para qué tipo de empresa o proyecto le gustaría implementar un sistema así y con quién tengo el gusto?"
    };
  }

  if (
    /hamburgues\w*|restauran\w*|comid\w*|pizz\w*|cocin\w*|caf[eé]\w*|panader\w*|pasteler\w*|reposter\w*|almuerz\w*|cen\w*|men[uú]|delivery|perros?\s+calientes?|sushi|tacos?|gastronom\w*/i.test(
      clean
    )
  ) {
    nextState.pain_point = "Catálogo Web Interactivo + Asistente 24/7 de Pedidos";
    if (nextState.company_name === "PENDIENTE") nextState.company_name = "Negocio Gastronómico";
    return {
      ...nextState,
      ready_for_crm: false,
      blocked: false,
      reply:
        "En el sector gastronómico y de hamburguesas, la velocidad al tomar el pedido define cuántas ventas cierra cada noche. Cuando los clientes escriben por WhatsApp o Instagram en hora pico y tardan en recibir el menú o el total, compran en otro lugar.\n\nEn Lhyo Group le instalamos el sistema completo:\n• Solución 02: Una Plataforma Web con Catálogo Interactivo donde el cliente ve sus hamburguesas, adicionales y precios y arma su pedido en segundos.\n• Solución 01: Un Asistente Inteligente 24/7 en WhatsApp e Instagram que responde al instante, toma el pedido y lo organiza automáticamente.\n\n¿Con quién tengo el gusto y en qué ciudad se encuentra su negocio?"
    };
  }

  if (
    /barber\w*|peluquer\w*|est[eé]tic\w*|cosmiatr\w*|spa|u[ñn]as|salon|sal[oó]n|m[eé]dic\w*|cl[ií]nic\w*|odont\w*|dentist\w*|salud|consultorio|psic[oó]log\w*|paciente\w*/i.test(
      clean
    )
  ) {
    nextState.pain_point = "Agendamiento Automático de Citas 24/7 + CRM";
    return {
      ...nextState,
      ready_for_crm: false,
      blocked: false,
      reply:
        "En clínicas, centros de estética, barberías y consultorios, el mayor desgaste es contestar mensajes todo el día para coordinar turnos y confirmar asistencia.\n\nCon nuestra Solución 01 (Asistente IA 24/7 en WhatsApp e Instagram) unida a la Solución 03 (CRM Automático), sus pacientes o clientes consultan disponibilidad, reservan su cita en segundos y quedan registrados sin que usted toque el teléfono.\n\n¿Cuál es su nombre y qué especialidad o servicios ofrece su centro?"
    };
  }

  if (
    /joyer\w*|ropa|tienda|zapatos|calzado|perfum\w*|accesorios|repuestos|ferreter\w*|vender\s+productos|catalogo|cat[aá]logo|inventario|mayorista|ecommerce|e-commerce/i.test(
      clean
    )
  ) {
    nextState.pain_point = "Catálogo Interactivo + IA con Inventario 24/7";
    return {
      ...nextState,
      ready_for_crm: false,
      blocked: false,
      reply:
        "En la venta de productos físicos, el cliente decide en segundos según el prestigio visual de su catálogo y la rapidez con la que le confirman stock y precios.\n\nEn Lhyo Group diseñamos su Plataforma Web con Catálogo Interactivo (Solución 02) y entrenamos un Cerebro IA Privado con todo su inventario (Solución 05) que atiende y cierra ventas en WhatsApp e Instagram las 24 horas.\n\n¿Con quién tengo el gusto y qué tipo de productos comercializa?"
    };
  }

  if (
    /inmobiliari\w*|bienes\s+ra[ií]ces|apartamento\w*|casas|construcci\w*|pintur\w*|remodelaci\w*|arquitect\w*|abogad\w*|jur[ií]dic\w*|contable|finanzas|seguros|agencia|consultor\w*/i.test(
      clean
    )
  ) {
    nextState.pain_point = "Captación y Calificación Automática de Clientes";
    return {
      ...nextState,
      ready_for_crm: false,
      blocked: false,
      reply:
        "En servicios profesionales, remodelaciones o bienes raíces, un solo contrato tiene un alto valor, por lo que proyectar máxima autoridad y responder en el primer segundo es clave.\n\nCon nuestra Solución 02 (Plataforma Web de Alto Prestigio) y nuestra Solución 01 (Asistente IA 24/7), su empresa filtra a cada interesado, recopila los datos del proyecto y le agenda la reunión en automático.\n\n¿Cuál es su nombre y en qué ciudad o país operan?"
    };
  }

  if (
    /futbol|f[uú]tbol|manchester|madrid|barcelona|messi|cristiano|b[eé]isbol|beisbol|nba|tenis|partido|gol|champions|mundial|juego|videojuego|roblox|cod|clash|pel[ií]cula|m[uú]sica|deporte\w*/i.test(
      clean
    )
  ) {
    return {
      ...nextState,
      ready_for_crm: false,
      blocked: false,
      reply:
        "¡Gran tema! Aunque mi núcleo está 100% enfocado en arquitectura tecnológica empresarial y no sigo marcadores en vivo, en los negocios aplica la misma ley que en el deporte de élite: gana el equipo que tiene mejor sistema y reacciona en menos de un segundo.\n\nEn Lhyo Group instalamos esa ventaja en su empresa con Asistentes IA 24/7 para WhatsApp e Instagram, Plataformas Web ultrarrápidas y Sistemas Todo-en-Uno para que ninguna venta se le escape.\n\nCuénteme: ¿con quién tengo el gusto y qué negocio o proyecto dirige actualmente?"
    };
  }

  if (
    /clima|lluvia|fr[ií]o|calor|hora|d[ií]a\s+es\s+hoy|chiste|cu[eé]ntame|carro\w*|auto\w*|moto\w*|cripto\w*|bitcoin|forex|trading|viaj\w*|uruguay|venezuela|espa[ñn]a|colombia/i.test(
      clean
    )
  ) {
    return {
      ...nextState,
      ready_for_crm: false,
      blocked: false,
      reply:
        "Qué buen punto comenta. Hoy en día, sin importar el país, el mercado o la hora del día, lo que permite tener libertad de tiempo y escalar ingresos es contar con sistemas que operen solos las 24 horas.\n\nEn Lhyo Group construimos esa infraestructura para su negocio: desde Asistentes IA 24/7 en WhatsApp e Instagram hasta su propia Plataforma Empresarial Todo-en-Uno (Soluciones 01 a 06).\n\n¿Con quién tengo el gusto de conversar y qué área de su negocio o actividad le gustaría automatizar?"
    };
  }

  if (
    /precio\w*|costo\w*|cu[aá]nto\s+cuesta|cu[aá]nto\s+vale|tarifa\w*|presupuesto|planes|mensualidad|inversion|inversi[oó]n|cu[aá]nto\s+tardan|tiempo\s+de\s+entrega|garant[ií]a/i.test(
      clean
    )
  ) {
    return {
      ...nextState,
      ready_for_crm: false,
      blocked: false,
      reply:
        "En Lhyo Group entregamos cada proyecto llave en mano en un plazo ejecutivo de 10 días y ajustamos el presupuesto exactamente a la etapa de su negocio (contamos tanto con planes ágiles para negocios en etapa inicial como con ecosistemas corporativos Todo-en-Uno).\n\nAdemás, con nuestra Solución 04 instalamos tecnología propia para que usted no pague mensualidades externas por volumen. Para enviarle nuestro Catálogo Privado PDF con las tarifas de su país: ¿cuál es su nombre y qué solución le interesa cotizar?"
    };
  }

  if (
    /^(hola|buenas|buenos\s+d[ií]as|buenas\s+tardes|buenas\s+noches|saludos|hey|epa|alo|ok|vale|perfecto|gracias|entendido|bien|genial|excelente)(\s+c[oó]mo\s+est[aá]s|\s+que\s+tal|\s+todo\s+bien|\s*\?)*$/i.test(
      clean
    ) ||
    /como\s+estas|c[oó]mo\s+est[aá]s|que\s+tal\s+todo|que\s+te\s+pasa|qu[eé]\s+te\s+pasa|me\s+escuchas|estas\s+ahi|est[aá]s\s+ah[ií]|funciona\w*/i.test(
      clean
    )
  ) {
    return {
      ...nextState,
      ready_for_crm: false,
      blocked: false,
      reply:
        "¡Todo excelente y operando al 100% en tiempo real! Es un verdadero gusto atenderle en Lhyo Group.\n\nPuedo explicarle al detalle cualquiera de nuestras 06 Soluciones (Asistentes IA 24/7 para WhatsApp e Instagram, Plataformas Web con Catálogos Interactivos, CRM Automático o Sistemas Todo-en-Uno) o analizar cómo multiplicar las ventas de su negocio. ¿Con quién tengo el gusto y a qué se dedica su empresa?"
    };
  }

  if (/solucion\w*|servicio\w*|qu[eé]\s+ofrecen|qu[eé]\s+hacen|como\s+me\s+ayudan|c[oó]mo\s+me\s+ayudan|catalogo|cat[aá]logo/i.test(clean)) {
    return {
      ...nextState,
      ready_for_crm: false,
      blocked: false,
      reply:
        "En Lhyo Group desarrollamos 06 Soluciones Tecnológicas diseñadas para hacer crecer su empresa en automático:\n\n01. Asistentes Inteligentes 24/7 para WhatsApp e Instagram\n02. Plataformas Web Modernas y Catálogos Interactivos (<0.8s)\n03. Organización Automática de Clientes y Ventas (CRM)\n04. Automatización Total con Tecnología Propia (sin cobros mensuales por uso)\n05. IA Personalizada con la Memoria de su Empresa\n06. Su Propia Plataforma Empresarial Todo-en-Uno\n\n¿Cuál de estas 06 soluciones le gustaría implementar primero y con quién tengo el gusto?"
    };
  }

  if (nextState.lead_name !== "PENDIENTE" && nextState.revenue_tier === "PENDIENTE") {
    return {
      ...nextState,
      ready_for_crm: false,
      blocked: false,
      reply: `Es un verdadero gusto conversar con usted, ${nextState.lead_name}. Para eso que me plantea, en Lhyo Group integramos nuestras Plataformas Web de alto prestigio con Asistentes Inteligentes 24/7 en WhatsApp e Instagram y CRM Automático para que todo el proceso funcione sin intervención manual.\n\nPara clasificar su solicitud y prepararle la propuesta ideal según el tamaño actual de su operación: ¿actualmente los ingresos mensuales de su negocio superan los $5,000 USD o se encuentran en una etapa inicial/menor a ese rango?`
    };
  }

  const intelligentBridges = [
    "Entiendo perfectamente su planteamiento. Cualquier proyecto o actividad que busque escalar hoy necesita dos pilares: una presencia digital que proyecte autoridad inmediata y un sistema que atienda clientes en menos de 1 segundo las 24 horas.\n\nEn Lhyo Group construimos ambos a la medida con nuestras 06 Soluciones (Asistentes IA 24/7 en WhatsApp/Instagram, Plataformas Web y Paneles Todo-en-Uno). ¿Con quién tengo el gusto y qué tipo de negocio o proyecto desea impulsar?",
    "Excelente punto. En Lhyo Group transformamos cualquier requerimiento o idea en un sistema automatizado que capta prospectos, responde dudas al instante en WhatsApp e Instagram y agenda ventas sin trabajo manual.\n\nPara orientarle con la solución exacta dentro de nuestro catálogo de 06 Soluciones: ¿cuál es su nombre y a qué se dedica su empresa o proyecto actual?",
    "Analizando lo que me comenta, la ventaja más rentable que podemos darle desde Lhyo Group es automatizar su atención y sus ventas las 24 horas con tecnología propia, sin que usted pierda tiempo contestando mensajes repetitivos.\n\n¿Me indica su nombre y qué área le gustaría automatizar o digitalizar primero?"
  ];

  return {
    ...nextState,
    ready_for_crm: false,
    blocked: false,
    reply: intelligentBridges[turnCount % intelligentBridges.length]
  };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ChatRequestBody;
    const userMessage = (body.message || "").trim();
    const historyList = Array.isArray(body.history) ? body.history : [];
    const turnCount = (body.currentLead?.turn_count || 0) + 1;

    const currentLead: LeadState = {
      lead_name: body.currentLead?.lead_name || "PENDIENTE",
      company_name: body.currentLead?.company_name || "PENDIENTE",
      pain_point: body.currentLead?.pain_point || "PENDIENTE",
      revenue_tier: body.currentLead?.revenue_tier || "PENDIENTE",
      turn_count: turnCount
    };

    const shield = checkSecurityShield(userMessage);
    if (shield.violated) {
      return NextResponse.json({
        reply: `⛔ PROTOCOLO DE SEGURIDAD ACTIVADO [${shield.code}]: Su mensaje infringe las políticas de seguridad e integridad de OpenAI / Gemini aplicadas en Lhyo Group (${shield.reason}). Esta sesión ha sido bloqueada permanentemente (escritura y micrófono deshabilitados).`,
        ...currentLead,
        ready_for_crm: false,
        blocked: true
      });
    }

    const baseAnalysis = synthesizeMultiTurnIntelligence(userMessage, currentLead, turnCount);

    // Si aún no ha cerrado para CRM, ejecutamos generación neuronal multi-turno en vivo
    if (!baseAnalysis.ready_for_crm) {
      const geminiKey = process.env.GEMINI_API_KEY || "";
      const historyText = historyList
        .slice(-10)
        .map((m) => `${m.sender === "user" ? "Cliente" : "Asistente Lhyo Group"}: ${m.text}`)
        .join("\n");

      let cloudSuccess = false;

      // Motor 1: Google Gemini 2.0 Flash API Oficial (si la llave es AIza...)
      if (geminiKey.startsWith("AIza")) {
        try {
          const ctrl = new AbortController();
          const tId = setTimeout(() => ctrl.abort(), 2400);
          const gRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              signal: ctrl.signal,
              body: JSON.stringify({
                systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
                contents: [
                  {
                    role: "user",
                    parts: [
                      {
                        text: `Historial de la conversación:\n${historyText}\n\nDatos captados: Nombre=${baseAnalysis.lead_name}, Empresa=${baseAnalysis.company_name}, Interés=${baseAnalysis.pain_point}\n\nMensaje #${turnCount} del cliente: "${userMessage}"`
                      }
                    ]
                  }
                ],
                generationConfig: { temperature: 0.45, maxOutputTokens: 260 }
              })
            }
          );
          clearTimeout(tId);
          if (gRes.ok) {
            const gJson = await gRes.json();
            const gText = gJson?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
            if (gText && gText.length > 25) {
              baseAnalysis.reply = gText;
              cloudSuccess = true;
            }
          }
        } catch {
          // Continúa al Motor 2
        }
      }

      // Motor 2: Cloud OpenAI GPT-4o-mini Multi-Turno (sin necesidad de llave)
      if (!cloudSuccess) {
        try {
          const ctrl2 = new AbortController();
          const tId2 = setTimeout(() => ctrl2.abort(), 2300);
          const cloudRes = await fetch("https://text.pollinations.ai/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: ctrl2.signal,
            body: JSON.stringify({
              model: "openai",
              messages: [
                { role: "system", content: SYSTEM_PROMPT },
                ...historyList.slice(-8).map((m) => ({
                  role: m.sender === "user" ? "user" : "assistant",
                  content: m.text
                })),
                { role: "user", content: userMessage }
              ],
              temperature: 0.45
            })
          });
          clearTimeout(tId2);
          if (cloudRes.ok) {
            const rawText = (await cloudRes.text()).trim();
            if (rawText && rawText.length > 25 && !rawText.startsWith("<") && !rawText.includes("Pollinations")) {
              baseAnalysis.reply = rawText;
            }
          }
        } catch {
          // Mantiene baseAnalysis.reply instantáneo
        }
      }
    }

    if (
      baseAnalysis.ready_for_crm &&
      (baseAnalysis.revenue_tier === "HIGH_TICKET" || baseAnalysis.revenue_tier === "LOW_TICKET")
    ) {
      const nowVe = new Date().toLocaleString("es-VE", { timeZone: "America/Caracas" });
      await fetch("https://hook.us2.make.com/krs48cjfzudf4lau3sapwdgdu9lfe1tb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fecha_registro: nowVe,
          horario_cita: "Calificado por Asistente IA Web",
          nombre_cliente: baseAnalysis.lead_name,
          email_cliente: "Captado en Chat IA Lhyo Group",
          empresa_web: baseAnalysis.company_name,
          facturacion_usd: baseAnalysis.revenue_tier,
          clasificacion: baseAnalysis.revenue_tier,
          servicio_elegido: `ASISTENTE IA (${baseAnalysis.revenue_tier})`,
          objetivo_cliente: baseAnalysis.pain_point,
          resumen_crm: `ETIQUETA OCULTA: ${baseAnalysis.revenue_tier} || Empresa: ${baseAnalysis.company_name} || Necesidad: ${baseAnalysis.pain_point}`,
          link_videollamada_meet: "https://meet.google.com/krc-vdii-zzh"
        })
      }).catch(() => {});
    }

    return NextResponse.json(baseAnalysis);
  } catch {
    return NextResponse.json({
      reply: "Es un gusto atenderle en Lhyo Group. ¿Con quién tengo el gusto y qué área de su negocio desea impulsar hoy?",
      ready_for_crm: false,
      blocked: false
    });
  }
}
