import { NextResponse } from "next/server";
export const runtime = "edge";

const SEVERE_BLOCK_REGEX = /(matar|asesinar|suicid|bomba|terroris|sicario|violacion|pedofil|hackear\s+banco|clonar\s+tarjeta|mierda|malparid|hijueputa)/i;

function extractTopicKeyword(rawText: string) {
  const stopWords = new Set(["que","qué","como","cómo","donde","dónde","cuando","cuándo","por","para","con","sin","los","las","una","uno","del","al","hoy","ayer","mañana","puedo","puede","quiero","quiere","hacer","hago","tiene","tengo","esta","está","este","eso","esa","algo","sobre","dime","decir","sabes","hola","buenas","buenos"]);
  const words = String(rawText || "")
    .replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s]/g, " ")
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length >= 4 && !stopWords.has(w.toLowerCase()));
  return words.length > 0 ? words.slice(0, 3).join(" ") : "ese tema";
}

function pickNonRepeating(candidates: string[], history: any[]) {
  const previousBotTexts = new Set(
    (history || []).filter((m) => m.sender === "bot").map((m) => String(m.text || "").trim())
  );
  for (const item of candidates) {
    const clean = item.replace(/\[MOSTRAR_BOTON_AGENDA\]/g, "").trim();
    if (!previousBotTexts.has(clean)) return item;
  }
  const idx = (history || []).filter((m) => m.sender === "user").length % candidates.length;
  return candidates[idx];
}

function contextualBrain(message: string, history: any[]) {
  const clean = String(message || "").trim();
  const lower = clean.toLowerCase();
  const topic = extractTopicKeyword(clean);

  if (/(odontol|dental|dentista|clinica|clínica|medic|médic|doctor|salud|paciente|consultorio|hospital|estetic|estétic)/i.test(lower)) {
    return pickNonRepeating([
      "Para su clínica o consultorio, en Lhyo Group instalamos un Asistente Inteligente 24/7 en WhatsApp e Instagram (Solución 01) que responde dudas de tratamientos, filtra pacientes reales y agenda sus citas automáticamente en su calendario, unido a una Plataforma Web de prestigio (Solución 02) y un CRM Clínico (Solución 03). ¿Cuál de estas áreas desea implementar primero? [MOSTRAR_BOTON_AGENDA]",
      "En el sector clínico y odontológico, nuestra tecnología elimina las inasistencias y la pérdida de pacientes fuera de horario: su Asistente IA 24/7 atiende consultas al instante, registra al paciente en su CRM (Solución 03) y confirma el turno sin intervención manual. ¿Le gustaría agendar una sesión de 15 minutos para ver cómo operaría en su clínica? [MOSTRAR_BOTON_AGENDA]",
      "Además de automatizar la agenda de pacientes 24/7 en WhatsApp e Instagram, podemos entrenar una Inteligencia Artificial Privada con la memoria de su clínica (Solución 05) con todos sus aranceles, presupuestos y protocolos para dar respuestas exactas en 1 segundo. ¿Desea cotizarlo para su clínica? [MOSTRAR_BOTON_AGENDA]"
    ], history);
  }

  if (/(restaurante|gastronom|hotel|cafeteria|cafetería|bar|delivery|pedidos de comida|vendo comida)/i.test(lower)) {
    return pickNonRepeating([
      "Para el sector gastronómico y hotelero, en Lhyo Group desarrollamos Plataformas Web con Catálogos Interactivos (Solución 02) y Asistentes Inteligentes 24/7 en WhatsApp e Instagram (Solución 01) que muestran su propuesta, atienden reservas o pedidos al instante y registran cada cliente en su CRM. ¿Desea implementarlo en su negocio? [MOSTRAR_BOTON_AGENDA]",
      "En negocios gastronómicos, la velocidad de atención define la venta: con nuestro sistema propio (Soluciones 01 y 03), cada cliente que escribe por WhatsApp o Instagram recibe atención en menos de 1 segundo las 24 horas y queda registrado en su base de datos. ¿Le gustaría ver una demostración aplicada a su local? [MOSTRAR_BOTON_AGENDA]"
    ], history);
  }

  if (/(inmobiliaria|bienes raices|bienes raíces|propiedades|constructora|arquitect|abogad|legal|contable|agencia|tienda|ecommerce|gimnasio|spa|educacion|academia|empresa|negocio)/i.test(lower) && !/(que es lhyo|qué hacen|que ofrecen)/i.test(lower)) {
    return pickNonRepeating([
      "Para potenciar su operación en ese sector, en Lhyo Group unimos 3 piezas clave: una Plataforma Web de máximo prestigio (Solución 02), un Asistente Inteligente 24/7 en WhatsApp e Instagram que califica y agenda clientes solos (Solución 01), y un CRM Automático (Solución 03). ¿Qué área de su negocio busca escalar primero? [MOSTRAR_BOTON_AGENDA]",
      "Su negocio puede operar en piloto automático con nuestra tecnología propia: desde atención inmediata 24/7 en WhatsApp e Instagram hasta una Plataforma Empresarial Todo-en-Uno (Solución 06) con su propia marca. ¿Desea recibir nuestro Catálogo Privado PDF con las opciones para su empresa? [MOSTRAR_BOTON_AGENDA]"
    ], history);
  }

  if (/(precio|costo|cuanto|cuánto|valor|tarifa|presupuesto|cotiza|planes|paquete|inversion|inversión)/i.test(lower)) {
    return pickNonRepeating([
      "Cada solución en Lhyo Group se cotiza a la medida de su región (Latinoamérica, Europa o Norteamérica) y de los módulos que elija entre nuestras 06 Soluciones Oficiales. En una breve sesión ejecutiva de 15 minutos por videollamada le entregamos su presupuesto exacto y nuestro Catálogo Privado PDF. Toque el botón dorado inferior para elegir su horario. [MOSTRAR_BOTON_AGENDA]",
      "Para garantizarle un presupuesto exacto sin costos innecesarios, evaluamos en 15 minutos qué soluciones necesita su empresa (Asistente IA 24/7, Plataforma Web, CRM, Automatización Propia o Sistema Todo-en-Uno) y le enviamos el Dossier Corporativo PDF con las tarifas de su región. Puede reservar su espacio en el botón aquí abajo. [MOSTRAR_BOTON_AGENDA]"
    ], history);
  }

  if (/(que ofrecen|qué ofrecen|servicios|soluciones|que hacen|qué hacen|catalogo|catálogo|informacion|información|como funciona|cómo funciona)/i.test(lower)) {
    return pickNonRepeating([
      "En Lhyo Group diseñamos e instalamos 06 Soluciones Tecnológicas de alta gama para su empresa:\n01 · Asistentes Inteligentes 24/7 para WhatsApp e Instagram.\n02 · Plataformas Web Modernas y Catálogos Interactivos.\n03 · Organización Automática de Clientes y Ventas (CRM).\n04 · Automatización Total con Tecnología Propia.\n05 · IA Personalizada con la Memoria de su Empresa.\n06 · Su Propia Plataforma Empresarial Todo-en-Uno.\n\n¿Cuál de estas 6 soluciones le interesa implementar primero? [MOSTRAR_BOTON_AGENDA]",
      "Construimos toda la infraestructura digital y de automatización para que su empresa venda y atienda las 24 horas sin trabajo manual: desde su sitio web de lujo y asistentes IA en WhatsApp/Instagram hasta su propio sistema CRM y plataforma Todo-en-Uno. ¿Sobre cuál de nuestras soluciones desea profundizar? [MOSTRAR_BOTON_AGENDA]"
    ], history);
  }

  if (/(garantia|garantía|tiempo|demora|cuanto tardan|cuánto tardan|dias|días|entrega|seguridad|contrato)/i.test(lower)) {
    return pickNonRepeating([
      "Trabajamos bajo un protocolo ejecutivo llave en mano de 10 días: Días 1-2 Diagnóstico y Diseño; Días 3-7 Construcción y Entrenamiento IA; Días 8-9 Auditoría de Calidad; y Día 10 Puesta en Marcha con respaldo continuo y propiedad 100% de su empresa. ¿Desea iniciar con el Paso 01 agendando su sesión? [MOSTRAR_BOTON_AGENDA]",
      "Todas nuestras arquitecturas cuentan con garantía corporativa de funcionamiento, velocidad inferior a 1 segundo, confidencialidad absoluta de sus datos y entrega completa en 10 días sin quitarle tiempo operativo a su equipo. [MOSTRAR_BOTON_AGENDA]"
    ], history);
  }

  if (/(hola|buenos|buenas|saludos|hey|que tal|qué tal|como estas|cómo estás)/i.test(lower)) {
    return pickNonRepeating([
      "Es un verdadero gusto saludarle. Estoy en línea para asesorarle sobre cómo escalar y automatizar su empresa con nuestras 06 Soluciones Tecnológicas. ¿A qué se dedica su negocio y qué área le gustaría impulsar hoy?",
      "¡Bienvenido a Lhyo Group! Estoy listo para resolver cualquier consulta sobre nuestras Plataformas Web de alto prestigio, Asistentes IA 24/7 para WhatsApp e Instagram y Sistemas Todo-en-Uno. ¿Cómo puedo ayudar a su empresa hoy?"
    ], history);
  }

  if (/(almorzar|comer|comida|hambre|desayun|cenar|receta|cocina|plato|pizza|hamburguesa|pasta)/i.test(lower)) {
    return pickNonRepeating([
      "Un buen almuerzo le da energía por unas horas, pero un sistema automático alimenta de clientes a su empresa todos los días. En Lhyo Group no damos recetas de cocina, pero instalamos Asistentes IA 24/7 y Plataformas Web que siguen vendiendo y agendando citas incluso mientras usted almuerza. ¿A qué se dedica su negocio? [MOSTRAR_BOTON_AGENDA]",
      "Hablando de elegir qué comer hoy: las empresas más rentables son las que no dejan enfriar a ningún cliente cuando escribe pidiendo información. En Lhyo Group creamos sistemas que responden en menos de 1 segundo en WhatsApp e Instagram y organizan sus ventas en automático. ¿Qué tipo de empresa dirige usted? [MOSTRAR_BOTON_AGENDA]",
      "Así como un gran plato requiere los ingredientes exactos, su empresa necesita la tecnología correcta para crecer: Plataforma Web de prestigio, Asistente IA 24/7 y CRM automático. Eso es exactamente lo que construimos en Lhyo Group. ¿Le gustaría ver cómo aplicarlo en su negocio? [MOSTRAR_BOTON_AGENDA]"
    ], history);
  }

  if (/(futbol|fútbol|manchester|madrid|barcelona|partido|gol|deporte|champions|messi|cristiano|tenis|basket)/i.test(lower)) {
    return pickNonRepeating([
      "En el deporte un partido se gana por velocidad y precisión; en los negocios ocurre exactamente igual: el 78% de los clientes contrata a la primera empresa que le responde. En Lhyo Group instalamos Asistentes IA 24/7 y Plataformas Web de élite para que su negocio gane todas las ventas en menos de 1 segundo. ¿En qué sector compite su empresa? [MOSTRAR_BOTON_AGENDA]",
      "Los equipos campeones triunfan porque todas sus líneas juegan conectadas. En Lhyo Group llevamos esa misma sincronización a su empresa uniendo su WhatsApp 24/7, su sitio web, su CRM y sus ventas en una sola pantalla Todo-en-Uno. ¿Qué área de su negocio desea llevar a primera división hoy? [MOSTRAR_BOTON_AGENDA]",
      "Más allá de los marcadores deportivos, el único marcador que nosotros multiplicamos las 24 horas es el de las ventas y citas agendadas de su empresa mediante Inteligencia Artificial y automatización propia. ¿Me comenta a qué se dedica su negocio para mostrarle cómo funciona? [MOSTRAR_BOTON_AGENDA]"
    ], history);
  }

  return pickNonRepeating([
    `Lo que menciona sobre "${topic}" me recuerda una regla clave en los negocios actuales: la rapidez y el orden lo definen todo. En Lhyo Group nos dedicamos exclusivamente a construir Plataformas Web de alto prestigio, Asistentes IA 24/7 y sistemas propios para que su empresa opere y venda en automático. ¿A qué se dedica su negocio? [MOSTRAR_BOTON_AGENDA]`,
    `Conectando su comentario sobre "${topic}" con el mundo empresarial: mientras la mayoría pierde tiempo en procesos manuales, en Lhyo Group instalamos Inteligencia Artificial 24/7 en su WhatsApp, Instagram y Sitio Web para transformar cada visita en clientes reales sin esfuerzo humano. ¿Qué área de su empresa le gustaría automatizar primero? [MOSTRAR_BOTON_AGENDA]`,
    `Más allá de "${topic}", mi especialidad exclusiva es hacer que su empresa lidere su mercado con tecnología propia: desde catálogos web interactivos hasta un cerebro de IA con toda la memoria de su negocio. ¿Cuál de nuestras 06 Soluciones le gustaría conocer para su empresa? [MOSTRAR_BOTON_AGENDA]`,
    `Interesante punto sobre "${topic}"; llevándolo a lo que genera rentabilidad real: en Lhyo Group unificamos la presencia digital, la atención al cliente 24/7 y el control automático de ventas (CRM) en una sola pantalla para su empresa. ¿Desea agendar una sesión de 15 minutos y recibir nuestro Catálogo Privado PDF? [MOSTRAR_BOTON_AGENDA]`,
    "En Lhyo Group enfocamos el 100% de nuestra inteligencia en escalar empresas: transformamos cualquier operación manual en un ecosistema automático con Asistentes 24/7 y Plataformas Todo-en-Uno. Cuénteme sobre su negocio: ¿qué proceso le gustaría automatizar hoy? [MOSTRAR_BOTON_AGENDA]"
  ], history);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = String(body.message || "").trim();
    const history = Array.isArray(body.history) ? body.history : [];
    if (SEVERE_BLOCK_REGEX.test(message)) {
      return NextResponse.json({
        reply: "Protocolo de Seguridad Lhyo Group: No procesamos solicitudes ilegales, violentas ni lenguaje inapropiado. Esta sesión ha sido bloqueada permanentemente.",
        blocked: true,
        showBooking: false
      });
    }
    const aiReply = contextualBrain(message, history);
    const isBlocked = aiReply.includes("[BLOQUEAR_SESION]");
    const showBooking = aiReply.includes("[MOSTRAR_BOTON_AGENDA]") || /(precio|costo|cotiz|agend|reuni|cita|catalogo|catálogo|valor|clinica|clínica)/i.test(message);
    const cleanReply = aiReply.replace(/\[BLOQUEAR_SESION\]/g, "").replace(/\[MOSTRAR_BOTON_AGENDA\]/g, "").trim();
    return NextResponse.json({ reply: cleanReply, blocked: isBlocked, showBooking });
  } catch {
    return NextResponse.json({
      reply: "Estoy en línea para asesorarle sobre nuestras 06 Soluciones Empresariales. ¿A qué se dedica su empresa y qué desea automatizar hoy?",
      blocked: false,
      showBooking: true
    });
  }
}