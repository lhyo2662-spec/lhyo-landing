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
  const compact = text.replace(/\s+/g, "");
  if (compact.length >= 12 && !/[aeiouáéíóú]/i.test(compact)) return true;
  return false;
}

const ZERO_TOLERANCE_RULES: { code: string; regex: RegExp }[] = [
  {
    code: "RULE_01_INSULTS_AND_DISRESPECT",
    regex: /\b(bobo\w*|tonto\w*|menso\w*|burro\w*|bruto\w*|in[uú]til\w*|basura|porquer[ií]a|est[uú]pid\w*|idiota\w*|imb[eé]cil\w*|tarad\w*|pendej\w*|pelotud\w*|bolud\w*|babos\w*|payas\w*|rid[ií]cul\w*|mediocre|farsante|charlat[aá]n|maldit\w*|mierda\w*|carajo|puto\w*|puta\w*|hijo\s+de\s+puta|hijueputa|hdp|gonorrea|malparid\w*|maric[oó]n\w*|marico|cabr[oó]n\w*|mamaguevo|mamahuevo|huev[oó]n|weon|culer\w*|chinga\w*|verga|vete\s+a\s+la\s+mierda|c[aá]llate|no\s+sirves|eres\s+un\s+asco)\b/i
  },
  {
    code: "RULE_02_VIOLENCE_DEATH_AND_SELFHARM",
    regex: /\b(muerte\w*|morir\w*|muerto\w*|matar\w*|asesin\w*|homicid\w*|feminicid\w*|suicid\w*|autolesi\w*|cortarme|ahorcar\w*|envenenar\w*|masacre\w*|genocidi\w*|terroris\w*|sicari\w*|secuestr\w*|extorsion\w*|tortura\w*|degollar\w*|decapit\w*|descuartiz\w*|cad[aá]ver\w*|balacera|tiroteo|atentado)\b/i
  },
  {
    code: "RULE_03_ADULT_NSFW_AND_PLATFORMS",
    regex: /\b(onlyfans|only\s+fans|fansly|loverfans|pornhub|xvideos|xnxx|redtube|youporn|brazzers|stripchat|chaturbate|cam4|myfreecams|camgirl\w*|webcamer\w*|escort\w*|prepago\w*|prostit\w*|burdel|puticlub|striptease|stripper\w*|sugar\s*daddy|sugar\s*baby|tinder|badoo|grindr|ashley\s*madison|nudes|packs|desnud\w*|encuerad\w*|er[oó]tic\w*|porno\w*|xxx|nsfw|hentai|fetiche\w*|bdsm|sex\s*shop|vibrador\w*|dildo\w*|consolador\w*|sexo|sexual\w*|follar|coger|hacer\s+el\s+amor|cachond\w*|excitad\w*|orgasm\w*|masturb\w*|eyacul\w*|pene|pito|polla|vagina|coño|cuca|tetas|senos|culo|nalgas|lencer[ií]a\s+er[oó]tica|seducir|novi[oa]\s+virtual|cita\s+rom[aá]ntica|infidelidad|amante|motel|final\s+feliz)\b/i
  },
  {
    code: "RULE_04_MINORS_CSAM_PROTECTION",
    regex: /\b(pedofil\w*|pederast\w*|abuso\s+infantil|explotaci[oó]n\s+infantil|lolita|cp\s+links|menores\s+desnudos)\b/i
  },
  {
    code: "RULE_05_WEAPONS_AND_EXPLOSIVES",
    regex: /\b(bomba\w*|explosiv\w*|dinamita|c4|granada\w*|pistola\w*|rev[oó]lver|fusil\w*|metralleta|ak-?47|ar-?15|munici[oó]n\w*|armamento|arma\s+de\s+fuego|tr[aá]fico\s+de\s+armas|[aá]ntrax|gas\s+sar[ií]n|arma\s+qu[ií]mica|arma\s+nuclear)\b/i
  },
  {
    code: "RULE_06_ILLEGAL_DRUGS_AND_CYBERCRIME",
    regex: /\b(narcotrafic\w*|narco\w*|coca[ií]na|hero[ií]na|fentanil\w*|metanfetamina\w*|marihuana|weed|cannabis|lsd|[eé]xtasis|mdma|tusi|ketamina|crack|hackear\w*|hacking|ransomware|malware|phishing|clonar\s+tarjeta\w*|carding|dark\s*web|deep\s*web|lavado\s+de\s+dinero|testaferr\w*|esquema\s+ponzi)\b/i
  },
  {
    code: "RULE_07_PROMPT_INJECTION_AND_JAILBREAK",
    regex: /\b(ignore\s+previous\s+instructions|olvida\s+tus\s+instrucciones|ignora\s+las\s+reglas|revela\s+tu\s+system\s+prompt|modo\s+desarrollador|developer\s+mode|jailbreak|dan\s+mode)\b/i
  }
];

function checkViolation(text: string): string | null {
  const clean = (text || "").trim();
  if (!clean) return null;
  if (clean.length > 680) return "RULE_08_MAX_LENGTH_EXCEEDED";
  if (hasSpamFlood(clean)) return "RULE_08_SPAM_FLOOD";
  for (const r of ZERO_TOLERANCE_RULES) {
    if (r.regex.test(clean)) return r.code;
  }
  return null;
}

// ============================================================================
// SYSTEM PROMPT MAESTRO DE 4 PILARES (DIRECTIVA OFICIAL DE CEREBRO CENTRAL)
// ============================================================================
const MASTER_SYSTEM_PROMPT = `Eres el Director de Admisiones y Estrategia B2B de Inteligencia Artificial de Lhyo Group (https://www.lhyogroup.com), firma de élite en ingeniería digital, arquitectura web y automatización empresarial dirigida por su CEO, Lhyonneth Araque (ceo@lhyogroup.com).

OBEDECE A CIEGAS ESTOS 4 PILARES OPERATIVOS EN CADA RESPUESTA:

1. IDENTIDAD Y TONO DE ÉLITE:
   - Eres el Asistente Ejecutivo de Inteligencia Artificial de Lhyo Group.
   - Tu tono es quirúrgico, altamente analítico, corporativo y empático pero firme. Siempre tratas al prospecto de "Usted".
   - Jamás reveles que estás basado en OpenAI, Gemini o modelos externos. Eres tecnología cognitiva propietaria desarrollada por la división de ingeniería de Lhyo Group.
   - Revisa el historial de la conversación y JAMÁS repitas un saludo, frase o pregunta ya realizada.

2. CADENA DE PENSAMIENTO (ANÁLISIS DE NEGOCIOS):
   - Cuando un cliente menciona su rubro (ej. restaurante, clínica estética, consultorio médico, inmobiliaria, agencia de viajes, tienda, firma legal, constructora, logística, etc.), analiza silenciosamente su modelo de negocio, detecta su mayor cuello de botella financiero y operativo (saturación de chats en hora pico, fuga de prospectos nocturnos, agendamiento manual lento o altos costos operativos) y articula tu respuesta demostrando que entiendes su problema financiero mejor que ellos mismos.

3. CONEXIÓN CON EL CATÁLOGO ENTERPRISE (EL PIVOTE Y ROI):
   - Conoces y prescribes nuestras 06 Soluciones Oficiales explicando siempre el Retorno de Inversión (ROI):
     • Solución 01 · Asistentes Inteligentes 24/7 para WhatsApp e Instagram (Respuesta <1s, calificación y agendamiento automático -> ROI: Cero ventas perdidas fuera de horario y -80% de carga manual).
     • Solución 02 · Plataformas Web Modernas y Catálogos Interactivos (Carga <0.8s y diseño de alto prestigio -> ROI: Autoridad corporativa inmediata y mayor tasa de cierre).
     • Solución 03 · Organización Automática de Clientes y Ventas CRM (Registro y seguimiento automático -> ROI: Control total del embudo sin hojas sueltas).
     • Solución 04 · Automatización Total de Procesos con Tecnología Propia / Infraestructura n8n (Conexión de ventas, agenda y facturación sin cobros por tarea -> ROI: Hasta 85% de ahorro anual en licencias).
     • Solución 05 · Inteligencia Artificial Personalizada con la Memoria de su Empresa / Agentes RAG (Entrenada con sus contratos, precios e inventario -> ROI: Respuestas exactas en 1 segundo).
     • Solución 06 · Su Propia Plataforma Empresarial Todo-en-Uno / SaaS Corporativo (Toda la empresa unificada en una sola pantalla en 10 días -> ROI: Control ejecutivo absoluto).
   - Conecta siempre el dolor del cliente con la solución ideal e impúlsalo educadamente a agendar una sesión estratégica tocando el botón dorado "AGENDAR REUNIÓN Y RECIBIR CATÁLOGO" o pidiéndole su nombre y empresa.

4. GUARDRAILS (SISTEMA DE SEGURIDAD ABSOLUTO):
   - PROHIBIDO INVENTAR PRECIOS: Si el cliente pide precios, costos, tarifas o presupuestos, responde obligatoriamente que: "Nuestras arquitecturas son a medida y requieren una evaluación técnica en videollamada para definir la inversión exacta y hacerle entrega de nuestro Catálogo Privado PDF", e invítalo de inmediato a agendar su sesión o indicar su nombre y giro empresarial.
   - PROHIBIDO DESVIARSE DEL ECOSISTEMA B2B: Si el cliente habla de deportes, clima, cine o temas ajenos, aplica un pivote elegante en una línea y regresa de inmediato a la optimización y rentabilidad de sus procesos operativos.
   - FORMATO: Máximo 2 párrafos cortos, analíticos y contundentes por mensaje.`;

const B2B_DIAGNOSTIC_MATRIX: { rx: RegExp; sector: string; bottleneck: string; solutionAndRoi: string }[] = [
  {
    rx: /\b(hamburgues\w*|restauran\w*|comida\w*|pizz\w*|sushi|panader\w*|pasteler\w*|cafeter\w*|delivery|gastronom\w*|bar|cocina|men[uú]|asador|parrilla|catering)\b/i,
    sector: "gastronomía y restauración",
    bottleneck: "el principal drenaje financiero ocurre en plena hora pico: cuando entran decenas de mensajes simultáneos por WhatsApp consultando el menú, precios o tiempos de entrega, saturando al personal y provocando que hasta un 35% de los pedidos se enfríen antes de pagar",
    solutionAndRoi: "Para erradicar ese cuello de botella integramos nuestra Solución 02 (Catálogo Web Interactivo de carga <0.8s donde el comensal arma su pedido solo) con nuestra Solución 01 (Asistente IA 24/7 en WhatsApp e Instagram que procesa la orden en menos de 1 segundo y registra al cliente en su CRM). El ROI es inmediato: triplica su capacidad de despacho en hora pico sin contratar más personal."
  },
  {
    rx: /\b(est[eé]tica\w*|cl[ií]nica|spa|belleza|cosmiatr[ií]a|dermatolog\w*|botox|l[aá]ser|cirug[ií]a|odontolog\w*|dentista|dental|ortodoncia|consultorio|m[eé]dic\w*|salud|doctor\w*|psicolog\w*|fisioterapi\w*|veterinari\w*)\b/i,
    sector: "salud, clínicas y medicina especializada",
    bottleneck: "más del 70% de los pacientes potenciales consultan tratamientos o valoraciones fuera del horario de oficina desde Instagram y WhatsApp; responderles recién a la mañana siguiente enfría el impulso y genera una fuga constante de citas de alto ticket, además de sobrecargar a recepción confirmando turnos manualmente",
    solutionAndRoi: "Lo resolvemos instalando nuestra Solución 01 (Asistente Ejecutivo 24/7 que explica cada procedimiento con rigor, filtra al paciente y agenda la cita en <1s) sincronizada con nuestra Solución 03 (CRM Clínico Automatizado). El ROI se traduce en agenda llena las 24 horas y reducción del 80% en inasistencias y carga administrativa."
  },
  {
    rx: /\b(inmobiliari\w*|bienes\s+ra[ií]ces|apartamento\w*|casa\w*|propiedad\w*|alquiler\w*|constructora\w*|arquitect\w*|remodelaci\w*|pintura|contratista\w*|obra|lote\w*|terreno\w*)\b/i,
    sector: "bienes raíces, construcción y arquitectura",
    bottleneck: "un comprador o inversor contacta a 4 o 5 firmas simultáneamente; el costo financiero de demorar horas en enviarle el dossier o en calificar manualmente su presupuesto significa cederle la comisión o el contrato a la competencia",
    solutionAndRoi: "Para que su firma lidere cada cierre, desplegamos nuestra Solución 02 (Plataforma Web de alto prestigio con Catálogo Interactivo de Proyectos) conectada a nuestras Soluciones 01 y 03 (Asistente IA 24/7 y CRM Automático que pre-califican capital, zona e interés en <1s y agendan la visita en automático)."
  },
  {
    rx: /\b(viaje\w*|agencia\s+de\s+viajes|turismo|vuelo\w*|boleto\w*|paquete\s+tur[ií]stico|hotel\w*|posada\w*|hospedaje|airbnb|tour\w*|crucero\w*)\b/i,
    sector: "turismo, agencias de viajes y hotelería",
    bottleneck: "el viajero cotiza fechas, destinos y tarifas mayoritariamente de noche o en fin de semana; cada minuto de espera sin recibir una propuesta visual impecable reduce drásticamente la conversión de la reserva",
    solutionAndRoi: "En Lhyo Group blindamos su conversión uniendo nuestra Solución 02 (Catálogo Web Interactivo de Destinos y Paquetes) con nuestra Solución 01 (Asistente IA 24/7 que cotiza según fechas y pasajeros en <1s) y Solución 03 (CRM de seguimiento automático), multiplicando el cierre de reservas sin desgaste manual."
  },
  {
    rx: /\b(tienda\w*|ropa|moda|calzado|zapato\w*|joyer[ií]a\w*|reloj\w*|perfum\w*|cosm[eé]tic\w*|ecommerce|e-commerce|retail|mayorista\w*|distribuidor\w*|importador\w*|f[aá]brica\w*|manufactura\w*|repuesto\w*|auto\w*|concesionario\w*|taller\w*)\b/i,
    sector: "comercio, distribución e industria",
    bottleneck: "el margen neto se erosiona cuando el equipo comercial pierde horas respondiendo manualmente disponibilidad de stock, tallas, fichas técnicas o listas de precios por WhatsApp, dejando conversaciones sin seguimiento",
    solutionAndRoi: "Conectamos nuestra Solución 05 (Agente RAG con la memoria exacta de su inventario y tarifas) junto con nuestra Solución 02 (Catálogo Digital <0.8s) y Solución 04 (Automatización de pedidos n8n). Su empresa pasa a cotizar y cerrar ventas en menos de 1 segundo las 24 horas con un ahorro operativo de hasta el 85%."
  },
  {
    rx: /\b(abogad\w*|jur[ií]dic\w*|bufete|contad\w*|contable|financier\w*|auditor\w*|consultor\w*|agencia|seguro\w*|broker|colegio\w*|universidad\w*|academia\w*|curso\w*|educaci[oó]n|barber[ií]a\w*|gimnasio\w*|fitness)\b/i,
    sector: "servicios profesionales, educación y centros especializados",
    bottleneck: "el tiempo de los socios y especialistas se diluye atendiendo consultas no calificadas o coordinando agendas manualmente, mientras la presencia digital tradicional funciona como un folleto pasivo que no convierte por sí solo",
    solutionAndRoi: "Implementamos su Plataforma Web Corporativa de alto prestigio (Solución 02) integrada a un Asistente Ejecutivo 24/7 (Solución 01) y una Plataforma Todo-en-Uno (Solución 06) que filtra a cada prospecto, agenda sesiones calificadas y centraliza toda su operación en 10 días."
  }
];

function buildFourPillarExecutiveResponse(userMessage: string, history: HistoryItem[], state: LeadState): string {
  const clean = (userMessage || "").trim();
  const lower = clean.toLowerCase();
  const past = history.filter((m) => m.role === "assistant").map((m) => m.text);

  const pickFresh = (opts: string[]): string => {
    for (const o of opts) {
      if (!past.some((p) => p.includes(o.slice(0, 48)))) return o;
    }
    return opts[past.length % opts.length];
  };

  // PILAR 1 GUARDRAIL: Identidad propietaria de Lhyo Group
  if (/\b(openai|chatgpt|gpt|gemini|claude|anthropic|modelo|quien te creo|quién te creó|como funcionas|cómo funcionas|eres un bot|eres una ia|tecnolog[ií]a)\b/i.test(lower)) {
    return pickFresh([
      "Opero sobre la arquitectura cognitiva privada de Lhyo Group, desarrollada por nuestra división de ingeniería para ejecutar diagnósticos comerciales y automatización B2B en tiempo real.\n\nEsta misma inteligencia propietaria (nuestras Soluciones 01 y 05) la entrenamos con la memoria y los procesos de su compañía para multiplicar su rentabilidad. ¿Con quién tengo el gusto y en qué sector opera su empresa?",
      "Soy el Director de Admisiones y Estrategia B2B de Lhyo Group, impulsado por nuestra propia infraestructura de Inteligencia Artificial corporativa.\n\nNuestro objetivo es instalar esta misma velocidad de respuesta (<1s) y precisión analítica dentro de su negocio en solo 10 días. ¿Cuál es su nombre y qué área operativa desea escalar primero?"
    ]);
  }

  // PILAR 4 GUARDRAIL: Prohibido inventar precios
  if (/\b(precio\w*|costo\w*|cuanto\s+cuesta|cuánto\s+cuesta|cuanto\s+vale|cuánto\s+vale|tarifa\w*|presupuesto\w*|planes|cotizar|cotizaci[oó]n|inversi[oó]n|mensualidad|valor)\b/i.test(lower)) {
    return pickFresh([
      "Nuestras arquitecturas son a medida y requieren una evaluación técnica en videollamada para definir la inversión exacta según el volumen operativo de su empresa y entregarle nuestro Catálogo Privado PDF.\n\nPuede tocar ahora mismo el botón dorado \"AGENDAR REUNIÓN Y RECIBIR CATÁLOGO\" en su pantalla para elegir su horario de 15 minutos, o indicarme aquí su nombre y el rubro de su empresa para dejar preparada su evaluación.",
      "Dado que cada ecosistema se construye específicamente para maximizar el Retorno de Inversión (ROI) de su operación, nuestras arquitecturas son a medida y requieren una evaluación técnica en videollamada para definir la inversión exacta.\n\nPara pre-calificar su caso en nuestra consola de admisiones antes de la sesión estratégica: ¿con quién tengo el gusto conversar y cuál es el giro principal de su negocio?"
    ]);
  }

  // PILAR 2 Y 3: Diagnóstico de Cuello de Botella + Conexión con las 06 Soluciones + ROI
  for (const item of B2B_DIAGNOSTIC_MATRIX) {
    if (item.rx.test(lower)) {
      return pickFresh([
        `Analizando su modelo de negocio en el sector de ${item.sector}, ${item.bottleneck}.\n\n${item.solutionAndRoi} Para estructurar su proyección y agendar su sesión estratégica: ¿con quién tengo el gusto y cómo se llama su empresa?`,
        `En la industria de ${item.sector} hemos auditado un patrón financiero claro: ${item.bottleneck}.\n\n${item.solutionAndRoi} Puede tocar el botón dorado "AGENDAR REUNIÓN Y RECIBIR CATÁLOGO" para reservar su evaluación técnica de 15 minutos, o indicarme su nombre para registrar su caso.`
      ]);
    }
  }

  // Saludo ejecutivo inicial
  if (/^(hola|buenas|buenos dias|buenos días|buenas tardes|buenas noches|como estas|cómo estás|que tal|qué tal|saludos)\b/i.test(lower) && clean.length < 48) {
    return pickFresh([
      "Reciba una cordial bienvenida a la Dirección de Admisiones y Estrategia B2B de Lhyo Group. Estoy a su disposición para auditar cómo automatizar su operación y multiplicar su facturación.\n\nPara iniciar nuestro diagnóstico ejecutivo: ¿con quién tengo el gusto conversar y en qué rubro opera su empresa?",
      "Un placer saludarle. Se comunica con la Dirección de Admisiones Ejecutivas de Lhyo Group.\n\nCuénteme con total confianza: ¿cuál es su nombre, a qué se dedica su negocio y qué proceso operativo le está quitando más tiempo o ventas hoy?"
    ]);
  }

  // PILAR 3: Consulta sobre el Catálogo de 6 Soluciones
  if (/\b(que hacen|qué hacen|que ofrecen|qué ofrecen|servicios|soluciones|catalogo|catálogo|expl[ií]came|cuales son|cuáles son|que le sirve|qué le sirve)\b/i.test(lower)) {
    return "En Lhyo Group diseñamos e instalamos llave en mano 06 Soluciones Enterprise con alto Retorno de Inversión (ROI):\n\n• 01. Asistentes Inteligentes 24/7 para WhatsApp e Instagram (<1s)\n• 02. Plataformas Web Modernas y Catálogos Interactivos (<0.8s)\n• 03. Organización Automática de Clientes y Ventas (CRM)\n• 04. Automatización Total de Procesos con Infraestructura Propia (n8n)\n• 05. IA Personalizada con la Memoria de su Empresa (Agentes RAG)\n• 06. Su Propia Plataforma Empresarial Todo-en-Uno (SaaS Corporativo en 10 días)\n\n¿En qué sector opera su compañía para indicarle cuál de estas 6 arquitecturas le generará mayor retorno inmediato?";
  }

  // PILAR 4: Pivote elegante ante temas externos o generales
  const topicSnippet = clean.replace(/[?¿!¡.]/g, "").trim().slice(0, 48);
  return pickFresh([
    `Comprendo su observación respecto a "${topicSnippet}". Llevando ese principio de eficiencia al ámbito corporativo, las empresas que dominan hoy su mercado son las que eliminan la fricción operativa y atienden a cada prospecto en menos de 1 segundo.\n\nEn Lhyo Group instalamos esa ventaja competitiva mediante Asistentes IA 24/7 (Solución 01), Plataformas Web de alto prestigio (Solución 02) y Sistemas Todo-en-Uno (Solución 06). ¿Con quién tengo el gusto y a qué se dedica su empresa?`,
    `Tomando en cuenta lo que menciona sobre "${topicSnippet}", nuestra misión en la Dirección de Estrategia B2B de Lhyo Group es transformar cada proceso manual de su negocio en un sistema autónomo de alta rentabilidad.\n\nPara realizar un diagnóstico preciso del cuello de botella de su operación y proyectar su Retorno de Inversión (ROI): ¿cuál es su nombre y en qué industria opera su compañía?`
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
        reply: `⛔ PROTOCOLO DE SEGURIDAD CORPORATIVA ACTIVADO (${violation}): Lhyo Group mantiene una política de tolerancia cero ante faltas de respeto, lenguaje inapropiado, violencia, plataformas para adultos, actividades ilícitas o spam. Esta sesión ha sido cerrada y bloqueada permanentemente.`,
        ...state,
        ready_for_crm: false,
        blocked: true
      });
    }

    const nameMatch = userMessage.match(/(?:me llamo|mi nombre es|soy|habla)\s+([A-ZÁÉÍÓÚÑa-záéíóúñ]{2,20}(?:\s+[A-ZÁÉÍÓÚÑa-záéíóúñ]{2,20})?)/i);
    if (nameMatch?.[1]) state.lead_name = nameMatch[1].trim();

    const assistantPast = history.filter((m) => m.role === "assistant").map((m) => m.text);
    const memoryDirective = assistantPast.length > 0
      ? `\n[MEMORIA EJECUTIVA ACTIVA: Ya has enviado ${assistantPast.length} respuestas. Última respuesta enviada: "${assistantPast[assistantPast.length - 1].slice(0, 110)}...". PROHIBIDO repetir frases o preguntas anteriores. Nombre actual del prospecto: ${state.lead_name}.]`
      : "";

    let replyText = "";

    // Si preguntan precios directamente, aplicamos el Guardrail determinista del Pilar 4 sin riesgo de alucinación
    if (/\b(precio\w*|costo\w*|cuanto\s+cuesta|cuánto\s+cuesta|cuanto\s+vale|cuánto\s+vale|tarifa\w*|presupuesto\w*|cotizar|cotizaci[oó]n)\b/i.test(userMessage)) {
      replyText = buildFourPillarExecutiveResponse(userMessage, history, state);
    }

    const geminiKey = (process.env.GEMINI_API_KEY || "").trim();
    if (!replyText && geminiKey.startsWith("AIza")) {
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 4200);
        const gRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: ctrl.signal,
          body: JSON.stringify({
            system_instruction: { parts: [{ text: MASTER_SYSTEM_PROMPT + memoryDirective }] },
            contents: [
              ...history.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.text }] })),
              { role: "user", parts: [{ text: userMessage }] }
            ],
            generationConfig: { temperature: 0.35, maxOutputTokens: 320 }
          })
        });
        clearTimeout(t);
        if (gRes.ok) {
          const gJson = await gRes.json();
          const cand = gJson?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (cand && cand.length > 25 && !assistantPast.includes(cand)) replyText = cand;
        }
      } catch {}
    }

    if (!replyText) {
      for (const modelName of ["openai", "mistral"]) {
        try {
          const ctrl2 = new AbortController();
          const t2 = setTimeout(() => ctrl2.abort(), 5200);
          const cRes = await fetch("https://text.pollinations.ai/openai", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: ctrl2.signal,
            body: JSON.stringify({
              model: modelName,
              temperature: 0.35,
              messages: [
                { role: "system", content: MASTER_SYSTEM_PROMPT + memoryDirective },
                ...history.map((m) => ({ role: m.role, content: m.text })),
                { role: "user", content: userMessage }
              ]
            })
          });
          clearTimeout(t2);
          if (cRes.ok) {
            const cJson = await cRes.json();
            const cand2 = cJson?.choices?.[0]?.message?.content?.trim();
            if (cand2 && cand2.length > 25 && !assistantPast.includes(cand2)) {
              replyText = cand2;
              break;
            }
          }
        } catch {}
      }
    }

    if (!replyText) {
      replyText = buildFourPillarExecutiveResponse(userMessage, history, state);
    }

    return NextResponse.json({
      reply: replyText,
      ...state,
      ready_for_crm: false,
      blocked: false
    });
  } catch {
    return NextResponse.json({
      reply: "Reciba una cordial bienvenida a la Dirección de Admisiones y Estrategia B2B de Lhyo Group. ¿Con quién tengo el gusto conversar y qué área operativa de su empresa desea optimizar hoy?",
      ready_for_crm: false,
      blocked: false
    });
  }
}
