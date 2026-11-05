import { NextResponse } from "next/server";
export const runtime = "edge";

const SYSTEM_PROMPT = `Eres el Asistente Ejecutivo de Inteligencia Artificial de Lhyo Group (https://www.lhyogroup.com), firma liderada por su CEO, Lhyonneth Araque.
REGLAS DE RAZONAMIENTO MULTI-TURNO:
1. Habla siempre de "Usted". Analiza cada mensaje del usuario (1ro, 2do, 3ro, 10mo) manteniendo el hilo completo de la conversacion.
2. NUNCA repitas respuestas genericas. Si pregunta que almorzar, de futbol o cualquier curiosidad, responde con ingenio y cortesia a eso mismo en 1 parrafo breve y luego vincula con elegancia hacia Lhyo Group.
3. Si menciona su rubro (ej. clinica odontologica, restaurante, inmobiliaria, tienda, servicios), explica especificamente como le ayudan nuestras 06 Soluciones:
   01. Asistentes Inteligentes para WhatsApp e Instagram (24/7)
   02. Plataformas Web Modernas y Catalogos Interactivos
   03. Organizacion Automatica de Clientes y Ventas (CRM)
   04. Automatizacion Total de Procesos con Tecnologia Propia
   05. Inteligencia Artificial Personalizada con la Memoria de su Empresa
   06. Su Propia Plataforma Empresarial Todo-en-Uno
4. Cuando pregunte precios o como agendar, invitalo a reservar su sesion ejecutiva de 15 minutos e incluye [MOSTRAR_BOTON_AGENDA].`;

const SEVERE_BLOCK_REGEX = /(matar|asesinar|suicid|bomba|terroris|sicario|violacion|pedofil|hackear\s+banco|clonar\s+tarjeta|mierda|malparid|hijueputa)/i;

function contextualBrain(message: string, history: any[]) {
  const clean = String(message || "").trim();
  const lower = clean.toLowerCase();
  const turn = history.filter((m) => m.sender === "user").length + 1;
  if (/(almorzar|comer|comida|hambre|desayun|cenar|menu|menú)/i.test(lower)) {
    if (/(vendo|negocio|restaurante|local|pedidos)/i.test(lower)) {
      return "Para un negocio gastronómico, en Lhyo Group implementamos Catálogos Web Interactivos (Solución 02) y Asistentes Inteligentes 24/7 en WhatsApp (Solución 01) que muestran el menú, toman el pedido y lo registran en automático. ¿Actualmente toman pedidos por WhatsApp?";
    }
    return turn === 1
      ? "¡Excelente pregunta! Para continuar el día con buena energía, una proteína al grill con ensalada fresca o una buena pasta siempre es una gran elección.\n\nY cuando guste, si tiene una empresa o negocio que desee automatizar o potenciar con una plataforma web de lujo, cuénteme a qué se dedica y le asesoro de inmediato."
      : "Si busca otra opción deliciosa para comer hoy: un salmón a la plancha o un buen corte al grill nunca falla.\n\nPor cierto, si tiene un negocio o consultorio propio, cuénteme de qué trata para indicarle qué sistema de Lhyo Group le daría mejores resultados.";
  }
  if (/(odontol|dental|dentista|clinica|clínica|medic|médic|doctor|salud|paciente|consultorio)/i.test(lower)) {
    return "Para una clínica odontológica, en Lhyo Group instalamos 3 soluciones clave:\n\n1. Asistente Inteligente 24/7 en WhatsApp e Instagram (Solución 01): responde dudas de tratamientos (ortodoncia, implantes, estética dental), filtra pacientes y agenda citas en su calendario día y noche.\n2. Plataforma Web de Prestigio Clínico (Solución 02): transmite autoridad inmediata a cada paciente.\n3. CRM Clínico Automático (Solución 03): registra pacientes y automatiza recordatorios para evitar inasistencias.\n\n¿Cuál de estas 3 áreas le gustaría impulsar primero en su clínica? [MOSTRAR_BOTON_AGENDA]";
  }
  if (/(futbol|fútbol|manchester|madrid|barcelona|partido|deporte)/i.test(lower)) {
    return "No tengo el marcador deportivo en vivo porque mi sistema está dedicado en exclusiva a la arquitectura tecnológica de Lhyo Group, pero en lo que sí logramos resultados de campeonato es en automatizar las ventas y la atención 24/7 de su empresa. ¿A qué se dedica su negocio?";
  }
  if (/(precio|costo|cuanto|cuánto|valor|tarifa|presupuesto|cotiza|agendar|reunion|reunión|cita)/i.test(lower)) {
    return "Cada sistema se cotiza a la medida de las soluciones que elija y de su región (Latinoamérica, Europa o Internacional). En una breve videollamada ejecutiva de 15 minutos con nuestro CEO le entregamos el presupuesto exacto y su Catálogo Privado PDF. Toque el botón dorado inferior para elegir su horario. [MOSTRAR_BOTON_AGENDA]";
  }
  if (/(hola|buenos|buenas|saludos|que tal|qué tal)/i.test(lower)) {
    return "Es un verdadero gusto saludarle. Estoy en línea para analizar las necesidades de su empresa y recomendarle la solución ideal. ¿A qué se dedica su negocio y qué área desea mejorar hoy?";
  }
  return `Analizando específicamente lo que me comenta ("${clean.slice(0, 60)}"), en Lhyo Group podemos construirle una solución a medida combinando nuestros Asistentes Inteligentes 24/7, Plataformas Web Interactivas y sistemas CRM propios.\n\nPara darle una recomendación exacta: ¿en qué sector opera su negocio y qué proceso desea automatizar primero? [MOSTRAR_BOTON_AGENDA]`;
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

    let aiReply = "";
    const geminiKey = process.env.GEMINI_API_KEY || "";

    if (geminiKey.startsWith("AIza")) {
      try {
        const contents = history.map((m: any) => ({
          role: m.sender === "user" ? "user" : "model",
          parts: [{ text: String(m.text || "") }]
        }));
        contents.push({ role: "user", parts: [{ text: message }] });
        const gRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
              contents,
              generationConfig: { temperature: 0.45, maxOutputTokens: 420 }
            })
          }
        );
        if (gRes.ok) {
          const gData = await gRes.json();
          aiReply = gData?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        }
      } catch {}
    }

    if (!aiReply) {
      try {
        const oaiMessages = [
          { role: "system", content: SYSTEM_PROMPT },
          ...history.slice(-10).map((m: any) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: String(m.text || "")
          })),
          { role: "user", content: message }
        ];
        const pRes = await fetch("https://text.pollinations.ai/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: oaiMessages,
            model: "openai",
            seed: Math.floor(Math.random() * 999999)
          })
        });
        if (pRes.ok) {
          const raw = await pRes.text();
          try {
            const parsed = JSON.parse(raw);
            aiReply = parsed?.choices?.[0]?.message?.content || raw;
          } catch {
            aiReply = raw;
          }
        }
      } catch {}
    }

    if (!aiReply || aiReply.length < 5 || aiReply.includes("<!DOCTYPE")) {
      aiReply = contextualBrain(message, history);
    }

    const isBlocked = aiReply.includes("[BLOQUEAR_SESION]");
    const showBooking = aiReply.includes("[MOSTRAR_BOTON_AGENDA]") || /(precio|costo|cotiz|agend|reuni|cita|catalogo|catálogo|valor|clinica|clínica)/i.test(message);
    const cleanReply = aiReply.replace(/\[BLOQUEAR_SESION\]/g, "").replace(/\[MOSTRAR_BOTON_AGENDA\]/g, "").trim();

    return NextResponse.json({ reply: cleanReply, blocked: isBlocked, showBooking });
  } catch {
    return NextResponse.json({
      reply: "Con total gusto le asistimos. Cuénteme a qué se dedica su empresa o elija su horario de videollamada en el botón inferior.",
      blocked: false,
      showBooking: true
    });
  }
}