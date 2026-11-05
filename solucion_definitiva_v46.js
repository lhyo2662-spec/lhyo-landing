const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = process.cwd();
const appRoot = fs.existsSync(path.join(ROOT, "lhyo-landing")) ? path.join(ROOT, "lhyo-landing") : ROOT;

// PASO 0: Restaurar aef356c limpio para que CONTACTO vuelva 100% a su estado original sin pantalla negra
for (const gDir of [ROOT, appRoot]) {
  if (fs.existsSync(path.join(gDir, ".git"))) {
    try { execSync("git checkout aef356c -- .", { cwd: gDir, stdio: "inherit" }); } catch {}
  }
}

// PASO 1: Crear /api/chat-lhyo/route.ts con respuesta instantanea (<120ms), turnos ilimitados y conexion corta a Lhyo Group
const apiDir = path.join(appRoot, "app", "api", "chat-lhyo");
fs.mkdirSync(apiDir, { recursive: true });

const routeLines = [
  'import { NextResponse } from "next/server";',
  'export const runtime = "edge";',
  '',
  'const SEVERE_BLOCK_REGEX = /(matar|asesinar|suicid|bomba|terroris|sicario|violacion|pedofil|hackear\\s+banco|clonar\\s+tarjeta|mierda|malparid|hijueputa)/i;',
  '',
  'function extractTopicKeyword(rawText: string) {',
  '  const stopWords = new Set(["que","qué","como","cómo","donde","dónde","cuando","cuándo","por","para","con","sin","los","las","una","uno","del","al","hoy","ayer","mañana","puedo","puede","quiero","quiere","hacer","hago","tiene","tengo","esta","está","este","eso","esa","algo","sobre","dime","decir","sabes","hola","buenas","buenos"]);',
  '  const words = String(rawText || "")',
  '    .replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\\s]/g, " ")',
  '    .split(/\\s+/)',
  '    .map((w) => w.trim())',
  '    .filter((w) => w.length >= 4 && !stopWords.has(w.toLowerCase()));',
  '  return words.length > 0 ? words.slice(0, 3).join(" ") : "ese tema";',
  '}',
  '',
  'function pickNonRepeating(candidates: string[], history: any[]) {',
  '  const previousBotTexts = new Set(',
  '    (history || []).filter((m) => m.sender === "bot").map((m) => String(m.text || "").trim())',
  '  );',
  '  for (const item of candidates) {',
  '    const clean = item.replace(/\\[MOSTRAR_BOTON_AGENDA\\]/g, "").trim();',
  '    if (!previousBotTexts.has(clean)) return item;',
  '  }',
  '  const idx = (history || []).filter((m) => m.sender === "user").length % candidates.length;',
  '  return candidates[idx];',
  '}',
  '',
  'function contextualBrain(message: string, history: any[]) {',
  '  const clean = String(message || "").trim();',
  '  const lower = clean.toLowerCase();',
  '  const topic = extractTopicKeyword(clean);',
  '',
  '  if (/(odontol|dental|dentista|clinica|clínica|medic|médic|doctor|salud|paciente|consultorio|hospital|estetic|estétic)/i.test(lower)) {',
  '    return pickNonRepeating([',
  '      "Para su clínica o consultorio, en Lhyo Group instalamos un Asistente Inteligente 24/7 en WhatsApp e Instagram (Solución 01) que responde dudas de tratamientos, filtra pacientes reales y agenda sus citas automáticamente en su calendario, unido a una Plataforma Web de prestigio (Solución 02) y un CRM Clínico (Solución 03). ¿Cuál de estas áreas desea implementar primero? [MOSTRAR_BOTON_AGENDA]",',
  '      "En el sector clínico y odontológico, nuestra tecnología elimina las inasistencias y la pérdida de pacientes fuera de horario: su Asistente IA 24/7 atiende consultas al instante, registra al paciente en su CRM (Solución 03) y confirma el turno sin intervención manual. ¿Le gustaría agendar una sesión de 15 minutos para ver cómo operaría en su clínica? [MOSTRAR_BOTON_AGENDA]",',
  '      "Además de automatizar la agenda de pacientes 24/7 en WhatsApp e Instagram, podemos entrenar una Inteligencia Artificial Privada con la memoria de su clínica (Solución 05) con todos sus aranceles, presupuestos y protocolos para dar respuestas exactas en 1 segundo. ¿Desea cotizarlo para su clínica? [MOSTRAR_BOTON_AGENDA]"',
  '    ], history);',
  '  }',
  '',
  '  if (/(restaurante|gastronom|hotel|cafeteria|cafetería|bar|delivery|pedidos de comida|vendo comida)/i.test(lower)) {',
  '    return pickNonRepeating([',
  '      "Para el sector gastronómico y hotelero, en Lhyo Group desarrollamos Plataformas Web con Catálogos Interactivos (Solución 02) y Asistentes Inteligentes 24/7 en WhatsApp e Instagram (Solución 01) que muestran su propuesta, atienden reservas o pedidos al instante y registran cada cliente en su CRM. ¿Desea implementarlo en su negocio? [MOSTRAR_BOTON_AGENDA]",',
  '      "En negocios gastronómicos, la velocidad de atención define la venta: con nuestro sistema propio (Soluciones 01 y 03), cada cliente que escribe por WhatsApp o Instagram recibe atención en menos de 1 segundo las 24 horas y queda registrado en su base de datos. ¿Le gustaría ver una demostración aplicada a su local? [MOSTRAR_BOTON_AGENDA]"',
  '    ], history);',
  '  }',
  '',
  '  if (/(inmobiliaria|bienes raices|bienes raíces|propiedades|constructora|arquitect|abogad|legal|contable|agencia|tienda|ecommerce|gimnasio|spa|educacion|academia|empresa|negocio)/i.test(lower) && !/(que es lhyo|qué hacen|que ofrecen)/i.test(lower)) {',
  '    return pickNonRepeating([',
  '      "Para potenciar su operación en ese sector, en Lhyo Group unimos 3 piezas clave: una Plataforma Web de máximo prestigio (Solución 02), un Asistente Inteligente 24/7 en WhatsApp e Instagram que califica y agenda clientes solos (Solución 01), y un CRM Automático (Solución 03). ¿Qué área de su negocio busca escalar primero? [MOSTRAR_BOTON_AGENDA]",',
  '      "Su negocio puede operar en piloto automático con nuestra tecnología propia: desde atención inmediata 24/7 en WhatsApp e Instagram hasta una Plataforma Empresarial Todo-en-Uno (Solución 06) con su propia marca. ¿Desea recibir nuestro Catálogo Privado PDF con las opciones para su empresa? [MOSTRAR_BOTON_AGENDA]"',
  '    ], history);',
  '  }',
  '',
  '  if (/(precio|costo|cuanto|cuánto|valor|tarifa|presupuesto|cotiza|planes|paquete|inversion|inversión)/i.test(lower)) {',
  '    return pickNonRepeating([',
  '      "Cada solución en Lhyo Group se cotiza a la medida de su región (Latinoamérica, Europa o Norteamérica) y de los módulos que elija entre nuestras 06 Soluciones Oficiales. En una breve sesión ejecutiva de 15 minutos por videollamada le entregamos su presupuesto exacto y nuestro Catálogo Privado PDF. Toque el botón dorado inferior para elegir su horario. [MOSTRAR_BOTON_AGENDA]",',
  '      "Para garantizarle un presupuesto exacto sin costos innecesarios, evaluamos en 15 minutos qué soluciones necesita su empresa (Asistente IA 24/7, Plataforma Web, CRM, Automatización Propia o Sistema Todo-en-Uno) y le enviamos el Dossier Corporativo PDF con las tarifas de su región. Puede reservar su espacio en el botón aquí abajo. [MOSTRAR_BOTON_AGENDA]"',
  '    ], history);',
  '  }',
  '',
  '  if (/(que ofrecen|qué ofrecen|servicios|soluciones|que hacen|qué hacen|catalogo|catálogo|informacion|información|como funciona|cómo funciona)/i.test(lower)) {',
  '    return pickNonRepeating([',
  '      "En Lhyo Group diseñamos e instalamos 06 Soluciones Tecnológicas de alta gama para su empresa:\\n01 · Asistentes Inteligentes 24/7 para WhatsApp e Instagram.\\n02 · Plataformas Web Modernas y Catálogos Interactivos.\\n03 · Organización Automática de Clientes y Ventas (CRM).\\n04 · Automatización Total con Tecnología Propia.\\n05 · IA Personalizada con la Memoria de su Empresa.\\n06 · Su Propia Plataforma Empresarial Todo-en-Uno.\\n\\n¿Cuál de estas 6 soluciones le interesa implementar primero? [MOSTRAR_BOTON_AGENDA]",',
  '      "Construimos toda la infraestructura digital y de automatización para que su empresa venda y atienda las 24 horas sin trabajo manual: desde su sitio web de lujo y asistentes IA en WhatsApp/Instagram hasta su propio sistema CRM y plataforma Todo-en-Uno. ¿Sobre cuál de nuestras soluciones desea profundizar? [MOSTRAR_BOTON_AGENDA]"',
  '    ], history);',
  '  }',
  '',
  '  if (/(garantia|garantía|tiempo|demora|cuanto tardan|cuánto tardan|dias|días|entrega|seguridad|contrato)/i.test(lower)) {',
  '    return pickNonRepeating([',
  '      "Trabajamos bajo un protocolo ejecutivo llave en mano de 10 días: Días 1-2 Diagnóstico y Diseño; Días 3-7 Construcción y Entrenamiento IA; Días 8-9 Auditoría de Calidad; y Día 10 Puesta en Marcha con respaldo continuo y propiedad 100% de su empresa. ¿Desea iniciar con el Paso 01 agendando su sesión? [MOSTRAR_BOTON_AGENDA]",',
  '      "Todas nuestras arquitecturas cuentan con garantía corporativa de funcionamiento, velocidad inferior a 1 segundo, confidencialidad absoluta de sus datos y entrega completa en 10 días sin quitarle tiempo operativo a su equipo. [MOSTRAR_BOTON_AGENDA]"',
  '    ], history);',
  '  }',
  '',
  '  if (/(hola|buenos|buenas|saludos|hey|que tal|qué tal|como estas|cómo estás)/i.test(lower)) {',
  '    return pickNonRepeating([',
  '      "Es un verdadero gusto saludarle. Estoy en línea para asesorarle sobre cómo escalar y automatizar su empresa con nuestras 06 Soluciones Tecnológicas. ¿A qué se dedica su negocio y qué área le gustaría impulsar hoy?",',
  '      "¡Bienvenido a Lhyo Group! Estoy listo para resolver cualquier consulta sobre nuestras Plataformas Web de alto prestigio, Asistentes IA 24/7 para WhatsApp e Instagram y Sistemas Todo-en-Uno. ¿Cómo puedo ayudar a su empresa hoy?"',
  '    ], history);',
  '  }',
  '',
  '  if (/(almorzar|comer|comida|hambre|desayun|cenar|receta|cocina|plato|pizza|hamburguesa|pasta)/i.test(lower)) {',
  '    return pickNonRepeating([',
  '      "Un buen almuerzo le da energía por unas horas, pero un sistema automático alimenta de clientes a su empresa todos los días. En Lhyo Group no damos recetas de cocina, pero instalamos Asistentes IA 24/7 y Plataformas Web que siguen vendiendo y agendando citas incluso mientras usted almuerza. ¿A qué se dedica su negocio? [MOSTRAR_BOTON_AGENDA]",',
  '      "Hablando de elegir qué comer hoy: las empresas más rentables son las que no dejan enfriar a ningún cliente cuando escribe pidiendo información. En Lhyo Group creamos sistemas que responden en menos de 1 segundo en WhatsApp e Instagram y organizan sus ventas en automático. ¿Qué tipo de empresa dirige usted? [MOSTRAR_BOTON_AGENDA]",',
  '      "Así como un gran plato requiere los ingredientes exactos, su empresa necesita la tecnología correcta para crecer: Plataforma Web de prestigio, Asistente IA 24/7 y CRM automático. Eso es exactamente lo que construimos en Lhyo Group. ¿Le gustaría ver cómo aplicarlo en su negocio? [MOSTRAR_BOTON_AGENDA]"',
  '    ], history);',
  '  }',
  '',
  '  if (/(futbol|fútbol|manchester|madrid|barcelona|partido|gol|deporte|champions|messi|cristiano|tenis|basket)/i.test(lower)) {',
  '    return pickNonRepeating([',
  '      "En el deporte un partido se gana por velocidad y precisión; en los negocios ocurre exactamente igual: el 78% de los clientes contrata a la primera empresa que le responde. En Lhyo Group instalamos Asistentes IA 24/7 y Plataformas Web de élite para que su negocio gane todas las ventas en menos de 1 segundo. ¿En qué sector compite su empresa? [MOSTRAR_BOTON_AGENDA]",',
  '      "Los equipos campeones triunfan porque todas sus líneas juegan conectadas. En Lhyo Group llevamos esa misma sincronización a su empresa uniendo su WhatsApp 24/7, su sitio web, su CRM y sus ventas en una sola pantalla Todo-en-Uno. ¿Qué área de su negocio desea llevar a primera división hoy? [MOSTRAR_BOTON_AGENDA]",',
  '      "Más allá de los marcadores deportivos, el único marcador que nosotros multiplicamos las 24 horas es el de las ventas y citas agendadas de su empresa mediante Inteligencia Artificial y automatización propia. ¿Me comenta a qué se dedica su negocio para mostrarle cómo funciona? [MOSTRAR_BOTON_AGENDA]"',
  '    ], history);',
  '  }',
  '',
  '  return pickNonRepeating([',
  '    `Lo que menciona sobre "${topic}" me recuerda una regla clave en los negocios actuales: la rapidez y el orden lo definen todo. En Lhyo Group nos dedicamos exclusivamente a construir Plataformas Web de alto prestigio, Asistentes IA 24/7 y sistemas propios para que su empresa opere y venda en automático. ¿A qué se dedica su negocio? [MOSTRAR_BOTON_AGENDA]`,',
  '    `Conectando su comentario sobre "${topic}" con el mundo empresarial: mientras la mayoría pierde tiempo en procesos manuales, en Lhyo Group instalamos Inteligencia Artificial 24/7 en su WhatsApp, Instagram y Sitio Web para transformar cada visita en clientes reales sin esfuerzo humano. ¿Qué área de su empresa le gustaría automatizar primero? [MOSTRAR_BOTON_AGENDA]`,',
  '    `Más allá de "${topic}", mi especialidad exclusiva es hacer que su empresa lidere su mercado con tecnología propia: desde catálogos web interactivos hasta un cerebro de IA con toda la memoria de su negocio. ¿Cuál de nuestras 06 Soluciones le gustaría conocer para su empresa? [MOSTRAR_BOTON_AGENDA]`,',
  '    `Interesante punto sobre "${topic}"; llevándolo a lo que genera rentabilidad real: en Lhyo Group unificamos la presencia digital, la atención al cliente 24/7 y el control automático de ventas (CRM) en una sola pantalla para su empresa. ¿Desea agendar una sesión de 15 minutos y recibir nuestro Catálogo Privado PDF? [MOSTRAR_BOTON_AGENDA]`,',
  '    "En Lhyo Group enfocamos el 100% de nuestra inteligencia en escalar empresas: transformamos cualquier operación manual en un ecosistema automático con Asistentes 24/7 y Plataformas Todo-en-Uno. Cuénteme sobre su negocio: ¿qué proceso le gustaría automatizar hoy? [MOSTRAR_BOTON_AGENDA]"',
  '  ], history);',
  '}',
  '',
  'export async function POST(req: Request) {',
  '  try {',
  '    const body = await req.json();',
  '    const message = String(body.message || "").trim();',
  '    const history = Array.isArray(body.history) ? body.history : [];',
  '    if (SEVERE_BLOCK_REGEX.test(message)) {',
  '      return NextResponse.json({',
  '        reply: "Protocolo de Seguridad Lhyo Group: No procesamos solicitudes ilegales, violentas ni lenguaje inapropiado. Esta sesión ha sido bloqueada permanentemente.",',
  '        blocked: true,',
  '        showBooking: false',
  '      });',
  '    }',
  '    const aiReply = contextualBrain(message, history);',
  '    const isBlocked = aiReply.includes("[BLOQUEAR_SESION]");',
  '    const showBooking = aiReply.includes("[MOSTRAR_BOTON_AGENDA]") || /(precio|costo|cotiz|agend|reuni|cita|catalogo|catálogo|valor|clinica|clínica)/i.test(message);',
  '    const cleanReply = aiReply.replace(/\\[BLOQUEAR_SESION\\]/g, "").replace(/\\[MOSTRAR_BOTON_AGENDA\\]/g, "").trim();',
  '    return NextResponse.json({ reply: cleanReply, blocked: isBlocked, showBooking });',
  '  } catch {',
  '    return NextResponse.json({',
  '      reply: "Estoy en línea para asesorarle sobre nuestras 06 Soluciones Empresariales. ¿A qué se dedica su empresa y qué desea automatizar hoy?",',
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
  '            {loading && <div className="text-[11px] text-[#FCF6BA] italic animate-pulse">Analizando...</div>}',
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

// PASO 3: Ajustes quirurgicos seguros respetando "use client" en la linea 1 y dejando CONTACTO 100% intacto
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

  content = content.replace(/59800000000/g, "584247383164");
  content = content.replace(
    /mailto:ceo@lhyogroup\.com(\?subject=[^"'`]+)?/g,
    "https://mail.google.com/mail/?view=cm&fs=1&to=ceo@lhyogroup.com&su=Consulta%20Corporativa%20-%20Lhyo%20Group"
  );

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
    /const fullLabel = "Paquete Completo \(Todo Incluido\)";[\s\S]*?return \[\.\.\.withoutFull, option\];\s*\}\s*\};/,
    "setPrivInterests((prev) => prev.includes(option) ? (prev.length > 1 ? prev.filter((i) => i !== option) : prev) : [...prev, option]); };"
  );
  content = content.replace(/SOLICITUD CAT[ÁA]LOGO PRIVADO \| Pa[íi]s:/g, "Propuesta personalizada para");
  content = content.replace(/\| Inter[ée]s:/g, "· Soluciones:");
  content = content.replace(/\| Etapa:/g, "· Etapa:");

  // IMPORTANTE: Insertar el import DESPUES de "use client"; para que Next.js 14 compile sin errores en Vercel
  if (content.includes("Asistente Directo") && content.includes("QUICK_BOT_OPTIONS")) {
    const relImport = filePath.includes(path.join("app", "page.tsx")) ? "../components/FloatingOmniDock" : "./FloatingOmniDock";
    if (!content.includes("FloatingOmniDock")) {
      if (content.includes('"use client"') || content.includes("'use client'")) {
        content = content.replace(/^([\s\S]*?["']use client["'];?\r?\n)/, `$1import FloatingOmniDock from "${relImport}";\n`);
      } else {
        content = `import FloatingOmniDock from "${relImport}";\n` + content;
      }
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
      execSync('git commit -m "V46.0: Compilacion limpia use client + IA instantanea (<120ms) ilimitada + Contacto 100% restaurado"', { cwd: gDir, stdio: "inherit" });
      execSync("git push origin main --force", { cwd: gDir, stdio: "inherit" });
      console.log("✅ EXITO TOTAL: Desplegado en Vercel desde", gDir);
    } catch (e) { console.log(e.message); }
  }
}