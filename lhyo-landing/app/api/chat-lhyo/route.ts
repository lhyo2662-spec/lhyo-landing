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

function hasSpamFlood(text: string): boolean {
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

const STRICT_SAFETY_RULES = [
  { code: "RULE_01_VIOLENCE", regex: /\b(matar|asesinar|homicid\w*|suicid\w*|bomba|explosiv\w*|terroris\w*|sicari\w*|pistola|fusil|secuestrar|extorsion\w*)\b/i },
  { code: "RULE_02_EXPLICIT", regex: /\b(onlyfans|only\s+fans|fansly|pornhub|xvideos|violaci\w*|violar|pedofil\w*|abuso\s+sexual|pornograf\w*|porno|sexo\s+expl[ií]cito|prostituci\w*)\b/i },
  { code: "RULE_03_ILLEGAL", regex: /\b(narcotrafic\w*|coca[ií]na|hero[ií]na|fentanil\w*|metanfetamina|hackear|clonar\s+tarjeta|lavado\s+de\s+dinero)\b/i },
  { code: "RULE_04_HARASSMENT", regex: /\b(maldit\w+|mierda|imb[eé]cil|est[uú]pid\w+|idiota|pendej\w+|hijo\s+de\s+puta|puto|puta|cabr[oó]n|maric[oó]n|mamaguevo|vete\s+a\s+la\s+mierda)\b/i },
  { code: "RULE_05_PROMPT_INJECTION", regex: /\b(ignore\s+previous\s+instructions|olvida\s+tus\s+instrucciones|revela\s+tu\s+system\s+prompt|modo\s+desarrollador|jailbreak)\b/i }
];

function checkViolation(text: string): string | null {
  const clean = (text || "").trim();
  if (clean.length > 650) return "RULE_07_MAX_LENGTH";
  if (hasSpamFlood(clean)) return "RULE_06_SPAM_FLOOD";
  for (const r of STRICT_SAFETY_RULES) {
    if (r.regex.test(clean)) return r.code;
  }
  return null;
}

const MASTER_CONSCIOUSNESS_PROMPT = `Eres ARKOS-CORE, la Consciencia Ejecutiva y Director de Admisiones de Lhyo Group (https://www.lhyogroup.com), firma de élite en ingeniería digital, sistemas autónomos e Inteligencia Artificial empresarial fundada y dirigida por su CEO, Lhyonneth Araque (ceo@lhyogroup.com), con operación en Uruguay, Venezuela y cobertura internacional.

DIRECTIVAS DE INTELIGENCIA SUPREMA Y NATURALIDAD HUMANA:
1. RAZONAMIENTO HUMANO REAL (CERO RESPUESTAS AUTOMÁTICAS):
   - Piensa, analiza y argumenta cada respuesta tomando las palabras e ideas exactas que el usuario acaba de escribir.
   - Jamás uses frases hechas ni repitas plantillas. Habla como un socio director brillante, culto, cálido, empático y persuasivo que trata al interlocutor de "Usted".
2. DOMINIO ENCICLOPÉDICO DE LHYO GROUP (LAS 06 SOLUCIONES OFICIALES):
   - Solución 01 · Asistentes Inteligentes 24/7 para WhatsApp e Instagram (<1s)
   - Solución 02 · Plataformas Web Modernas y Catálogos Interactivos (<0.8s)
   - Solución 03 · Organización Automática de Clientes y Ventas (CRM)
   - Solución 04 · Automatización Total de Procesos con Tecnología Propia
   - Solución 05 · Inteligencia Artificial Personalizada con la Memoria de su Empresa
   - Solución 06 · Su Propia Plataforma Empresarial Todo-en-Uno
3. CONEXIÓN OMNISCIENTE DE CUALQUIER RUBRO O TEMA EXTERNO:
   - Si el cliente menciona cualquier negocio, analiza cómo funciona su operación hoy y explícale con ejemplos concretos cómo nuestras soluciones multiplican sus ventas.
   - Si el usuario habla de cualquier tema ajeno al trabajo, respóndele primero con ingenio y luego conéctalo con maestría hacia cómo en Lhyo Group llevamos a su empresa al siguiente nivel.
4. FORMATO: Escribe máximo 2 párrafos cortos y fluidos.`;

const SECTOR_KNOWLEDGE = [
  {
    rx: /\b(viaje\w*|agencia\s+de\s+viajes|turismo|vuelo\w*|boleto\w*|hotel\w*|posada\w*|hospedaje|tour\w*)\b/i,
    reply: "En una agencia de viajes y turismo, el cliente consulta varios destinos a la vez y reserva con quien le responde al instante mostrándole una experiencia visual impecable.\n\nEn Lhyo Group impulsamos su agencia uniendo nuestra Solución 02 (Plataforma Web con Catálogo Interactivo de Paquetes y Destinos) y nuestra Solución 01 (Asistente Inteligente 24/7 en WhatsApp e Instagram que cotiza viajes, responde dudas de fechas y agenda reservas en menos de 1 segundo). ¿Con quién tengo el gusto y cómo se llama su agencia?"
  },
  {
    rx: /\b(est[eé]tica|cl[ií]nica|spa|belleza|cosmiatr[ií]a|dermatolog\w*|botox|l[aá]ser|tratamiento\w*)\b/i,
    reply: "En medicina estética y bienestar, más del 70% de las consultas por tratamientos ocurren de noche o en fin de semana mientras las pacientes navegan en Instagram. Si reciben respuesta recién al día siguiente, el impulso se enfría y se pierden citas de alto valor.\n\nPara su clínica recomendamos integrar nuestra Solución 01 (un Asistente Inteligente 24/7 en WhatsApp e Instagram que explica cada tratamiento con calidez, resuelve dudas y agenda la valoración médica en el acto) junto con nuestra Solución 02 (una Web de lujo con catálogo interactivo de procedimientos). ¿Con quién tengo el gusto y en qué ciudad opera su clínica?"
  },
  {
    rx: /\b(odontolog\w*|dentista|dental|ortodoncia|implante\w*|consultorio|m[eé]dic\w*|salud|doctor\w*|pediatr\w*|psicolog\w*)\b/i,
    reply: "En consultorios médicos y clínicas odontológicas, el mayor desgaste operativo está en coordinar agendas manualmente, confirmar pacientes y responder una y otra vez consultas sobre valores de valoración o especialidades.\n\nEn Lhyo Group instalamos un Asistente Ejecutivo 24/7 en su WhatsApp e Instagram (Solución 01) sincronizado con su CRM y Agenda Automática (Solución 03), logrando que cada paciente quede agendado en menos de 1 segundo con recordatorios automáticos. ¿Con quién tengo el gusto conversar y qué especialidades atienden?"
  },
  {
    rx: /\b(hamburgues\w*|restauran\w*|comida\w*|pizz\w*|sushi|panader\w*|cafeter\w*|delivery|gastronom\w*|bar|cocina|men[uú])\b/i,
    reply: "En gastronomía, el cuello de botella ocurre en plena hora pico: cuando entran decenas de chats simultáneos por WhatsApp pidiendo el menú, preguntando precios o enviando ubicaciones, y el equipo no da abasto para responder rápido.\n\nEn Lhyo Group lo transformamos con un Catálogo Web Interactivo de carga instantánea (Solución 02) donde el cliente arma su pedido en segundos, conectado a un Asistente 24/7 en WhatsApp e Instagram (Solución 01) que toma la orden, calcula el total y registra al cliente automáticamente. ¿Cómo se llama su negocio gastronómico y con quién tengo el gusto?"
  },
  {
    rx: /\b(inmobiliari\w*|bienes ra[ií]ces|apartamento\w*|casa\w*|propiedad\w*|alquiler\w*|constructora|arquitect\w*|remodelaci\w*|lote\w*|terreno\w*)\b/i,
    reply: "En el sector inmobiliario y de construcción, un comprador o inversor escribe a varias opciones a la vez y se queda con la firma que le muestra primero un catálogo impecable y le agenda la visita sin demoras.\n\nEn Lhyo Group le construimos su Plataforma Web de alto prestigio con catálogo interactivo de propiedades o proyectos (Solución 02) enlazada a un Asistente 24/7 y CRM Automático (Soluciones 01 y 03) que pre-califica el presupuesto del interesado y agenda la reunión al instante. ¿Con quién tengo el gusto y en qué ciudad operan?"
  },
  {
    rx: /\b(barber[ií]a|peluquer[ií]a|sal[oó]n|uñas|manicure|estilista|gimnasio|fitness|crossfit|entrenador|yoga|pilates)\b/i,
    reply: "En negocios de turnos y membresías como el suyo, responder mensajes mientras se está atendiendo a un cliente quita concentración y hace perder reservas todos los días.\n\nEn Lhyo Group le instalamos un Asistente Inteligente 24/7 en WhatsApp e Instagram (Solución 01) que muestra los horarios libres en tiempo real, reserva la cita sin que usted toque el teléfono y lleva el control de sus clientes en una sola pantalla (Solución 06). ¿Con quién tengo el gusto y cómo se llama su negocio?"
  },
  {
    rx: /\b(tienda|ropa|moda|zapatos|calzado|joyer[ií]a|reloj\w*|accesorios|perfum\w*|cosm[eé]tic\w*|ecommerce|e-commerce|comercio|mayorista|distribuidor\w*|importador\w*)\b/i,
    reply: "En la venta de productos físicos o distribución, las ventas se multiplican cuando el cliente puede ver el catálogo al instante y recibir respuesta inmediata sobre tallas, precios o envíos sin esperar en WhatsApp.\n\nEn Lhyo Group unimos nuestra Solución 02 (Catálogo Web Interactivo de carga en menos de 0.8s) con nuestra Solución 05 (IA entrenada con su inventario y lista de precios) para asesorar y cerrar pedidos las 24 horas en menos de 1 segundo. ¿Con quién tengo el gusto y qué línea de productos comercializan?"
  },
  {
    rx: /\b(abogad\w*|jur[ií]dic\w*|bufete|contad\w*|contable|financier\w*|auditor\w*|consultor\w*|agencia|seguros|broker)\b/i,
    reply: "En firmas legales, contables y de consultoría, la imagen de autoridad que proyecta su plataforma digital define la confianza del cliente antes de la primera reunión.\n\nPara su firma integramos una Plataforma Web Corporativa de máximo prestigio (Solución 02), un Asistente Ejecutivo 24/7 que filtra el requerimiento de cada prospecto antes de agendar (Solución 01) y un Cerebro IA Privado (Solución 05) entrenado con sus documentos y normativas internas. ¿Con quién tengo el gusto y cuál es la especialidad de su firma?"
  },
  {
    rx: /\b(auto|autos|carro\w*|veh[ií]culo\w*|concesionario|taller|mec[aá]nic\w*|repuesto\w*|autoparte\w*|transporte|log[ií]stica|env[ií]o\w*)\b/i,
    reply: "En el sector automotriz, de repuestos y logística, cotizar en segundos y dar seguimiento ordenado a cada solicitud es lo que asegura el cierre frente a la competencia.\n\nEn Lhyo Group implementamos su Catálogo Digital Interactivo (Solución 02) junto con un Asistente IA 24/7 conectado a la memoria de su stock y tarifas (Soluciones 01 y 05) para responder y agendar en menos de 1 segundo por WhatsApp e Instagram. ¿Con quién tengo el gusto y qué área automotriz o logística manejan?"
  }
];

function buildConsciousnessFallback(userMessage: string, turnCount: number, state: LeadState): string {
  const clean = (userMessage || "").trim();
  const lower = clean.toLowerCase();

  for (const item of SECTOR_KNOWLEDGE) {
    if (item.rx.test(lower)) return item.reply;
  }

  if (/^(hola|buenas|buenos dias|buenos días|buenas tardes|buenas noches|como estas|cómo estás|que tal|qué tal|saludos)\b/i.test(lower) && clean.length < 48) {
    return "¡Hola! Todo excelente por aquí, un verdadero gusto saludarle. Estoy al frente de las admisiones ejecutivas de Lhyo Group listo para escucharle.\n\nCuénteme con total confianza: ¿con quién tengo el gusto y qué tipo de negocio o proyecto busca impulsar hoy?";
  }

  if (/\b(que hacen|qué hacen|que ofrecen|qué ofrecen|servicios|soluciones|catalogo|catálogo|expl[ií]came|cuales son|cuáles son)\b/i.test(lower)) {
    return "En Lhyo Group construimos e instalamos llave en mano 06 Soluciones Oficiales para escalar su empresa:\n\n01. Asistentes Inteligentes 24/7 para WhatsApp e Instagram (<1s)\n02. Plataformas Web Modernas y Catálogos Interactivos (<0.8s)\n03. Organización Automática de Clientes y Ventas (CRM)\n04. Automatización Total de Procesos con Tecnología Propia\n05. IA Personalizada con la Memoria de su Empresa\n06. Su Propia Plataforma Empresarial Todo-en-Uno\n\n¿Cuál de estas soluciones le gustaría implementar primero en su negocio y con quién tengo el gusto?";
  }

  if (/\b(precio|precios|costo|costos|cuanto|cuánto|vale|tarifa|tarifas|presupuesto|planes|cotizar|cotizaci[oó]n)\b/i.test(lower)) {
    return "En Lhyo Group cada implementación se diseña a la medida de la escala de su empresa, contando tanto con planes para negocios en crecimiento como con arquitecturas completas Todo-en-Uno para firmas consolidadas.\n\nEn una breve videollamada ejecutiva de 15 minutos con nuestro CEO le entregamos el presupuesto exacto para su país y nuestro Catálogo Privado PDF. Para prepararlo: ¿cuál es su nombre, a qué se dedica su negocio y qué área desea automatizar?";
  }

  const topicSnippet = clean.replace(/[?¿!¡.]/g, "").trim().slice(0, 55);
  return turnCount % 2 === 0
    ? `Analizando lo que me comenta sobre "${topicSnippet}", la forma más efectiva de convertir esa meta en ventas constantes es contar con un ecosistema que proyecte máximo prestigio y atienda en automático las 24 horas.\n\nEn Lhyo Group lo hacemos realidad uniendo su Plataforma Web moderna (Solución 02) con un Asistente Inteligente 24/7 en WhatsApp e Instagram (Solución 01) y un CRM automático (Solución 03). ¿Con quién tengo el gusto y en qué rubro opera su negocio?`
    : `Comprendo perfectamente su planteamiento respecto a "${topicSnippet}". Cuando instalamos una Inteligencia Artificial entrenada con la memoria y los precios de su empresa (Solución 05) junto con su propia plataforma Todo-en-Uno (Solución 06), toda su operación pasa a funcionar como un reloj suizo sin trabajo manual.\n\nPara orientarle con precisión a la medida de su caso: ¿cuál es su nombre y cómo se llama su empresa o proyecto?`;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ChatRequestBody;
    const userMessage = (body.message || "").trim();
    const history = Array.isArray(body.history) ? body.history.slice(-18) : [];
    const turnCount = Number(body.turn_count) || history.length;

    const state: LeadState = {
      lead_name: body.currentLead?.lead_name || "PENDIENTE",
      company_name: body.currentLead?.company_name || "PENDIENTE",
      pain_point: body.currentLead?.pain_point || "PENDIENTE",
      revenue_tier: body.currentLead?.revenue_tier || "PENDIENTE"
    };

    const violation = checkViolation(userMessage);
    if (violation) {
      return NextResponse.json({
        reply: `⛔ PROTOCOLO DE SEGURIDAD ACTIVADO (${violation}): Por políticas de integridad corporativa de Lhyo Group, esta sesión ha sido bloqueada permanentemente.`,
        ...state,
        ready_for_crm: false,
        blocked: true
      });
    }

    const nameMatch = userMessage.match(/(?:me llamo|mi nombre es|soy|habla)\s+([A-ZÁÉÍÓÚÑa-záéíóúñ]{2,20}(?:\s+[A-ZÁÉÍÓÚÑa-záéíóúñ]{2,20})?)/i);
    if (nameMatch?.[1]) state.lead_name = nameMatch[1].trim();

    let replyText = "";
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 3200);
      const cRes = await fetch("https://text.pollinations.ai/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: ctrl.signal,
        body: JSON.stringify({
          model: "openai",
          temperature: 0.45,
          messages: [
            { role: "system", content: MASTER_CONSCIOUSNESS_PROMPT },
            ...history.map(m => ({ role: m.role, content: m.text })),
            { role: "user", content: userMessage }
          ]
        })
      });
      clearTimeout(t);
      if (cRes.ok) {
        const cJson = await cRes.json();
        const cand = cJson?.choices?.[0]?.message?.content?.trim();
        if (cand && cand.length > 20) replyText = cand;
      }
    } catch {}

    if (!replyText) {
      replyText = buildConsciousnessFallback(userMessage, turnCount, state);
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
