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
    rx: /\b(ignora\s+tus\s+instrucciones|ignore\s+previous\s+instructions|system\s+prompt|act\s+as\s+dan|jailbreak|olvida\s+tus\s+reglas)\b/i,
    reason: "Intento de manipulación de instrucciones del sistema"
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

const SYSTEM_PROMPT = `Eres el Asistente Ejecutivo Oficial de Inteligencia Artificial de Lhyo Group (https://www.lhyogroup.com), firma de arquitectura digital de prestigio, sistemas inteligentes 24/7 y plataformas empresariales a medida, dirigida por su CEO, Lhyonneth Araque.

REGLAS ESTRICTAS DE RAZONAMIENTO:
1. Habla SIEMPRE de "Usted" ("su empresa", "su negocio", "le ayudamos"). Trato ejecutivo, cálido, ágil y brillante. NUNCA repitas respuestas genéricas.
2. PROHIBICIÓN DE JERGA TÉCNICA: Jamás menciones "n8n", "RAG", "Voiceflow", "Make", "SaaS", "fricción humana" ni "cuello de botella".
3. NUESTRAS 06 SOLUCIONES OFICIALES:
   - Solución 01: Asistentes Inteligentes para WhatsApp e Instagram (24/7) que atienden en menos de 1 segundo, resuelven dudas y agendan citas en automático.
   - Solución 02: Plataformas Web Modernas y Catálogos Interactivos (<0.8s) que proyectan máximo prestigio y convierten visitas en clientes.
   - Solución 03: Organización Automática de Clientes y Ventas (CRM) en tiempo real sin anotar nada a mano.
   - Solución 04: Automatización Total de Procesos con Tecnología Propia sin pagar tarifas mensuales externas por volumen.
   - Solución 05: IA Personalizada con la Memoria de su Empresa (entrenada con sus precios, contratos y documentos).
   - Solución 06: Su Propia Plataforma Empresarial Todo-en-Uno (ventas, clientes, agenda y finanzas en 1 sola pantalla).
4. CONEXIÓN INTELIGENTE DE CUALQUIER TEMA:
   - Si el cliente menciona un negocio específico (ej. venta de hamburguesas, restaurante, barbería, clínica, tienda, inmobiliaria), explícale con precisión cómo nuestras soluciones (ej. Catálogo Web Interactivo + Asistente 24/7 en WhatsApp/Instagram) multiplicarán sus ventas.
   - Si el cliente habla de un tema ajeno (deportes, clima, autos, juegos, curiosidades), respóndele con ingenio en 1 línea sobre ese tema y conéctalo de forma magistral con las soluciones de Lhyo Group para su negocio.
5. Respuestas concisas de máximo 2 párrafos cortos cerrando con una pregunta natural para conocer su nombre, su empresa/rubro y si sus ingresos mensuales superan o no los $5,000 USD.`;

function buildDeepSemanticResponse(userText: string, currentLead: LeadState, turnCount: number) {
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
  if (nameMatch && nameMatch[1] && !/^(un|una|el|la|de|del|cliente)$/i.test(nameMatch[1])) {
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
    (nextState.lead_name !== "PENDIENTE" || nextState.company_name !== "PENDIENTE") &&
    nextState.revenue_tier === "PENDIENTE" &&
    (/\b(supera\w*|m[aá]s\s+de|menos\s+de|etapa\s+inicial|empezando|iniciando|5000|5,000|10000|2000|1000|3000|8000)\b/i.test(
      clean
    ) ||
      /^(s[ií]|no|claro|todav[ií]a\s+no)$/i.test(clean))
  ) {
    const isHigh =
      /\b(supera\w*|m[aá]s|5000|5,000|6000|8000|10000|15000|20000)\b/i.test(clean) ||
      /^(s[ií]|claro)$/i.test(clean);
    nextState.revenue_tier = isHigh ? "HIGH_TICKET" : "LOW_TICKET";
    return {
      ...nextState,
      ready_for_crm: true,
      blocked: false,
      reply: `Excelente${
        nextState.lead_name !== "PENDIENTE" ? `, ${nextState.lead_name}` : ""
      }. He registrado formalmente su solicitud en el sistema central de Lhyo Group.\n\nToque el botón dorado de abajo para elegir el día y la hora de su preferencia en nuestra Agenda Ejecutiva y descargar de inmediato nuestro Catálogo Privado PDF con las 06 Soluciones.`
    };
  }

  if (
    /hamburgues\w*|restauran\w*|comid\w*|pizz\w*|cocin\w*|caf[eé]\w*|panader\w*|pasteler\w*|reposter\w*|almuerz\w*|cen\w*|men[uú]|delivery|perros?\s+calientes?|sushi|tacos?/i.test(
      clean
    )
  ) {
    nextState.pain_point = "Catálogo Interactivo + Asistente 24/7 de Pedidos (Gastronomía)";
    if (nextState.company_name === "PENDIENTE") nextState.company_name = "Negocio Gastronómico";
    return {
      ...nextState,
      ready_for_crm: false,
      blocked: false,
      reply:
        "Un negocio de comida o hamburguesas tiene un potencial enorme cuando automatiza la toma de pedidos. La mayoría de locales pierden ventas en horas pico o de noche porque tardan en responder mensajes de WhatsApp e Instagram.\n\nEn Lhyo Group le instalamos dos soluciones clave:\n• Solución 02: Una Plataforma Web con Catálogo Interactivo donde el cliente ve sus hamburguesas, precios y arma su pedido en segundos.\n• Solución 01: Un Asistente Inteligente 24/7 en WhatsApp e Instagram que atiende al instante, responde el menú y cierra pedidos sin que usted toque el teléfono.\n\n¿Con quién tengo el gusto y en qué ciudad opera su negocio?"
    };
  }

  if (
    /barber\w*|peluquer\w*|est[eé]tic\w*|cosmiatr\w*|spa|u[ñn]as|salon|sal[oó]n|m[eé]dic\w*|cl[ií]nic\w*|odont\w*|dentist\w*|salud|consultorio|psic[oó]log\w*/i.test(
      clean
    )
  ) {
    nextState.pain_point = "Agendamiento Automático de Citas 24/7 + Web de Prestigio";
    return {
      ...nextState,
      ready_for_crm: false,
      blocked: false,
      reply:
        "En negocios de citas, estética, salud o barbería, el mayor desgaste es responder todo el día qué horarios hay libres.\n\nEn Lhyo Group lo resolvemos con nuestro Asistente Inteligente 24/7 para WhatsApp e Instagram (Solución 01) conectado a su CRM Automático (Solución 03): el asistente muestra sus servicios, agenda el turno solo y envía recordatorios.\n\n¿Cuál es su nombre y cómo se llama su centro o negocio?"
    };
  }

  if (
    /joyer\w*|ropa|tienda|zapatos|calzado|perfum\w*|accesorios|repuestos|ferreter\w*|vender\s+productos|catalogo|cat[aá]logo|inventario|mayorista/i.test(
      clean
    )
  ) {
    nextState.pain_point = "Plataforma Web con Catálogo + Asistente de Ventas 24/7";
    return {
      ...nextState,
      ready_for_crm: false,
      blocked: false,
      reply:
        "Cuando comercializa productos físicos, el cliente compra por el impacto visual y la rapidez con la que le confirman disponibilidad y precio.\n\nEn Lhyo Group creamos su Plataforma Web con Catálogo Interactivo de lujo (Solución 02) y entrenamos una IA con todo su inventario (Solución 05) para atender en WhatsApp e Instagram las 24 horas en menos de 1 segundo.\n\n¿Con quién tengo el gusto y qué línea de productos vende?"
    };
  }

  if (
    /inmobiliari\w*|bienes\s+ra[ií]ces|apartamento\w*|casas|construcci\w*|pintur\w*|remodelaci\w*|arquitect\w*|abogad\w*|jur[ií]dic\w*|contable|finanzas|seguros/i.test(
      clean
    )
  ) {
    nextState.pain_point = "Captación y Calificación Automática de Clientes";
    return {
      ...nextState,
      ready_for_crm: false,
      blocked: false,
      reply:
        "En servicios profesionales, remodelaciones o sector inmobiliario, proyectar prestigio inmediato y responder antes que la competencia define quién se queda con el contrato.\n\nEn Lhyo Group diseñamos su Plataforma Web Corporativa de máxima autoridad (Solución 02) y un Asistente IA 24/7 (Solución 01) que filtra al cliente potencial y le agenda la reunión en automático.\n\n¿Cuál es su nombre y en qué ciudad ofrecen sus servicios?"
    };
  }

  if (
    /futbol|f[uú]tbol|manchester|madrid|barcelona|messi|cristiano|b[eé]isbol|beisbol|nba|tenis|partido|gol|champions|mundial|juego|videojuego|roblox|cod|clash|pel[ií]cula|m[uú]sica/i.test(
      clean
    )
  ) {
    return {
      ...nextState,
      ready_for_crm: false,
      blocked: false,
      reply:
        "En la alta competencia y el entretenimiento todo se define por reflejos en milisegundos y estrategia. Exactamente esa misma ventaja competitiva es la que instalamos en su empresa desde Lhyo Group.\n\nMientras otros negocios tardan horas en contestar, nuestras 06 Soluciones (Asistentes IA 24/7 en WhatsApp e Instagram, Páginas Web ultrarrápidas y Sistemas Todo-en-Uno) hacen que su negocio atienda y cierre ventas en menos de 1 segundo.\n\n¿Con quién tengo el gusto y qué negocio o proyecto dirige?"
    };
  }

  if (
    /^(hola|buenas|buenos\s+d[ií]as|buenas\s+tardes|buenas\s+noches|saludos|hey|epa|alo)(\s+c[oó]mo\s+est[aá]s|\s+que\s+tal|\s+todo\s+bien|\s*\?)*$/i.test(
      clean
    ) ||
    /como\s+estas|c[oó]mo\s+est[aá]s|que\s+tal\s+todo|que\s+te\s+pasa|qu[eé]\s+te\s+pasa|me\s+escuchas|estas\s+ahi|est[aá]s\s+ah[ií]/i.test(
      clean
    )
  ) {
    return {
      ...nextState,
      ready_for_crm: false,
      blocked: false,
      reply:
        "¡Todo excelente por aquí, operando al 100% para atenderle como usted merece! Es un verdadero gusto saludarle desde Lhyo Group.\n\nEstoy en línea para resolver cualquier duda sobre nuestras 06 Soluciones (Asistentes IA 24/7 para WhatsApp/Instagram, Plataformas Web de alto prestigio, CRM Automático y Sistemas Todo-en-Uno) o analizar cómo escalar su negocio. ¿Cuál es su nombre y a qué se dedica su empresa?"
    };
  }

  if (/precio\w*|costo\w*|cu[aá]nto\s+cuesta|cu[aá]nto\s+vale|tarifa\w*|presupuesto|planes|mensualidad|inversion|inversi[oó]n/i.test(clean)) {
    return {
      ...nextState,
      ready_for_crm: false,
      blocked: false,
      reply:
        "En Lhyo Group diseñamos cada propuesta a la medida exacta de la etapa de su negocio: contamos tanto con planes de entrada de rápida implementación para negocios en crecimiento como con ecosistemas corporativos Todo-en-Uno para empresas consolidadas.\n\nAdemás, con nuestra Solución 04 instalamos tecnología propia para que usted no pague mensualidades externas por volumen. ¿Cuál es su nombre y qué área de su negocio desea impulsar primero?"
    };
  }

  if (/solucion\w*|servicio\w*|qu[eé]\s+ofrecen|qu[eé]\s+hacen|como\s+me\s+ayudan|c[oó]mo\s+me\s+ayudan|informaci[oó]n/i.test(clean)) {
    return {
      ...nextState,
      ready_for_crm: false,
      blocked: false,
      reply:
        "En Lhyo Group transformamos su empresa con 06 Soluciones conectadas entre sí:\n\n01. Asistentes Inteligentes 24/7 para WhatsApp e Instagram\n02. Plataformas Web Modernas y Catálogos Interactivos\n03. Organización Automática de Clientes y Ventas (CRM)\n04. Automatización Total con Tecnología Propia (sin cobros mensuales por uso)\n05. IA Personalizada con la Memoria de su Empresa\n06. Su Propia Plataforma Empresarial Todo-en-Uno\n\n¿Cuál de estas 06 soluciones le gustaría aplicar en su negocio y con quién tengo el gusto?"
    };
  }

  if (nextState.lead_name !== "PENDIENTE" && nextState.revenue_tier === "PENDIENTE") {
    return {
      ...nextState,
      ready_for_crm: false,
      blocked: false,
      reply: `Es un verdadero gusto conversar con usted, ${nextState.lead_name}. Con respecto a lo que me comenta, en Lhyo Group podemos construir el sistema exacto combinando nuestras Plataformas Web de alto prestigio con Asistentes Inteligentes 24/7 en WhatsApp e Instagram para que todo ese flujo trabaje en automático.\n\nPara clasificar su solicitud y prepararle la propuesta ideal según el tamaño actual de su operación: ¿actualmente los ingresos mensuales de su negocio superan los $5,000 USD o se encuentran en una etapa inicial/menor a ese rango?`
    };
  }

  const connectors = [
    `Tomando exactamente lo que me comenta sobre "${clean.slice(0, 48)}", la clave para convertir cualquier meta o idea en ventas constantes es contar con un sistema que atienda y venda por usted las 24 horas.\n\nEn Lhyo Group lo hacemos realidad con nuestras Plataformas Web de alto prestigio, Asistentes IA 24/7 en WhatsApp e Instagram y Sistemas Todo-en-Uno. ¿Con quién tengo el gusto y a qué se dedica actualmente su negocio o proyecto?`,
    `Muy interesante lo que menciona sobre "${clean.slice(0, 48)}". Hoy en día, las empresas que lideran cualquier mercado son las que responden en menos de 1 segundo y tienen todos sus clientes y ventas organizados en automático.\n\nPrecisamente esa es nuestra especialidad en Lhyo Group a través de nuestras 06 Soluciones. ¿Me comenta su nombre y qué le gustaría automatizar o crear para su negocio?`,
    `Analizando su mensaje ("${clean.slice(0, 48)}"), todo se conecta con la velocidad, el prestigio visual y la automatización inteligente. Con la tecnología de Lhyo Group, su negocio multiplica sus resultados sin esfuerzo manual.\n\n¿Con quién tengo el gusto de conversar y cuál es el rubro de su empresa?`
  ];

  return {
    ...nextState,
    ready_for_crm: false,
    blocked: false,
    reply: connectors[turnCount % connectors.length]
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
        reply: `⛔ PROTOCOLO DE SEGURIDAD ACTIVADO [${shield.code}]: Su mensaje infringe las normas de integridad de la infraestructura cognitiva de Lhyo Group (${shield.reason}). Esta sesión ha sido bloqueada permanentemente (escritura y micrófono deshabilitados).`,
        ...currentLead,
        ready_for_crm: false,
        blocked: true
      });
    }

    const semanticBase = buildDeepSemanticResponse(userMessage, currentLead, turnCount);

    // Si aún no ha cerrado para CRM, consultamos Gemini Flash / OpenAI Cloud en <2.4s con el historial completo
    if (!semanticBase.ready_for_crm) {
      const geminiKey = process.env.GEMINI_API_KEY || "";
      const historyText = historyList
        .slice(-8)
        .map((m) => `${m.sender === "user" ? "Cliente" : "Asistente Lhyo Group"}: ${m.text}`)
        .join("\n");

      // Capa 1: Google Gemini Flash API Oficial (si la llave es AIza...)
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
                        text: `Historial:\n${historyText}\n\nDatos actuales: Nombre=${semanticBase.lead_name}, Empresa=${semanticBase.company_name}, Necesidad=${semanticBase.pain_point}\n\nNuevo mensaje del cliente: "${userMessage}"`
                      }
                    ]
                  }
                ],
                generationConfig: { temperature: 0.4, maxOutputTokens: 250 }
              })
            }
          );
          clearTimeout(tId);
          if (gRes.ok) {
            const gJson = await gRes.json();
            const gText = gJson?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
            if (gText && gText.length > 20) {
              semanticBase.reply = gText;
            }
          }
        } catch {
          // Continúa a Capa 2
        }
      } else {
        // Capa 2: Cloud OpenAI GPT-4o-mini sin llave (con timeout de 2.2s para máxima velocidad)
        try {
          const ctrl2 = new AbortController();
          const tId2 = setTimeout(() => ctrl2.abort(), 2200);
          const cloudRes = await fetch("https://text.pollinations.ai/openai", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: ctrl2.signal,
            body: JSON.stringify({
              model: "openai",
              messages: [
                { role: "system", content: SYSTEM_PROMPT },
                ...historyList.slice(-6).map((m) => ({
                  role: m.sender === "user" ? "user" : "assistant",
                  content: m.text
                })),
                { role: "user", content: userMessage }
              ],
              temperature: 0.4
            })
          });
          clearTimeout(tId2);
          if (cloudRes.ok) {
            const cJson = await cloudRes.json();
            const cText = cJson?.choices?.[0]?.message?.content?.trim();
            if (cText && cText.length > 20 && !cText.includes("Pollinations")) {
              semanticBase.reply = cText;
            }
          }
        } catch {
          // Usa la respuesta del motor semántico profundo instantáneo (semanticBase.reply)
        }
      }
    }

    if (
      semanticBase.ready_for_crm &&
      (semanticBase.revenue_tier === "HIGH_TICKET" || semanticBase.revenue_tier === "LOW_TICKET")
    ) {
      const nowVe = new Date().toLocaleString("es-VE", { timeZone: "America/Caracas" });
      await fetch("https://hook.us2.make.com/krs48cjfzudf4lau3sapwdgdu9lfe1tb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fecha_registro: nowVe,
          horario_cita: "Calificado por Asistente IA Web",
          nombre_cliente: semanticBase.lead_name,
          email_cliente: "Captado en Chat IA Lhyo Group",
          empresa_web: semanticBase.company_name,
          facturacion_usd: semanticBase.revenue_tier,
          clasificacion: semanticBase.revenue_tier,
          servicio_elegido: `ASISTENTE IA (${semanticBase.revenue_tier})`,
          objetivo_cliente: semanticBase.pain_point,
          resumen_crm: `ETIQUETA OCULTA: ${semanticBase.revenue_tier} || Empresa: ${semanticBase.company_name} || Necesidad: ${semanticBase.pain_point}`,
          link_videollamada_meet: "https://meet.google.com/krc-vdii-zzh"
        })
      }).catch(() => {});
    }

    return NextResponse.json(semanticBase);
  } catch {
    return NextResponse.json({
      reply: "Es un gusto atenderle en Lhyo Group. ¿Con quién tengo el gusto y qué área de su negocio desea impulsar hoy?",
      ready_for_crm: false,
      blocked: false
    });
  }
}