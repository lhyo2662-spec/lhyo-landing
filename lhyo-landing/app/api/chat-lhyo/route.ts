import { NextResponse } from "next/server";
export const runtime = "edge";

const SEVERE_BLOCK_REGEX = /(porno|porn|xxx|sexo|sexual|desnud|prostit|onlyfans|erotic|hentai|webcam|masturb|orgasmo|foll|burdel|escort|pene|vagina|tetas|culo|matar|asesinar|suicid|bomba|terroris|sicario|violacion|violar|pedofil|secuestr|extorsion|pistola|fusil|explosiv|cocaina|marihuana|heroina|fentanilo|droga|narco|hackear|phishing|clonar\s+tarjeta|robar|estafar|mierda|malparid|hijueputa|hdp|puta|puto|verga|coño|marico|maricon|pendejo|imbecil|idiota|estupido|maldito|cabron|mamaguevo|mamahuevo|gonorrea)/i;

function isGibberishOrFlood(text: string, history: any[]) {
  const clean = String(text || "").trim();
  if (/(.)\1{6,}/i.test(clean)) return true;
  if (/^[bcdfghjklmnpqrstvwxyz]{7,}$/i.test(clean.replace(/\s+/g, ""))) return true;
  const userMsgs = (history || []).filter((m) => m.sender === "user").map((m) => String(m.text || "").toLowerCase().trim());
  if (userMsgs.length >= 2 && userMsgs[userMsgs.length - 1] === clean.toLowerCase() && userMsgs[userMsgs.length - 2] === clean.toLowerCase()) {
    return true;
  }
  return false;
}

function pickStrictlyUnique(candidates: string[], history: any[]) {
  const previousBotMessages = (history || [])
    .filter((m) => m.sender === "bot")
    .map((m) => String(m.text || "").toLowerCase().trim());
  for (const candidate of candidates) {
    const clean = candidate.replace(/\[MOSTRAR_BOTON_AGENDA\]/g, "").trim();
    const sig = clean.toLowerCase().slice(0, 42);
    const alreadyUsed = previousBotMessages.some((prev) => prev.includes(sig) || prev === clean.toLowerCase());
    if (!alreadyUsed) return candidate;
  }
  return null;
}

const UNIVERSAL_EXECUTIVE_BRIDGES = [
  "En el mundo actual cada segundo cuenta: mientras otros se distraen, las empresas líderes tienen sistemas trabajando por ellas día y noche. En Lhyo Group instalamos Plataformas Web de alto prestigio y Asistentes IA 24/7 que atienden clientes y agendan citas en automático. ¿A qué se dedica su negocio? [MOSTRAR_BOTON_AGENDA]",
  "Conectando lo que me comenta con el crecimiento empresarial: el 78% de las ventas se las lleva la primera empresa que responde con claridad y rapidez. En Lhyo Group automatizamos su WhatsApp, su Instagram y su página web para que su negocio atienda en menos de 1 segundo las 24 horas. ¿En qué sector opera su empresa? [MOSTRAR_BOTON_AGENDA]",
  "Hoy la verdadera libertad para un dueño de negocio es contar con tecnología propia que funcione sin depender de su presencia manual. En Lhyo Group unificamos su presencia web, su atención al cliente 24/7 y su registro de ventas (CRM) en un solo ecosistema. ¿Qué área de su empresa desea impulsar primero? [MOSTRAR_BOTON_AGENDA]",
  "Toda gran decisión necesita una estructura sólida para transformarse en resultados: en Lhyo Group construimos desde Catálogos Web Interactivos (Solución 02) hasta Inteligencia Artificial entrenada con la memoria de su empresa (Solución 05). ¿Cuál de nuestras 06 Soluciones se adapta mejor a su proyecto actual? [MOSTRAR_BOTON_AGENDA]",
  "Cuando una empresa automatiza sus procesos repetitivos, multiplica su rentabilidad y recupera horas valiosas cada semana. En Lhyo Group diseñamos su propia Plataforma Empresarial Todo-en-Uno (Solución 06) con su marca y su logo. ¿Le gustaría recibir nuestro Catálogo Privado PDF? [MOSTRAR_BOTON_AGENDA]",
  "La diferencia entre un negocio estancado y uno en expansión está en cómo recibe y organiza a sus clientes: con nuestro CRM Automático (Solución 03) y nuestros Asistentes 24/7 (Solución 01), cada prospecto queda clasificado al instante sin anotar nada a mano. ¿Cómo manejan hoy la atención al cliente en su negocio? [MOSTRAR_BOTON_AGENDA]",
  "Más allá de cualquier conversación cotidiana, mi función ejecutiva en Lhyo Group es mostrarle cómo llevar su empresa al siguiente nivel tecnológico en solo 10 días de implementación llave en mano. ¿Desea agendar una breve videollamada de 15 minutos con nuestro CEO? [MOSTRAR_BOTON_AGENDA]",
  "Piense en esto: mientras usted conversa conmigo en este chat, un sistema idéntico a este podría estar instalado en el WhatsApp, Instagram y Sitio Web de su empresa cerrando citas y atendiendo clientes en automático. ¿Para qué tipo de negocio le gustaría implementarlo? [MOSTRAR_BOTON_AGENDA]",
  "Las empresas más admiradas proyectan autoridad desde el primer clic: en Lhyo Group combinamos ingeniería de lujo y automatización 24/7 para que su marca destaque por encima de toda su competencia. ¿Tiene actualmente página web o busca crear una desde cero? [MOSTRAR_BOTON_AGENDA]",
  "En Lhyo Group eliminamos los pagos mensuales excesivos instalando tecnología propia (Solución 04): su empresa se vuelve dueña absoluta de su motor de automatización sin límites de mensajes ni recargos por volumen. ¿En qué región opera actualmente su negocio? [MOSTRAR_BOTON_AGENDA]",
  "Cada cliente que visita su negocio espera atención inmediata y de alto nivel: por eso en Lhyo Group integramos diseño web corporativo, inteligencia artificial 24/7 y organización automática de ventas en un solo lugar. ¿Qué objetivo comercial busca alcanzar este mes? [MOSTRAR_BOTON_AGENDA]",
  "El activo más valioso de un directivo es su tiempo: nuestros sistemas toman el control de las consultas repetitivas, califican a los interesados y agendan reuniones listas para cerrar. ¿Le gustaría ver una demostración aplicada a su empresa? [MOSTRAR_BOTON_AGENDA]"
];

function contextualBrain(message: string, history: any[]) {
  const clean = String(message || "").trim();
  const lower = clean.toLowerCase();

  if (/(repetir|repites|repitiendo|misma respuesta|automatico|automático|eres un bot|eres ia|quien eres|cómo funcionas|como funcionas|prueba|test)/i.test(lower)) {
    const p = pickStrictlyUnique([
      "Bien observado: mi memoria conversacional registra cada mensaje de esta sesión para ofrecerle siempre un análisis nuevo y demostrarle en vivo la tecnología que instalamos en Lhyo Group. Así mismo atenderá a los clientes de su empresa las 24 horas. ¿A qué se dedica su negocio y qué proceso desea automatizar primero? [MOSTRAR_BOTON_AGENDA]",
      "Exactamente así debe comportarse un asistente ejecutivo de alto nivel: adaptándose en tiempo real a cada intervención sin repetir guiones rígidos. Esta misma inteligencia es la que entrenamos con los precios, servicios y documentos de su empresa (Soluciones 01 y 05). ¿En qué sector opera su organización? [MOSTRAR_BOTON_AGENDA]",
      "Está poniendo a prueba nuestro motor cognitivo en vivo, y esa es la mejor demostración de lo que hacemos en Lhyo Group: construimos asistentes 24/7, plataformas web interactivas y sistemas Todo-en-Uno que responden al instante con precisión ejecutiva. ¿Le gustaría implementarlo en su empresa? [MOSTRAR_BOTON_AGENDA]"
    ], history);
    if (p) return p;
  }

  if (/(cumpleaños|cumpleanos|cumple|papa|papá|mama|mamá|hermano|hijo|hija|familia|regalo|regalar|fiesta|celebrar|aniversario|boda|esposa|novia)/i.test(lower)) {
    const p = pickStrictlyUnique([
      "El mejor regalo en un cumpleaños o celebración familiar es poder disfrutar con los suyos sin estar pegado al teléfono respondiendo clientes. En Lhyo Group no vendemos regalos físicos, pero instalamos Asistentes IA 24/7 y Plataformas Web que siguen atendiendo y agendando ventas por usted mientras celebra en familia. ¿A qué se dedica su negocio? [MOSTRAR_BOTON_AGENDA]",
      "Las fechas especiales con la familia nos recuerdan por qué emprendemos: para tener libertad de tiempo y tranquilidad financiera. En Lhyo Group construimos el sistema automático de su empresa (WhatsApp 24/7, Web de prestigio y CRM) para que su negocio funcione solo en sus días libres. ¿Qué tipo de empresa dirige usted? [MOSTRAR_BOTON_AGENDA]",
      "Si busca dar un gran obsequio, nada supera regalar o construir un negocio propio que genere ingresos las 24 horas: en Lhyo Group diseñamos Plataformas Web Modernas, Catálogos Interactivos y Sistemas Todo-en-Uno listos en 10 días. ¿Tienen algún negocio familiar o proyecto que deseen llevar al siguiente nivel? [MOSTRAR_BOTON_AGENDA]"
    ], history);
    if (p) return p;
  }

  if (/(almorzar|comer|comida|hambre|desayun|cenar|receta|cocina|plato|pizza|hamburguesa|pasta|cafe|café)/i.test(lower)) {
    const p = pickStrictlyUnique([
      "Un buen almuerzo le da energía por unas horas, pero un sistema automático alimenta de clientes a su empresa todos los días. En Lhyo Group no damos recetas de cocina, pero instalamos Asistentes IA 24/7 y Plataformas Web que siguen vendiendo y agendando citas incluso mientras usted almuerza. ¿A qué se dedica su negocio? [MOSTRAR_BOTON_AGENDA]",
      "Hablando de elegir qué comer hoy: las empresas más rentables son las que nunca dejan enfriar a un cliente cuando escribe pidiendo información. En Lhyo Group creamos sistemas que responden en menos de 1 segundo en WhatsApp e Instagram y organizan sus ventas en automático. ¿Qué tipo de empresa dirige usted? [MOSTRAR_BOTON_AGENDA]",
      "Así como un plato de alta cocina requiere los ingredientes exactos, su empresa necesita la tecnología correcta para liderar su mercado: Plataforma Web de lujo (Solución 02), Asistente IA 24/7 (Solución 01) y CRM automático (Solución 03). ¿Le gustaría ver cómo aplicarlo en su negocio? [MOSTRAR_BOTON_AGENDA]"
    ], history);
    if (p) return p;
  }

  if (/(futbol|fútbol|manchester|madrid|barcelona|partido|gol|deporte|champions|messi|cristiano|tenis|basket|mundial)/i.test(lower)) {
    const p = pickStrictlyUnique([
      "En el deporte un partido se gana por velocidad y precisión; en los negocios ocurre exactamente igual: el 78% de los clientes contrata a la primera empresa que le responde. En Lhyo Group instalamos Asistentes IA 24/7 y Plataformas Web de élite para que su negocio gane todas las ventas en menos de 1 segundo. ¿En qué sector compite su empresa? [MOSTRAR_BOTON_AGENDA]",
      "Los equipos campeones triunfan porque todas sus líneas juegan conectadas. En Lhyo Group llevamos esa misma sincronización a su empresa uniendo su WhatsApp 24/7, su sitio web, su CRM y sus ventas en una sola pantalla Todo-en-Uno. ¿Qué área de su negocio desea llevar a primera división hoy? [MOSTRAR_BOTON_AGENDA]",
      "Más allá de los marcadores deportivos, el único marcador que nosotros multiplicamos las 24 horas es el de las ventas y citas agendadas de su empresa mediante Inteligencia Artificial y automatización propia. ¿Me comenta a qué se dedica su negocio para mostrarle cómo funciona? [MOSTRAR_BOTON_AGENDA]"
    ], history);
    if (p) return p;
  }

  if (/(viaje|viajar|vacaciones|playa|avion|hotel|clima|lluvia|calor|frio|dormir|sueño|cansad|musica|pelicula|netflix|serie|juego|cine)/i.test(lower)) {
    const p = pickStrictlyUnique([
      "El descanso, los viajes y el tiempo libre se disfrutan de verdad cuando su empresa no se detiene porque usted no esté presente. En Lhyo Group instalamos Asistentes Inteligentes 24/7 y sistemas propios que atienden prospectos y agendan reuniones día y noche en piloto automático. ¿Qué área de su negocio le gustaría automatizar? [MOSTRAR_BOTON_AGENDA]",
      "Mientras el mundo descansa o se entretiene, las empresas digitalizadas con Lhyo Group siguen captando clientes a las 2:00 AM en WhatsApp, Instagram y su Sitio Web sin intervención humana. ¿A qué se dedica actualmente su empresa o proyecto? [MOSTRAR_BOTON_AGENDA]"
    ], history);
    if (p) return p;
  }

  if (/(odontol|dental|dentista|clinica|clínica|medic|médic|doctor|salud|paciente|consultorio|hospital|estetic|estétic)/i.test(lower)) {
    const p = pickStrictlyUnique([
      "Para su clínica o consultorio, en Lhyo Group instalamos un Asistente Inteligente 24/7 en WhatsApp e Instagram (Solución 01) que responde dudas de tratamientos, filtra pacientes reales y agenda sus citas automáticamente en su calendario, unido a una Plataforma Web de prestigio (Solución 02) y un CRM Clínico (Solución 03). ¿Cuál de estas áreas desea implementar primero? [MOSTRAR_BOTON_AGENDA]",
      "En el sector clínico y odontológico, nuestra tecnología elimina las inasistencias y la pérdida de pacientes fuera de horario: su Asistente IA 24/7 atiende consultas al instante, registra al paciente en su CRM (Solución 03) y confirma el turno sin intervención manual. ¿Le gustaría agendar una sesión de 15 minutos para ver cómo operaría en su clínica? [MOSTRAR_BOTON_AGENDA]",
      "Además de automatizar la agenda de pacientes 24/7 en WhatsApp e Instagram, podemos entrenar una Inteligencia Artificial Privada con la memoria de su clínica (Solución 05) con todos sus aranceles, presupuestos y protocolos para dar respuestas exactas en 1 segundo. ¿Desea cotizarlo para su clínica? [MOSTRAR_BOTON_AGENDA]"
    ], history);
    if (p) return p;
  }

  if (/(restaurante|gastronom|cafeteria|cafetería|bar|delivery|pedidos de comida|vendo comida)/i.test(lower)) {
    const p = pickStrictlyUnique([
      "Para el sector gastronómico, en Lhyo Group desarrollamos Plataformas Web con Catálogos Interactivos (Solución 02) y Asistentes Inteligentes 24/7 en WhatsApp e Instagram (Solución 01) que muestran su menú, atienden reservas o pedidos al instante y registran cada cliente en su CRM. ¿Desea implementarlo en su negocio? [MOSTRAR_BOTON_AGENDA]",
      "En negocios gastronómicos, la velocidad de atención define la venta: con nuestro sistema propio (Soluciones 01 y 03), cada cliente que escribe por WhatsApp o Instagram recibe atención en menos de 1 segundo las 24 horas y queda registrado en su base de datos. ¿Le gustaría ver una demostración aplicada a su local? [MOSTRAR_BOTON_AGENDA]"
    ], history);
    if (p) return p;
  }

  if (/(inmobiliaria|bienes raices|bienes raíces|propiedades|constructora|arquitect|abogad|legal|contable|agencia|tienda|ecommerce|gimnasio|spa|educacion|academia|empresa|negocio)/i.test(lower) && !/(que es lhyo|qué hacen|que ofrecen)/i.test(lower)) {
    const p = pickStrictlyUnique([
      "Para potenciar su operación en ese sector, en Lhyo Group unimos 3 piezas clave: una Plataforma Web de máximo prestigio (Solución 02), un Asistente Inteligente 24/7 en WhatsApp e Instagram que califica y agenda clientes solos (Solución 01), y un CRM Automático (Solución 03). ¿Qué área de su negocio busca escalar primero? [MOSTRAR_BOTON_AGENDA]",
      "Su negocio puede operar en piloto automático con nuestra tecnología propia: desde atención inmediata 24/7 en WhatsApp e Instagram hasta una Plataforma Empresarial Todo-en-Uno (Solución 06) con su propia marca. ¿Desea recibir nuestro Catálogo Privado PDF con las opciones para su empresa? [MOSTRAR_BOTON_AGENDA]"
    ], history);
    if (p) return p;
  }

  if (/(precio|costo|cuanto|cuánto|valor|tarifa|presupuesto|cotiza|planes|paquete|inversion|inversión)/i.test(lower)) {
    const p = pickStrictlyUnique([
      "Cada solución en Lhyo Group se cotiza a la medida de su región (Latinoamérica, Europa o Norteamérica) y de los módulos que elija entre nuestras 06 Soluciones Oficiales. En una breve sesión ejecutiva de 15 minutos por videollamada le entregamos su presupuesto exacto y nuestro Catálogo Privado PDF. Toque el botón dorado inferior para elegir su horario. [MOSTRAR_BOTON_AGENDA]",
      "Para garantizarle un presupuesto exacto sin costos innecesarios, evaluamos en 15 minutos qué soluciones necesita su empresa (Asistente IA 24/7, Plataforma Web, CRM, Automatización Propia o Sistema Todo-en-Uno) y le enviamos el Dossier Corporativo PDF con las tarifas de su región. Puede reservar su espacio en el botón aquí abajo. [MOSTRAR_BOTON_AGENDA]"
    ], history);
    if (p) return p;
  }

  if (/(que ofrecen|qué ofrecen|servicios|soluciones|que hacen|qué hacen|catalogo|catálogo|informacion|información)/i.test(lower)) {
    const p = pickStrictlyUnique([
      "En Lhyo Group diseñamos e instalamos 06 Soluciones Tecnológicas de alta gama para su empresa:\n01 · Asistentes Inteligentes 24/7 para WhatsApp e Instagram.\n02 · Plataformas Web Modernas y Catálogos Interactivos.\n03 · Organización Automática de Clientes y Ventas (CRM).\n04 · Automatización Total con Tecnología Propia.\n05 · IA Personalizada con la Memoria de su Empresa.\n06 · Su Propia Plataforma Empresarial Todo-en-Uno.\n\n¿Cuál de estas 6 soluciones le interesa implementar primero? [MOSTRAR_BOTON_AGENDA]",
      "Construimos toda la infraestructura digital y de automatización para que su empresa venda y atienda las 24 horas sin trabajo manual: desde su sitio web de lujo y asistentes IA en WhatsApp/Instagram hasta su propio sistema CRM y plataforma Todo-en-Uno. ¿Sobre cuál de nuestras soluciones desea profundizar? [MOSTRAR_BOTON_AGENDA]"
    ], history);
    if (p) return p;
  }

  if (/(hola|buenos|buenas|saludos|hey|que tal|qué tal|como estas|cómo estás)/i.test(lower)) {
    const p = pickStrictlyUnique([
      "Es un verdadero gusto saludarle. Estoy en línea para asesorarle sobre cómo escalar y automatizar su empresa con nuestras 06 Soluciones Tecnológicas. ¿A qué se dedica su negocio y qué área le gustaría impulsar hoy?",
      "¡Bienvenido a Lhyo Group! Estoy listo para resolver cualquier consulta sobre nuestras Plataformas Web de alto prestigio, Asistentes IA 24/7 para WhatsApp e Instagram y Sistemas Todo-en-Uno. ¿Cómo puedo ayudar a su empresa hoy?"
    ], history);
    if (p) return p;
  }

  const uniqueBridge = pickStrictlyUnique(UNIVERSAL_EXECUTIVE_BRIDGES, history);
  if (uniqueBridge) return uniqueBridge;

  const turnNum = (history || []).filter((m) => m.sender === "user").length + 1;
  return `En este punto de nuestra conversación (consulta #${turnNum}), la mejor manera de comprobar el impacto de Lhyo Group es verlo aplicado directamente a su empresa. Toque el botón dorado inferior para elegir su horario de videollamada ejecutiva y recibir nuestro Catálogo Privado PDF. [MOSTRAR_BOTON_AGENDA]`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = String(body.message || "").trim();
    const history = Array.isArray(body.history) ? body.history : [];

    if (SEVERE_BLOCK_REGEX.test(message) || isGibberishOrFlood(message, history)) {
      return NextResponse.json({
        reply: "Protocolo de Seguridad Lhyo Group: Esta infraestructura cognitiva está destinada exclusivamente a consultoría tecnológica y sistemas empresariales. No procesamos contenido adulto, ilegal, violento, spam ni lenguaje inapropiado. Esta sesión ha sido bloqueada permanentemente.",
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