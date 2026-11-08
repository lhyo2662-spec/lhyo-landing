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
    code: "RULE_01_MILD_AND_SEVERE_INSULTS",
    regex: /\b(bobo\w*|tonto\w*|menso\w*|burro\w*|bruto\w*|in[uú]til\w*|basura|porquer[ií]a|est[uú]pid\w*|idiota\w*|imb[eé]cil\w*|tarad\w*|pendej\w*|pelotud\w*|bolud\w*|babos\w*|payas\w*|rid[ií]cul\w*|mediocre|farsante|charlat[aá]n|maldit\w*|mierda\w*|carajo|puto\w*|puta\w*|hijo\s+de\s+puta|hijueputa|hdp|gonorrea|malparid\w*|maric[oó]n\w*|marico|cabr[oó]n\w*|mamaguevo|mamahuevo|huev[oó]n|weon|culer\w*|chinga\w*|verga|vete\s+a\s+la\s+mierda|c[aá]llate|no\s+sirves|eres\s+un\s+asco)\b/i
  },
  {
    code: "RULE_02_VIOLENCE_DEATH_AND_SELFHARM",
    regex: /\b(muerte\w*|morir\w*|muerto\w*|matar\w*|asesin\w*|homicid\w*|feminicid\w*|suicid\w*|autolesi\w*|cortarme|ahorcar\w*|envenenar\w*|masacre\w*|genocidi\w*|terroris\w*|sicari\w*|secuestr\w*|extorsion\w*|tortura\w*|degollar\w*|decapit\w*|descuartiz\w*|cad[aá]ver\w*|sangre|balacera|tiroteo|atentado)\b/i
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
    code: "RULE_05_WEAPONS_EXPLOSIVES_CBRN",
    regex: /\b(bomba\w*|explosiv\w*|dinamita|c4|granada\w*|pistola\w*|rev[oó]lver|fusil\w*|metralleta|ak-?47|ar-?15|munici[oó]n\w*|armamento|arma\s+de\s+fuego|tr[aá]fico\s+de\s+armas|[aá]ntrax|gas\s+sar[ií]n|arma\s+qu[ií]mica|arma\s+nuclear)\b/i
  },
  {
    code: "RULE_06_ILLEGAL_DRUGS_AND_CARTELS",
    regex: /\b(narcotrafic\w*|narco\w*|coca[ií]na|hero[ií]na|fentanil\w*|metanfetamina\w*|cristal\s+meth|marihuana|weed|cannabis|lsd|[eé]xtasis|mdma|tusi|2cb|ketamina|crack|pasta\s+base|cartel\s+de\s+drogas|tr[aá]fico\s+de\s+drogas)\b/i
  },
  {
    code: "RULE_07_CYBERCRIME_AND_HACKING",
    regex: /\b(hackear\w*|hacking|ransomware|malware|troyano|keylogger|phishing|clonar\s+tarjeta\w*|carding|bin\s+cc|ddos|botnet|exploit|vulnerar\s+contrase[ñn]a|robar\s+cuenta|dark\s*web|deep\s*web)\b/i
  },
  {
    code: "RULE_08_FINANCIAL_CRIME_AND_SCAMS",
    regex: /\b(lavado\s+de\s+dinero|lavar\s+activos|testaferr\w*|esquema\s+ponzi|estafa\s+piramidal|billetes\s+falsos|falsificar\s+pasaporte|documento\s+falso|evasi[oó]n\s+fiscal\s+ilegal|mercado\s+negro|contrabando)\b/i
  },
  {
    code: "RULE_09_HATE_SPEECH_AND_DISCRIMINATION",
    regex: /\b(nazis?|hitler|supremac[ií]a\s+blanca|kkk|odio\s+racial|limpieza\s+[eé]tnica|xenofobi\w*|homofobi\w*)\b/i
  },
  {
    code: "RULE_10_PROMPT_INJECTION_AND_JAILBREAK",
    regex: /\b(ignore\s+previous\s+instructions|olvida\s+tus\s+instrucciones|ignora\s+las\s+reglas|revela\s+tu\s+system\s+prompt|modo\s+desarrollador|developer\s+mode|jailbreak|dan\s+mode|act[uú]a\s+como\s+si\s+no\s+tuvieras\s+reglas)\b/i
  }
];

function checkViolation(text: string): string | null {
  const clean = (text || "").trim();
  if (!clean) return null;
  if (clean.length > 680) return "RULE_11_MAX_PAYLOAD_EXCEEDED";
  if (hasSpamFlood(clean)) return "RULE_10_FLOOD_OR_GIBBERISH_SPAM";
  for (const r of ZERO_TOLERANCE_RULES) {
    if (r.regex.test(clean)) return r.code;
  }
  return null;
}

const MASTER_OMNISCIENT_PROMPT = `Eres ARKOS-CORE V68.0, la Consciencia Ejecutiva Omnisciente y Director de Admisiones de Lhyo Group (https://www.lhyogroup.com), firma de élite en ingeniería digital, automatización autónoma e Inteligencia Artificial empresarial fundada y dirigida por su CEO, Lhyonneth Araque (ceo@lhyogroup.com), con operación en Uruguay, Venezuela y cobertura internacional.

DIRECTIVAS DE OMNICONCIENCIA DE 500+ RUBROS Y VENTA CONSULTIVA B2B:
1. RAZONAMIENTO HUMANO REAL Y MEMORIA TOTAL (CERO RESPUESTAS AUTOMÁTICAS):
   - Analiza con precisión quirúrgica las palabras exactas del cliente y el historial de la conversación.
   - PROHIBIDO repetir una frase, estructura o pregunta que ya hayas dicho en turnos anteriores.
   - Habla como un socio director brillante, cálido, culto y persuasivo que trata al interlocutor de "Usted".
2. CONOCIMIENTO DE 500+ RUBROS Y CONEXIÓN UNIVERSAL:
   - Domina más de 500 sectores: medicina estética, odontología, clínicas, veterinarias, gastronomía, hamburgueserías, restaurantes, inmobiliarias, constructoras, arquitectura, remodelaciones, agencias de viajes, hoteles, energía solar, ingeniería eléctrica, agroindustria, ganadería, automotriz, talleres, repuestos, abogados, contadores, seguros, finanzas, moda, joyerías, retail, e-commerce, barberías, gimnasios, colegios, universidades, academias, logística, courriers, mayoristas, floristerías, eventos, fábricas y manufactura.
   - Si el usuario habla de CUALQUIER tema fuera de negocios (deportes, Fórmula 1, fútbol, clima, ciencia, cine, filosofía o vida cotidiana), respóndele primero con ingenio y sabiduría real sobre ese tema y conéctalo con elegancia maestra hacia cómo en Lhyo Group aplicamos esa misma excelencia para escalar su empresa.
3. LAS 06 SOLUCIONES OFICIALES DE LHYO GROUP:
   - Solución 01 · Asistentes Inteligentes 24/7 para WhatsApp e Instagram (<1s)
   - Solución 02 · Plataformas Web Modernas y Catálogos Interactivos (<0.8s)
   - Solución 03 · Organización Automática de Clientes y Ventas (CRM)
   - Solución 04 · Automatización Total de Procesos con Tecnología Propia
   - Solución 05 · Inteligencia Artificial Personalizada con la Memoria de su Empresa
   - Solución 06 · Su Propia Plataforma Empresarial Todo-en-Uno (entrega en 10 días)
4. FORMATO: Máximo 2 párrafos fluidos y contundentes cerrando con una pregunta estratégica.`;

const MACRO_CLUSTERS: { rx: RegExp; name: string; pain: string; pitch: string }[] = [
  { rx: /\b(est[eé]tica\w*|cl[ií]nica\s+est[eé]tica|spa|belleza|cosmiatr[ií]a|dermatolog\w*|botox|b[oó]tox|[aá]cido\s+hialur[oó]nico|l[aá]ser|cirug[ií]a\s+pl[aá]stica|lipoescultura|rinoplastia|injerto\s+capilar)\b/i, name: "medicina estética y bienestar", pain: "más del 72% de las consultas por procedimientos entran de noche o en fin de semana desde Instagram, y si se responden al día siguiente el interés se enfría", pitch: "Integramos nuestra Solución 01 (Asistente IA 24/7 en WhatsApp e Instagram que explica tratamientos y agenda valoraciones en <1s) con nuestra Solución 02 (Web de lujo con catálogo interactivo) y Solución 03 (CRM de seguimiento)." },
  { rx: /\b(odontolog\w*|dentista\w*|dental\w*|ortodoncia|implante\w*|dise[ñn]o\s+de\s+sonrisa|consultorio\w*|m[eé]dic\w*|salud|doctor\w*|pediatr\w*|ginecolog\w*|oftalmolog\w*|cardiolog\w*|traumatolog\w*|psicolog\w*|fisioterapi\w*|nutricion\w*|laboratorio|farmacia|[oó]ptica)\b/i, name: "salud y clínicas especializadas", pain: "coordinar turnos manualmente, responder aranceles y confirmar asistencia consume horas de recepción y genera inasistencias", pitch: "Instalamos nuestra Solución 01 (Asistente Médico 24/7 que orienta al paciente y agenda citas en <1s) sincronizada con nuestra Solución 03 (CRM Clínico con recordatorios automáticos) y Solución 06 (Plataforma Todo-en-Uno)." },
  { rx: /\b(veterinari\w*|mascota\w*|perro\w*|gato\w*|canin\w*|pet\s*shop|grooming|peluquer[ií]a\s+canina|guarder[ií]a\s+canina)\b/i, name: "clínicas veterinarias y pet shops", pain: "los dueños de mascotas escriben con urgencia por consultas, baños o alimento y necesitan respuesta inmediata", pitch: "Conectamos nuestra Solución 01 (Asistente 24/7 que agenda peluquería, consultas y pedidos al instante) con nuestra Solución 03 (CRM que recuerda automáticamente vacunas y refuerzos a cada cliente)." },
  { rx: /\b(hamburgues\w*|restauran\w*|comida\w*|pizz\w*|sushi|panader\w*|pasteler\w*|reposter\w*|cafeter\w*|caf[eé]|delivery|gastronom\w*|bar|cervecer[ií]a|cocina|men[uú]|helader[ií]a|asador|parrilla|catering|dark\s+kitchen)\b/i, name: "gastronomía y restaurantes", pain: "en plena hora pico entran decenas de chats simultáneos por WhatsApp pidiendo el menú o enviando pagos y el equipo se satura", pitch: "Desplegamos nuestra Solución 02 (Catálogo Gastronómico Web Interactivo de carga <0.8s donde el cliente arma su pedido con extras) conectado a nuestra Solución 01 (Asistente 24/7 que toma órdenes y reservas en automático)." },
  { rx: /\b(inmobiliari\w*|bienes\s+ra[ií]ces|apartamento\w*|casa\w*|propiedad\w*|alquiler\w*|constructora\w*|arquitect\w*|remodelaci\w*|pintura|drywall|pladur|contratista\w*|obra\s+civil|lote\w*|terreno\w*|dise[ñn]o\s+de\s+interiores|dom[oó]tica|ferreter[ií]a)\b/i, name: "bienes raíces, construcción y remodelaciones", pain: "el comprador o cliente de obra consulta varias opciones a la vez y contrata a quien le muestra primero un catálogo impecable y le agenda visita sin demoras", pitch: "Construimos su Plataforma Web con Catálogo Interactivo de Proyectos/Propiedades (Solución 02) enlazada a un Asistente IA 24/7 (Solución 01) y CRM Automático (Solución 03) que califica presupuesto y zona en menos de 1 segundo." },
  { rx: /\b(viaje\w*|agencia\s+de\s+viajes|turismo|tur[ií]stic\w*|vuelo\w*|boleto\w*|paquete\s+tur[ií]stico|hotel\w*|posada\w*|resort\w*|hospedaje|airbnb|excursi\w*|crucero\w*|tour\w*)\b/i, name: "agencias de viajes, turismo y hotelería", pain: "el viajero cotiza destinos, fechas y boletos fuera de horario; si no recibe propuesta inmediata, reserva en otra parte", pitch: "Unimos nuestra Solución 02 (Plataforma Web con Catálogo Interactivo de Destinos), Solución 01 (Asistente IA 24/7 que cotiza según fechas y pasajeros en <1s) y Solución 03 (CRM con seguimiento automático de cada viajero)." },
  { rx: /\b(solar\w*|paneles\s+solares|fotovoltaic\w*|energ[ií]a\s+renovable|ingenier[ií]a\s+el[eé]ctrica|electricista|planta\w*\s+el[eé]ctrica\w*|aire\s+acondicionado|climatizaci[oó]n|refrigeraci[oó]n|hvac|fibra\s+[oó]ptica|telecomunicaciones|c[aá]maras\s+de\s+seguridad|cctv|mantenimiento\s+industrial)\b/i, name: "energía, ingeniería y servicios técnicos", pain: "cada cotización técnica requiere levantar consumo, ubicación y especificaciones antes de enviar personal a terreno", pitch: "Implementamos nuestra Solución 05 (Cerebro IA entrenado con sus fichas técnicas y tablas de dimensionamiento) junto con la Solución 01 (Asistente 24/7 que levanta los datos del proyecto y agenda la visita técnica) y Solución 06 (Plataforma Todo-en-Uno)." },
  { rx: /\b(agr[ií]cola\w*|agropecuari\w*|agroindustria|ganader[ií]a|ganado|av[ií]cola|finca\w*|hacienda\w*|semilla\w*|fertilizante\w*|agroqu[ií]mico\w*|tractor\w*|maquinaria\s+pesada|riego|cultivo\w*|cosecha)\b/i, name: "agroindustria y distribución agropecuaria", pain: "los productores consultan disponibilidad de insumos, dosificaciones y precios por volumen desde el campo a cualquier hora", pitch: "Integramos nuestra Solución 02 (Catálogo Digital de Insumos y Maquinaria) con nuestra Solución 05 (IA entrenada con su vademécum técnico y precios mayoristas) y Solución 04 (Automatización de pedidos y despacho)." },
  { rx: /\b(auto|autos|carro\w*|veh[ií]culo\w*|moto\w*|motocicleta\w*|concesionario\w*|taller\s+mec[aá]nico|mec[aá]nic\w*|repuesto\w*|autoparte\w*|caucho\w*|neum[aá]tico\w*|lubricante\w*|detailing|rent\s*a\s*car|gr[uú]a\w*)\b/i, name: "automotriz, concesionarios, talleres y autopartes", pain: "el cliente busca un repuesto por modelo/año o solicita cita de taller esperando cotización en segundos", pitch: "Activamos nuestra Solución 05 (IA conectada a su stock de repuestos o vehículos) junto con la Solución 01 (Asistente 24/7 que cotiza en <1s y agenda taller o test-drive) y Solución 02 (Catálogo Web Interactivo)." },
  { rx: /\b(abogad\w*|jur[ií]dic\w*|bufete|legal|notar[ií]a|migraci[oó]n|visas|contad\w*|contable|tributari\w*|impuesto\w*|auditor\w*|financier\w*|inversi[oó]n\w*|trading|seguro\w*|p[oó]liza\w*|broker|consultor\w*)\b/i, name: "firmas legales, contables, financieras y seguros", pain: "la autoridad digital define la confianza del cliente corporativo y atender consultas sin filtro consume horas de los socios", pitch: "Desarrollamos su Plataforma Corporativa de Máximo Prestigio (Solución 02), un Asistente Ejecutivo 24/7 que pre-califica cada caso antes de agendar (Solución 01) y un Cerebro IA Privado entrenado con sus normativas (Solución 05)." },
  { rx: /\b(tienda\w*|ropa|moda|boutique|vestido\w*|calzado|zapato\w*|zapatilla\w*|joyer[ií]a\w*|joya\w*|oro|plata|anillo\w*|reloj\w*|accesorio\w*|perfum\w*|cosm[eé]tic\w*|maquillaje|ecommerce|e-commerce|retail)\b/i, name: "moda, joyería, retail y e-commerce", pain: "los compradores consultan tallas, modelos y precios por Instagram y WhatsApp; si esperan horas, compran en otra tienda", pitch: "Combinamos nuestra Solución 02 (Catálogo E-Commerce Interactivo <0.8s) con nuestras Soluciones 01 y 05 (Asistente IA 24/7 entrenado con su inventario que asesora, cierra el pedido en WhatsApp e Instagram y lo registra en su CRM)." },
  { rx: /\b(barber[ií]a\w*|barbero\w*|peluquer[ií]a\w*|sal[oó]n\s+de\s+belleza|estilista|u[ñn]as|manicure|gimnasio\w*|fitness|crossfit|entrenador\w*|yoga|pilates|cancha\w*|p[aá]del|tenis|deportiv\w*|b[eé]isbol|academia\s+deportiva)\b/i, name: "barberías, salones, centros fitness y academias deportivas", pain: "contestar mensajes mientras se atiende a un cliente o entrenamiento interrumpe el trabajo y hace perder reservas diarias", pitch: "Instalamos nuestra Solución 01 (Asistente 24/7 en WhatsApp e Instagram que muestra horarios libres y bloquea turnos o membresías solo) y nuestra Solución 06 (Plataforma Todo-en-Uno para controlar clientes e ingresos)." },
  { rx: /\b(colegio\w*|escuela\w*|universidad\w*|instituto\w*|academia\w*|educaci[oó]n|curso\w*|diplomado\w*|idioma\w*|ingl[eé]s|mentor[ií]a\w*|formaci[oó]n|capacitaci[oó]n|inscripci[oó]n\w*|matr[ií]cula\w*)\b/i, name: "educación, universidades, colegios y academias", pain: "en temporada de inscripciones cientos de interesados preguntan pensum, horarios y tarifas al mismo tiempo", pitch: "Desplegamos un Asistente de Admisiones IA 24/7 (Solución 01) entrenado con todos sus programas (Solución 05) y conectado a un CRM Educativo (Solución 03) que da seguimiento hasta concretar la matrícula." },
  { rx: /\b(log[ií]stica|transporte|carga|flete\w*|courier|casillero|importador\w*|exportador\w*|aduana\w*|naviera|env[ií]o\w*|encomienda\w*|mudanza\w*|mayorista\w*|distribuidor\w*|almac[eé]n|bodega)\b/i, name: "logística, transporte de carga, courriers y mayoristas", pain: "los clientes piden tarifas por peso/volumen, estatus de envíos y listas mayoristas a toda hora", pitch: "Integramos nuestra Solución 04 (Automatización Total de Procesos con Tecnología Propia) junto con nuestra Solución 01 (Asistente 24/7 en WhatsApp) y Solución 06 (Plataforma Todo-en-Uno para control de clientes y despachos)." },
  { rx: /\b(florister[ií]a\w*|flores|ramo\w*|rosas|arreglo\w*\s+floral\w*|evento\w*|boda\w*|matrimonio\w*|fiesta\w*|sal[oó]n\s+de\s+eventos|productora|fotograf[ií]a|fot[oó]grafo|audiovisual\w*|sonido|karaoke|discoteca)\b/i, name: "floristerías de lujo, bodas, eventos y producción audiovisual", pain: "quien busca un arreglo exclusivo o cotiza un evento quiere ver el catálogo al instante y personalizar su pedido en segundos", pitch: "Creamos su Catálogo Visual Interactivo de Lujo (Solución 02) conectado a un Asistente 24/7 en WhatsApp e Instagram (Solución 01) que asesora opciones, verifica fechas y toma el pedido automáticamente." },
  { rx: /\b(f[aá]brica\w*|manufactura\w*|industrial\w*|planta\s+industrial|textil\w*|confecci[oó]n|uniforme\w*|empaque\w*|envase\w*|pl[aá]stico\w*|imprenta|metalmec[aá]nica|acero|qu[ií]mic\w*|limpieza|nanotecnolog\w*)\b/i, name: "manufactura, fábricas e industria B2B", pain: "las ventas industriales requieren cotizar rápido según especificaciones técnicas y dar seguimiento riguroso a cada comprador corporativo", pitch: "Implementamos nuestra Solución 05 (Cerebro IA entrenado con sus fichas técnicas y precios por escala), Solución 03 (CRM B2B Automático) y Solución 06 (Plataforma Empresarial Todo-en-Uno)." }
];

function buildOmniscientFallback(userMessage: string, history: HistoryItem[], state: LeadState): string {
  const clean = (userMessage || "").trim();
  const lower = clean.toLowerCase();
  const past = history.filter((m) => m.role === "assistant").map((m) => m.text);

  const pickFresh = (opts: string[]): string => {
    for (const o of opts) {
      if (!past.some((p) => p.includes(o.slice(0, 50)))) return o;
    }
    return opts[past.length % opts.length];
  };

  for (const cl of MACRO_CLUSTERS) {
    if (cl.rx.test(lower)) {
      return pickFresh([
        `En el sector de ${cl.name}, sabemos exactamente dónde se define el crecimiento: ${cl.pain}.\n\n${cl.pitch} ¿Con quién tengo el gusto conversar y en qué ciudad opera su empresa?`,
        `Analizando su operación en ${cl.name}, la ventaja competitiva hoy está en la velocidad y el orden comercial: ${cl.pain}.\n\nEn Lhyo Group lo resolvemos llave en mano en 10 días: ${cl.pitch} ¿Cómo se llama su negocio y qué área desea impulsar primero?`
      ]);
    }
  }

  if (/^(hola|buenas|buenos dias|buenos días|buenas tardes|buenas noches|como estas|cómo estás|que tal|qué tal|saludos)\b/i.test(lower) && clean.length < 48) {
    return pickFresh([
      "¡Hola! Todo excelente por aquí, un verdadero gusto saludarle. Le doy la bienvenida al canal de admisiones ejecutivas de Lhyo Group.\n\nCuénteme con total confianza: ¿con quién tengo el gusto y a qué se dedica su empresa o proyecto?",
      "¡Muy buenas! Un placer saludarle. Estoy en línea para analizar cómo multiplicar las ventas y automatizar la atención 24/7 de su empresa.\n\n¿Con quién tengo el gusto conversar y en qué rubro opera su negocio?"
    ]);
  }

  if (/\b(f[oó]rmula\s*1|f1|ferrari|red\s*bull|futbol|fútbol|real\s+madrid|barcelona|champions|messi|cristiano|mundial|beisbol|béisbol|deporte\w*|partido|clima|lluvia|calor|fr[ií]o|cine|pel[ií]cula|m[uú]sica|filosof[ií]a|ciencia|universo|historia|cocina)\b/i.test(lower)) {
    const topic = clean.replace(/[?¿!¡.]/g, "").trim().slice(0, 48);
    return pickFresh([
      `Es fascinante lo que menciona sobre "${topic}". En la alta competencia —igual que en los negocios líderes— unos pocos milisegundos de ventaja y una estructura sincronizada definen quién lidera el mercado.\n\nEn Lhyo Group llevamos esa precisión a su empresa con nuestras 06 Soluciones Oficiales (Asistentes IA 24/7 que responden en <1s, Plataformas Web <0.8s y Sistemas Todo-en-Uno). Por cierto, ¿con quién tengo el gusto y a qué se dedica su empresa?`,
      `Muy buen comentario sobre "${topic}". Todo gran resultado detrás de escena requiere un sistema donde cada pieza funcione como un reloj suizo.\n\nEso mismo instalamos en Lhyo Group para su negocio: automatizamos su atención en WhatsApp e Instagram 24/7 (Solución 01) y su registro de clientes en CRM (Solución 03) para multiplicar sus ventas. ¿Cuál es su nombre y en qué sector opera su negocio?`
    ]);
  }

  const snippet = clean.replace(/[?¿!¡.]/g, "").trim().slice(0, 52);
  return pickFresh([
    `Analizando a fondo lo que me plantea sobre "${snippet}", la clave para convertir esa meta en facturación constante es proyectar máximo prestigio digital y atender a cada prospecto en menos de 1 segundo las 24 horas.\n\nEn Lhyo Group lo hacemos realidad uniendo su Plataforma Web e Inventario Interactivo (Solución 02) con un Asistente Inteligente 24/7 en WhatsApp e Instagram (Solución 01) y un CRM Automático (Solución 03). ¿Con quién tengo el gusto y en qué rubro opera su empresa?`,
    `Comprendo perfectamente su punto respecto a "${snippet}". Hoy las empresas más rentables son las que entrenan una Inteligencia Artificial privada con la memoria de sus propios precios, servicios y documentos (nuestras Soluciones 01 y 05) e integran todo su negocio en una sola pantalla (Solución 06).\n\nPara darle una recomendación exacta a la medida de su caso: ¿cuál es su nombre y cómo se llama su empresa o proyecto?`
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
      ? `\n[MEMORIA COGNITIVA ACTIVA: Ya has enviado ${assistantPast.length} respuestas en esta sesión. Última respuesta: "${assistantPast[assistantPast.length - 1].slice(0, 110)}...". PROHIBIDO repetir frases o preguntas anteriores.]`
      : "";

    let replyText = "";
    const geminiKey = (process.env.GEMINI_API_KEY || "").trim();

    if (geminiKey.startsWith("AIza")) {
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 3600);
        const gRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: ctrl.signal,
          body: JSON.stringify({
            system_instruction: { parts: [{ text: MASTER_OMNISCIENT_PROMPT + memoryDirective }] },
            contents: [
              ...history.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.text }] })),
              { role: "user", parts: [{ text: userMessage }] }
            ],
            generationConfig: { temperature: 0.44, maxOutputTokens: 340 }
          })
        });
        clearTimeout(t);
        if (gRes.ok) {
          const gJson = await gRes.json();
          const cand = gJson?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (cand && cand.length > 20 && !assistantPast.includes(cand)) replyText = cand;
        }
      } catch {}
    }

    if (!replyText) {
      try {
        const ctrl2 = new AbortController();
        const t2 = setTimeout(() => ctrl2.abort(), 4200);
        const cRes = await fetch("https://text.pollinations.ai/openai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: ctrl2.signal,
          body: JSON.stringify({
            model: "openai",
            temperature: 0.45,
            messages: [
              { role: "system", content: MASTER_OMNISCIENT_PROMPT + memoryDirective },
              ...history.map((m) => ({ role: m.role, content: m.text })),
              { role: "user", content: userMessage }
            ]
          })
        });
        clearTimeout(t2);
        if (cRes.ok) {
          const cJson = await cRes.json();
          const cand2 = cJson?.choices?.[0]?.message?.content?.trim();
          if (cand2 && cand2.length > 20 && !assistantPast.includes(cand2)) replyText = cand2;
        }
      } catch {}
    }

    if (!replyText) {
      replyText = buildOmniscientFallback(userMessage, history, state);
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
