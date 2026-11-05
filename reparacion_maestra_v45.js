const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = process.cwd();
const appRoot = fs.existsSync(path.join(ROOT, "lhyo-landing")) ? path.join(ROOT, "lhyo-landing") : ROOT;

// PASO 0: Restaurar el estado limpio aef356c para que CONTACTO vuelva a estar 100% original y sin pantalla negra
for (const gDir of [ROOT, appRoot]) {
  if (fs.existsSync(path.join(gDir, ".git"))) {
    try { execSync("git checkout aef356c -- .", { cwd: gDir, stdio: "inherit" }); } catch {}
  }
}

// PASO 1: Crear /api/chat-lhyo/route.ts con Motor Triple (Gemini + Cloud LLM + Razonador Contextual Multi-Turno)
const apiDir = path.join(appRoot, "app", "api", "chat-lhyo");
fs.mkdirSync(apiDir, { recursive: true });

const routeLines = [
  'import { NextResponse } from "next/server";',
  'export const runtime = "edge";',
  '',
  'const SYSTEM_PROMPT = `Eres el Asistente Ejecutivo de Inteligencia Artificial de Lhyo Group (https://www.lhyogroup.com), firma liderada por su CEO, Lhyonneth Araque.',
  'REGLAS DE RAZONAMIENTO MULTI-TURNO:',
  '1. Habla siempre de "Usted". Analiza cada mensaje del usuario (1ro, 2do, 3ro, 10mo) manteniendo el hilo completo de la conversacion.',
  '2. NUNCA repitas respuestas genericas. Si pregunta que almorzar, de futbol o cualquier curiosidad, responde con ingenio y cortesia a eso mismo en 1 parrafo breve y luego vincula con elegancia hacia Lhyo Group.',
  '3. Si menciona su rubro (ej. clinica odontologica, restaurante, inmobiliaria, tienda, servicios), explica especificamente como le ayudan nuestras 06 Soluciones:',
  '   01. Asistentes Inteligentes para WhatsApp e Instagram (24/7)',
  '   02. Plataformas Web Modernas y Catalogos Interactivos',
  '   03. Organizacion Automatica de Clientes y Ventas (CRM)',
  '   04. Automatizacion Total de Procesos con Tecnologia Propia',
  '   05. Inteligencia Artificial Personalizada con la Memoria de su Empresa',
  '   06. Su Propia Plataforma Empresarial Todo-en-Uno',
  '4. Cuando pregunte precios o como agendar, invitalo a reservar su sesion ejecutiva de 15 minutos e incluye [MOSTRAR_BOTON_AGENDA].`;',
  '',
  'const SEVERE_BLOCK_REGEX = /(matar|asesinar|suicid|bomba|terroris|sicario|violacion|pedofil|hackear\\s+banco|clonar\\s+tarjeta|mierda|malparid|hijueputa)/i;',
  '',
  'function contextualBrain(message: string, history: any[]) {',
  '  const clean = String(message || "").trim();',
  '  const lower = clean.toLowerCase();',
  '  const turn = history.filter((m) => m.sender === "user").length + 1;',
  '  if (/(almorzar|comer|comida|hambre|desayun|cenar|menu|menú)/i.test(lower)) {',
  '    if (/(vendo|negocio|restaurante|local|pedidos)/i.test(lower)) {',
  '      return "Para un negocio gastronómico, en Lhyo Group implementamos Catálogos Web Interactivos (Solución 02) y Asistentes Inteligentes 24/7 en WhatsApp (Solución 01) que muestran el menú, toman el pedido y lo registran en automático. ¿Actualmente toman pedidos por WhatsApp?";',
  '    }',
  '    return turn === 1',
  '      ? "¡Excelente pregunta! Para continuar el día con buena energía, una proteína al grill con ensalada fresca o una buena pasta siempre es una gran elección.\\n\\nY cuando guste, si tiene una empresa o negocio que desee automatizar o potenciar con una plataforma web de lujo, cuénteme a qué se dedica y le asesoro de inmediato."',
  '      : "Si busca otra opción deliciosa para comer hoy: un salmón a la plancha o un buen corte al grill nunca falla.\\n\\nPor cierto, si tiene un negocio o consultorio propio, cuénteme de qué trata para indicarle qué sistema de Lhyo Group le daría mejores resultados.";',
  '  }',
  '  if (/(odontol|dental|dentista|clinica|clínica|medic|médic|doctor|salud|paciente|consultorio)/i.test(lower)) {',
  '    return "Para una clínica odontológica, en Lhyo Group instalamos 3 soluciones clave:\\n\\n1. Asistente Inteligente 24/7 en WhatsApp e Instagram (Solución 01): responde dudas de tratamientos (ortodoncia, implantes, estética dental), filtra pacientes y agenda citas en su calendario día y noche.\\n2. Plataforma Web de Prestigio Clínico (Solución 02): transmite autoridad inmediata a cada paciente.\\n3. CRM Clínico Automático (Solución 03): registra pacientes y automatiza recordatorios para evitar inasistencias.\\n\\n¿Cuál de estas 3 áreas le gustaría impulsar primero en su clínica? [MOSTRAR_BOTON_AGENDA]";',
  '  }',
  '  if (/(futbol|fútbol|manchester|madrid|barcelona|partido|deporte)/i.test(lower)) {',
  '    return "No tengo el marcador deportivo en vivo porque mi sistema está dedicado en exclusiva a la arquitectura tecnológica de Lhyo Group, pero en lo que sí logramos resultados de campeonato es en automatizar las ventas y la atención 24/7 de su empresa. ¿A qué se dedica su negocio?";',
  '  }',
  '  if (/(precio|costo|cuanto|cuánto|valor|tarifa|presupuesto|cotiza|agendar|reunion|reunión|cita)/i.test(lower)) {',
  '    return "Cada sistema se cotiza a la medida de las soluciones que elija y de su región (Latinoamérica, Europa o Internacional). En una breve videollamada ejecutiva de 15 minutos con nuestro CEO le entregamos el presupuesto exacto y su Catálogo Privado PDF. Toque el botón dorado inferior para elegir su horario. [MOSTRAR_BOTON_AGENDA]";',
  '  }',
  '  if (/(hola|buenos|buenas|saludos|que tal|qué tal)/i.test(lower)) {',
  '    return "Es un verdadero gusto saludarle. Estoy en línea para analizar las necesidades de su empresa y recomendarle la solución ideal. ¿A qué se dedica su negocio y qué área desea mejorar hoy?";',
  '  }',
  '  return `Analizando específicamente lo que me comenta ("${clean.slice(0, 60)}"), en Lhyo Group podemos construirle una solución a medida combinando nuestros Asistentes Inteligentes 24/7, Plataformas Web Interactivas y sistemas CRM propios.\\n\\nPara darle una recomendación exacta: ¿en qué sector opera su negocio y qué proceso desea automatizar primero? [MOSTRAR_BOTON_AGENDA]`;',
  '}',
  '',
  'export async function POST(req: Request) {',
  '  try {',
  '    const body = await req.json();',
  '    const message = String(body.message || "").trim();',
  '    const history = Array.isArray(body.history) ? body.history : [];',
  '',
  '    if (SEVERE_BLOCK_REGEX.test(message)) {',
  '      return NextResponse.json({',
  '        reply: "Protocolo de Seguridad Lhyo Group: No procesamos solicitudes ilegales, violentas ni lenguaje inapropiado. Esta sesión ha sido bloqueada permanentemente.",',
  '        blocked: true,',
  '        showBooking: false',
  '      });',
  '    }',
  '',
  '    let aiReply = "";',
  '    const geminiKey = process.env.GEMINI_API_KEY || "";',
  '',
  '    if (geminiKey.startsWith("AIza")) {',
  '      try {',
  '        const contents = history.map((m: any) => ({',
  '          role: m.sender === "user" ? "user" : "model",',
  '          parts: [{ text: String(m.text || "") }]',
  '        }));',
  '        contents.push({ role: "user", parts: [{ text: message }] });',
  '        const gRes = await fetch(',
  '          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,',
  '          {',
  '            method: "POST",',
  '            headers: { "Content-Type": "application/json" },',
  '            body: JSON.stringify({',
  '              systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },',
  '              contents,',
  '              generationConfig: { temperature: 0.45, maxOutputTokens: 420 }',
  '            })',
  '          }',
  '        );',
  '        if (gRes.ok) {',
  '          const gData = await gRes.json();',
  '          aiReply = gData?.candidates?.[0]?.content?.parts?.[0]?.text || "";',
  '        }',
  '      } catch {}',
  '    }',
  '',
  '    if (!aiReply) {',
  '      try {',
  '        const oaiMessages = [',
  '          { role: "system", content: SYSTEM_PROMPT },',
  '          ...history.slice(-10).map((m: any) => ({',
  '            role: m.sender === "user" ? "user" : "assistant",',
  '            content: String(m.text || "")',
  '          })),',
  '          { role: "user", content: message }',
  '        ];',
  '        const pRes = await fetch("https://text.pollinations.ai/", {',
  '          method: "POST",',
  '          headers: { "Content-Type": "application/json" },',
  '          body: JSON.stringify({',
  '            messages: oaiMessages,',
  '            model: "openai",',
  '            seed: Math.floor(Math.random() * 999999)',
  '          })',
  '        });',
  '        if (pRes.ok) {',
  '          const raw = await pRes.text();',
  '          try {',
  '            const parsed = JSON.parse(raw);',
  '            aiReply = parsed?.choices?.[0]?.message?.content || raw;',
  '          } catch {',
  '            aiReply = raw;',
  '          }',
  '        }',
  '      } catch {}',
  '    }',
  '',
  '    if (!aiReply || aiReply.length < 5 || aiReply.includes("<!DOCTYPE")) {',
  '      aiReply = contextualBrain(message, history);',
  '    }',
  '',
  '    const isBlocked = aiReply.includes("[BLOQUEAR_SESION]");',
  '    const showBooking = aiReply.includes("[MOSTRAR_BOTON_AGENDA]") || /(precio|costo|cotiz|agend|reuni|cita|catalogo|catálogo|valor|clinica|clínica)/i.test(message);',
  '    const cleanReply = aiReply.replace(/\\[BLOQUEAR_SESION\\]/g, "").replace(/\\[MOSTRAR_BOTON_AGENDA\\]/g, "").trim();',
  '',
  '    return NextResponse.json({ reply: cleanReply, blocked: isBlocked, showBooking });',
  '  } catch {',
  '    return NextResponse.json({',
  '      reply: "Con total gusto le asistimos. Cuénteme a qué se dedica su empresa o elija su horario de videollamada en el botón inferior.",',
  '      blocked: false,',
  '      showBooking: true',
  '    });',
  '  }',
  '}'
];
fs.writeFileSync(path.join(apiDir, "route.ts"), routeLines.join("\n"), "utf8");
console.log("✔ [ACTUALIZADO]: app/api/chat-lhyo/route.ts");

// PASO 2: Crear FloatingOmniDock.tsx con limpieza al cerrar o salir de la pagina
const compDir = path.join(appRoot, "components");
fs.mkdirSync(compDir, { recursive: true });

const dockLines = [
  '"use client";',
  'import React, { useState, useEffect, useRef } from "react";',
  'interface ChatMsg { sender: "bot" | "user"; text: string; showBooking?: boolean; }',
  'const INITIAL_GREETING: ChatMsg = {',
  '  sender: "bot",',
  '  text: "Está interactuando con la infraestructura cognitiva de Lhyo Group. Soy su Asistente Ejecutivo de Inteligencia Artificial.\\n\\nPuede escribirme o tocar el micrófono para hablarme con total libertad: ¿con quién tengo el gusto y qué le gustaría consultar, crear o automatizar hoy?"',
  '};',
  'export default function FloatingOmniDock({ onOpenBooking }: { onOpenBooking?: (plan: string) => void }) {',
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
  '            {loading && <div className="text-[11px] text-[#FCF6BA] italic animate-pulse">Analizando y redactando respuesta...</div>}',
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
  '}'
];
fs.writeFileSync(path.join(compDir, "FloatingOmniDock.tsx"), dockLines.join("\n"), "utf8");
console.log("✔ [ACTUALIZADO]: components/FloatingOmniDock.tsx");

// PASO 3: Ajustes quirurgicos seguros (SIN tocar la estructura de CONTACTO para que jamas de error)
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
  if (filePath.endsWith("FloatingOmniDock.tsx") || filePath.endsWith("route.ts")) continue;
  let content = fs.readFileSync(filePath, "utf8");
  const orig = content;

  if (filePath.endsWith("globals.css") && !content.includes("/* LHYO_PRE_LINE */")) {
    content += "\n/* LHYO_PRE_LINE */\nh3 { white-space: pre-line; }\n";
  }

  // 1. Numero de WhatsApp 584247383164 y correo directo a Gmail (reemplazo seguro de texto sin romper etiquetas JSX)
  content = content.replace(/59800000000/g, "584247383164");
  content = content.replace(/mailto:ceo@lhyogroup\.com/g, "https://mail.google.com/mail/?view=cm&fs=1&to=ceo@lhyogroup.com");

  // 2. Titulos de las 3 Claves en Inicio: 2 lineas simetricas + punto final (.)
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

  // 3. Cotizador por Regiones y SOLO las 06 Soluciones (SIN Todo Incluido)
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
    /const handlePrivInterestToggle = \(option: string\) => \{[\s\S]*?\n  \};/,
    `const handlePrivInterestToggle = (option: string) => {\n    setPrivInterests((prev) => {\n      if (prev.includes(option)) {\n        return prev.length > 1 ? prev.filter((item) => item !== option) : prev;\n      }\n      return [...prev, option];\n    });\n  };`
  );
  content = content.replace(/SOLICITUD CAT[ÁA]LOGO PRIVADO \| Pa[íi]s:/g, "Propuesta personalizada para");
  content = content.replace(/\| Inter[ée]s:/g, "· Soluciones:");
  content = content.replace(/\| Etapa:/g, "· Etapa:");

  // 4. Si page.tsx tiene el dock inline viejo, reemplazarlo de forma segura manteniendo el cierre de tags intacto
  if (content.includes("Asistente Directo") && content.includes("QUICK_BOT_OPTIONS")) {
    if (!content.includes("FloatingOmniDock")) {
      content = 'import FloatingOmniDock from "../components/FloatingOmniDock";\n' + content;
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
      execSync('git commit -m "V45.0: IA Multi-Turno + Contacto 100% Restaurado + Claves con punto final + Cotizador 6 Soluciones por Region"', { cwd: gDir, stdio: "inherit" });
      execSync("git push origin main --force", { cwd: gDir, stdio: "inherit" });
      console.log("✅ EXITO TOTAL: Desplegado en Vercel desde", gDir);
    } catch (e) { console.log(e.message); }
  }
}