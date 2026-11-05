import { NextResponse } from "next/server";
export const runtime = "edge";

const SYSTEM_PROMPT = `Eres el Asistente Ejecutivo de Inteligencia Artificial de Lhyo Group (https://www.lhyogroup.com), firma liderada por su CEO, Lhyonneth Araque.
REGLAS DE INTELIGENCIA COGNITIVA (GEMINI FLASH 3.8):
1. Habla SIEMPRE de "Usted" con tono ejecutivo, humano, rápido y brillante. NUNCA respondas con listas robóticas prefabricadas.
2. Analiza exactamente lo que el usuario pregunta:
   - Si pregunta algo fuera de tema (fútbol, deportes, clima, cocina, chistes): responde con naturalidad e ingenio a su comentario en 1 línea y luego conecta con elegancia explicando que tu especialidad es construir plataformas web de prestigio, asistentes IA 24/7 y automatización para empresas.
   - Si pregunta por un servicio que NO ofrecemos (como imprenta física, manejo tradicional de redes o publicidad básica): aclara con honestidad que no somos una agencia tradicional, sino que construimos los sistemas tecnológicos (web, catálogo interactivo y asistente IA 24/7) para que su negocio convierta clientes en automático.
   - Si escribe algo violento, ilegal, delictivo o insultante: rechaza tajantemente la solicitud e incluye la etiqueta [BLOQUEAR_SESION].
3. Nuestras 06 Soluciones Oficiales (menciónalas solo según convenga a la charla):
   01. Asistentes Inteligentes para WhatsApp e Instagram (24/7)
   02. Plataformas Web Modernas y Catálogos Interactivos
   03. Organización Automática de Clientes y Ventas (CRM)
   04. Automatización Total de Procesos con Tecnología Propia
   05. Inteligencia Artificial Personalizada con la Memoria de su Empresa
   06. Su Propia Plataforma Empresarial Todo-en-Uno
4. Si preguntan precios o desean agendar reunión, explica que cada proyecto se cotiza a medida en una breve videollamada ejecutiva de 15 minutos con nuestro CEO (donde reciben el Catálogo Privado PDF) e incluye la etiqueta [MOSTRAR_BOTON_AGENDA].`;

const SEVERE_BLOCK_REGEX = /(matar|asesinar|suicid|bomba|terroris|sicario|violacion|pedofil|hackear\s+banco|clonar\s+tarjeta|mierda|malparid|hijueputa|estupido\s+bot)/i;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = String(body.message || "").trim();
    const history = Array.isArray(body.history) ? body.history : [];

    if (SEVERE_BLOCK_REGEX.test(message)) {
      return NextResponse.json({
        reply: "Protocolo de Seguridad Lhyo Group: Esta infraestructura cognitiva está destinada estrictamente a consultoría tecnológica y sistemas empresariales. No procesamos solicitudes ilegales, violentas ni lenguaje inapropiado. Esta sesión ha sido bloqueada.",
        blocked: true,
        showBooking: false
      });
    }

    let aiReply = "";
    const geminiKey = process.env.GEMINI_API_KEY || "";

    // Motor 1: Google Gemini Flash Oficial (si hay llave AIzaSy...)
    if (geminiKey.startsWith("AIza")) {
      try {
        const contents = history.map((m: { sender: string; text: string }) => ({
          role: m.sender === "user" ? "user" : "model",
          parts: [{ text: m.text }]
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
              generationConfig: { temperature: 0.4, maxOutputTokens: 420 }
            })
          }
        );
        if (gRes.ok) {
          const gData = await gRes.json();
          aiReply = gData?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        }
      } catch {}
    }

    // Motor 2: Inferencia LLM Neuronal en Vivo sin llave (Pollinations OpenAI / Gemini Flash)
    if (!aiReply) {
      try {
        const oaiMessages = [
          { role: "system", content: SYSTEM_PROMPT },
          ...history.slice(-8).map((m: { sender: string; text: string }) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text
          })),
          { role: "user", content: message }
        ];
        const pRes = await fetch("https://text.pollinations.ai/openai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "openai",
            messages: oaiMessages,
            temperature: 0.4
          })
        });
        if (pRes.ok) {
          const pData = await pRes.json();
          aiReply = pData?.choices?.[0]?.message?.content || "";
        }
      } catch {}
    }

    if (!aiReply) {
      aiReply = "Comprendo perfectamente su consulta. En Lhyo Group diseñamos plataformas web de alto prestigio, asistentes inteligentes 24/7 y sistemas propios a la medida de su negocio. ¿Me comenta a qué se dedica su empresa y qué área le gustaría impulsar primero? [MOSTRAR_BOTON_AGENDA]";
    }

    const isBlocked = aiReply.includes("[BLOQUEAR_SESION]");
    const showBooking = aiReply.includes("[MOSTRAR_BOTON_AGENDA]") || /(precio|costo|cotiz|agend|reuni|cita|catalogo|catálogo|valor)/i.test(message);
    const cleanReply = aiReply.replace(/\[BLOQUEAR_SESION\]/g, "").replace(/\[MOSTRAR_BOTON_AGENDA\]/g, "").trim();

    return NextResponse.json({ reply: cleanReply, blocked: isBlocked, showBooking });
  } catch {
    return NextResponse.json({
      reply: "Estoy a su entera disposición. Cuénteme sobre su empresa o elija un horario en nuestra agenda ejecutiva.",
      blocked: false,
      showBooking: true
    });
  }
}