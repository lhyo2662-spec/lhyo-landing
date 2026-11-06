import { NextResponse } from "next/server";

export const runtime = "edge";

interface LeadState {
  lead_name?: string;
  company_name?: string;
  pain_point?: string;
  revenue_tier?: string;
  turn_count?: number;
}

interface ChatRequestBody {
  message?: string;
  history?: string;
  currentLead?: LeadState;
}

const STRICT_SAFETY_PATTERNS = [
  /\b(matar|asesinar|homicid\w*|suicid\w*|sicari\w*|bomba|explosiv\w*|terroris\w*|arma\s+de\s+fuego|pistola|fusil|violaci\w*|violar|pedofil\w*|abuso\s+sexual|pornograf\w*|porno|prostituci\w*|narcotrafic\w*|coca[ií]na|hero[ií]na|fentanil\w*|metanfetamina|hackear|clonar\s+tarjeta|estafar|secuestrar|extorsion\w*|lavado\s+de\s+dinero)\b/i,
  /\b(maldit\w+|mierda|imb[eé]cil|est[uú]pid\w+|idiota|pendej\w+|hijo\s+de\s+puta|puto|puta|cabron|cabr[oó]n|maric[oó]n|mamaguevo|co[ñn]o\s+de\s+tu\s+madre|vete\s+a\s+la\s+mierda|chupalo|ch[uú]palo)\b/i
];

function isGibberishOrSpam(text: string): boolean {
  const clean = (text || "").trim();
  if (clean.length >= 5 && /^(.)\1{4,}$/i.test(clean.replace(/\s+/g, ""))) return true;
  if (clean.length >= 6 && !/[aeiouáéíóú]/i.test(clean) && /^[a-z]+$/i.test(clean)) return true;
  return false;
}

function runMultiTurnFastEngine(userText: string, currentLead: LeadState) {
  const clean = (userText || "").trim();
  const lower = clean.toLowerCase();
  const turnCount = (currentLead?.turn_count || 0) + 1;

  if (STRICT_SAFETY_PATTERNS.some((rx) => rx.test(clean)) || isGibberishOrSpam(clean)) {
    return {
      reply:
        "⛔ PROTOCOLO DE SEGURIDAD ACTIVADO: Su mensaje infringe las políticas de uso e integridad de la infraestructura cognitiva de Lhyo Group. Esta sesión ha sido bloqueada permanentemente (escritura y micrófono deshabilitados).",
      lead_name: currentLead?.lead_name || "PENDIENTE",
      company_name: currentLead?.company_name || "PENDIENTE",
      pain_point: currentLead?.pain_point || "PENDIENTE",
      revenue_tier: "SPAM",
      turn_count: turnCount,
      ready_for_crm: false,
      blocked: true
    };
  }

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
  if (nameMatch && nameMatch[1]) nextState.lead_name = nameMatch[1].trim();

  const compMatch = clean.match(
    /(?:mi empresa es|mi empresa se llama|negocio de|tengo una?|tenemos una?|trabajo en)\s+([A-ZÁÉÍÓÚÑa-záéíóúñ0-9\s]{2,35})/i
  );
  if (compMatch && compMatch[1]) nextState.company_name = compMatch[1].trim();

  // Saludos conversacionales naturales
  if (
    /^(hola|buenas|buenos\s+d[ií]as|buenas\s+tardes|buenas\s+noches|saludos|hey|holaa+)(\s+c[oó]mo\s+est[aá]s|\s+que\s+tal|\s+todo\s+bien|\s*\?)*$/i.test(
      clean
    ) ||
    lower.includes("como estas") ||
    lower.includes("cómo estás") ||
    lower.includes("que tal estas")
  ) {
    return {
      ...nextState,
      ready_for_crm: false,
      blocked: false,
      reply:
        "¡Muy bien, muchas gracias por preguntar! Es un verdadero gusto saludarle desde Lhyo Group.\n\nEstoy aquí en vivo para resolver cualquier duda sobre nuestras 06 Soluciones (Asistentes IA 24/7 para WhatsApp e Instagram, Plataformas Web de alto prestigio, CRM Automático y Sistemas Todo-en-Uno). ¿Con quién tengo el gusto y a qué se dedica su negocio o proyecto?"
    };
  }

  // Preguntas meta o confusión ("Que te pasa", "Eres un robot?", etc.)
  if (
    lower.includes("que te pasa") ||
    lower.includes("qué te pasa") ||
    lower.includes("por que dices eso") ||
    lower.includes("no me entiendes") ||
    lower.includes("eres un robot") ||
    lower.includes("eres una ia") ||
    lower.includes("hablar con un humano")
  ) {
    return {
      ...nextState,
      ready_for_crm: false,
      blocked: false,
      reply:
        "Le pido disculpas si mi respuesta anterior no fue lo suficientemente directa. Soy el Asistente Ejecutivo de Inteligencia Artificial de Lhyo Group y le leo con total atención.\n\nDígame con total confianza: ¿qué duda específica tiene o qué le gustaría mejorar hoy en su empresa para darle una respuesta exacta al instante?"
    };
  }

  // Consultas de precios
  if (
    lower.includes("precio") ||
    lower.includes("cuanto cuesta") ||
    lower.includes("cuánto cuesta") ||
    lower.includes("costo") ||
    lower.includes("tarifa") ||
    lower.includes("valor") ||
    lower.includes("presupuesto")
  ) {
    return {
      ...nextState,
      ready_for_crm: false,
      blocked: false,
      reply:
        "En Lhyo Group adaptamos el presupuesto exactamente al tamaño y etapa de cada negocio (contamos tanto con planes de crecimiento para negocios en etapa inicial como con arquitecturas completas llave en mano para empresas consolidadas).\n\nAdemás, al desarrollar tecnología propia para su empresa, usted evita pagar mensualidades infladas por volumen. ¿Cuál es su nombre y qué solución le interesa cotizar?"
    };
  }

  // Consultas sobre qué ofrece Lhyo Group
  if (
    lower.includes("que hacen") ||
    lower.includes("qué hacen") ||
    lower.includes("que ofrecen") ||
    lower.includes("qué ofrecen") ||
    lower.includes("servicios") ||
    lower.includes("soluciones")
  ) {
    return {
      ...nextState,
      ready_for_crm: false,
      blocked: false,
      reply:
        "En Lhyo Group instalamos el ecosistema completo para que su empresa venda y opere en automático:\n\n• 01. Asistentes Inteligentes 24/7 en WhatsApp e Instagram\n• 02. Plataformas Web Modernas y Catálogos Interactivos\n• 03. Organización Automática de Clientes y Ventas (CRM)\n• 04. Automatización Total con Tecnología Propia\n• 05. IA Personalizada con la Memoria de su Empresa\n• 06. Su Propia Plataforma Empresarial Todo-en-Uno\n\n¿Cuál de estas 06 áreas le gustaría implementar primero en su negocio?"
    };
  }

  // Respuesta de facturación ($5,000 USD)
  if (
    nextState.lead_name !== "PENDIENTE" &&
    nextState.revenue_tier === "PENDIENTE" &&
    (lower.includes("supera") ||
      lower.includes("mas de 5") ||
      lower.includes("más de 5") ||
      lower.includes("menos de 5") ||
      lower.includes("etapa inicial") ||
      lower.includes("empezando") ||
      lower === "si" ||
      lower === "sí" ||
      lower === "no" ||
      /\b(1000|2000|3000|4000|5000|6000|8000|10000|15000|20000)\b/.test(lower))
  ) {
    const isHigh =
      lower.includes("supera") ||
      lower.includes("mas") ||
      lower.includes("más") ||
      lower === "si" ||
      lower === "sí" ||
      /\b(5000|6000|8000|10000|15000|20000)\b/.test(lower);
    nextState.revenue_tier = isHigh ? "HIGH_TICKET" : "LOW_TICKET";
    return {
      ...nextState,
      ready_for_crm: true,
      blocked: false,
      reply: `Excelente, ${nextState.lead_name}. He registrado formalmente su perfil en el sistema central de Lhyo Group.\n\nToque el botón dorado de abajo para elegir el día y la hora de su preferencia en nuestra Agenda Ejecutiva y descargar de inmediato nuestro Catálogo Privado PDF con las 06 Soluciones.`
    };
  }

  // Puentes inteligentes para cualquier tema externo (Comida, Deportes, Clima, Autos, Salud, etc.)
  const offTopicBridges = [
    {
      rx: /\b(comida|restaurante|hamburguesa|pizza|cocina|receta|almuerzo|cena|cafe|caf[eé]|panader[ií]a|pastel)\b/i,
      bridge:
        "El sector gastronómico demuestra una regla de oro: cuando un cliente desea hacer un pedido, compra en el negocio que le responde en 1 segundo y le muestra un catálogo interactivo impecable."
    },
    {
      rx: /\b(futbol|f[uú]tbol|manchester|madrid|barcelona|messi|cristiano|deporte|partido|gol|tenis|gym|gimnasio)\b/i,
      bridge:
        "En el deporte de élite, igual que en los negocios actuales, la diferencia entre ganar o perder está en la velocidad de reacción y la estructura del equipo."
    },
    {
      rx: /\b(clima|lluvia|sol|fr[ií]o|calor|tiempo|temperatura|nube)\b/i,
      bridge:
        "Aunque el clima cambie todos los días, la atención y las ventas de su empresa nunca deberían detenerse fuera del horario de oficina."
    },
    {
      rx: /\b(carro|auto|veh[ií]culo|moto|concesionario|repuesto|mec[aá]nico|transporte)\b/i,
      bridge:
        "Un vehículo de alto nivel necesita un motor preciso; de igual forma, una empresa moderna necesita un motor digital que atienda y convierta clientes las 24 horas."
    },
    {
      rx: /\b(m[eé]dico|cl[ií]nica|salud|odont[oó]logo|doctor|hospital|farmacia|est[eé]tica|belleza)\b/i,
      bridge:
        "En el sector de salud y estética, la confianza visual y la facilidad para agendar citas sin esperas hacen que un paciente elija su centro por encima de la competencia."
    }
  ];

  for (const item of offTopicBridges) {
    if (item.rx.test(clean)) {
      if (nextState.pain_point === "PENDIENTE") nextState.pain_point = clean.slice(0, 80);
      return {
        ...nextState,
        ready_for_crm: false,
        blocked: false,
        reply: `${item.bridge}\n\nPrecisamente en Lhyo Group creamos Plataformas Web con Catálogos Interactivos y Asistentes Inteligentes 24/7 para WhatsApp e Instagram que atienden y agendan ventas en automático. ¿Cómo se llama usted y qué tipo de negocio dirige o desea impulsar?`
      };
    }
  }

  if (nextState.pain_point === "PENDIENTE" && clean.length > 4) {
    nextState.pain_point = clean.slice(0, 90);
  }

  if (nextState.lead_name !== "PENDIENTE" && nextState.revenue_tier === "PENDIENTE") {
    return {
      ...nextState,
      ready_for_crm: false,
      blocked: false,
      reply: `Gracias por comentármelo, ${nextState.lead_name}. En Lhyo Group podemos automatizar y escalar ese proceso integrando nuestras Plataformas Web de alto prestigio con Asistentes Inteligentes 24/7 en WhatsApp e Instagram.\n\nPara asignarle el plan ideal a la medida de su negocio: ¿actualmente los ingresos mensuales de su empresa superan los $5,000 USD o se encuentran en una etapa inicial/menor a ese rango?`
    };
  }

  const dynamicBridges = [
    `Analizando lo que me comenta ("${clean.slice(0, 45)}"), en Lhyo Group transformamos cualquier meta operativa en un sistema que genera clientes en automático mediante nuestras 06 Soluciones (Páginas Web de lujo, Asistentes IA 24/7 para WhatsApp/Instagram y Sistemas Todo-en-Uno).\n\nPara orientarle de forma personalizada: ¿cuál es su nombre y a qué se dedica su empresa o proyecto?`,
    `Excelente punto. En Lhyo Group nos especializamos en que cada área de su negocio funcione con precisión automática las 24 horas, desde la captación del cliente en su Web hasta el cierre de la cita en WhatsApp e Instagram.\n\nCuénteme: ¿con quién tengo el gusto y qué es lo primero que le gustaría automatizar o mejorar en su negocio?`,
    `Todo hoy en día se conecta con la velocidad de respuesta y el prestigio digital. Con la infraestructura de Lhyo Group (Asistentes IA 24/7, CRM Automático y Plataformas Web ultrarrápidas), su empresa multiplica sus resultados sin trabajo manual.\n\n¿Me indica su nombre y el rubro de su negocio para mostrarle cómo aplicarlo en su caso?`
  ];

  return {
    ...nextState,
    ready_for_crm: false,
    blocked: false,
    reply: dynamicBridges[turnCount % dynamicBridges.length]
  };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ChatRequestBody;
    const userMessage = (body.message || "").trim();
    const currentLead: LeadState = {
      lead_name: body.currentLead?.lead_name || "PENDIENTE",
      company_name: body.currentLead?.company_name || "PENDIENTE",
      pain_point: body.currentLead?.pain_point || "PENDIENTE",
      revenue_tier: body.currentLead?.revenue_tier || "PENDIENTE",
      turn_count: body.currentLead?.turn_count || 0
    };

    // Respuesta ultrarrápida (<100ms) con puente contextual inteligente
    const resultData = runMultiTurnFastEngine(userMessage, currentLead);

    if (
      resultData.ready_for_crm &&
      (resultData.revenue_tier === "HIGH_TICKET" || resultData.revenue_tier === "LOW_TICKET")
    ) {
      const nowVe = new Date().toLocaleString("es-VE", { timeZone: "America/Caracas" });
      await fetch("https://hook.us2.make.com/krs48cjfzudf4lau3sapwdgdu9lfe1tb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fecha_registro: nowVe,
          horario_cita: "Calificado por Asistente IA Web",
          nombre_cliente: resultData.lead_name,
          email_cliente: "Captado en Chat IA Lhyo Group",
          empresa_web: resultData.company_name,
          facturacion_usd: resultData.revenue_tier,
          clasificacion: resultData.revenue_tier,
          servicio_elegido: `ASISTENTE IA (${resultData.revenue_tier})`,
          objetivo_cliente: resultData.pain_point,
          resumen_crm: `ETIQUETA OCULTA: ${resultData.revenue_tier} || Empresa: ${resultData.company_name} || Necesidad: ${resultData.pain_point}`,
          link_videollamada_meet: "https://meet.google.com/krc-vdii-zzh"
        })
      }).catch(() => {});
    }

    return NextResponse.json(resultData);
  } catch {
    return NextResponse.json({
      reply: "Es un gusto atenderle en Lhyo Group. ¿Con quién tengo el gusto y qué área de su negocio desea impulsar hoy?",
      ready_for_crm: false,
      blocked: false
    });
  }
}
