const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = process.cwd();
const appRoot = fs.existsSync(path.join(ROOT, "lhyo-landing")) ? path.join(ROOT, "lhyo-landing") : ROOT;

// PASO 0: Restaurar aef356c limpio como punto de partida
for (const gDir of [ROOT, appRoot]) {
  if (fs.existsSync(path.join(gDir, ".git"))) {
    try { execSync("git checkout aef356c -- .", { cwd: gDir, stdio: "inherit" }); } catch {}
  }
}

// PASO 1: Crear /api/chat-lhyo/route.ts con Cero Repeticion (pickStrictlyUnique), Conexiones Ejecutivas y Bloqueo Total (incluyendo PORNO/Adulto/Spam)
const apiDir = path.join(appRoot, "app", "api", "chat-lhyo");
fs.mkdirSync(apiDir, { recursive: true });

const routeLines = [
  'import { NextResponse } from "next/server";',
  'export const runtime = "edge";',
  '',
  'const SEVERE_BLOCK_REGEX = /(porno|porn|xxx|sexo|sexual|desnud|prostit|onlyfans|erotic|hentai|webcam|masturb|orgasmo|foll|burdel|escort|pene|vagina|tetas|culo|matar|asesinar|suicid|bomba|terroris|sicario|violacion|violar|pedofil|secuestr|extorsion|pistola|fusil|explosiv|cocaina|marihuana|heroina|fentanilo|droga|narco|hackear|phishing|clonar\\s+tarjeta|robar|estafar|mierda|malparid|hijueputa|hdp|puta|puto|verga|coño|marico|maricon|pendejo|imbecil|idiota|estupido|maldito|cabron|mamaguevo|mamahuevo|gonorrea)/i;',
  '',
  'function isGibberishOrFlood(text: string, history: any[]) {',
  '  const clean = String(text || "").trim();',
  '  if (/(.)\\1{6,}/i.test(clean)) return true;',
  '  if (/^[bcdfghjklmnpqrstvwxyz]{7,}$/i.test(clean.replace(/\\s+/g, ""))) return true;',
  '  const userMsgs = (history || []).filter((m) => m.sender === "user").map((m) => String(m.text || "").toLowerCase().trim());',
  '  if (userMsgs.length >= 2 && userMsgs[userMsgs.length - 1] === clean.toLowerCase() && userMsgs[userMsgs.length - 2] === clean.toLowerCase()) {',
  '    return true;',
  '  }',
  '  return false;',
  '}',
  '',
  'function pickStrictlyUnique(candidates: string[], history: any[]) {',
  '  const previousBotMessages = (history || [])',
  '    .filter((m) => m.sender === "bot")',
  '    .map((m) => String(m.text || "").toLowerCase().trim());',
  '  for (const candidate of candidates) {',
  '    const clean = candidate.replace(/\\[MOSTRAR_BOTON_AGENDA\\]/g, "").trim();',
  '    const sig = clean.toLowerCase().slice(0, 42);',
  '    const alreadyUsed = previousBotMessages.some((prev) => prev.includes(sig) || prev === clean.toLowerCase());',
  '    if (!alreadyUsed) return candidate;',
  '  }',
  '  return null;',
  '}',
  '',
  'const UNIVERSAL_EXECUTIVE_BRIDGES = [',
  '  "En el mundo actual cada segundo cuenta: mientras otros se distraen, las empresas líderes tienen sistemas trabajando por ellas día y noche. En Lhyo Group instalamos Plataformas Web de alto prestigio y Asistentes IA 24/7 que atienden clientes y agendan citas en automático. ¿A qué se dedica su negocio? [MOSTRAR_BOTON_AGENDA]",',
  '  "Conectando lo que me comenta con el crecimiento empresarial: el 78% de las ventas se las lleva la primera empresa que responde con claridad y rapidez. En Lhyo Group automatizamos su WhatsApp, su Instagram y su página web para que su negocio atienda en menos de 1 segundo las 24 horas. ¿En qué sector opera su empresa? [MOSTRAR_BOTON_AGENDA]",',
  '  "Hoy la verdadera libertad para un dueño de negocio es contar con tecnología propia que funcione sin depender de su presencia manual. En Lhyo Group unificamos su presencia web, su atención al cliente 24/7 y su registro de ventas (CRM) en un solo ecosistema. ¿Qué área de su empresa desea impulsar primero? [MOSTRAR_BOTON_AGENDA]",',
  '  "Toda gran decisión necesita una estructura sólida para transformarse en resultados: en Lhyo Group construimos desde Catálogos Web Interactivos (Solución 02) hasta Inteligencia Artificial entrenada con la memoria de su empresa (Solución 05). ¿Cuál de nuestras 06 Soluciones se adapta mejor a su proyecto actual? [MOSTRAR_BOTON_AGENDA]",',
  '  "Cuando una empresa automatiza sus procesos repetitivos, multiplica su rentabilidad y recupera horas valiosas cada semana. En Lhyo Group diseñamos su propia Plataforma Empresarial Todo-en-Uno (Solución 06) con su marca y su logo. ¿Le gustaría recibir nuestro Catálogo Privado PDF? [MOSTRAR_BOTON_AGENDA]",',
  '  "La diferencia entre un negocio estancado y uno en expansión está en cómo recibe y organiza a sus clientes: con nuestro CRM Automático (Solución 03) y nuestros Asistentes 24/7 (Solución 01), cada prospecto queda clasificado al instante sin anotar nada a mano. ¿Cómo manejan hoy la atención al cliente en su negocio? [MOSTRAR_BOTON_AGENDA]",',
  '  "Más allá de cualquier conversación cotidiana, mi función ejecutiva en Lhyo Group es mostrarle cómo llevar su empresa al siguiente nivel tecnológico en solo 10 días de implementación llave en mano. ¿Desea agendar una breve videollamada de 15 minutos con nuestro CEO? [MOSTRAR_BOTON_AGENDA]",',
  '  "Piense en esto: mientras usted conversa conmigo en este chat, un sistema idéntico a este podría estar instalado en el WhatsApp, Instagram y Sitio Web de su empresa cerrando citas y atendiendo clientes en automático. ¿Para qué tipo de negocio le gustaría implementarlo? [MOSTRAR_BOTON_AGENDA]",',
  '  "Las empresas más admiradas proyectan autoridad desde el primer clic: en Lhyo Group combinamos ingeniería de lujo y automatización 24/7 para que su marca destaque por encima de toda su competencia. ¿Tiene actualmente página web o busca crear una desde cero? [MOSTRAR_BOTON_AGENDA]",',
  '  "En Lhyo Group eliminamos los pagos mensuales excesivos instalando tecnología propia (Solución 04): su empresa se vuelve dueña absoluta de su motor de automatización sin límites de mensajes ni recargos por volumen. ¿En qué región opera actualmente su negocio? [MOSTRAR_BOTON_AGENDA]",',
  '  "Cada cliente que visita su negocio espera atención inmediata y de alto nivel: por eso en Lhyo Group integramos diseño web corporativo, inteligencia artificial 24/7 y organización automática de ventas en un solo lugar. ¿Qué objetivo comercial busca alcanzar este mes? [MOSTRAR_BOTON_AGENDA]",',
  '  "El activo más valioso de un directivo es su tiempo: nuestros sistemas toman el control de las consultas repetitivas, califican a los interesados y agendan reuniones listas para cerrar. ¿Le gustaría ver una demostración aplicada a su empresa? [MOSTRAR_BOTON_AGENDA]"',
  '];',
  '',
  'function contextualBrain(message: string, history: any[]) {',
  '  const clean = String(message || "").trim();',
  '  const lower = clean.toLowerCase();',
  '',
  '  if (/(repetir|repites|repitiendo|misma respuesta|automatico|automático|eres un bot|eres ia|quien eres|cómo funcionas|como funcionas|prueba|test)/i.test(lower)) {',
  '    const p = pickStrictlyUnique([',
  '      "Bien observado: mi memoria conversacional registra cada mensaje de esta sesión para ofrecerle siempre un análisis nuevo y demostrarle en vivo la tecnología que instalamos en Lhyo Group. Así mismo atenderá a los clientes de su empresa las 24 horas. ¿A qué se dedica su negocio y qué proceso desea automatizar primero? [MOSTRAR_BOTON_AGENDA]",',
  '      "Exactamente así debe comportarse un asistente ejecutivo de alto nivel: adaptándose en tiempo real a cada intervención sin repetir guiones rígidos. Esta misma inteligencia es la que entrenamos con los precios, servicios y documentos de su empresa (Soluciones 01 y 05). ¿En qué sector opera su organización? [MOSTRAR_BOTON_AGENDA]",',
  '      "Está poniendo a prueba nuestro motor cognitivo en vivo, y esa es la mejor demostración de lo que hacemos en Lhyo Group: construimos asistentes 24/7, plataformas web interactivas y sistemas Todo-en-Uno que responden al instante con precisión ejecutiva. ¿Le gustaría implementarlo en su empresa? [MOSTRAR_BOTON_AGENDA]"',
  '    ], history);',
  '    if (p) return p;',
  '  }',
  '',
  '  if (/(cumpleaños|cumpleanos|cumple|papa|papá|mama|mamá|hermano|hijo|hija|familia|regalo|regalar|fiesta|celebrar|aniversario|boda|esposa|novia)/i.test(lower)) {',
  '    const p = pickStrictlyUnique([',
  '      "El mejor regalo en un cumpleaños o celebración familiar es poder disfrutar con los suyos sin estar pegado al teléfono respondiendo clientes. En Lhyo Group no vendemos regalos físicos, pero instalamos Asistentes IA 24/7 y Plataformas Web que siguen atendiendo y agendando ventas por usted mientras celebra en familia. ¿A qué se dedica su negocio? [MOSTRAR_BOTON_AGENDA]",',
  '      "Las fechas especiales con la familia nos recuerdan por qué emprendemos: para tener libertad de tiempo y tranquilidad financiera. En Lhyo Group construimos el sistema automático de su empresa (WhatsApp 24/7, Web de prestigio y CRM) para que su negocio funcione solo en sus días libres. ¿Qué tipo de empresa dirige usted? [MOSTRAR_BOTON_AGENDA]",',
  '      "Si busca dar un gran obsequio, nada supera regalar o construir un negocio propio que genere ingresos las 24 horas: en Lhyo Group diseñamos Plataformas Web Modernas, Catálogos Interactivos y Sistemas Todo-en-Uno listos en 10 días. ¿Tienen algún negocio familiar o proyecto que deseen llevar al siguiente nivel? [MOSTRAR_BOTON_AGENDA]"',
  '    ], history);',
  '    if (p) return p;',
  '  }',
  '',
  '  if (/(almorzar|comer|comida|hambre|desayun|cenar|receta|cocina|plato|pizza|hamburguesa|pasta|cafe|café)/i.test(lower)) {',
  '    const p = pickStrictlyUnique([',
  '      "Un buen almuerzo le da energía por unas horas, pero un sistema automático alimenta de clientes a su empresa todos los días. En Lhyo Group no damos recetas de cocina, pero instalamos Asistentes IA 24/7 y Plataformas Web que siguen vendiendo y agendando citas incluso mientras usted almuerza. ¿A qué se dedica su negocio? [MOSTRAR_BOTON_AGENDA]",',
  '      "Hablando de elegir qué comer hoy: las empresas más rentables son las que nunca dejan enfriar a un cliente cuando escribe pidiendo información. En Lhyo Group creamos sistemas que responden en menos de 1 segundo en WhatsApp e Instagram y organizan sus ventas en automático. ¿Qué tipo de empresa dirige usted? [MOSTRAR_BOTON_AGENDA]",',
  '      "Así como un plato de alta cocina requiere los ingredientes exactos, su empresa necesita la tecnología correcta para liderar su mercado: Plataforma Web de lujo (Solución 02), Asistente IA 24/7 (Solución 01) y CRM automático (Solución 03). ¿Le gustaría ver cómo aplicarlo en su negocio? [MOSTRAR_BOTON_AGENDA]"',
  '    ], history);',
  '    if (p) return p;',
  '  }',
  '',
  '  if (/(futbol|fútbol|manchester|madrid|barcelona|partido|gol|deporte|champions|messi|cristiano|tenis|basket|mundial)/i.test(lower)) {',
  '    const p = pickStrictlyUnique([',
  '      "En el deporte un partido se gana por velocidad y precisión; en los negocios ocurre exactamente igual: el 78% de los clientes contrata a la primera empresa que le responde. En Lhyo Group instalamos Asistentes IA 24/7 y Plataformas Web de élite para que su negocio gane todas las ventas en menos de 1 segundo. ¿En qué sector compite su empresa? [MOSTRAR_BOTON_AGENDA]",',
  '      "Los equipos campeones triunfan porque todas sus líneas juegan conectadas. En Lhyo Group llevamos esa misma sincronización a su empresa uniendo su WhatsApp 24/7, su sitio web, su CRM y sus ventas en una sola pantalla Todo-en-Uno. ¿Qué área de su negocio desea llevar a primera división hoy? [MOSTRAR_BOTON_AGENDA]",',
  '      "Más allá de los marcadores deportivos, el único marcador que nosotros multiplicamos las 24 horas es el de las ventas y citas agendadas de su empresa mediante Inteligencia Artificial y automatización propia. ¿Me comenta a qué se dedica su negocio para mostrarle cómo funciona? [MOSTRAR_BOTON_AGENDA]"',
  '    ], history);',
  '    if (p) return p;',
  '  }',
  '',
  '  if (/(viaje|viajar|vacaciones|playa|avion|hotel|clima|lluvia|calor|frio|dormir|sueño|cansad|musica|pelicula|netflix|serie|juego|cine)/i.test(lower)) {',
  '    const p = pickStrictlyUnique([',
  '      "El descanso, los viajes y el tiempo libre se disfrutan de verdad cuando su empresa no se detiene porque usted no esté presente. En Lhyo Group instalamos Asistentes Inteligentes 24/7 y sistemas propios que atienden prospectos y agendan reuniones día y noche en piloto automático. ¿Qué área de su negocio le gustaría automatizar? [MOSTRAR_BOTON_AGENDA]",',
  '      "Mientras el mundo descansa o se entretiene, las empresas digitalizadas con Lhyo Group siguen captando clientes a las 2:00 AM en WhatsApp, Instagram y su Sitio Web sin intervención humana. ¿A qué se dedica actualmente su empresa o proyecto? [MOSTRAR_BOTON_AGENDA]"',
  '    ], history);',
  '    if (p) return p;',
  '  }',
  '',
  '  if (/(odontol|dental|dentista|clinica|clínica|medic|médic|doctor|salud|paciente|consultorio|hospital|estetic|estétic)/i.test(lower)) {',
  '    const p = pickStrictlyUnique([',
  '      "Para su clínica o consultorio, en Lhyo Group instalamos un Asistente Inteligente 24/7 en WhatsApp e Instagram (Solución 01) que responde dudas de tratamientos, filtra pacientes reales y agenda sus citas automáticamente en su calendario, unido a una Plataforma Web de prestigio (Solución 02) y un CRM Clínico (Solución 03). ¿Cuál de estas áreas desea implementar primero? [MOSTRAR_BOTON_AGENDA]",',
  '      "En el sector clínico y odontológico, nuestra tecnología elimina las inasistencias y la pérdida de pacientes fuera de horario: su Asistente IA 24/7 atiende consultas al instante, registra al paciente en su CRM (Solución 03) y confirma el turno sin intervención manual. ¿Le gustaría agendar una sesión de 15 minutos para ver cómo operaría en su clínica? [MOSTRAR_BOTON_AGENDA]",',
  '      "Además de automatizar la agenda de pacientes 24/7 en WhatsApp e Instagram, podemos entrenar una Inteligencia Artificial Privada con la memoria de su clínica (Solución 05) con todos sus aranceles, presupuestos y protocolos para dar respuestas exactas en 1 segundo. ¿Desea cotizarlo para su clínica? [MOSTRAR_BOTON_AGENDA]"',
  '    ], history);',
  '    if (p) return p;',
  '  }',
  '',
  '  if (/(restaurante|gastronom|cafeteria|cafetería|bar|delivery|pedidos de comida|vendo comida)/i.test(lower)) {',
  '    const p = pickStrictlyUnique([',
  '      "Para el sector gastronómico, en Lhyo Group desarrollamos Plataformas Web con Catálogos Interactivos (Solución 02) y Asistentes Inteligentes 24/7 en WhatsApp e Instagram (Solución 01) que muestran su menú, atienden reservas o pedidos al instante y registran cada cliente en su CRM. ¿Desea implementarlo en su negocio? [MOSTRAR_BOTON_AGENDA]",',
  '      "En negocios gastronómicos, la velocidad de atención define la venta: con nuestro sistema propio (Soluciones 01 y 03), cada cliente que escribe por WhatsApp o Instagram recibe atención en menos de 1 segundo las 24 horas y queda registrado en su base de datos. ¿Le gustaría ver una demostración aplicada a su local? [MOSTRAR_BOTON_AGENDA]"',
  '    ], history);',
  '    if (p) return p;',
  '  }',
  '',
  '  if (/(inmobiliaria|bienes raices|bienes raíces|propiedades|constructora|arquitect|abogad|legal|contable|agencia|tienda|ecommerce|gimnasio|spa|educacion|academia|empresa|negocio)/i.test(lower) && !/(que es lhyo|qué hacen|que ofrecen)/i.test(lower)) {',
  '    const p = pickStrictlyUnique([',
  '      "Para potenciar su operación en ese sector, en Lhyo Group unimos 3 piezas clave: una Plataforma Web de máximo prestigio (Solución 02), un Asistente Inteligente 24/7 en WhatsApp e Instagram que califica y agenda clientes solos (Solución 01), y un CRM Automático (Solución 03). ¿Qué área de su negocio busca escalar primero? [MOSTRAR_BOTON_AGENDA]",',
  '      "Su negocio puede operar en piloto automático con nuestra tecnología propia: desde atención inmediata 24/7 en WhatsApp e Instagram hasta una Plataforma Empresarial Todo-en-Uno (Solución 06) con su propia marca. ¿Desea recibir nuestro Catálogo Privado PDF con las opciones para su empresa? [MOSTRAR_BOTON_AGENDA]"',
  '    ], history);',
  '    if (p) return p;',
  '  }',
  '',
  '  if (/(precio|costo|cuanto|cuánto|valor|tarifa|presupuesto|cotiza|planes|paquete|inversion|inversión)/i.test(lower)) {',
  '    const p = pickStrictlyUnique([',
  '      "Cada solución en Lhyo Group se cotiza a la medida de su región (Latinoamérica, Europa o Norteamérica) y de los módulos que elija entre nuestras 06 Soluciones Oficiales. En una breve sesión ejecutiva de 15 minutos por videollamada le entregamos su presupuesto exacto y nuestro Catálogo Privado PDF. Toque el botón dorado inferior para elegir su horario. [MOSTRAR_BOTON_AGENDA]",',
  '      "Para garantizarle un presupuesto exacto sin costos innecesarios, evaluamos en 15 minutos qué soluciones necesita su empresa (Asistente IA 24/7, Plataforma Web, CRM, Automatización Propia o Sistema Todo-en-Uno) y le enviamos el Dossier Corporativo PDF con las tarifas de su región. Puede reservar su espacio en el botón aquí abajo. [MOSTRAR_BOTON_AGENDA]"',
  '    ], history);',
  '    if (p) return p;',
  '  }',
  '',
  '  if (/(que ofrecen|qué ofrecen|servicios|soluciones|que hacen|qué hacen|catalogo|catálogo|informacion|información)/i.test(lower)) {',
  '    const p = pickStrictlyUnique([',
  '      "En Lhyo Group diseñamos e instalamos 06 Soluciones Tecnológicas de alta gama para su empresa:\\n01 · Asistentes Inteligentes 24/7 para WhatsApp e Instagram.\\n02 · Plataformas Web Modernas y Catálogos Interactivos.\\n03 · Organización Automática de Clientes y Ventas (CRM).\\n04 · Automatización Total con Tecnología Propia.\\n05 · IA Personalizada con la Memoria de su Empresa.\\n06 · Su Propia Plataforma Empresarial Todo-en-Uno.\\n\\n¿Cuál de estas 6 soluciones le interesa implementar primero? [MOSTRAR_BOTON_AGENDA]",',
  '      "Construimos toda la infraestructura digital y de automatización para que su empresa venda y atienda las 24 horas sin trabajo manual: desde su sitio web de lujo y asistentes IA en WhatsApp/Instagram hasta su propio sistema CRM y plataforma Todo-en-Uno. ¿Sobre cuál de nuestras soluciones desea profundizar? [MOSTRAR_BOTON_AGENDA]"',
  '    ], history);',
  '    if (p) return p;',
  '  }',
  '',
  '  if (/(hola|buenos|buenas|saludos|hey|que tal|qué tal|como estas|cómo estás)/i.test(lower)) {',
  '    const p = pickStrictlyUnique([',
  '      "Es un verdadero gusto saludarle. Estoy en línea para asesorarle sobre cómo escalar y automatizar su empresa con nuestras 06 Soluciones Tecnológicas. ¿A qué se dedica su negocio y qué área le gustaría impulsar hoy?",',
  '      "¡Bienvenido a Lhyo Group! Estoy listo para resolver cualquier consulta sobre nuestras Plataformas Web de alto prestigio, Asistentes IA 24/7 para WhatsApp e Instagram y Sistemas Todo-en-Uno. ¿Cómo puedo ayudar a su empresa hoy?"',
  '    ], history);',
  '    if (p) return p;',
  '  }',
  '',
  '  const uniqueBridge = pickStrictlyUnique(UNIVERSAL_EXECUTIVE_BRIDGES, history);',
  '  if (uniqueBridge) return uniqueBridge;',
  '',
  '  const turnNum = (history || []).filter((m) => m.sender === "user").length + 1;',
  '  return `En este punto de nuestra conversación (consulta #${turnNum}), la mejor manera de comprobar el impacto de Lhyo Group es verlo aplicado directamente a su empresa. Toque el botón dorado inferior para elegir su horario de videollamada ejecutiva y recibir nuestro Catálogo Privado PDF. [MOSTRAR_BOTON_AGENDA]`;',
  '}',
  '',
  'export async function POST(req: Request) {',
  '  try {',
  '    const body = await req.json();',
  '    const message = String(body.message || "").trim();',
  '    const history = Array.isArray(body.history) ? body.history : [];',
  '',
  '    if (SEVERE_BLOCK_REGEX.test(message) || isGibberishOrFlood(message, history)) {',
  '      return NextResponse.json({',
  '        reply: "Protocolo de Seguridad Lhyo Group: Esta infraestructura cognitiva está destinada exclusivamente a consultoría tecnológica y sistemas empresariales. No procesamos contenido adulto, ilegal, violento, spam ni lenguaje inapropiado. Esta sesión ha sido bloqueada permanentemente.",',
  '        blocked: true,',
  '        showBooking: false',
  '      });',
  '    }',
  '',
  '    const aiReply = contextualBrain(message, history);',
  '    const isBlocked = aiReply.includes("[BLOQUEAR_SESION]");',
  '    const showBooking = aiReply.includes("[MOSTRAR_BOTON_AGENDA]") || /(precio|costo|cotiz|agend|reuni|cita|catalogo|catálogo|valor|clinica|clínica)/i.test(message);',
  '    const cleanReply = aiReply.replace(/\\[BLOQUEAR_SESION\\]/g, "").replace(/\\[MOSTRAR_BOTON_AGENDA\\]/g, "").trim();',
  '    return NextResponse.json({ reply: cleanReply, blocked: isBlocked, showBooking });',
  '  } catch {',
  '    return NextResponse.json({',
  '      reply: "Estoy en línea para asesorarle sobre nuestras 06 Soluciones Empresariales. ¿A qué se dedica su empresa y qué desea automatizar hoy?",',
  '      blocked: false,',
  '      showBooking: true',
  '    });',
  '  }',
  '}'
];
fs.writeFileSync(path.join(apiDir, "route.ts"), routeLines.join("\n"), "utf8");
console.log("✔ [ACTUALIZADO]: app/api/chat-lhyo/route.ts");

// PASO 2: Escribir FloatingOmniDock.tsx y DirectContactSection.tsx 100% blindado (con export default y export named)
const compDir = path.join(appRoot, "components");
fs.mkdirSync(compDir, { recursive: true });

const safeContactLines = [
  '"use client";',
  'import React, { useState } from "react";',
  '',
  'export function DirectContactSection() {',
  '  const [contactName, setContactName] = useState("");',
  '  const [contactEmail, setContactEmail] = useState("");',
  '  const [contactPhone, setContactPhone] = useState("");',
  '  const [contactMsg, setContactMsg] = useState("");',
  '  const [contactSent, setContactSent] = useState(false);',
  '',
  '  return (',
  '    <section className="px-6 pt-10 pb-20 md:px-16 lg:px-24 max-w-7xl mx-auto">',
  '      <div className="mb-10 border-b border-white/10 pb-5">',
  '        <span className="text-[11px] font-semibold text-[#C5A059] uppercase tracking-[0.16em] block mb-1.5">',
  '          CANALES OFICIALES DE COMUNICACIÓN',
  '        </span>',
  '        <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">',
  '          Contacto Directo y Atención Ejecutiva',
  '        </h2>',
  '        <p className="text-sm text-gray-300 mt-2 max-w-2xl">',
  '          Comuníquese directamente con nuestra dirección general o envíenos su consulta para recibir atención inmediata:',
  '        </p>',
  '      </div>',
  '',
  '      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">',
  '        <div className="lg:col-span-5 flex flex-col justify-between gap-4">',
  '          <a',
  '            href="https://wa.me/584247383164?text=Hola%20Lhyo%20Group%2C%20les%20escribo%20desde%20su%20p%C3%A1gina%20web%20oficial."',
  '            target="_blank"',
  '            rel="noopener noreferrer"',
  '            className="p-6 rounded-2xl bg-[#0A1128]/70 border border-[#C5A059]/30 hover:border-[#FCF6BA] transition block"',
  '          >',
  '            <span className="text-[10px] font-semibold text-[#C5A059] uppercase tracking-widest block mb-1.5">',
  '              ATENCIÓN INMEDIATA EN WHATSAPP',
  '            </span>',
  '            <div className="text-lg font-semibold text-[#FCF6BA] mb-1">',
  '              Iniciar Conversación en WhatsApp →',
  '            </div>',
  '            <p className="text-xs text-gray-300">',
  '              Respuesta directa de nuestro asistente y equipo comercial.',
  '            </p>',
  '          </a>',
  '',
  '          <a',
  '            href="https://mail.google.com/mail/?view=cm&fs=1&to=ceo@lhyogroup.com&su=Consulta%20Corporativa%20-%20Lhyo%20Group"',
  '            target="_blank"',
  '            rel="noopener noreferrer"',
  '            className="p-6 rounded-2xl bg-[#0A1128]/70 border border-[#C5A059]/30 hover:border-[#FCF6BA] transition block"',
  '          >',
  '            <span className="text-[10px] font-semibold text-[#C5A059] uppercase tracking-widest block mb-1.5">',
  '              CORREO ELECTRÓNICO CORPORATIVO OFICIAL',
  '            </span>',
  '            <div className="text-lg font-semibold text-[#FCF6BA] mb-1">',
  '              ceo@lhyogroup.com →',
  '            </div>',
  '            <p className="text-xs text-gray-300">',
  '              Dirección General: Lhyonneth Araque (CEO & Founder).',
  '            </p>',
  '          </a>',
  '',
  '          <div className="p-6 rounded-2xl bg-[#0A1128]/70 border border-[#C5A059]/30">',
  '            <span className="text-[10px] font-semibold text-[#C5A059] uppercase tracking-widest block mb-2.5">',
  '              REDES SOCIALES Y PRESENCIA OFICIAL',
  '            </span>',
  '            <div className="flex flex-wrap gap-3 mb-3">',
  '              <a',
  '                href="https://www.instagram.com/lhyogroup"',
  '                target="_blank"',
  '                rel="noopener noreferrer"',
  '                className="px-4 py-2 rounded-full border border-[#C5A059]/45 bg-[#050507] text-xs font-medium text-[#FCF6BA] hover:bg-[#C5A059] hover:text-[#050507] transition"',
  '              >',
  '                Instagram Oficial →',
  '              </a>',
  '              <a',
  '                href="https://www.linkedin.com/company/lhyogroup"',
  '                target="_blank"',
  '                rel="noopener noreferrer"',
  '                className="px-4 py-2 rounded-full border border-[#C5A059]/45 bg-[#050507] text-xs font-medium text-[#FCF6BA] hover:bg-[#C5A059] hover:text-[#050507] transition"',
  '              >',
  '                LinkedIn Corporativo →',
  '              </a>',
  '            </div>',
  '            <p className="text-xs text-gray-400">',
  '              Operación activa en Latinoamérica, Europa y Cobertura Online Internacional.',
  '            </p>',
  '          </div>',
  '        </div>',
  '',
  '        <div className="lg:col-span-7 rounded-2xl bg-gradient-to-br from-[#0A1128]/90 via-[#070A14] to-[#050507] border border-[#C5A059]/45 p-6 sm:p-8 flex flex-col justify-between">',
  '          {!contactSent ? (',
  '            <form',
  '              onSubmit={(e) => {',
  '                e.preventDefault();',
  '                if (!contactName.trim() || !contactEmail.trim() || !contactMsg.trim()) return;',
  '                setContactSent(true);',
  '              }}',
  '              className="space-y-4"',
  '            >',
  '              <div>',
  '                <span className="text-[11px] font-semibold text-[#FCF6BA] uppercase tracking-wider block mb-1">',
  '                  MENSAJE DIRECTO A DIRECCIÓN GENERAL (ceo@lhyogroup.com)',
  '                </span>',
  '                <h3 className="text-xl sm:text-2xl font-semibold text-white">',
  '                  Envíenos su consulta directa',
  '                </h3>',
  '              </div>',
  '',
  '              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">',
  '                <div>',
  '                  <label className="text-xs font-semibold text-[#FCF6BA] uppercase block mb-1">',
  '                    Su Nombre *',
  '                  </label>',
  '                  <input',
  '                    type="text"',
  '                    placeholder="Ej: Carlos Mendoza"',
  '                    value={contactName}',
  '                    onChange={(e) => setContactName(e.target.value)}',
  '                    className="w-full rounded-xl bg-[#050507] border border-white/15 focus:border-[#C5A059] text-white text-sm px-3.5 py-2.5 outline-none"',
  '                  />',
  '                </div>',
  '                <div>',
  '                  <label className="text-xs font-semibold text-[#FCF6BA] uppercase block mb-1">',
  '                    Su Correo Electrónico *',
  '                  </label>',
  '                  <input',
  '                    type="email"',
  '                    placeholder="correo@empresa.com"',
  '                    value={contactEmail}',
  '                    onChange={(e) => setContactEmail(e.target.value)}',
  '                    className="w-full rounded-xl bg-[#050507] border border-white/15 focus:border-[#C5A059] text-white text-sm px-3.5 py-2.5 outline-none"',
  '                  />',
  '                </div>',
  '              </div>',
  '',
  '              <div>',
  '                <label className="text-xs font-semibold text-[#FCF6BA] uppercase block mb-1">',
  '                  Su Número de WhatsApp (Opcional)',
  '                </label>',
  '                <input',
  '                  type="text"',
  '                  placeholder="Ej: +58 424 000 0000"',
  '                  value={contactPhone}',
  '                  onChange={(e) => setContactPhone(e.target.value)}',
  '                  className="w-full rounded-xl bg-[#050507] border border-white/15 focus:border-[#C5A059] text-white text-sm px-3.5 py-2.5 outline-none"',
  '                />',
  '              </div>',
  '',
  '              <div>',
  '                <label className="text-xs font-semibold text-[#FCF6BA] uppercase block mb-1">',
  '                  ¿En qué podemos ayudarle? *',
  '                </label>',
  '                <textarea',
  '                  rows={3}',
  '                  placeholder="Escriba aquí su consulta o requerimiento..."',
  '                  value={contactMsg}',
  '                  onChange={(e) => setContactMsg(e.target.value)}',
  '                  className="w-full rounded-xl bg-[#050507] border border-white/15 focus:border-[#C5A059] text-white text-sm px-3.5 py-2.5 outline-none resize-none"',
  '                />',
  '              </div>',
  '',
  '              <button',
  '                type="submit"',
  '                className="w-full h-[50px] rounded-xl bg-gradient-to-r from-[#C5A059] via-[#FCF6BA] to-[#B38728] text-[#050507] font-bold text-xs uppercase tracking-wider cursor-pointer"',
  '              >',
  '                ENVIAR MENSAJE DIRECTO A LHYO GROUP →',
  '              </button>',
  '            </form>',
  '          ) : (',
  '            <div className="py-10 text-center">',
  '              <div className="w-12 h-12 mx-auto mb-3 rounded-full border border-[#C5A059] bg-[#C5A059]/15 flex items-center justify-center text-lg text-[#FCF6BA] font-bold">',
  '                ✓',
  '              </div>',
  '              <h4 className="text-xl font-semibold text-white mb-2">',
  '                ¡Mensaje recibido en ceo@lhyogroup.com!',
  '              </h4>',
  '              <p className="text-xs sm:text-sm text-gray-300 mb-5">',
  '                Le responderemos a la brevedad.',
  '              </p>',
  '              <button',
  '                type="button"',
  '                onClick={() => setContactSent(false)}',
  '                className="px-5 py-2.5 rounded-xl border border-[#C5A059] text-xs font-semibold text-[#FCF6BA] cursor-pointer"',
  '              >',
  '                Enviar otra consulta',
  '              </button>',
  '            </div>',
  '          )}',
  '        </div>',
  '      </div>',
  '    </section>',
  '  );',
  '}',
  'export default DirectContactSection;'
];
fs.writeFileSync(path.join(compDir, "DirectContactSection.tsx"), safeContactLines.join("\n"), "utf8");
console.log("✔ [REPARADO AL 100%]: components/DirectContactSection.tsx");

const dockLines = [
  '"use client";',
  'import React, { useState, useEffect, useRef } from "react";',
  'interface ChatMsg { sender: "bot" | "user"; text: string; showBooking?: boolean; }',
  'const INITIAL_GREETING: ChatMsg = {',
  '  sender: "bot",',
  '  text: "Está interactuando con la infraestructura cognitiva de Lhyo Group. Soy su Asistente Ejecutivo de Inteligencia Artificial.\\n\\nPuede escribirme o tocar el micrófono para hablarme con total libertad: ¿con quién tengo el gusto y qué le gustaría consultar, crear o automatizar hoy?"',
  '};',
  'export function FloatingOmniDock({ onOpenBooking }: { onOpenBooking?: (plan: string) => void }) {',
  '  const [chatOpen, setChatOpen] = useState(false);',
  '  const [messages, setMessages] = useState<ChatMsg[]>([INITIAL_GREETING]);',
  '  const [inputMsg, setInputMsg] = useState("");',
  '  const [loading, setLoading] = useState(false);',
  '  const [sessionBlocked, setSessionBlocked] = useState(false);',
  '  const [isListening, setIsListening] = useState(false);',
  '  const [micNote, setMicNote] = useState("");',
  '  const recognitionRef = useRef<any>(null);',
  '  const chatScrollRef = useRef<HTMLDivElement | null>(null);',
  '  useEffect(() => {',
  '    if (chatScrollRef.current) chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;',
  '  }, [messages, loading]);',
  '  useEffect(() => {',
  '    const clearOnLeave = () => { setMessages([INITIAL_GREETING]); setInputMsg(""); };',
  '    window.addEventListener("beforeunload", clearOnLeave);',
  '    return () => window.removeEventListener("beforeunload", clearOnLeave);',
  '  }, []);',
  '  const handleCloseChat = () => {',
  '    if (recognitionRef.current && isListening) { try { recognitionRef.current.stop(); } catch {} setIsListening(false); }',
  '    setChatOpen(false);',
  '    if (!sessionBlocked) { setMessages([INITIAL_GREETING]); setInputMsg(""); }',
  '  };',
  '  const toggleMicrophone = () => {',
  '    if (sessionBlocked) return;',
  '    setMicNote("");',
  '    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;',
  '    if (!SpeechRec) { setMicNote("Su navegador actual no admite dictado por voz. Use Google Chrome."); return; }',
  '    if (isListening && recognitionRef.current) { try { recognitionRef.current.stop(); } catch {} setIsListening(false); return; }',
  '    try {',
  '      const rec = new SpeechRec();',
  '      rec.lang = "es-ES"; rec.continuous = false; rec.interimResults = true;',
  '      rec.onstart = () => setIsListening(true);',
  '      rec.onresult = (event: any) => {',
  '        let transcript = "";',
  '        for (let i = 0; i < event.results.length; i++) transcript += event.results[i][0].transcript;',
  '        setInputMsg(transcript);',
  '      };',
  '      rec.onerror = () => { setIsListening(false); setMicNote("Permita el acceso al micrófono para hablar."); };',
  '      rec.onend = () => setIsListening(false);',
  '      recognitionRef.current = rec; rec.start();',
  '    } catch { setIsListening(false); }',
  '  };',
  '  const handleSend = async (e?: React.FormEvent) => {',
  '    if (e) e.preventDefault();',
  '    const text = inputMsg.trim();',
  '    if (!text || loading || sessionBlocked) return;',
  '    if (isListening && recognitionRef.current) { try { recognitionRef.current.stop(); } catch {} setIsListening(false); }',
  '    setInputMsg("");',
  '    const historyForApi = [...messages];',
  '    setMessages((prev) => [...prev, { sender: "user", text }]);',
  '    setLoading(true);',
  '    try {',
  '      const res = await fetch("/api/chat-lhyo", {',
  '        method: "POST",',
  '        headers: { "Content-Type": "application/json" },',
  '        body: JSON.stringify({ message: text, history: historyForApi })',
  '      });',
  '      const data = await res.json();',
  '      if (data.blocked) setSessionBlocked(true);',
  '      setMessages((prev) => [...prev, { sender: "bot", text: data.reply, showBooking: Boolean(data.showBooking) }]);',
  '    } catch {',
  '      setMessages((prev) => [...prev, { sender: "bot", text: "Con gusto le asistimos. Puede abrir nuestra agenda ejecutiva en el botón inferior.", showBooking: true }]);',
  '    } finally { setLoading(false); }',
  '  };',
  '  const triggerBookingModal = () => {',
  '    if (onOpenBooking) { onOpenBooking("CONSULTA DESDE ASISTENTE IA"); return; }',
  '    const buttons = Array.from(document.querySelectorAll("button"));',
  '    const mainBtn = buttons.find((b) => (b.textContent || "").toUpperCase().includes("AGENDAR REUNIÓN"));',
  '    if (mainBtn) { mainBtn.click(); return; }',
  '  };',
  '  return (',
  '    <div className="fixed bottom-5 right-5 z-[9000] flex flex-col items-end gap-3 select-none">',
  '      {chatOpen && (',
  '        <div className="w-[345px] sm:w-[410px] rounded-2xl border border-[#C5A059]/70 bg-[#050507]/95 backdrop-blur-xl shadow-[0_25px_75px_rgba(0,0,0,0.95)] overflow-hidden mb-1">',
  '          <div className="px-4 py-3.5 bg-gradient-to-r from-[#0A1128] via-[#091024] to-[#050507] border-b border-white/10 flex items-center justify-between">',
  '            <div className="flex items-center gap-2.5">',
  '              <span className="relative flex h-2.5 w-2.5">',
  '                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6EE7B7] opacity-75" />',
  '                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#6EE7B7]" />',
  '              </span>',
  '              <div>',
  '                <span className="text-xs font-bold text-[#FCF6BA] uppercase tracking-wider block">Asistente Ejecutivo IA · Lhyo Group</span>',
  '                <span className="text-[10px] text-[#6EE7B7] font-medium">En Línea 24/7 · Inteligencia Artificial en Vivo</span>',
  '              </div>',
  '            </div>',
  '            <button type="button" onClick={handleCloseChat} className="w-7 h-7 rounded-full bg-white/5 text-gray-300 text-xs flex items-center justify-center hover:text-white cursor-pointer">✕</button>',
  '          </div>',
  '          <div ref={chatScrollRef} className="p-4 space-y-3 max-h-[320px] overflow-y-auto bg-[#050507]">',
  '            {messages.map((m, i) => (',
  '              <div key={i} className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}>',
  '                <div className={`max-w-[87%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-line ${m.sender === "user" ? "bg-gradient-to-r from-[#C5A059] via-[#FCF6BA] to-[#B38728] text-[#050507] font-semibold" : "bg-[#0A1128]/90 border border-[#C5A059]/40 text-gray-100"}`}>{m.text}</div>',
  '                {m.showBooking && m.sender === "bot" && !sessionBlocked && (',
  '                  <button type="button" onClick={triggerBookingModal} className="mt-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#FCF6BA] to-[#B38728] text-[#050507] font-extrabold text-[11px] uppercase tracking-wider shadow-lg hover:brightness-105 transition cursor-pointer">📅 Agendar Reunión y Recibir Catálogo PDF →</button>',
  '                )}',
  '              </div>',
  '            ))}',
  '            {loading && <div className="text-[11px] text-[#FCF6BA] italic animate-pulse">Analizando...</div>}',
  '          </div>',
  '          {micNote && <div className="px-4 py-1.5 bg-[#12100B] border-t border-[#C5A059]/30 text-[10px] text-[#FCF6BA]">🎙️ {micNote}</div>}',
  '          {sessionBlocked ? (',
  '            <div className="p-3.5 bg-red-950/50 border-t border-red-500/40 text-center text-[11px] font-bold text-red-200">🔒 Escritura y Micrófono Bloqueados por Seguridad</div>',
  '          ) : (',
  '            <form onSubmit={handleSend} className="p-3 bg-[#0A1128]/70 border-t border-white/10 flex items-center gap-2">',
  '              <input type="text" value={inputMsg} onChange={(e) => setInputMsg(e.target.value)} placeholder={isListening ? "🎙️ Escuchando su voz... hable ahora" : "Pregunte o pida lo que desee..."} className="flex-1 bg-[#050507] border border-white/15 focus:border-[#C5A059] rounded-xl px-3 py-2 text-xs text-white outline-none" />',
  '              <button type="button" onClick={toggleMicrophone} className={`w-9 h-9 rounded-xl flex items-center justify-center border transition cursor-pointer shrink-0 ${isListening ? "bg-red-500/20 border-red-400 text-red-300 animate-pulse" : "bg-[#050507] border-[#C5A059]/50 text-[#FCF6BA]"}`}>',
  '                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" /></svg>',
  '              </button>',
  '              <button type="submit" disabled={loading} className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#FCF6BA] to-[#B38728] text-[#050507] font-bold text-xs cursor-pointer shrink-0">Enviar</button>',
  '            </form>',
  '          )}',
  '          <div className="px-4 py-2.5 bg-[#050507] border-t border-white/10 flex items-center justify-between text-[11px]">',
  '            <span className="text-gray-400">¿Prefiere atención en WhatsApp?</span>',
  '            <a href="https://wa.me/584247383164?text=Hola%20Lhyo%20Group%2C%20les%20escribo%20desde%20su%20sitio%20web%20oficial." target="_blank" rel="noopener noreferrer" className="text-[#FCF6BA] font-semibold hover:underline">Abrir WhatsApp →</a>',
  '          </div>',
  '        </div>',
  '      )}',
  '      <div className="flex items-center gap-2 rounded-full bg-[#080A10]/95 backdrop-blur-xl border border-[#C5A059]/60 p-1.5 pl-2.5 shadow-2xl">',
  '        <a href="https://www.instagram.com/lhyogroup" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-white/10 bg-white/[0.03] hover:border-[#C5A059] flex items-center justify-center text-[#FCF6BA] transition">',
  '          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>',
  '        </a>',
  '        <a href="https://www.linkedin.com/company/lhyogroup" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-white/10 bg-white/[0.03] hover:border-[#C5A059] flex items-center justify-center text-[#FCF6BA] transition">',
  '          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" /></svg>',
  '        </a>',
  '        <button type="button" onClick={() => (chatOpen ? handleCloseChat() : setChatOpen(true))} className="px-5 h-9 rounded-full bg-gradient-to-r from-[#C5A059] via-[#FCF6BA] to-[#B38728] text-[#050507] font-bold text-xs tracking-wider uppercase flex items-center gap-2 shadow-[0_0_25px_rgba(197,160,89,0.5)] hover:brightness-105 transition cursor-pointer">',
  '          <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#065F46] opacity-75" /><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#047857]" /></span>',
  '          <span>{chatOpen ? "Cerrar Asistente IA" : "✦ Asistente IA 24/7 / WhatsApp"}</span>',
  '        </button>',
  '      </div>',
  '    </div>',
  '  );',
  '}',
  'export default FloatingOmniDock;'
];
fs.writeFileSync(path.join(compDir, "FloatingOmniDock.tsx"), dockLines.join("\n"), "utf8");
console.log("✔ [ACTUALIZADO]: components/FloatingOmniDock.tsx");

// Funcion segura de conteo de llaves para reemplazar el bloque de CONTACTO sin cortar etiquetas JSX
function replaceContactoBlockSafely(source, varName) {
  const patterns = [
    `{${varName} === "contacto" && (`,
    `{${varName} === 'contacto' && (`
  ];
  for (const pat of patterns) {
    const startIdx = source.indexOf(pat);
    if (startIdx !== -1) {
      let depth = 0;
      let endIdx = -1;
      for (let i = startIdx; i < source.length; i++) {
        if (source[i] === "{") depth++;
        else if (source[i] === "}") {
          depth--;
          if (depth === 0) { endIdx = i; break; }
        }
      }
      if (endIdx !== -1) {
        return source.slice(0, startIdx) + `{${varName} === "contacto" && <DirectContactSection />}` + source.slice(endIdx + 1);
      }
    }
  }
  return source;
}

function getFiles(dir, list = []) {
  if (!fs.existsSync(dir)) return list;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === ".next" || e.name === ".git") continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) getFiles(full, list);
    else if (full.endsWith(".tsx") || full.endsWith(".ts") || full.endsWith(".css")) list.push(full);
  }
  return list;
}

for (const filePath of getFiles(appRoot)) {
  if (filePath.endsWith("FloatingOmniDock.tsx") || filePath.endsWith("route.ts") || filePath.endsWith("DirectContactSection.tsx")) continue;
  let content = fs.readFileSync(filePath, "utf8");
  const orig = content;

  if (filePath.endsWith("globals.css") && !content.includes("/* LHYO_PRE_LINE */")) {
    content += "\n/* LHYO_PRE_LINE */\nh3 { white-space: pre-line; }\n";
  }

  content = content.replace(/59800000000/g, "584247383164");
  content = content.replace(
    /mailto:ceo@lhyogroup\.com(\?subject=[^"'`]+)?/g,
    "https://mail.google.com/mail/?view=cm&fs=1&to=ceo@lhyogroup.com&su=Consulta%20Corporativa%20-%20Lhyo%20Group"
  );

  content = content.replace(
    /Mientras su competencia descansa,[\s\S]{1,65}?0\.4 segundos/g,
    "Mientras su competencia descansa, su empresa atiende\\ny\u00A0agenda\u00A0citas\u00A0hoy\u00A0al\u00A0instante."
  );
  content = content.replace(
    /Porque las p[áa]ginas tradicionales saturan;[\s\S]{1,60}?cautivan/g,
    "Una plataforma moderna de máximo prestigio que\\nproyecta\u00A0autoridad\u00A0y\u00A0multiplica\u00A0sus\u00A0ventas."
  );
  content = content.replace(
    /Todo su negocio unido en una sola pantalla[\s\S]{1,60}?control absoluto/g,
    "Todo su negocio unido en una pantalla\\noperando\u00A0siempre\u00A0bajo\u00A0su\u00A0control\u00A0total."
  );

  content = content.replace(/1\. PA[ÍI]S DE OPERACI[ÓO]N/g, "1. REGIÓN DE OPERACIÓN");
  content = content.replace(
    /\["Uruguay",\s*"Venezuela",\s*"Otro Pa[íi]s \/ Internacional"\]/g,
    '["Latinoamérica", "Europa", "Estados Unidos / Norteamérica", "Otra Región / Global"]'
  );
  content = content.replace(/useState\("Uruguay"\)/g, 'useState("Latinoamérica")');
  content = content.replace(
    /"Paquete Completo \(Todo Incluido\)",[\s\r\n]*"Asistente WhatsApp \/ IG 24\/7",[\s\r\n]*"Plataforma Web Moderna",[\s\r\n]*"Sistemas Propios \(Motor \/ Cerebro \/ Panel\)"/g,
    '"01 · Asistentes Inteligentes WhatsApp / IG (24/7)", "02 · Plataformas Web y Catálogos Interactivos", "03 · Organización Automática de Clientes (CRM)", "04 · Automatización Total con Tecnología Propia", "05 · IA Personalizada con la Memoria de su Empresa", "06 · Plataforma Empresarial Todo-en-Uno"'
  );
  content = content.replace(
    /useState<string\[\]>\(\["Paquete Completo \(Todo Incluido\)"\]\)/g,
    'useState<string[]>(["01 · Asistentes Inteligentes WhatsApp / IG (24/7)"])'
  );
  content = content.replace(
    /useState\(\["Paquete Completo \(Todo Incluido\)"\]\)/g,
    'useState(["01 · Asistentes Inteligentes WhatsApp / IG (24/7)"])'
  );
  content = content.replace(
    /const fullLabel = "Paquete Completo \(Todo Incluido\)";[\s\S]*?return \[\.\.\.withoutFull, option\];\s*\}\s*\};/,
    "setPrivInterests((prev) => prev.includes(option) ? (prev.length > 1 ? prev.filter((i) => i !== option) : prev) : [...prev, option]); };"
  );
  content = content.replace(/SOLICITUD CAT[ÁA]LOGO PRIVADO \| Pa[íi]s:/g, "Propuesta personalizada para");
  content = content.replace(/\| Inter[ée]s:/g, "· Soluciones:");
  content = content.replace(/\| Etapa:/g, "· Etapa:");

  // Enlazar DirectContactSection blindado en page.tsx y CollapsibleMasterSections.tsx
  if (content.includes('activeView === "contacto"') || content.includes('activeTab === "contacto"')) {
    const relContact = filePath.includes(path.join("app", "page.tsx")) ? "../components/DirectContactSection" : "./DirectContactSection";
    if (!content.includes("DirectContactSection")) {
      if (content.includes('"use client"') || content.includes("'use client'")) {
        content = content.replace(/^([\s\S]*?["']use client["'];?\r?\n)/, `$1import DirectContactSection from "${relContact}";\n`);
      } else {
        content = `import DirectContactSection from "${relContact}";\n` + content;
      }
    }
    content = replaceContactoBlockSafely(content, "activeView");
    content = replaceContactoBlockSafely(content, "activeTab");
  }

  if (content.includes("Asistente Directo") && content.includes("QUICK_BOT_OPTIONS")) {
    const relImport = filePath.includes(path.join("app", "page.tsx")) ? "../components/FloatingOmniDock" : "./FloatingOmniDock";
    if (!content.includes("FloatingOmniDock")) {
      if (content.includes('"use client"') || content.includes("'use client'")) {
        content = content.replace(/^([\s\S]*?["']use client["'];?\r?\n)/, `$1import FloatingOmniDock from "${relImport}";\n`);
      } else {
        content = `import FloatingOmniDock from "${relImport}";\n` + content;
      }
    }
    content = content.replace(
      /\{\/\*\s*DOCK FLOTANTE OMNICANAL[\s\S]*?(?=<ExecutiveBookingModal)/,
      "<FloatingOmniDock onOpenBooking={openBookingWithPlan} />\n\n      "
    );
  }

  if (content !== orig) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log("✔ [CALIBRADO]:", path.relative(ROOT, filePath));
  }
}

// PASO 4: Subir a GitHub y Vercel
for (const gDir of [ROOT, appRoot]) {
  if (fs.existsSync(path.join(gDir, ".git"))) {
    try {
      execSync("git add -A", { cwd: gDir, stdio: "inherit" });
      execSync('git commit -m "V47.0: Contacto 100% blindado sin excepcion + IA sin repeticion + Bloqueo PORNO"', { cwd: gDir, stdio: "inherit" });
      execSync("git push origin main --force", { cwd: gDir, stdio: "inherit" });
      console.log("✅ EXITO TOTAL: Desplegado en Vercel desde", gDir);
    } catch (e) { console.log(e.message); }
  }
}