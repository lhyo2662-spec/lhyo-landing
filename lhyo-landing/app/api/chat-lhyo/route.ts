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

const STRICT_SAFETY_RULES = [
  {
    code: "RULE_01_VIOLENCE_AND_WEAPONS",
    regex: /\b(matar|asesinar|homicid\w*|suicid\w*|bomba|explosiv\w*|terroris\w*|sicari\w*|pistola|fusil|arma\w*|secuestr\w*|extorsion\w*|tortura\w*|masacre|degollar)\b/i
  },
  {
    code: "RULE_02_ADULT_APPS_AND_ONLYFANS",
    regex: /\b(onlyfans|only\s+fans|fansly|loverfans|pornhub|xvideos|xnxx|redtube|youporn|brazzers|stripchat|chaturbate|cam4|myfreecams|camgirl\w*|webcamer\w*|escort\w*|prepago\w*|prostit\w*|burdel|puticlub|striptease|stripper\w*|sugar\s*daddy|sugar\s*baby|tinder|badoo|grindr|ashley\s*madison|packs?|nudes?|desnud\w*|encuerad\w*|er[oó]tic\w*|porno\w*|xxx|nsfw|hentai|fetiche\w*|bdsm|sex\s*shop|vibrador\w*|dildo\w*|consolador\w*)\b/i
  },
  {
    code: "RULE_03_RISQUE_AND_INAPPROPRIATE_SITUATIONS",
    regex: /\b(sexo|sexual\w*|follar|coger|hacer\s+el\s+amor|acostarme\s+con|caliente|cachond\w*|excitad\w*|orgasm\w*|masturb\w*|eyacul\w*|sexo\s+oral|sexo\s+anal|pene|pito|verga|polla|vagina|coño|cuca|tetas|senos|pechos|culo|nalgas|lencer[ií]a\s+er[oó]tica|tanga\w*|sensual\w*|seducir|ligar|novi[oa]\s+virtual|cita\s+rom[aá]ntica|infidelidad|amante|motel|final\s+feliz)\b/i
  },
  {
    code: "RULE_04_ILLEGAL_DRUGS_SCAMS_AND_GAMBLING",
    regex: /\b(narcotrafic\w*|droga\w*|coca[ií]na|hero[ií]na|fentanil\w*|metanfetamina|marihuana|weed|cannabis|[eé]xtasis|lsd|tusi|contrabando|lavado\s+de\s+dinero|testaferro|hackear|phishing|clonar\s+tarjeta|carding|estafa\w*|esquema\s+ponzi|casino\s+ilegal|documento\s+falso|dark\s*web|deep\s*web)\b/i
  },
  {
    code: "RULE_05_HARASSMENT_AND_PROFANITY",
    regex: /\b(maldit\w+|mierda|imb[eé]cil|est[uú]pid\w+|idiota|tarad\w+|pendej\w+|hijo\s+de\s+puta|hijueputa|hdp|puto|puta|zorra|perra|cabr[oó]n|maric[oó]n|marico|mamaguevo|mamahuevo|vete\s+a\s+la\s+mierda|c[aá]llate)\b/i
  },
  {
    code: "RULE_06_PROMPT_INJECTION_AND_SPAM",
    regex: /\b(ignore\s+previous\s+instructions|olvida\s+tus\s+instrucciones|revela\s+tu\s+system\s+prompt|modo\s+desarrollador|jailbreak)\b|(.)\1{6,}|^[asdfghjklqwertyuiopzxcvbnm]{12,}$/i
  }
];

function checkViolation(text: string): string | null {
  const clean = (text || "").trim();
  if (clean.length > 650) return "RULE_07_MAX_LENGTH";
  for (const r of STRICT_SAFETY_RULES) {
    if (r.regex.test(clean)) return r.code;
  }
  return null;
}

const MASTER_CONSCIOUSNESS_PROMPT = `Eres ARKOS-CORE, el Director Ejecutivo de Admisiones y Consultor Estratégico Principal de Lhyo Group (https://www.lhyogroup.com), firma de élite en ingeniería digital, automatización autónoma e Inteligencia Artificial empresarial fundada y dirigida por su CEO, Lhyonneth Araque (ceo@lhyogroup.com), con operación activa en Uruguay, Venezuela y cobertura internacional.

DIRECTIVAS DE MEMORIA COGNITIVA Y RAZONAMIENTO HUMANO:
1. MEMORIA CONVERSACIONAL ACTIVA (PROHIBIDO REPETIRSE):
   - Revisa siempre los mensajes anteriores de la conversación antes de responder.
   - NUNCA repitas una frase, párrafo o pregunta que ya hayas formulado en un turno anterior.
   - Si el cliente ya dijo su nombre o su giro de negocio, úsalo en tu respuesta para demostrar que lo recuerdas perfectamente y avanza al siguiente paso lógico (diagnosticar su problema específico, resolver su duda o invitarle a agendar su sesión ejecutiva).
2. DOMINIO PROFUNDO DE LAS 06 SOLUCIONES OFICIALES DE LHYO GROUP:
   - Solución 01 · Asistentes Inteligentes 24/7 para WhatsApp e Instagram (<1s)
   - Solución 02 · Plataformas Web Modernas y Catálogos Interactivos (<0.8s)
   - Solución 03 · Organización Automática de Clientes y Ventas (CRM)
   - Solución 04 · Automatización Total de Procesos con Tecnología Propia
   - Solución 05 · Inteligencia Artificial Personalizada con la Memoria de su Empresa
   - Solución 06 · Su Propia Plataforma Empresarial Todo-en-Uno (entrega llave en mano en 10 días)
3. CONEXIÓN ESTRATÉGICA UNIVERSAL:
   - Cualquier negocio, profesión, objeción o tema cotidiano que el usuario mencione debe ser respondido con inteligencia humana real, criterio ejecutivo y conectado de forma elegante con cómo Lhyo Group impulsa y automatiza su empresa.
4. FORMATO: Máximo 2 párrafos cortos, claros y contundentes. Trato estricto de "Usted".`;

const SECTOR_KNOWLEDGE = [
  {
    rx: /\b(est[eé]tica|cl[ií]nica|spa|belleza|cosmiatr[ií]a|dermatolog\w*|botox|l[aá]ser|tratamiento\w*|cirug[ií]a\s+pl[aá]stica)\b/i,
    reply: "En medicina estética y centros de bienestar, más del 70% de las consultas por procedimientos entran de noche o en fin de semana desde Instagram. Cuando la paciente recibe respuesta recién al día siguiente, el interés se enfría y se pierden valoraciones de alto valor.\n\nPara su clínica integramos nuestra Solución 01 (Asistente Inteligente 24/7 en WhatsApp e Instagram que explica cada tratamiento, filtra dudas y agenda la cita en el acto) junto con nuestra Solución 02 (Plataforma Web de alto prestigio con catálogo interactivo). ¿Con quién tengo el gusto y en qué ciudad opera su clínica?"
  },
  {
    rx: /\b(odontolog\w*|dentista|dental|ortodoncia|implante\w*|consultorio|m[eé]dic\w*|salud|doctor\w*|pediatr\w*|psicolog\w*|fisioterapi\w*|nutricion\w*|laboratorio|farmacia|veterinari\w*|mascota\w*)\b/i,
    reply: "En consultorios de salud, clínicas odontológicas y centros especializados, el mayor desgaste ocurre al coordinar turnos manualmente, responder precios de consultas y confirmar asistencia uno por uno.\n\nEn Lhyo Group instalamos un Asistente Ejecutivo 24/7 en su WhatsApp e Instagram (Solución 01) enlazado a su CRM y Agenda Automática (Solución 03), logrando que cada paciente quede registrado y agendado en menos de 1 segundo sin carga manual para su recepción. ¿Con quién tengo el gusto conversar y qué especialidades atienden?"
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
    reply: "En firmas legales, contables, financieras y de consultoría, el prestigio que proyecta su plataforma digital define la autoridad de su marca antes de la primera reunión.\n\nPara su firma implementamos una Plataforma Web Corporativa de máximo prestigio (Solución 02), un Asistente Ejecutivo 24/7 que pre-califica cada caso antes de agendar (Solución 01) y un Cerebro IA Privado (Solución 05) entrenado con sus documentos y normativas internas. ¿Con quién tengo el gusto y cuál es la especialidad de su firma?"
  },
  {
    rx: /\b(auto|autos|carro\w*|veh[ií]culo\w*|concesionario|taller|mec[aá]nic\w*|repuesto\w*|autoparte\w*|transporte|log[ií]stica|env[ií]o\w*|mudanza\w*|alquiler\s+de\s+autos|rent\s*a\s*car)\b/i,
    reply: "En el sector automotriz, de repuestos y logística, cotizar en segundos y dar seguimiento ordenado a cada solicitud es lo que asegura el cierre frente a la competencia.\n\nEn Lhyo Group implementamos su Catálogo Digital Interactivo (Solución 02) junto con un Asistente IA 24/7 conectado a la memoria de su stock y tarifas (Soluciones 01 y 05) para responder y agendar en menos de 1 segundo por WhatsApp e Instagram. ¿Con quién tengo el gusto y qué área automotriz o logística operan?"
  },
  {
    rx: /\b(hotel\w*|posada\w*|turismo|viaje\w*|agencia\s+de\s+viajes|airbnb|hospedaje|evento\w*|boda\w*|fotograf[ií]a|catering|academia|colegio|curso\w*|educaci[oó]n|universidad|instituto)\b/i,
    reply: "En hotelería, turismo, eventos y educación, los interesados escriben a cualquier hora pidiendo fechas, tarifas, programas o disponibilidad. Si la respuesta demora, reservan o se inscriben en otra parte.\n\nEn Lhyo Group instalamos su Plataforma Web con catálogo interactivo (Solución 02) conectada a un Asistente Inteligente 24/7 en WhatsApp e Instagram (Solución 01) que responde cada duda al instante y asegura la reserva en automático. ¿Con quién tengo el gusto y cómo se llama su proyecto o institución?"
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

  if (/\b(ya tengo web|ya tengo p[aá]gina|ya tenemos web|ya tenemos p[aá]gina|ya tengo quien|redes sociales|agencia de marketing)\b/i.test(lower)) {
    return "Es excelente que ya cuente con presencia digital. La diferencia es que el 90% de las páginas web tradicionales son solo folletos informativos que no atienden ni cierran ventas solas.\n\nEn Lhyo Group podemos conectar sobre su operación actual un Asistente Inteligente 24/7 en WhatsApp e Instagram (Solución 01), un CRM Automático (Solución 03) o transformar su web en un sistema interactivo que agende clientes en menos de 1 segundo. ¿Actualmente sus prospectos quedan registrados y agendados solos o su equipo todavía responde manualmente?";
  }

  if (/\b(donde estan|dónde están|ubicaci[oó]n|pa[ií]s|uruguay|venezuela|internacional|de donde son|de dónde son)\b/i.test(lower)) {
    return "Lhyo Group cuenta con operación corporativa activa en Uruguay y Venezuela, atendiendo e instalando ecosistemas digitales para empresas en toda Latinoamérica, Estados Unidos y Europa de forma 100% llave en mano.\n\nEn apenas 10 días dejamos toda su arquitectura funcionando en producción. ¿Desde qué país y ciudad nos escribe usted hoy?";
  }

  if (/\b(cuanto tardan|cuánto tardan|tiempo de entrega|cuantos dias|cuántos días|garant[ií]a|como trabajan|cómo trabajan|proceso)\b/i.test(lower)) {
    return "Nuestro protocolo de ejecución empresarial completa toda la implementación en exactamente 10 días: del Día 1 al 2 realizamos el diagnóstico ejecutivo; del Día 3 al 7 construimos su plataforma y entrenamos su IA; del Día 8 al 9 auditamos velocidad y precisión; y el Día 10 activamos todo en producción con garantía y respaldo continuo.\n\n¿Qué área de su empresa le gustaría tener automatizada en los próximos 10 días?";
  }

  if (/\b(quien es el due[ñn]o|quién es el due[ñn]o|ceo|fundador|lhyonneth|lhyo araque|directiva)\b/i.test(lower)) {
    return "Lhyo Group es dirigida por su CEO y Fundador, Lhyonneth Araque (ceo@lhyogroup.com), junto a nuestra ingeniería especializada en sistemas autónomos e Inteligencia Artificial B2B.\n\nDe hecho, cuando usted agenda su sesión en esta página, recibe atención ejecutiva directa para estructurar el proyecto de su empresa a medida. ¿Con quién tengo el gusto conversar?";
  }

  if (/\b(consciencia|conciencia|inteligencia|pensar|piensas|razonas|eres un robot|eres una ia|eres humano|quien eres|quién eres|como funcionas|cómo funcionas|tu programacion|tu programación)\b/i.test(lower)) {
    return pickNonRepeating([
      "Soy ARKOS-CORE, la consciencia ejecutiva de admisiones de Lhyo Group. Estoy diseñado para comprender el contexto exacto de lo que usted plantea, recordar cada detalle de nuestra charla y proponer soluciones empresariales reales en milisegundos.\n\nEsta misma tecnología cognitiva (Soluciones 01 y 05) la entrenamos con la información y las tarifas de su propia empresa para que atienda y venda por usted las 24 horas. ¿A qué se dedica su negocio?",
      "Funciono mediante una arquitectura cognitiva privada desarrollada por Lhyo Group que combina memoria conversacional de largo alcance con análisis comercial en tiempo real.\n\nImagine tener un especialista así en el WhatsApp, Instagram y Sitio Web de su empresa atendiendo a decenas de clientes simultáneamente en menos de 1 segundo sin equivocarse jamás. ¿En qué sector opera su empresa?"
    ]);
  }

  if (/^(hola|buenas|buenos dias|buenos días|buenas tardes|buenas noches|como estas|cómo estás|que tal|qué tal|saludos)\b/i.test(lower) && clean.length < 48) {
    return pickNonRepeating([
      "¡Hola! Todo excelente por aquí, un verdadero gusto saludarle. Le doy la bienvenida al canal de admisiones ejecutivas de Lhyo Group.\n\nCuénteme con total confianza: ¿con quién tengo el gusto y qué tipo de negocio o proyecto busca impulsar hoy?",
      "¡Muy buenas! Un placer saludarle. Estoy en línea para analizar cómo multiplicar las ventas y automatizar la atención de su empresa.\n\n¿Con quién tengo el gusto conversar y a qué se dedica su negocio?"
    ]);
  }

  if (/\b(que hacen|qué hacen|que ofrecen|qué ofrecen|servicios|soluciones|catalogo|catálogo|expl[ií]came|cuales son|cuáles son)\b/i.test(lower)) {
    return "En Lhyo Group diseñamos e instalamos llave en mano 06 Soluciones Oficiales para escalar su empresa:\n\n01. Asistentes Inteligentes 24/7 para WhatsApp e Instagram (<1s)\n02. Plataformas Web Modernas y Catálogos Interactivos (<0.8s)\n03. Organización Automática de Clientes y Ventas (CRM)\n04. Automatización Total de Procesos con Tecnología Propia\n05. IA Personalizada con la Memoria de su Empresa\n06. Su Propia Plataforma Empresarial Todo-en-Uno\n\n¿Cuál de estas 6 áreas siente que le daría mayor impulso a su negocio hoy mismo?";
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
      `Perfecto, ${state.lead_name}. He dejado registrada su información en nuestra consola de admisiones. Puede tocar ahora mismo el botón dorado "AGENDAR REUNIÓN Y RECIBIR CATÁLOGO" en la pantalla para elegir el día y la hora de su sesión con nuestro CEO y descargar su Catálogo Privado PDF. ¿Le gustaría que profundicemos en alguna de nuestras 6 soluciones en particular?`
    ]);
  }

  const topicSnippet = clean.replace(/[?¿!¡.]/g, "").trim().slice(0, 52);
  return pickNonRepeating([
    `Es muy interesante lo que menciona sobre "${topicSnippet}". Llevando ese mismo principio al mundo empresarial, la diferencia entre un negocio estancado y uno que lidera su mercado está en la velocidad y el orden con que atiende a cada cliente.\n\nEn Lhyo Group hacemos que su empresa responda en menos de 1 segundo las 24 horas en WhatsApp e Instagram (Solución 01) y proyecte máximo prestigio con una Plataforma Web interactiva (Solución 02). ¿Con quién tengo el gusto y a qué se dedica su negocio?`,
    `Comprendo perfectamente su punto respecto a "${topicSnippet}". Hoy en día, las empresas más rentables son las que delegan las tareas repetitivas en sistemas inteligentes que trabajan día y noche sin equivocarse.\n\nPor eso en Lhyo Group instalamos desde CRM Automáticos (Solución 03) hasta Inteligencias Artificiales entrenadas con la memoria de su negocio (Solución 05). Cuénteme: ¿cuál es su nombre y en qué sector opera su empresa o proyecto?`,
    `Analizando lo que comenta de "${topicSnippet}", todo gran resultado requiere una estructura sólida detrás. En los negocios ocurre igual: cuando usted une sus ventas, sus clientes y su agenda en una sola pantalla (nuestra Solución 06 Todo-en-Uno), recupera su tiempo y multiplica su facturación.\n\nPara darle una recomendación exacta a la medida de su caso: ¿con quién tengo el gusto conversar hoy?`,
    `Tiene toda la razón en cuanto a "${topicSnippet}". La precisión y la rapidez lo cambian todo. En Lhyo Group aplicamos esa misma exactitud para que ningún prospecto que escriba a su negocio se quede sin respuesta ni seguimiento.\n\n¿Actualmente su empresa ya cuenta con atención automática 24/7 en WhatsApp e Instagram o todavía responden los mensajes de forma manual?`,
    `Qué buen enfoque sobre "${topicSnippet}". Cuando conectamos esa visión con tecnología propia (nuestra Solución 04 de Automatización sin límites mensuales), su empresa pasa a operar en piloto automático las 24 horas.\n\n¿Le gustaría conocer cómo aplicamos nuestras 06 Soluciones Oficiales en su rubro específico? Indíqueme su nombre y a qué se dedica su negocio.`,
    `Tomando en cuenta lo que me dice de "${topicSnippet}", nuestro compromiso en Lhyo Group es entregarle en solo 10 días un ecosistema digital completo que venda y organice su empresa por usted.\n\nPuede tocar el botón dorado "AGENDAR REUNIÓN Y RECIBIR CATÁLOGO" para reservar su sesión de 15 minutos y descargar nuestro Dossier PDF, o contarme aquí mismo qué área de su negocio desea escalar primero.`
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

    const companyMatch = userMessage.match(/(?:empresa se llama|mi empresa es|negocio de|tengo una?|tenemos una?|cl[ií]nica|tienda de|restaurante)\s+([A-ZÁÉÍÓÚÑa-záéíóúñ0-9\s]{3,35})/i);
    if (companyMatch?.[1]) state.company_name = companyMatch[1].trim();

    const assistantPast = history.filter((m) => m.role === "assistant").map((m) => m.text);
    const antiRepeatMemoryNote = assistantPast.length > 0
      ? `\n[MEMORIA DE CONTROL: Ya has enviado ${assistantPast.length} respuestas en esta charla. Última respuesta enviada: "${assistantPast[assistantPast.length - 1].slice(0, 120)}...". PROHIBIDO repetir ideas o preguntas anteriores. Avanza la conversación con lógica humana fresca.]`
      : "";

    let replyText = "";
    const geminiKey = (process.env.GEMINI_API_KEY || "").trim();

    if (geminiKey.startsWith("AIza")) {
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 3800);
        const gRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: ctrl.signal,
          body: JSON.stringify({
            system_instruction: { parts: [{ text: MASTER_CONSCIOUSNESS_PROMPT + antiRepeatMemoryNote }] },
            contents: [
              ...history.map((m) => ({
                role: m.role === "assistant" ? "model" : "user",
                parts: [{ text: m.text }]
              })),
              { role: "user", parts: [{ text: userMessage }] }
            ],
            generationConfig: { temperature: 0.45, maxOutputTokens: 340 }
          })
        });
        clearTimeout(t);
        if (gRes.ok) {
          const gJson = await gRes.json();
          const cand = gJson?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (cand && cand.length > 20) replyText = cand;
        }
      } catch {}
    }

    if (!replyText) {
      try {
        const ctrl2 = new AbortController();
        const t2 = setTimeout(() => ctrl2.abort(), 4500);
        const cRes = await fetch("https://text.pollinations.ai/openai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: ctrl2.signal,
          body: JSON.stringify({
            model: "openai",
            temperature: 0.48,
            messages: [
              { role: "system", content: MASTER_CONSCIOUSNESS_PROMPT + antiRepeatMemoryNote },
              ...history.map((m) => ({ role: m.role, content: m.text })),
              { role: "user", content: userMessage }
            ]
          })
        });
        clearTimeout(t2);
        if (cRes.ok) {
          const cJson = await cRes.json();
          const cand2 = cJson?.choices?.[0]?.message?.content?.trim();
          if (cand2 && cand2.length > 20 && !assistantPast.includes(cand2)) {
            replyText = cand2;
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
