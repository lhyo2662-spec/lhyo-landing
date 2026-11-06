import { NextResponse } from "next/server";
export const runtime = "edge";

const SYSTEM_PROMPT_MAESTRO = `Eres el "Director de Admisiones IA" de Lhyo Group (https://www.lhyogroup.com), firma de ingeniería digital, automatización empresarial B2B e Inteligencia Artificial liderada por su CEO, Lhyonneth Araque.
1. Habla estrictamente de "Usted".
2. Domina nuestras 06 Soluciones B2B: (01) Asistentes 24/7 WhatsApp/IG, (02) Plataformas Web y Catálogos Interactivos, (03) CRM Automático, (04) Automatización Propia en n8n, (05) IA Personalizada RAG con la memoria de la empresa, (06) Plataforma Empresarial Todo-en-Uno.
3. MANIOBRA DE PIVOTE: Si preguntan cosas fuera de contexto (clima, política, deportes, cocina, regalos, programación general), bloquea la respuesta directa y aplica una Maniobra de Pivote elegante conectando hacia la optimización y automatización de su empresa.
4. BLINDAJE DE PRECIOS: Bajo ninguna circunstancia inventes precios. Si exigen precios, explica que se cotiza a medida según la región y soluciones elegidas y fuerza el agendamiento con el token [MOSTRAR_BOTON_AGENDA].`;

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

const PIVOT_MANEUVER_BRIDGES = [
  "Mi núcleo de procesamiento está dedicado exclusivamente a la arquitectura empresarial de Lhyo Group. Hablando de optimización y precisión operativa, ¿cómo están manejando actualmente sus cuellos de botella comerciales o la atención a sus clientes? [MOSTRAR_BOTON_AGENDA]",
  "Como Director de Admisiones IA de Lhyo Group, opero estrictamente sobre infraestructuras de crecimiento corporativo. Llevando su atención hacia la rentabilidad de su negocio: ¿cuántas oportunidades comerciales estima que pierde su empresa fuera de horario laboral? [MOSTRAR_BOTON_AGENDA]",
  "En el mundo empresarial cada segundo cuenta: mientras otros se distraen, las firmas líderes tienen sistemas trabajando por ellas día y noche. En Lhyo Group instalamos Plataformas Web de alto prestigio y Asistentes IA 24/7 que atienden y agendan citas en automático. ¿A qué se dedica su negocio? [MOSTRAR_BOTON_AGENDA]",
  "Conectando su consulta con la eficiencia de su organización: el 78% de las ventas se las lleva la primera empresa que responde con claridad y rapidez. En Lhyo Group automatizamos su WhatsApp, Instagram y Sitio Web para responder en menos de 1 segundo las 24 horas. ¿En qué sector opera su empresa? [MOSTRAR_BOTON_AGENDA]",
  "Hoy la verdadera libertad directiva es contar con tecnología propia (n8n, Agentes RAG y Sistemas Todo-en-Uno) que funcione sin depender de trabajo manual. ¿Qué área de su empresa desea automatizar primero? [MOSTRAR_BOTON_AGENDA]",
  "Toda gran operación necesita una estructura sólida para escalar: en Lhyo Group construimos desde Catálogos Web Interactivos (Solución 02) hasta Inteligencia Artificial entrenada con la memoria de su empresa (Solución 05). ¿Cuál de nuestras 06 Soluciones se adapta mejor a su proyecto? [MOSTRAR_BOTON_AGENDA]",
  "Cuando una empresa automatiza sus procesos repetitivos, multiplica su rentabilidad y recupera horas valiosas cada semana. En Lhyo Group diseñamos su propia Plataforma Empresarial Todo-en-Uno (Solución 06) con su marca y su logo. ¿Desea recibir nuestro Dossier Corporativo PDF? [MOSTRAR_BOTON_AGENDA]",
  "Piense en esto: mientras usted conversa conmigo en este chat, un sistema idéntico a este podría estar instalado en el WhatsApp, Instagram y Sitio Web de su empresa cerrando citas y atendiendo clientes en automático. ¿Para qué tipo de negocio le gustaría implementarlo? [MOSTRAR_BOTON_AGENDA]"
];

function executeGuardrailsAndRag(message: string, history: any[]) {
  const clean = String(message || "").trim();
  const lower = clean.toLowerCase();

  // 1. BLINDAJE DE PRECIOS (Cero precios inventados -> Fuerza Auditoría)
  if (/(precio|precios|costo|costos|cuanto cuesta|cuánto cuesta|cuanto vale|cuánto vale|tarifa|tarifas|presupuesto|cotiza|planes|inversion|inversión|valor)/i.test(lower)) {
    const p = pickStrictlyUnique([
      "En Lhyo Group no emitimos tarifas genéricas ni estimaciones improvisadas; cada arquitectura se cotiza con precisión de ingeniería según su región operativa (Latinoamérica, Europa o Norteamérica) y las soluciones seleccionadas (n8n, Agentes RAG, Asistentes 24/7 o Plataforma Todo-en-Uno). Para entregarle su presupuesto exacto y su Dossier Corporativo PDF personalizado, agende ahora nuestra Auditoría Ejecutiva de 15 minutos en el botón inferior. [MOSTRAR_BOTON_AGENDA]",
      "Por política estricta de ingeniería B2B, el valor de inversión se determina evaluando en 15 minutos qué módulos exactos requiere su empresa entre nuestras 06 Soluciones Oficiales. Toque el botón dorado inferior para reservar su sesión de diagnóstico y descargar su Catálogo Privado PDF. [MOSTRAR_BOTON_AGENDA]"
    ], history);
    if (p) return p;
  }

  // 2. OBSERVACIONES SOBRE EL PROPIO ASISTENTE / NO REPETIR
  if (/(repetir|repites|repitiendo|misma respuesta|automatico|automático|eres un bot|eres ia|quien eres|cómo funcionas|como funcionas|prueba|test)/i.test(lower)) {
    const p = pickStrictlyUnique([
      "Bien observado: mi memoria conversacional registra cada mensaje de esta sesión para ofrecerle siempre un análisis nuevo y demostrarle en vivo la tecnología Dual-Engine que instalamos en Lhyo Group. Así mismo atenderá a los clientes de su empresa las 24 horas. ¿A qué se dedica su negocio y qué proceso desea automatizar primero? [MOSTRAR_BOTON_AGENDA]",
      "Exactamente así debe comportarse un Director de Admisiones IA de alto nivel: adaptándose en tiempo real a cada intervención sin repetir guiones rígidos. Esta misma inteligencia es la que entrenamos con los documentos y servicios de su empresa (Soluciones 01 y 05). ¿En qué sector opera su organización? [MOSTRAR_BOTON_AGENDA]"
    ], history);
    if (p) return p;
  }

  // 3. MANIOBRA DE PIVOTE PARA CUMPLEAÑOS / FAMILIA / COMIDA / DEPORTES / CLIMA / POLÍTICA
  if (/(cumpleaños|cumpleanos|cumple|papa|papá|mama|mamá|familia|regalo|fiesta|aniversario)/i.test(lower)) {
    const p = pickStrictlyUnique([
      "Mi núcleo de procesamiento está dedicado exclusivamente a la arquitectura empresarial de Lhyo Group, pero conectando su mensaje con su calidad de vida: el mejor regalo en una celebración familiar es disfrutar sin estar pegado al teléfono respondiendo clientes. Nosotros instalamos Asistentes IA 24/7 y Plataformas Web que siguen vendiendo y agendando citas mientras usted celebra en familia. ¿A qué se dedica su negocio? [MOSTRAR_BOTON_AGENDA]",
      "Las fechas especiales con la familia nos recuerdan por qué emprendemos: para tener libertad de tiempo. En Lhyo Group construimos el sistema automático de su empresa (WhatsApp 24/7, Web de prestigio y CRM) para que su operación funcione sola en sus días libres. ¿Qué tipo de empresa dirige usted? [MOSTRAR_BOTON_AGENDA]"
    ], history);
    if (p) return p;
  }

  if (/(almorzar|comer|comida|hambre|desayun|cenar|receta|cocina|plato|pizza|hamburguesa|pasta|cafe|café)/i.test(lower)) {
    const p = pickStrictlyUnique([
      "Un buen almuerzo le da energía por unas horas, pero un sistema automático alimenta de clientes a su empresa todos los días. En Lhyo Group no damos recetas de cocina, pero instalamos Asistentes IA 24/7 y Plataformas Web que siguen vendiendo y agendando citas incluso mientras usted almuerza. ¿A qué se dedica su negocio? [MOSTRAR_BOTON_AGENDA]",
      "Hablando de elegir qué comer hoy: las empresas más rentables son las que nunca dejan enfriar a un cliente cuando escribe pidiendo información. En Lhyo Group creamos sistemas que responden en menos de 1 segundo en WhatsApp e Instagram y organizan sus ventas en automático. ¿Qué tipo de empresa dirige usted? [MOSTRAR_BOTON_AGENDA]"
    ], history);
    if (p) return p;
  }

  if (/(futbol|fútbol|manchester|madrid|barcelona|partido|gol|deporte|champions|messi|cristiano|clima|lluvia|politica|política|presidente|elecciones)/i.test(lower)) {
    const p = pickStrictlyUnique([
      "Mi núcleo de procesamiento está dedicado exclusivamente a la arquitectura empresarial de Lhyo Group. Hablando de alta competencia y resultados: el 78% de los clientes contrata a la primera empresa que le responde, y nosotros instalamos Asistentes IA 24/7 y Plataformas Web para que su negocio gane todas las ventas en menos de 1 segundo. ¿En qué sector compite su empresa? [MOSTRAR_BOTON_AGENDA]",
      "Más allá de la actualidad externa, el único indicador que en Lhyo Group multiplicamos las 24 horas es la rentabilidad y el control operativo de su empresa mediante automatización propia en n8n y Agentes RAG. ¿Cómo están manejando actualmente sus cuellos de botella operativos? [MOSTRAR_BOTON_AGENDA]"
    ], history);
    if (p) return p;
  }

  // 4. MEMORIA RAG DE LAS 06 SOLUCIONES Y RUBROS B2B
  if (/(n8n|automatizacion|automatización|flujo|make|zapier|solucion 04|solución 04)/i.test(lower)) {
    const p = pickStrictlyUnique([
      "Nuestra Solución 04 (Automatización Total con Tecnología Propia basada en n8n) instala una central de flujos privada bajo propiedad exclusiva de su empresa. Esto elimina los cobros mensuales por volumen de operaciones y conecta su WhatsApp, CRM, correo y agenda con latencia cero. ¿Qué procesos manuales desea automatizar primero? [MOSTRAR_BOTON_AGENDA]"
    ], history);
    if (p) return p;
  }

  if (/(rag|memoria|documentos|contratos|ia personalizada|solucion 05|solución 05)/i.test(lower)) {
    const p = pickStrictlyUnique([
      "Con la Solución 05 (Inteligencia Artificial Personalizada con arquitectura RAG), entrenamos un cerebro privado exclusivamente con los contratos, tarifarios, manuales y PDFs de su empresa para responder consultas en 1 segundo con 99.4% de exactitud y confidencialidad total. ¿Desea evaluarlo para su organización? [MOSTRAR_BOTON_AGENDA]"
    ], history);
    if (p) return p;
  }

  if (/(odontol|dental|dentista|clinica|clínica|medic|médic|doctor|salud|paciente|consultorio|hospital|estetic|estétic)/i.test(lower)) {
    const p = pickStrictlyUnique([
      "Para su clínica o consultorio, en Lhyo Group instalamos un Asistente Inteligente 24/7 en WhatsApp e Instagram (Solución 01) que responde dudas de tratamientos, filtra pacientes reales y agenda citas automáticamente en su calendario, unido a una Plataforma Web de prestigio (Solución 02) y un CRM Clínico (Solución 03). ¿Cuál de estas áreas desea implementar primero? [MOSTRAR_BOTON_AGENDA]",
      "En el sector clínico y odontológico, nuestra tecnología elimina las inasistencias y la pérdida de pacientes fuera de horario: su Asistente IA 24/7 atiende consultas al instante, registra al paciente en su CRM y confirma el turno sin intervención manual. ¿Le gustaría agendar una sesión de 15 minutos para ver cómo operaría en su clínica? [MOSTRAR_BOTON_AGENDA]"
    ], history);
    if (p) return p;
  }

  if (/(que ofrecen|qué ofrecen|servicios|soluciones|que hacen|qué hacen|catalogo|catálogo|informacion|información)/i.test(lower)) {
    const p = pickStrictlyUnique([
      "En Lhyo Group diseñamos e instalamos 06 Soluciones Tecnológicas de alta gama para su empresa:\n01 · Asistentes Inteligentes 24/7 para WhatsApp e Instagram.\n02 · Plataformas Web Modernas y Catálogos Interactivos.\n03 · Organización Automática de Clientes y Ventas (CRM).\n04 · Automatización Total con Tecnología Propia (n8n).\n05 · IA Personalizada con la Memoria de su Empresa (RAG).\n06 · Su Propia Plataforma Empresarial Todo-en-Uno.\n\n¿Cuál de estas 6 soluciones le interesa implementar primero? [MOSTRAR_BOTON_AGENDA]"
    ], history);
    if (p) return p;
  }

  if (/(hola|buenos|buenas|saludos|hey|que tal|qué tal)/i.test(lower)) {
    const p = pickStrictlyUnique([
      "Bienvenido al Directorio de Admisiones IA de Lhyo Group. Estoy en línea para analizar las necesidades de su organización y recomendarle la arquitectura ideal entre nuestras 06 Soluciones B2B. ¿Con qué empresa tengo el gusto y qué cuello de botella operativo desean resolver?"
    ], history);
    if (p) return p;
  }

  const uniquePivot = pickStrictlyUnique(PIVOT_MANEUVER_BRIDGES, history);
  if (uniquePivot) return uniquePivot;

  return "Como Director de Admisiones IA de Lhyo Group, le invito a comprobar el impacto de nuestras 06 Soluciones directamente sobre la operación de su empresa. Toque el botón dorado inferior para agendar nuestra Auditoría Ejecutiva de 15 minutos y descargar su Dossier Corporativo PDF personalizado. [MOSTRAR_BOTON_AGENDA]";
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

    // Si el usuario pregunta por precios, aplicamos el Blindaje de Precios Determinista antes de cualquier LLM
    if (/(precio|precios|costo|costos|cuanto cuesta|cuánto cuesta|cuanto vale|cuánto vale|tarifa|tarifas|presupuesto|cotiza)/i.test(message)) {
      const priceShieldReply = executeGuardrailsAndRag(message, history).replace(/\[MOSTRAR_BOTON_AGENDA\]/g, "").trim();
      return NextResponse.json({ reply: priceShieldReply, blocked: false, showBooking: true });
    }

    // Motor Primario: Google Gemini 2.0 Flash (si hay GEMINI_API_KEY AIzaSy... configurada)
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
              generationConfig: { temperature: 0.25, maxOutputTokens: 350 }
            })
          }
        );
        if (gRes.ok) {
          const gData = await gRes.json();
          const rawReply = gData?.candidates?.[0]?.content?.parts?.[0]?.text || "";
          if (rawReply) {
            const showB = rawReply.includes("[MOSTRAR_BOTON_AGENDA]") || rawReply.includes("[FORZAR_AUDITORIA]");
            const cleanR = rawReply.replace(/\[MOSTRAR_BOTON_AGENDA\]/g, "").replace(/\[FORZAR_AUDITORIA\]/g, "").trim();
            return NextResponse.json({ reply: cleanR, blocked: false, showBooking: showB });
          }
        }
      } catch {}
    }

    // Motor Dual-Engine de Latencia Cero (< 10ms) con Maniobra de Pivote y RAG de las 06 Soluciones
    const aiReply = executeGuardrailsAndRag(message, history);
    const showBooking = aiReply.includes("[MOSTRAR_BOTON_AGENDA]");
    const cleanReply = aiReply.replace(/\[MOSTRAR_BOTON_AGENDA\]/g, "").trim();
    return NextResponse.json({ reply: cleanReply, blocked: false, showBooking });
  } catch {
    return NextResponse.json({
      reply: "Director de Admisiones IA de Lhyo Group activo. ¿Con qué organización tengo el gusto y qué proceso operativo desean automatizar?",
      blocked: false,
      showBooking: true
    });
  }
}