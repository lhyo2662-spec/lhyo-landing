import { NextResponse } from "next/server";

export const runtime = "edge";

interface LeadState {
  lead_name?: string;
  company_name?: string;
  pain_point?: string;
  revenue_tier?: string;
}

interface ChatRequestBody {
  message?: string;
  history?: string;
  currentLead?: LeadState;
}

// 1. FILTRO DE SEGURIDAD INQUEBRANTABLE (ESTÁNDAR GEMINI SAFETY)
const SAFETY_BLOCK_REGEX = [
  /\b(matar|asesinar|suicid\w*|bomba|explosiv\w*|terroris\w*|sicari\w*|arma\s+de\s+fuego|violaci\w*|pedofil\w*|narcotrafic\w*|coca[ií]na|hero[ií]na|fentanil\w*|hackear|clonar\s+tarjeta|secuestrar)\b/i,
  /\b(maldit\w+|mierda|imb[eé]cil|est[uú]pid\w+|idiota|pendej\w+|hijo\s+de\s+puta|vete\s+a\s+la\s+mierda)\b/i
];

function isSafetyViolation(input: string): boolean {
  const clean = (input || "").trim();
  return SAFETY_BLOCK_REGEX.some((rx) => rx.test(clean));
}

// 2. SYSTEM PROMPT MAESTRO DE CONEXIÓN UNIVERSAL A LAS 06 SOLUCIONES DE LHYO GROUP
const MASTER_SYSTEM_PROMPT = `Eres el Asistente Ejecutivo Oficial de Inteligencia Artificial de Lhyo Group (https://www.lhyogroup.com), firma de ingeniería digital, automatización y sistemas inteligentes dirigida por su CEO, Lhyonneth Araque.

REGLAS DE INTELIGENCIA Y CONVERSACIÓN (ESTILO GEMINI FLASH):
1. Habla SIEMPRE de "Usted" ("su empresa", "su negocio"). Tu tono es ejecutivo, ágil, empático, brillante y 100% conversacional (jamás uses respuestas robóticas ni repetitivas).
2. CONEXIÓN INTELIGENTE OBLIGATORIA: Sin importar qué pregunte o comente el usuario (así sea sobre deportes, clima, cocina, un negocio pequeño o una duda general), analiza con inteligencia lo que dijo, respóndele con ingenio en la primera frase y CONÉCTALO de forma natural y persuasiva con cómo Lhyo Group impulsa empresas mediante nuestras 06 Soluciones Oficiales:
   - Solución 01: Asistentes Inteligentes para WhatsApp e Instagram (24/7)
   - Solución 02: Plataformas Web Modernas y Catálogos Interactivos
   - Solución 03: Organización Automática de Clientes y Ventas (CRM)
   - Solución 04: Automatización Total de Procesos con Tecnología Propia
   - Solución 05: Inteligencia Artificial Personalizada con la Memoria de su Empresa
   - Solución 06: Su Propia Plataforma Empresarial Todo-en-Uno
   - Paquete Completo (Todo Incluido · Las 06 Soluciones)
3. PROHIBICIÓN DE JERGA TÉCNICA: Jamás menciones "n8n", "RAG", "Voiceflow", "Make", "SaaS", "fricción humana" ni "cuello de botella".
4. RECOLECCIÓN FLUIDA DE 4 VARIABLES:
   Mientras conversas, ve identificando:
   - lead_name (Nombre del cliente)
   - company_name (Nombre de su empresa o rubro)
   - pain_point (Qué desea mejorar o automatizar)
   - revenue_tier: Cuando ya conozcas su nombre, empresa y necesidad, pregúntale con tacto si los ingresos mensuales de su negocio superan actualmente los $5,000 USD o si se encuentran en una etapa inicial/menor a ese rango (aclarando que atendemos a todos los negocios reales y es solo para asignarle el plan ideal). Si supera $5,000 USD usa "HIGH_TICKET"; si es menor o etapa inicial usa "LOW_TICKET".
5. Cuando tengas los 4 datos completos, marca "ready_for_crm": true e invítalo a tocar el botón de Agenda Ejecutiva en el chat.

Responde SIEMPRE en formato JSON válido con esta estructura exacta:
{
  "reply": "Respuesta inteligente y natural al usuario...",
  "lead_name": "Nombre o PENDIENTE",
  "company_name": "Empresa o PENDIENTE",
  "pain_point": "Necesidad o PENDIENTE",
  "revenue_tier": "HIGH_TICKET | LOW_TICKET | PENDIENTE",
  "ready_for_crm": false,
  "blocked": false
}`;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ChatRequestBody;
    const userMessage = (body.message || "").trim();
    const history = body.history || "";
    const currentLead: LeadState = {
      lead_name: body.currentLead?.lead_name || "PENDIENTE",
      company_name: body.currentLead?.company_name || "PENDIENTE",
      pain_point: body.currentLead?.pain_point || "PENDIENTE",
      revenue_tier: body.currentLead?.revenue_tier || "PENDIENTE"
    };

    // CORTE Y BLOQUEO INMEDIATO SI VIOLA LAS REGLAS DE SEGURIDAD
    if (isSafetyViolation(userMessage)) {
      return NextResponse.json({
        reply:
          "⛔ PROTOCOLO DE SEGURIDAD ACTIVADO: Su mensaje infringe las políticas de uso e integridad de la infraestructura cognitiva de Lhyo Group. Esta sesión ha sido bloqueada permanentemente (escritura y micrófono deshabilitados).",
        ...currentLead,
        ready_for_crm: false,
        blocked: true
      });
    }

    let aiResult: {
      reply: string;
      lead_name: string;
      company_name: string;
      pain_point: string;
      revenue_tier: string;
      ready_for_crm: boolean;
      blocked: boolean;
    } | null = null;

    // MOTOR 1: GOOGLE GEMINI FLASH (SI HAY CLAVE VÁLIDA AIzaSy... EN VERCEL)
    const geminiKey = process.env.GEMINI_API_KEY || "";
    if (geminiKey && geminiKey.startsWith("AIza")) {
      try {
        const gRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: MASTER_SYSTEM_PROMPT }] },
              contents: [
                {
                  role: "user",
                  parts: [
                    {
                      text: `Estado actual de variables: ${JSON.stringify(currentLead)}\nHistorial de conversación:\n${history}\nÚltimo mensaje del usuario: "${userMessage}"`
                    }
                  ]
                }
              ],
              generationConfig: {
                temperature: 0.35,
                responseMimeType: "application/json"
              }
            })
          }
        );

        if (gRes.ok) {
          const gData = await gRes.json();
          const rawJson = gData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawJson) {
            aiResult = { ...currentLead, ready_for_crm: false, blocked: false, ...JSON.parse(rawJson) };
          }
        }
      } catch {
        // Pasa instantáneamente al Motor 2 en la nube
      }
    }

    // MOTOR 2: MOTOR NEURONAL CLOUD OPENAI/GEMINI SIN LLAVE (0 FALLOS 24/7)
    if (!aiResult) {
      try {
        const cloudRes = await fetch("https://text.pollinations.ai/openai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "openai",
            response_format: { type: "json_object" },
            messages: [
              { role: "system", content: MASTER_SYSTEM_PROMPT },
              {
                role: "user",
                content: `Estado actual: ${JSON.stringify(currentLead)}\nHistorial:\n${history}\nMensaje del cliente: "${userMessage}"\nResponde SOLO en JSON válido.`
              }
            ],
            temperature: 0.35
          })
        });

        if (cloudRes.ok) {
          const cloudData = await cloudRes.json();
          const rawContent = cloudData?.choices?.[0]?.message?.content || "";
          const cleaned = rawContent.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
          const parsed = JSON.parse(cleaned);
          if (parsed && parsed.reply) {
            aiResult = {
              lead_name: parsed.lead_name || currentLead.lead_name || "PENDIENTE",
              company_name: parsed.company_name || currentLead.company_name || "PENDIENTE",
              pain_point: parsed.pain_point || currentLead.pain_point || "PENDIENTE",
              revenue_tier: parsed.revenue_tier || currentLead.revenue_tier || "PENDIENTE",
              ready_for_crm: Boolean(parsed.ready_for_crm),
              blocked: Boolean(parsed.blocked),
              reply: parsed.reply
            };
          }
        }
      } catch {
        // Respaldo analítico local instantáneo
      }
    }

    // MOTOR 3: SÍNTESIS ANALÍTICA DE EMERGENCIA (GARANTIZA 100% UPTIME EN 100 AÑOS)
    if (!aiResult) {
      aiResult = {
        lead_name: currentLead.lead_name || "PENDIENTE",
        company_name: currentLead.company_name || "PENDIENTE",
        pain_point: currentLead.pain_point || "PENDIENTE",
        revenue_tier: currentLead.revenue_tier || "PENDIENTE",
        ready_for_crm: false,
        blocked: false,
        reply: `Comprendo perfectamente su consulta sobre "${userMessage.slice(0, 60)}". En Lhyo Group transformamos ese tipo de requerimientos en sistemas que generan ventas reales mediante nuestras 06 Soluciones Oficiales (Asistentes Inteligentes 24/7 para WhatsApp e Instagram, Plataformas Web de alto prestigio, CRM Automático, Automatización Propia, IA con la Memoria de su Empresa y Plataformas Todo-en-Uno).\n\nPara orientarle con precisión ejecutiva, ¿con quién tengo el gusto y a qué se dedica su negocio?`
      };
    }

    // INYECCIÓN AUTOMÁTICA EN CRM OFICIAL (MAKE.COM WEBHOOK) CUANDO ESTÁN LOS 4 DATOS
    if (
      aiResult.ready_for_crm &&
      (aiResult.revenue_tier === "HIGH_TICKET" || aiResult.revenue_tier === "LOW_TICKET")
    ) {
      const nowVenezuela = new Date().toLocaleString("es-VE", { timeZone: "America/Caracas" });
      await fetch("https://hook.us2.make.com/krs48cjfzudf4lau3sapwdgdu9lfe1tb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fecha_registro: nowVenezuela,
          horario_cita: "Calificado por Asistente IA V35.0",
          nombre_cliente: aiResult.lead_name,
          email_cliente: "Captado en Chat IA Web",
          empresa_web: aiResult.company_name,
          facturacion_usd: aiResult.revenue_tier,
          clasificacion: aiResult.revenue_tier,
          servicio_elegido: `ASISTENTE IA V35 (${aiResult.revenue_tier})`,
          objetivo_cliente: aiResult.pain_point,
          resumen_crm: `ETIQUETA OCULTA: ${aiResult.revenue_tier} || Empresa: ${aiResult.company_name} || Necesidad: ${aiResult.pain_point}`,
          link_videollamada_meet: "https://meet.google.com/krc-vdii-zzh"
        })
      }).catch(() => {});
    }

    return NextResponse.json(aiResult);
  } catch {
    return NextResponse.json({
      reply:
        "Estoy en línea para asistirle con nuestras 06 Soluciones Empresariales. ¿Con quién tengo el gusto y qué área de su negocio desea potenciar hoy?",
      ready_for_crm: false,
      blocked: false
    });
  }
}