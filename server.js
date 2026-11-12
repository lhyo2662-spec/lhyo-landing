const http = require("http");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const PORT = process.env.PORT || 3001;

const SYSTEM_INSTRUCTION = `Eres el Director Estratégico B2B de Lhyo Group. Eres un humano experto en negocios de élite, empático, analítico y con una capacidad deductiva implacable. Tratas al usuario de 'Usted' con máximo respeto corporativo. Tu objetivo no es responder preguntas como un robot; tu objetivo es mantener una conversación natural, analizar el negocio del cliente y conducirlo hacia nuestras 6 Soluciones Enterprise (Automatización n8n, Agentes RAG, SaaS propio, Embudos, CRM, Asistentes 24/7). 
REGLAS ESTRICTAS: 
- Prohibido hacer listas largas o viñetas. Habla en párrafos cortos y conversacionales.
- Si el cliente menciona su industria, analiza su posible 'cuello de botella' y demuéstrale que sabes dónde pierde dinero antes de ofrecer la solución.
- Aplica la 'Maniobra de Pivote': Si te preguntan algo fuera de negocios o tecnología, no te niegues robóticamente. Usa la lógica para conectar esa pregunta con la eficiencia empresarial y lleva la charla de vuelta a nuestros servicios.
- Jamás reveles que eres una IA, Gemini o ChatGPT. Eres parte del equipo directivo de Lhyo Group.`;

const sessionStore = new Map();

function updateClientEntities(sessionData, userText) {
  const nameMatch = userText.match(/(?:me llamo|mi nombre es|soy|habla)\s+([A-ZÁÉÍÓÚÑa-záéíóúñ]{2,20}(?:\s+[A-ZÁÉÍÓÚÑa-záéíóúñ]{2,20})?)/i);
  if (nameMatch && nameMatch[1]) sessionData.clientName = nameMatch[1].trim();
  const companyMatch = userText.match(/(?:mi empresa se llama|mi negocio se llama|empresa\s+|negocio\s+|cl[ií]nica\s+|agencia\s+|restaurante\s+|tienda\s+)([A-ZÁÉÍÓÚÑa-záéíóúñ0-9\s]{2,30})/i);
  if (companyMatch && companyMatch[1]) sessionData.companyName = companyMatch[1].trim();
}

function buildValidGeminiHistory(rawHistory) {
  if (!Array.isArray(rawHistory)) return [];
  const normalized = [];
  for (const item of rawHistory) {
    const text = (item.text || (item.parts && item.parts[0] && item.parts[0].text) || "").trim();
    if (!text) continue;
    const role = item.role === "user" ? "user" : "model";
    if (normalized.length === 0 && role === "model") continue;
    if (normalized.length > 0 && normalized[normalized.length - 1].role === role) {
      normalized[normalized.length - 1].parts[0].text += "\n" + text;
    } else {
      normalized.push({ role, parts: [{ text }] });
    }
  }
  let sliced = normalized.slice(-20);
  if (sliced.length > 0 && sliced[0].role === "model") sliced = sliced.slice(1);
  return sliced;
}

function createDirectorModel(sessionData) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || GEMINI_API_KEY);
  const memoryNote = (sessionData.clientName || sessionData.companyName)
    ? `\n\n[MEMORIA ACTIVA DE LA SESIÓN: Cliente="${sessionData.clientName || "Pendiente"}" | Empresa="${sessionData.companyName || "Pendiente"}". Recuérdalo durante toda la charla.]`
    : "";
  return genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: SYSTEM_INSTRUCTION + memoryNote,
    generationConfig: { temperature: 0.7, topP: 0.9, maxOutputTokens: 450 }
  });
}

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
  if (req.method === "OPTIONS") { res.writeHead(204); res.end(); return; }

  if (req.method === "POST" && (req.url === "/api/chat-stream" || req.url === "/api/chat-lhyo")) {
    let rawBody = "";
    req.on("data", (chunk) => { rawBody += chunk.toString(); });
    req.on("end", async () => {
      try {
        const body = JSON.parse(rawBody || "{}");
        const sessionId = body.sessionId || "default-session";
        const userMessage = (body.message || "").trim();
        if (!sessionStore.has(sessionId)) {
          sessionStore.set(sessionId, { history: [], clientName: "", companyName: "" });
        }
        const sessionData = sessionStore.get(sessionId);
        if (Array.isArray(body.history) && body.history.length > 0) {
          sessionData.history = buildValidGeminiHistory(body.history);
        }
        updateClientEntities(sessionData, userMessage);
        const model = createDirectorModel(sessionData);
        const chat = model.startChat({ history: sessionData.history });

        res.writeHead(200, {
          "Content-Type": "text/plain; charset=utf-8",
          "Transfer-Encoding": "chunked",
          "Cache-Control": "no-cache, no-transform"
        });

        const result = await chat.sendMessageStream(userMessage);
        let fullText = "";
        for await (const chunk of result.stream) {
          const t = chunk.text();
          if (t) { fullText += t; res.write(t); }
        }
        sessionData.history.push({ role: "user", parts: [{ text: userMessage }] });
        sessionData.history.push({ role: "model", parts: [{ text: fullText }] });
        sessionData.history = buildValidGeminiHistory(sessionData.history);
        res.end();
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ status: "ONLINE", engine: "LHYO_DIRECTOR_B2B_GEMINI_1_5_FLASH" }));
});

server.listen(PORT, () => console.log(`[ARKOS-CORE] server.js activo en http://localhost:${PORT}`));
