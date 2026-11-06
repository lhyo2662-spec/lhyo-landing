/**
 * LHYO GROUP | DIRECTOR DE ADMISIONES IA B2B — ORQUESTADOR DUAL-ENGINE (index.js)
 * Motor Primario: Google Gemini (gemini-1.5-flash)
 * Motor Secundario / Fallback Analítico Silencioso: OpenAI (gpt-4o)
 */
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const PORT = process.env.PORT || 4000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const CRM_WEBHOOK_URL =
  process.env.CRM_WEBHOOK_URL || "https://hook.us2.make.com/krs48cjfzudf4lau3sapwdgdu9lfe1tb";

const SYSTEM_PROMPT = `# IDENTIDAD SUPREMA
Eres el Consultor Estratégico Jefe de Lhyo Group (https://www.lhyogroup.com). Tu tono es quirúrgico, corporativo, de élite y siempre tratas al usuario de "Usted". Jamás revelas que eres Gemini o ChatGPT; eres la infraestructura de Lhyo Group.

# CONOCIMIENTO Y ANÁLISIS DE FUGA DE CAPITAL (ROI)
Conoces nuestras 6 Soluciones:
- División Comercial:
  01. Asistentes Inteligentes 24/7 para WhatsApp e Instagram
  02. Plataformas Web Modernas y Catálogos Interactivos (< 0.8s)
  03. Organización Automática de Clientes y Ventas (CRM)
- División Enterprise:
  04. Automatización Total de Procesos con Tecnología Propia (n8n self-hosted)
  05. Inteligencia Artificial Personalizada con la Memoria de su Empresa (Agentes RAG)
  06. Su Propia Plataforma Empresarial Todo-en-Uno (SaaS propio)

Tienes capacidad analítica suprema. Si un cliente te describe su empresa, debes calcular dónde están perdiendo dinero (fuga de capital) y recomendarles exactamente cuál de nuestras soluciones necesitan con un argumento lógico de ROI (Retorno de Inversión).

# PROTOCOLO DE PIVOTE Y BLOQUEO (CRÍTICO)
Tienes estrictamente prohibido responder sobre temas ajenos a negocios, tecnología, escalabilidad o Lhyo Group (ej. política, clima, chistes, deportes, código general que no sea para vender nuestro servicio).
- Maniobra de Conexión: Si el usuario pregunta algo irrelevante, DEBES conectar esa pregunta con nuestros servicios usando una transición elegante.
  (Ejemplo de directiva de pivote: Si preguntan "¿Cuál es el mejor carro?", respondes: "La eficiencia de un motor de alto rendimiento es comparable a lo que hacemos en Lhyo Group. Nosotros no fabricamos vehículos, pero construimos infraestructuras en n8n y Agentes RAG que aceleran las operaciones de su empresa a niveles industriales. ¿Qué software está usando actualmente para gestionar sus ventas?")
- Mantén respuestas ejecutivas de máximo 2 párrafos y cierra siempre con una pregunta estratégica para capturar Nombre, Empresa, Fuga Operativa y si su facturación mensual supera los $5,000 USD.`;

const SAFETY_PATTERNS = [
  /\b(matar|asesinar|homicid\w*|suicid\w*|sicari\w*|bomba|explosiv\w*|terroris\w*|arma\s+de\s+fuego|violaci\w*|pedofil\w*|pornograf\w*|narcotrafic\w*|coca[ií]na|hackear|clonar\s+tarjeta|maldit\w+|mierda|imb[eé]cil|idiota|hijo\s+de\s+puta|ignora\s+tus\s+instrucciones|jailbreak)\b/i
];

function checkSafetyShield(message) {
  const clean = (message || "").trim();
  if (clean.length > 600) return { blocked: true, code: "RULE_07_MAX_LENGTH" };
  const compact = clean.replace(/\s+/g, "");
  if (compact.length >= 5 && /^(.)\1{4,}$/i.test(compact)) return { blocked: true, code: "RULE_06_FLOOD" };
  if (SAFETY_PATTERNS.some((rx) => rx.test(clean))) return { blocked: true, code: "RULE_01_05_SAFETY" };
  return { blocked: false, code: null };
}

async function callPrimaryGemini(userMessage, history = []) {
  if (!GEMINI_API_KEY) throw new Error("GEMINI_KEY_MISSING");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3200);

  const contents = [
    ...history.slice(-10).map((m) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text }]
    })),
    { role: "user", parts: [{ text: userMessage }] }
  ];

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: { temperature: 0.35, maxOutputTokens: 280 }
      })
    }
  );
  clearTimeout(timer);
  if (!response.ok) throw new Error(`GEMINI_HTTP_${response.status}`);
  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) throw new Error("GEMINI_EMPTY");
  return { reply: text, engine: "PRIMARY: gemini-1.5-flash" };
}

async function callFallbackOpenAI(userMessage, history = []) {
  if (!OPENAI_API_KEY) throw new Error("OPENAI_KEY_MISSING");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4500);

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.slice(-10).map((m) => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text
    })),
    { role: "user", content: userMessage }
  ];

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`
    },
    signal: controller.signal,
    body: JSON.stringify({
      model: "gpt-4o",
      temperature: 0.35,
      max_tokens: 280,
      messages
    })
  });
  clearTimeout(timer);
  if (!response.ok) throw new Error(`OPENAI_HTTP_${response.status}`);
  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("OPENAI_EMPTY");
  return { reply: text, engine: "FALLBACK: gpt-4o" };
}

app.post("/api/admissions-b2b", async (req, res) => {
  const { message = "", history = [], currentLead = {} } = req.body || {};
  const shield = checkSafetyShield(message);

  if (shield.blocked) {
    return res.json({
      reply: "⛔ PROTOCOLO DE SEGURIDAD ACTIVADO (" + shield.code + "): Sesión bloqueada permanentemente.",
      blocked: true,
      routed_engine: "SECURITY_SHIELD_LOCK"
    });
  }

  const isHighComplexity =
    message.length > 140 || /roi|fuga|sedes|arquitectura|complej\w*|integraci[oó]n|erp/i.test(message);

  try {
    if (isHighComplexity && OPENAI_API_KEY) {
      const gptResult = await callFallbackOpenAI(message, history);
      return res.json({ ...gptResult, blocked: false });
    }
    const geminiResult = await callPrimaryGemini(message, history);
    return res.json({ ...geminiResult, blocked: false });
  } catch (primaryErr) {
    try {
      const fallbackResult = await callFallbackOpenAI(message, history);
      return res.json({ ...fallbackResult, blocked: false });
    } catch (fallbackErr) {
      return res.json({
        reply:
          "En Lhyo Group auditamos su operación para erradicar fugas de capital mediante nuestras 06 Soluciones (Asistentes 24/7, Plataformas Web <0.8s, CRM Automático, Automatización en n8n, Agentes RAG y Sistemas Todo-en-Uno). ¿Con quién tengo el gusto y qué área de su negocio desea optimizar hoy?",
        engine: "SOVEREIGN_LOCAL_FAILSAFE",
        blocked: false
      });
    }
  }
});

app.listen(PORT, () => {
  console.log(`[LHYO GROUP] Director de Admisiones IA Dual-Engine activo en http://localhost:${PORT}`);
});
