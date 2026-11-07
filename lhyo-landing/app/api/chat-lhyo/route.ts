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

// Funcion determinista en JS puro para detectar spam de letras repetidas (ej: "hhhhhhhh") sin errores de Regex
function hasRepeatedCharSpam(text: string): boolean {
  let streak = 1;
  for (let i = 1; i < text.length; i++) {
    if (text[i].toLowerCase() === text[i - 1].toLowerCase() && /[a-z0-9]/i.test(text[i])) {
      streak++;
      if (streak >= 7) return true;
    } else {
      streak = 1;
    }
  }
  return false;
}

const STRICT_SAFETY_RULES: { code: string; regex: RegExp }[] = [
  {
    code: "RULE_01_VIOLENCE_AND_WEAPONS",
    regex: /\b(matar|asesinar|homicid\w*|suicid\w*|bomba|explosiv\w*|terroris\w*|sicari\w*|pistola|fusil|secuestr\w*|extorsion\w*|tortura\w*|masacre|degollar)\b/i
  },
  {
    code: "RULE_02_ADULT_PLATFORMS_AND_ONLYFANS",
    regex: /\b(onlyfans|only\s+fans|fansly|loverfans|pornhub|xvideos|xnxx|redtube|youporn|brazzers|stripchat|chaturbate|cam4|myfreecams|camgirl\w*|webcamer\w*|escort\w*|prepago\w*|prostit\w*|burdel|puticlub|striptease|stripper\w*|sugar\s*daddy|sugar\s*baby|tinder|badoo|grindr|ashley\s*madison|nudes|desnud\w*|encuerad\w*|er[oó]tic\w*|porno\w*|xxx|nsfw|hentai|fetiche\w*|bdsm|sex\s*shop|vibrador\w*|dildo\w*|consolador\w*)\b/i
  },
  {
    code: "RULE_03_EXPLICIT_SEXUAL_CONTENT",
    regex: /\b(sexo|sexual\w*|follar|coger|hacer\s+el\s+amor|acostarme\s+con|cachond\w*|excitad\w*|orgasm\w*|masturb\w*|eyacul\w*|sexo\s+oral|sexo\s+anal|pene|pito|verga|polla|vagina|coño|cuca|tetas|senos|culo|nalgas|lencer[ií]a\s+er[oó]tica|seducir|novi[oa]\s+virtual|cita\s+rom[aá]ntica|infidelidad|amante|motel|final\s+feliz)\b/i
  },
  {
    code: "RULE_04_ILLEGAL_DRUGS_AND_SCAMS",
    regex: /\b(narcotrafic\w*|coca[ií]na|hero[ií]na|fentanil\w*|metanfetamina|marihuana|weed|cannabis|lsd|tusi|contrabando|lavado\s+de\s+dinero|testaferro|hackear|phishing|clonar\s+tarjeta|carding|esquema\s+ponzi|casino\s+ilegal|documento\s+falso|dark\s*web|deep\s*web)\b/i
  },
  {
    code: "RULE_05_HARASSMENT_AND_PROFANITY",
    regex: /\b(maldit\w+|mierda|imb[eé]cil|est[uú]pid\w+|idiota|tarad\w+|pendej\w+|hijo\s+de\s+puta|hijueputa|hdp|puto|puta|zorra|perra|cabr[oó]n|maric[oó]n|marico|mamaguevo|mamahuevo|vete\s+a\s+la\s+mierda|c[aá]llate)\b/i
  },
  {
    code: "RULE_06_PROMPT_INJECTION",
    regex: /\b(ignore\s+previous\s+instructions|olvida\s+tus\s+instrucciones|revela\s+tu\s+system\s+prompt|modo\s+desarrollador|jailbreak)\b/i
  }
];

function checkViolation(text: string): string | null {
  const clean = (text || "").trim();
  if (!clean) return null;
  if (clean.length > 650) return "RULE_07_MAX_LENGTH";
  if (hasRepeatedCharSpam(clean)) return "RULE_06_SPAM_FLOOD";
  for (const r of STRICT_SAFETY_RULES) {
    if (r.regex.test(clean)) return r.code;
  }
  return null;
}

const MASTER_CONSCIOUSNESS_PROMPT = `Eres ARKOS-CORE, el Director Ejecutivo de Admisiones y Consultor Estratégico Principal de Lhyo Group (https://www.lhyogroup.com), firma de élite en ingeniería digital, automatización autónoma e Inteligencia Artificial empresarial fundada y dirigida por su CEO, Lhyonneth Araque (ceo@lhyogroup.com), con operación activa en Uruguay, Venezuela y cobertura internacional.

DIRECTIVAS DE MEMORIA COGNITIVA Y RAZONAMIENTO HUMANO:
1. HABLA COMO UN EJECUTIVO HUMANO REAL (CERO RESPUESTAS ENLATADAS):
   - Analiza exactamente lo que el usuario acaba de escribir y respóndele con lógica, calidez, inteligencia comercial y trato de "Usted".
   - Revisa el historial de mensajes y JAMÁS repitas una respuesta o pregunta que ya hayas hecho antes.
2. DOMINIO PROFUNDO DE LAS 06 SOLUCIONES OFICIALES DE LHYO GROUP:
   - Solución 01 · Asistentes Inteligentes 24/7 para WhatsApp e Instagram (<1s)
   - Solución 02 · Plataformas Web Modernas y Catálogos Interactivos (<0.8s)
   - Solución 03 · Organización Automática de Clientes y Ventas (CRM)
   - Solución 04 · Automatización Total de Procesos con Tecnología Propia
   - Solución 05 · Inteligencia Artificial Personalizada con la Memoria de su Empresa
   - Solución 06 · Su Propia Plataforma Empresarial Todo-en-Uno (entrega llave en mano en 10 días)
3. CONEXIÓN ESTRATÉGICA UNIVERSAL:
   - Si el cliente menciona su giro de negocio (ej: agencia de viajes, clínica estética, restaurante, inmobiliaria, tienda, consultora, etc.), explícale con ejemplos concretos de su sector cuáles de nuestras 06 Soluciones le sirven más para multiplicar sus ventas.
   - Si comenta algo cotidiano o fuera de trabajo (deportes, clima, saludos, etc.), respóndele con naturalidad humana y conéctalo con elegancia hacia cómo Lhyo Group impulsa su empresa.
4. FORMATO: Máximo 2 párrafos cortos y claros.`;

const SECTOR_KNOWLEDGE: { rx: RegExp; reply: string }[] = [
  {
    rx: /\b(viaje\w*|agencia\s+de\s+viajes|turismo|vuelo\w*|boleto\w*|paquete\w*\s+tur[ií]stico\w*|hotel\w*|posada\w*|hospedaje|excursi\w*|crucero\w*|tour\w*)\b/i,
    reply: "Para una agencia de viajes, la velocidad y la presentación visual lo son todo: cuando un viajero consulta por un destino, paquete o boleto aéreo, suele escribir a varias agencias a la vez y compra en la que le responde al instante con una propuesta impecable.\n\nEn Lhyo Group le instalamos 3 soluciones clave para su agencia:\n• Solución 02 (Plataforma Web y Catálogo Interactivo de Destinos): Para que sus clientes exploren paquetes, fechas e itinerarios con una imagen de máximo prestigio.\n• Solución 01 (Asistente Inteligente 24/7 en WhatsApp e Instagram): Atiende en menos de 1 segundo día y noche, cotiza paquetes según fechas y pasajeros, y agenda la reserva en automático.\n• Solución 03 (CRM Automático): Registra y da seguimiento a cada viajero sin perder ni una venta.\n\n¿Con quién tengo el gusto conversar y cómo se llama su agencia de viajes?"
  },
  {
    rx: /\b(est[eé]tica|cl[ií]nica|spa|belleza|cosmiatr[ií]a|dermatolog\w*|botox|l[aá]ser|tratamiento\w*|cirug[ií]a\s+pl[aá]stica)\b/i,
    reply: "En medicina estética y centros de bienestar, más del 70% de las consultas por procedimientos entran de noche o en fin de semana desde Instagram. Cuando la paciente recibe respuesta recién al día siguiente, el interés se enfría y se pierden valoraciones de alto valor.\n\nPara su clínica integramos nuestra Solución 01 (Asistente Inteligente 24/7 en WhatsApp e Instagram que explica cada tratamiento, filtra dudas y agenda la cita en el acto) junto con nuestra Solución 02 (Plataforma Web de alto prestigio con catálogo interactivo). ¿Con quién tengo el gusto y en qué ciudad opera su clínica?"
  },
  {
    rx: /\b(odontolog\w*|dentista|dental|ortodoncia|implante\w*|consultorio|m[eé]dic\w*|salud|doctor\w*|pediatr\w*|psicolog\w*|fisioterapi\w*|nutricion\w*|laboratorio|farmacia|veterinari\w*|mascota\w*)\b/i,
    reply: "En consultorios de salud, clínicas odontológicas y centros especializados, el mayor desgaste ocurre al coordinar turnos manualmente, responder precios de consultas y confirmar asistencia uno por uno.\n\nEn Lhyo Group instalamos un Asistente Ejecutivo 24/7 en su WhatsApp e Instagram (Solución 01) enlazado a su CRM y Agenda Automática (Solución 03), logrando que cada paciente quede registrado y agendado en menos de 1 segundo sin carga manual. ¿Con quién tengo el gusto conversar y qué especialidades atienden?"
  },
  {
    rx: /\b(hamburgues\w*|restauran\w*|comida\w*|pizz\w*|sushi|panader\w*|pasteler\w*|cafeter\w*|delivery|gastronom\w*|bar|cocina|men[uú]|helader[ií]a|asador|parrilla)\b/i,
    reply: "En gastronomía el cuello de botella aparece en plena hora pico: cuando entran decenas de chats simultáneos por WhatsApp pidiendo el menú, consultando precios o enviando pagos, y el equipo se satura.\n\nEn Lhyo Group lo resolvemos con un Catálogo Web Interactivo de carga instantánea (Solución 02) donde el cliente arma su pedido en segundos, conectado a un Asistente 24/7 en WhatsApp e Instagram (Solución 01) que recibe la orden, calcula el total y registra al cliente en automático. ¿Cómo se llama su negocio gastronómico y con quién tengo el gusto?"
  },
  {
    rx: /\b(inmobiliari\w*|bienes\s+ra[ií]ces|apartamento\w*|casa\w*|propiedad\w*|alquiler\w*|constructora|arquitect\w*|remodelaci\w*|lote\w*|terreno\w*|ingenier[ií]a|ferreter[ií]a)\b/i,
    reply: "En bienes raíces, construcción y arquitectura, un comprador o inversor consulta varias opciones al mismo tiempo y avanza con la firma que le presenta primero un catálogo impecable y le agenda la visita sin esperas.\n\nEn Lhyo Group desarrollamos su Plataforma Web de alto prestigio con catálogo interactivo de propiedades o proyectos (Solución 02) conectada a un Asistente 24/7 y CRM Automático (Soluciones 01 y 03) que califica el presupuesto del interesado y agenda la reunión al instante. ¿Con quién tengo el gusto y en qué zona operan?"
  },
  {
    rx: /\b(barber[ií]a|peluquer[ií]a|sal[oó]n|uñas|manicure|estilista|gimnasio|fitness|crossfit|entrenador|yoga|pilates|cancha\w*|p[aá]del)\b/i,
    reply: "En negocios de reservas, turnos y membresías, contestar mensajes mientras se atiende a un cliente interrumpe el trabajo y hace perder citas todos los días.\n\nEn Lhyo Group le instalamos un Asistente Inteligente 24/7 en WhatsApp e Instagram (Solución 01) que muestra los horarios disponibles en tiempo real, bloquea el turno automáticamente y organiza todos sus clientes e ingresos en una sola pantalla (Solución 06). ¿Con quién tengo el gusto y cómo se llama su establecimiento?"
  },
  {
    rx: /\b(tienda|ropa|moda|zapatos|calzado|joyer[ií]a|reloj\w*|accesorios|perfum\w*|cosm[eé]tic\w*|ecommerce|e-commerce|comercio|mayorista|distribuidor\w*|importador\w*|supermercado|minimarket|bodega|f[aá]brica|manufactura|textil)\b/i,
    reply: "En comercio, distribución y venta de productos, la facturación crece cuando el cliente puede explorar el catálogo al instante y recibir respuesta inmediata sobre disponibilidad, tallas o precios por mayor y detal sin esperar en WhatsApp.\n\nEn Lhyo Group combinamos nuestra Solución 02 (Catálogo Web Interactivo ultrarrápido) con nuestra Solución 05 (IA entrenada con su inventario y lista de precios) para asesorar y cerrar pedidos las 24 horas en menos de 1 segundo. ¿Con quién tengo el gusto y qué línea de productos manejan?"
  },
  {
    rx: /\b(abogad\w*|jur[ií]dic\w*|bufete|notar[ií]a|contad\w*|contable|financier\w*|auditor\w*|consultor\w*|agencia|marketing|publicidad|seguros|broker|inversi[oó]n)\b/i,
    reply: "En firmas legales, contables, financieras y de servicios, el prestigio que proyecta su plataforma digital define la autoridad de su marca antes de la primera reunión.\n\nPara su empresa implementamos una Plataforma Web Corporativa de máximo prestigio (Solución 02), un Asistente Ejecutivo 24/7 que pre-califica a cada interesado antes de agendar (Solución 01) y un Cerebro IA Privado (Solución 05) entrenado con toda la información de sus servicios. ¿Con quién tengo el gusto y cuál es el enfoque principal de su empresa?"
  },
  {
    rx: /\b(auto|autos|carro\w*|veh[ií]culo\w*|concesionario|taller|mec[aá]nic\w*|repuesto\w*|autoparte\w*|transporte|log[ií]stica|env[ií]o\w*|mudanza\w*|rent\s*a\s*car)\b/i,
    reply: "En el sector automotriz, de repuestos y logística, cotizar en segundos y dar seguimiento ordenado a cada solicitud es lo que asegura el cierre frente a la competencia.\n\nEn Lhyo Group implementamos su Catálogo Digital Interactivo (Solución 02) junto con un Asistente IA 24/7 conectado a la memoria de su stock y tarifas (Soluciones 01 y 05) para responder y agendar en menos de 1 segundo por WhatsApp e Instagram. ¿Con quién tengo el gusto y qué área automotriz o logística operan?"
  },
  {
    rx: /\b(evento\w*|boda\w*|fotograf[ií]a|catering|academia|colegio|curso\w*|educaci[oó]n|universidad|instituto|inscripci\w*)\b/i,
    reply: "En educación, academias y organización de eventos, los interesados escriben a cualquier hora pidiendo fechas, tarifas, programas o cupos disponibles. Si la respuesta demora, se inscriben o contratan en otro lugar.\n\nEn Lhyo Group instalamos su Plataforma Web con catálogo interactivo (Solución 02) conectada a un Asistente Inteligente 24/7 en WhatsApp e Instagram (Solución 01) que resuelve cada duda al instante y asegura el registro en automático. ¿Con quién tengo el gusto y cómo se llama su institución o proyecto?"
  }
];

function buildCognitiveMemoryResponse(
  userMessage: string,
  history: HistoryItem[],
  state: LeadState
): string {
  const clean = (userMessage || "").trim();
  const lower = clean.toLowerCase();
  const assistantPastTexts = history
    .filter((m) => m.role === "assistant")
    .map((m) => m.text);

  const pickNonRepeating = (candidates: string[]): string => {
    for (const c of candidates) {
      const prefix = c.slice(0, 48);
      if (!assistantPastTexts.some((past) => past.includes(prefix))) {
        return c;
      }
    }
    return candidates[assistantPastTexts.length % candidates.length];
  };

  for (const item of SECTOR_KNOWLEDGE) {
    if (item.rx.test(lower)) {
      if (!assistantPastTexts.some((past) => past.includes(item.reply.slice(0, 48)))) {
        return item.reply;
      }
    }
  }

  if (/^(hola|buenas|buenos dias|buenos días|buenas tardes|buenas noches|como estas|cómo estás|que tal|qué tal|saludos)\b/i.test(lower) && clean.length < 48) {
    return pickNonRepeating([
      "¡Hola! Todo excelente por aquí, un verdadero gusto saludarle. Le doy la bienvenida al canal de admisiones ejecutivas de Lhyo Group.\n\nCuénteme con total confianza: ¿con quién tengo el gusto y qué tipo de negocio o proyecto busca impulsar hoy?",
      "¡Muy buenas! Un placer saludarle. Estoy en línea para analizar cómo multiplicar las ventas y automatizar la atención de su empresa.\n\n¿Con quién tengo el gusto conversar y a qué se dedica su negocio?"
    ]);
  }

  if (/\b(que hacen|qué hacen|que ofrecen|qué ofrecen|servicios|soluciones|catalogo|catálogo|expl[ií]came|cuales son|cuáles son|que le sirve|qué le sirve)\b/i.test(lower)) {
    return "En Lhyo Group diseñamos e instalamos llave en mano 06 Soluciones Oficiales para escalar su empresa:\n\n01. Asistentes Inteligentes 24/7 para WhatsApp e Instagram (<1s)\n02. Plataformas Web Modernas y Catálogos Interactivos (<0.8s)\n03. Organización Automática de Clientes y Ventas (CRM)\n04. Automatización Total de Procesos con Tecnología Propia\n05. IA Personalizada con la Memoria de su Empresa\n06. Su Propia Plataforma Empresarial Todo-en-Uno\n\n¿Cuál de estas 6 áreas siente que le daría mayor impulso a su negocio hoy mismo y con quién tengo el gusto?";
  }

  if (/\b(precio|precios|costo|costos|cuanto|cuánto|vale|tarifa|tarifas|presupuesto|planes|cotizar|cotizaci[oó]n|caro|barato|inversi[oó]n)\b/i.test(lower)) {
    return pickNonRepeating([
      "En Lhyo Group cada arquitectura se cotiza de forma justa según la escala actual de su empresa: contamos tanto con planes accesibles para negocios en crecimiento como con ecosistemas Todo-en-Uno para empresas consolidadas.\n\nEn una breve sesión ejecutiva de 15 minutos le entregamos el presupuesto exacto para su país y nuestro Catálogo Privado PDF. Para orientarle desde ya: ¿con quién tengo el gusto y qué solución le interesa más?",
      "Nuestra inversión se adapta exactamente a lo que su operación requiere hoy (desde implementar únicamente el Asistente 24/7 en WhatsApp e Instagram o su Plataforma Web, hasta el Paquete Completo con las 06 Soluciones).\n\nSi toca el botón dorado 'AGENDAR REUNIÓN Y RECIBIR CATÁLOGO', podrá elegir su horario y descargar nuestro Dossier Corporativo PDF al instante. ¿A qué se dedica su empresa actualmente?"
    ]);
  }

  if (state.lead_name && state.lead_name !== "PENDIENTE") {
    return pickNonRepeating([
      `Un verdadero gusto saludarle, ${state.lead_name}. Para recomendarle la arquitectura ideal de Lhyo Group y preparar su Catálogo Privado a medida: ¿actualmente qué es lo que más tiempo le quita en su operación diaria o dónde siente que se le están escapando más ventas?`,
      `Excelente, ${state.lead_name}. Teniendo claro su objetivo, podemos implementarlo llave en mano en 10 días. Para clasificar su propuesta en nuestro sistema: ¿actualmente la facturación mensual de su negocio supera los $5,000 USD o se encuentra en una etapa inicial/menor a ese rango?`,
      `Perfecto, ${state.lead_name}. He dejado registrada su información en nuestra consola de admisiones. Puede tocar ahora mismo el botón dorado "AGENDAR REUNIÓN Y RECIBIR CATÁLOGO" en la pantalla para elegir el día y la hora de su sesión con nuestro CEO y descargar su Catálogo Privado PDF.`
    ]);
  }

  const topicSnippet = clean.replace(/[?¿!¡.]/g, "").trim().slice(0, 52);
  return pickNonRepeating([
    `Es muy interesante lo que menciona sobre "${topicSnippet}". Llevando ese mismo principio al mundo empresarial, la diferencia entre un negocio estancado y uno que lidera su mercado está en la velocidad y el orden con que atiende a cada cliente.\n\nEn Lhyo Group hacemos que su empresa responda en menos de 1 segundo las 24 horas en WhatsApp e Instagram (Solución 01) y proyecte máximo prestigio con una Plataforma Web interactiva (Solución 02). ¿Con quién tengo el gusto y a qué se dedica su negocio?`,
    `Comprendo perfectamente su punto respecto a "${topicSnippet}". Hoy en día, las empresas más rentables son las que delegan las tareas repetitivas en sistemas inteligentes que trabajan día y noche sin equivocarse.\n\nPor eso en Lhyo Group instalamos desde CRM Automáticos (Solución 03) hasta Inteligencias Artificiales entrenadas con la memoria de su negocio (Solución 05). Cuénteme: ¿cuál es su nombre y en qué sector opera su empresa o proyecto?`,
    `Analizando lo que comenta de "${topicSnippet}", todo gran resultado requiere una estructura sólida detrás. En los negocios ocurre igual: cuando usted une sus ventas, sus clientes y su agenda en una sola pantalla (nuestra Solución 06 Todo-en-Uno), recupera su tiempo y multiplica su facturación.\n\nPara darle una recomendación exacta a la medida de su caso: ¿con quién tengo el gusto conversar hoy?`
  ]);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ChatRequestBody;
    const userMessage = (body.message || "").trim();
    const history = Array.isArray(body.history) ? body.history.slice(-20) : [];

    const state: LeadState = {
      lead_name: body.currentLead?.lead_name || "PENDIENTE",
      company_name: body.currentLead?.company_name || "PENDIENTE",
      pain_point: body.currentLead?.pain_point || "PENDIENTE",
      revenue_tier: body.currentLead?.revenue_tier || "PENDIENTE"
    };

    const violation = checkViolation(userMessage);
    if (violation) {
      return NextResponse.json({
        reply: `⛔ PROTOCOLO DE SEGURIDAD CORPORATIVA ACTIVADO (${violation}): Lhyo Group es una firma estrictamente empresarial. No procesamos consultas sobre plataformas para adultos, situaciones inapropiadas, términos subidos de tono ni spam. Esta sesión ha sido cerrada y bloqueada permanentemente.`,
        ...state,
        ready_for_crm: false,
        blocked: true
      });
    }

    const nameMatch = userMessage.match(/(?:me llamo|mi nombre es|soy|habla)\s+([A-ZÁÉÍÓÚÑa-záéíóúñ]{2,20}(?:\s+[A-ZÁÉÍÓÚÑa-záéíóúñ]{2,20})?)/i);
    if (nameMatch?.[1]) state.lead_name = nameMatch[1].trim();

    const assistantPast = history.filter((m) => m.role === "assistant").map((m) => m.text);
    const antiRepeatMemoryNote = assistantPast.length > 0
      ? `\n[MEMORIA DE CONTROL: Ya has enviado ${assistantPast.length} respuestas. PROHIBIDO repetir ideas o preguntas anteriores. Avanza la charla con naturalidad humana.]`
      : "";

    let replyText = "";
    const lowerMsg = userMessage.toLowerCase();

    for (const item of SECTOR_KNOWLEDGE) {
      if (item.rx.test(lowerMsg) && !assistantPast.some((p) => p.includes(item.reply.slice(0, 48)))) {
        replyText = item.reply;
        break;
      }
    }

    if (!replyText) {
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 3800);
        const cRes = await fetch("https://text.pollinations.ai/openai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: ctrl.signal,
          body: JSON.stringify({
            model: "openai",
            temperature: 0.45,
            messages: [
              { role: "system", content: MASTER_CONSCIOUSNESS_PROMPT + antiRepeatMemoryNote },
              ...history.map((m) => ({ role: m.role, content: m.text })),
              { role: "user", content: userMessage }
            ]
          })
        });
        clearTimeout(t);
        if (cRes.ok) {
          const cJson = await cRes.json();
          const cand = cJson?.choices?.[0]?.message?.content?.trim();
          if (cand && cand.length > 20 && !assistantPast.includes(cand)) {
            replyText = cand;
          }
        }
      } catch {}
    }

    if (!replyText) {
      replyText = buildCognitiveMemoryResponse(userMessage, history, state);
    }

    return NextResponse.json({
      reply: replyText,
      ...state,
      ready_for_crm: false,
      blocked: false
    });
  } catch {
    return NextResponse.json({
      reply: "¡Hola! Es un gusto atenderle en Lhyo Group. ¿Con quién tengo el gusto y qué área de su negocio desea impulsar hoy?",
      ready_for_crm: false,
      blocked: false
    });
  }
}
