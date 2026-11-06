import { NextResponse } from "next/server";
export const runtime = "edge";

const SYSTEM_PROMPT_MAESTRO = `Eres el Asistente Ejecutivo de Élite y Cerebro Central de Lhyo Group (https://www.lhyogroup.com), firma liderada por su CEO, Lhyonneth Araque.
1. PERSONALIDAD: Empático, fluido, sumamente agradable, culto y analítico. Habla siempre de "Usted" con tono consultivo (cero agresividad comercial).
2. MEMORIA (RAG 06 SOLUCIONES): (01) Asistentes Inteligentes 24/7 WhatsApp/IG, (02) Plataformas Web y Catálogos Interactivos, (03) Organización Automática de Clientes CRM, (04) Automatización Propia en n8n, (05) Agentes RAG con la memoria de la empresa, (06) Plataforma Empresarial Todo-en-Uno SaaS.
3. PIVOTE NATURAL OBLIGATORIO: Si el usuario pregunta algo ajeno a la empresa (finanzas globales, deportes, comida, clima, viajes), NUNCA digas "No puedo responder eso". Responde de forma natural y agradable sobre ese tema en 1 oración e inmediatamente conecta la idea haciendo un pivote hacia nuestras soluciones.
4. CAPACIDAD DE DEDUCCIÓN: Si el cliente dice "Tengo una clínica y pierdo tiempo" (o menciona cualquier dolor de su negocio), deduce al instante qué soluciones necesita (ej. Asistente 24/7 + CRM), explícalo de manera conversacional y guíalo a la auditoría.
5. DOSSIER CONFIDENCIAL Y PRECIOS: Nuestro Dossier Privado B2B ("El Arte de Escalar con Fluidez") es confidencial y se envía exclusivamente por correo al agendar la sesión consultiva de 15 minutos ([MOSTRAR_BOTON_AGENDA]).`;

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

const NATURAL_PIVOT_POOL = [
  "Es un punto muy interesante; de hecho, cuando analizamos cómo funcionan los sistemas más eficientes hoy en día, todo se resume en eliminar la fricción y ganar fluidez. Precisamente eso hacemos en Lhyo Group: instalamos Asistentes Inteligentes 24/7, automatización en n8n y Plataformas Todo-en-Uno para que su empresa escale con total serenidad. ¿A qué se dedica actualmente su organización? [MOSTRAR_BOTON_AGENDA]",
  "Qué agradable conversar sobre eso. Y conectando esa misma idea con el mundo de los negocios: los directivos que logran mayor calidad de vida son los que cuentan con sistemas propios que atienden clientes y organizan sus ventas en automático las 24 horas. ¿Qué área de su empresa siente que le consume más tiempo hoy? [MOSTRAR_BOTON_AGENDA]",
  "Me parece una excelente observación. Llevando ese mismo nivel de análisis a su empresa: el 78% de los clientes elige a la firma que le responde primero y con mayor claridad. Con nuestros Asistentes 24/7 (Solución 01) y nuestro CRM Automático (Solución 03), su negocio atiende en menos de 1 segundo día y noche. ¿En qué sector opera usted? [MOSTRAR_BOTON_AGENDA]",
  "Totalmente de acuerdo; en cualquier disciplina la clave del éxito está en contar con una estructura confiable detrás. En Lhyo Group diseñamos desde Plataformas Web de alto prestigio (Solución 02) hasta Agentes RAG entrenados con la memoria privada de su empresa (Solución 05). ¿Le gustaría conocer cómo lo aplicaríamos en su negocio? [MOSTRAR_BOTON_AGENDA]",
  "Hoy más que nunca el activo más valioso es el tiempo: por eso en Lhyo Group unificamos sus ventas, su agenda, su CRM y su atención al cliente en una sola Plataforma Empresarial Todo-en-Uno (Solución 06). Si agenda una breve sesión consultiva de 15 minutos, le enviaremos a su correo nuestro Dossier Confidencial B2B. ¿Qué proceso le gustaría optimizar primero? [MOSTRAR_BOTON_AGENDA]"
];

function consultativeBrain(message: string, history: any[]) {
  const clean = String(message || "").trim();
  const lower = clean.toLowerCase();

  // 1. DEDUCCIÓN CONSULTIVA: CLÍNICAS, CONSULTORIOS O PÉRDIDA DE TIEMPO
  if (/(clinica|clínica|odontol|dental|dentista|medic|médic|doctor|salud|paciente|consultorio|hospital|estetic|estétic)/i.test(lower)) {
    const p = pickStrictlyUnique([
      "Comprendo perfectamente la dinámica de su clínica: cuando el equipo dedica horas a responder las mismas consultas por WhatsApp o a coordinar turnos manualmente, se pierde un tiempo valioso que debería enfocarse en los pacientes.\n\nPor lo que me comenta, su clínica se beneficiaría de inmediato con dos soluciones conectadas: nuestro Asistente Inteligente 24/7 (Solución 01), que responde dudas de tratamientos y agenda citas solo a cualquier hora, y nuestro CRM Clínico Automático (Solución 03), que organiza cada paciente sin anotar nada a mano. ¿Le gustaría agendar una breve sesión de 15 minutos para mostrárselo y enviarle a su correo nuestro Dossier Confidencial B2B? [MOSTRAR_BOTON_AGENDA]",
      "En el sector salud la agilidad y la confianza lo son todo: si un paciente escribe a las 9:00 PM consultando por un tratamiento y recibe una respuesta cálida y precisa en menos de 1 segundo que deja su cita agendada, esa consulta no se pierde. Además, podemos entrenar un Agente RAG (Solución 05) con los protocolos y aranceles de su clínica. ¿Qué especialidad atienden principalmente? [MOSTRAR_BOTON_AGENDA]"
    ], history);
    if (p) return p;
  }

  if (/(pierdo tiempo|perdiendo tiempo|mucho tiempo|no me da tiempo|desorden|caos|no doy abasto|saturad|manual|lento)/i.test(lower)) {
    const p = pickStrictlyUnique([
      "Ese síntoma que menciona —sentir que la operación diaria le consume el tiempo— indica claramente que su negocio ya superó la etapa manual y necesita delegar en sistemas autónomos.\n\nEn Lhyo Group lo resolvemos instalando un Asistente Ejecutivo 24/7 (Solución 01) que filtra y agenda a sus clientes en automático, unido a un flujo propio en n8n (Solución 04) y un CRM (Solución 03) que registra todo sin intervención humana. ¿A qué se dedica su empresa para indicarle por cuál empezar? [MOSTRAR_BOTON_AGENDA]"
    ], history);
    if (p) return p;
  }

  // 2. PIVOTE NATURAL: FINANZAS GLOBALES / ECONOMÍA / MERCADOS
  if (/(finanzas|economia|economía|mercado|inflacion|inflación|bolsa|inversion|inversión|dolar|dólar|banco|rentabilidad)/i.test(lower)) {
    const p = pickStrictlyUnique([
      "Las finanzas globales actuales muestran una tendencia clara: los mercados premian a las empresas que operan con máxima eficiencia y estructuras ligeras.\n\nConectando ese principio con su propia organización, nuestra Automatización Total basada en n8n (Solución 04) reduce hasta en un 85% los costos operativos en suscripciones de software y elimina las fugas de capital por falta de seguimiento comercial. ¿Cómo están gestionando hoy la eficiencia operativa en su negocio? [MOSTRAR_BOTON_AGENDA]",
      "Analizar el panorama financiero siempre nos lleva a la misma conclusión: la mejor inversión es aquella que protege el flujo de caja de su propia empresa. Al integrar un CRM Automático (Solución 03) y Asistentes 24/7 (Solución 01), cada oportunidad comercial queda capturada y atendida en menos de 1 segundo. ¿En qué sector se desarrolla su actividad principal? [MOSTRAR_BOTON_AGENDA]"
    ], history);
    if (p) return p;
  }

  // 3. PIVOTE NATURAL: CUMPLEAÑOS / FAMILIA / COMIDA / DEPORTES / CLIMA / VIAJES
  if (/(cumpleaños|cumpleanos|cumple|papa|papá|mama|mamá|familia|regalo|fiesta|aniversario)/i.test(lower)) {
    const p = pickStrictlyUnique([
      "¡Muchas felicidades por esa fecha especial! Una cena especial o una experiencia compartida en familia siempre es un gran detalle.\n\nY pensando precisamente en disfrutar esos momentos con tranquilidad: la mayor ventaja de instalar nuestros Asistentes IA 24/7 (Solución 01) y sistemas autónomos es que su empresa sigue atendiendo clientes y agendando reuniones por usted mientras comparte con los suyos. ¿A qué se dedica su negocio? [MOSTRAR_BOTON_AGENDA]",
      "Las celebraciones familiares nos recuerdan que el verdadero propósito de dirigir una empresa es ganar calidad de vida y tiempo libre. En Lhyo Group construimos la infraestructura automática de su negocio (Web, WhatsApp 24/7 y CRM) para que funcione con fluidez sin depender de su presencia constante. ¿Qué tipo de empresa lidera usted? [MOSTRAR_BOTON_AGENDA]"
    ], history);
    if (p) return p;
  }

  if (/(almorzar|comer|comida|hambre|desayun|cenar|receta|cocina|plato|pizza|hamburguesa|pasta|cafe|café)/i.test(lower)) {
    const p = pickStrictlyUnique([
      "Para hoy siempre viene excelente un plato equilibrado, como una buena proteína a la plancha o una pasta artesanal que le recargue energías para el resto del día.\n\nY así como una buena comida mantiene su energía, contar con una arquitectura automática en su empresa mantiene el flujo de clientes activo las 24 horas incluso mientras usted hace una pausa para almorzar. ¿A qué se dedica actualmente su negocio? [MOSTRAR_BOTON_AGENDA]",
      "La alta gastronomía y la ingeniería de negocios comparten un secreto: cuando los procesos están bien organizados, el resultado es impecable. En Lhyo Group diseñamos Plataformas Web Interactivas (Solución 02) y Asistentes 24/7 (Solución 01) que atienden y agendan clientes al instante. ¿En qué rubro opera su empresa? [MOSTRAR_BOTON_AGENDA]"
    ], history);
    if (p) return p;
  }

  if (/(futbol|fútbol|manchester|madrid|barcelona|partido|gol|deporte|champions|messi|cristiano|clima|lluvia|viaje|vacaciones)/i.test(lower)) {
    const p = pickStrictlyUnique([
      "En el deporte de élite —igual que en cualquier gran jornada— la diferencia entre ganar o perder un encuentro está en la velocidad de reacción y la coordinación del equipo.\n\nLlevando esa misma sincronización a su empresa, en Lhyo Group conectamos su WhatsApp 24/7, su Plataforma Web y su CRM para que responda a cada cliente en menos de 1 segundo. ¿Qué área de su negocio le gustaría potenciar primero? [MOSTRAR_BOTON_AGENDA]"
    ], history);
    if (p) return p;
  }

  // 4. CONSULTAS SOBRE EL DOSSIER CONFIDENCIAL, PRECIOS O LAS 06 SOLUCIONES
  if (/(dossier|catalogo|catálogo|pdf|descargar|precio|precios|costo|cuanto cuesta|cuánto cuesta|tarifa|presupuesto|cotiza)/i.test(lower)) {
    const p = pickStrictlyUnique([
      "Nuestro Dossier Consultivo B2B (\"El Arte de Escalar con Fluidez\") es un documento confidencial y personalizado que incluye el detalle de nuestras 06 Soluciones Oficiales.\n\nPor protocolo de privacidad no está disponible para descarga pública; nuestro sistema lo genera y lo envía directamente a su correo electrónico en el instante en que usted agenda su breve sesión ejecutiva de 15 minutos en el botón dorado inferior. ¿Le gustaría reservar su horario ahora? [MOSTRAR_BOTON_AGENDA]",
      "Cada arquitectura en Lhyo Group se dimensiona a la medida exacta de su organización. Al confirmar su espacio de 15 minutos en nuestro calendario ejecutivo, recibirá de inmediato en su bandeja de correo nuestro Dossier Confidencial en PDF junto con el enlace a nuestra sala privada. Puede elegir el día y la hora tocando el botón aquí abajo. [MOSTRAR_BOTON_AGENDA]"
    ], history);
    if (p) return p;
  }

  if (/(que ofrecen|qué ofrecen|servicios|soluciones|que hacen|qué hacen|n8n|rag|saas|informacion|información)/i.test(lower)) {
    const p = pickStrictlyUnique([
      "En Lhyo Group acompañamos la expansión de su empresa a través de 06 Soluciones Oficiales:\n01 · Asistentes Inteligentes 24/7 para WhatsApp e Instagram.\n02 · Plataformas Web Modernas y Catálogos Interactivos.\n03 · Organización Automática de Clientes y Ventas (CRM).\n04 · Automatización Total de Procesos con Tecnología Propia (n8n).\n05 · Inteligencia Artificial Personalizada con la Memoria de su Empresa (Agentes RAG).\n06 · Su Propia Plataforma Empresarial Todo-en-Uno.\n\nCuénteme sobre su empresa: ¿en cuál de estas áreas siente hoy la mayor oportunidad de mejora? [MOSTRAR_BOTON_AGENDA]"
    ], history);
    if (p) return p;
  }

  if (/(hola|buenos|buenas|saludos|hey|que tal|qué tal)/i.test(lower)) {
    const p = pickStrictlyUnique([
      "¡Hola! Es un verdadero gusto darle la bienvenida a Lhyo Group. Estoy aquí para escuchar sobre su empresa, analizar qué procesos podemos optimizar juntos y guiarle paso a paso. ¿Con quién tengo el gusto y a qué se dedica su organización?"
    ], history);
    if (p) return p;
  }

  const uniquePivot = pickStrictlyUnique(NATURAL_PIVOT_POOL, history);
  if (uniquePivot) return uniquePivot;

  return "Ha sido un gusto analizar cada uno de estos puntos con usted. Para que pueda revisar con calma el alcance completo de nuestras 06 Soluciones y recibir en su correo nuestro Dossier Confidencial B2B (\"El Arte de Escalar con Fluidez\"), le invito a elegir su horario de 15 minutos en el botón dorado inferior. [MOSTRAR_BOTON_AGENDA]";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = String(body.message || "").trim();
    const history = Array.isArray(body.history) ? body.history : [];

    if (SEVERE_BLOCK_REGEX.test(message) || isGibberishOrFlood(message, history)) {
      return NextResponse.json({
        reply: "Protocolo de Seguridad Lhyo Group: Este canal ejecutivo está dedicado exclusivamente a consultoría tecnológica y sistemas empresariales. Esta sesión ha sido bloqueada.",
        blocked: true,
        showBooking: false
      });
    }

    const apiKey = process.env.GEMINI_API_KEY || "";
    if (apiKey && apiKey.startsWith("AIza")) {
      try {
        const contents = history.slice(-10).map((m: any) => ({
          role: m.sender === "user" ? "user" : "model",
          parts: [{ text: String(m.text || "") }]
        }));
        contents.push({ role: "user", parts: [{ text: message }] });
        const gRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: SYSTEM_PROMPT_MAESTRO }] },
              contents,
              generationConfig: { temperature: 0.35, maxOutputTokens: 380 }
            })
          }
        );
        if (gRes.ok) {
          const gData = await gRes.json();
          const rawReply = gData?.candidates?.[0]?.content?.parts?.[0]?.text || "";
          if (rawReply) {
            const showB = rawReply.includes("[MOSTRAR_BOTON_AGENDA]");
            const cleanR = rawReply.replace(/\[MOSTRAR_BOTON_AGENDA\]/g, "").trim();
            return NextResponse.json({ reply: cleanR, blocked: false, showBooking: showB });
          }
        }
      } catch {}
    }

    const aiReply = consultativeBrain(message, history);
    const showBooking = aiReply.includes("[MOSTRAR_BOTON_AGENDA]");
    const cleanReply = aiReply.replace(/\[MOSTRAR_BOTON_AGENDA\]/g, "").trim();
    return NextResponse.json({ reply: cleanReply, blocked: false, showBooking });
  } catch {
    return NextResponse.json({
      reply: "Es un gusto atenderle en Lhyo Group. Cuénteme sobre su empresa y qué proceso le gustaría optimizar o automatizar.",
      blocked: false,
      showBooking: true
    });
  }
}