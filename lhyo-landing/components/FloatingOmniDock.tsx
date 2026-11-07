"use client";

import React, { useState, useRef, useEffect } from "react";

interface ChatMsg {
  sender: "bot" | "user";
  text: string;
}

const INITIAL_GREETING =
  "Está interactuando con la infraestructura cognitiva de Lhyo Group. Soy su Asistente Ejecutivo de Inteligencia Artificial.\n\nPara brindarle una asesoría a la medida de su negocio, cuénteme: ¿con quién tengo el gusto, a qué se dedica su empresa y qué le gustaría mejorar o automatizar hoy?";

export default function FloatingOmniDock() {
  const [chatOpen, setChatOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [listenSeconds, setListenSeconds] = useState(0);
  const [micHint, setMicHint] = useState("");
  const [isBlocked, setIsBlocked] = useState(false);

  const [messages, setMessages] = useState<ChatMsg[]>([
    { sender: "bot", text: INITIAL_GREETING }
  ]);
  const [leadState, setLeadState] = useState({
    lead_name: "PENDIENTE",
    company_name: "PENDIENTE",
    pain_point: "PENDIENTE",
    revenue_tier: "PENDIENTE"
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, isListening]);

  // Contador visual de segundos cuando el micrófono está escuchando
  useEffect(() => {
    if (isListening) {
      setListenSeconds(0);
      timerRef.current = setInterval(() => {
        setListenSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setListenSeconds(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isListening]);

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
  };

  const handleCloseAndReset = () => {
    stopListening();
    setChatOpen(false);
    if (!isBlocked) {
      setMessages([{ sender: "bot", text: INITIAL_GREETING }]);
      setLeadState({
        lead_name: "PENDIENTE",
        company_name: "PENDIENTE",
        pain_point: "PENDIENTE",
        revenue_tier: "PENDIENTE"
      });
      setInputMsg("");
      setMicHint("");
    }
  };

  // Micrófono con transcripción en vivo e indicador claro de cuándo hablar
  const handleVoiceMic = () => {
    if (isBlocked || loading) return;

    if (isListening) {
      stopListening();
      setMicHint("✓ Dictado finalizado. Puede revisar su texto y tocar Enviar.");
      setTimeout(() => setMicHint(""), 3500);
      return;
    }

    const SpeechRec =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRec) {
      setMicHint("⚠️ Su navegador no soporta dictado por voz. Use Google Chrome o Safari.");
      setTimeout(() => setMicHint(""), 4000);
      return;
    }

    try {
      const rec = new SpeechRec();
      rec.lang = "es-ES";
      rec.interimResults = true;
      rec.continuous = true;
      rec.maxAlternatives = 1;

      const baseText = inputMsg ? inputMsg.trim() + " " : "";

      rec.onstart = () => {
        setIsListening(true);
        setMicHint("");
      };

      rec.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          const transcriptPiece = event.results[i][0]?.transcript || "";
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPiece + " ";
          } else {
            interimTranscript += transcriptPiece;
          }
        }
        setInputMsg((baseText + finalTranscript + interimTranscript).trimStart());
      };

      rec.onerror = () => {
        setIsListening(false);
        setMicHint("⚠️ Permita el acceso al micrófono en su navegador para hablar.");
        setTimeout(() => setMicHint(""), 4000);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
      rec.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleOpenAgendaModal = () => {
    window.dispatchEvent(new CustomEvent("lhyo-open-audit-modal"));
    const el = document.getElementById("contacto");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isListening) stopListening();
    const userText = inputMsg.trim();
    if (!userText || loading || isBlocked) return;

    setInputMsg("");
    setMicHint("");

    const updatedMessages: ChatMsg[] = [...messages, { sender: "user", text: userText }];
    setMessages(updatedMessages);
    setLoading(true);

    const historyPayload = updatedMessages.slice(1).map((m) => ({
      role: m.sender === "user" ? ("user" as const) : ("assistant" as const),
      text: m.text
    }));

    try {
      const res = await fetch("/api/chat-lhyo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          history: historyPayload,
          currentLead: leadState
        })
      });
      const data = await res.json();

      if (data.blocked) {
        setIsBlocked(true);
      }

      setLeadState({
        lead_name: data.lead_name || leadState.lead_name,
        company_name: data.company_name || leadState.company_name,
        pain_point: data.pain_point || leadState.pain_point,
        revenue_tier: data.revenue_tier || leadState.revenue_tier
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text:
            data.reply ||
            "Con todo gusto le orientamos en Lhyo Group. ¿Cuál es el giro de su negocio?"
        }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Estamos listos para atenderle. Cuénteme: ¿a qué se dedica su empresa y qué área desea impulsar hoy?"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-[9000] flex flex-col items-end gap-2.5 select-none max-w-[calc(100vw-24px)]">
      {chatOpen && (
        <div className="w-[calc(100vw-24px)] sm:w-[415px] max-w-[415px] rounded-2xl border border-[#C5A059]/75 bg-[#08080A]/98 backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden mb-1">
          {/* Cabecera Ejecutiva */}
          <div className="px-4 py-3 bg-gradient-to-r from-[#12100E] via-[#0B0B0E] to-[#08080A] border-b border-[#C5A059]/25 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="relative flex h-3 w-3 shrink-0">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-90 ${
                    isBlocked ? "bg-red-500" : "bg-[#00FF66]"
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-3 w-3 ${
                    isBlocked
                      ? "bg-red-500"
                      : "bg-[#00FF66] shadow-[0_0_12px_#00FF66]"
                  }`}
                />
              </span>
              <div className="truncate">
                <span className="text-[11px] sm:text-xs font-semibold text-[#EFE2BA] uppercase tracking-wider block truncate">
                  Asistente Ejecutivo IA · Lhyo Group
                </span>
                <span
                  className={`text-[10px] font-medium block truncate ${
                    isBlocked ? "text-red-400" : "text-[#00FF66]"
                  }`}
                >
                  {isBlocked
                    ? "Sesión Bloqueada por Seguridad"
                    : "En Línea 24/7 · Gem Corporativo en Vivo"}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCloseAndReset}
              className="w-7 h-7 rounded-full bg-white/5 text-gray-300 text-xs flex items-center justify-center cursor-pointer hover:text-white shrink-0"
            >
              ✕
            </button>
          </div>

          {/* Historial de Mensajes */}
          <div
            ref={scrollRef}
            className="p-3.5 sm:p-4 space-y-3 max-h-[52vh] sm:max-h-[325px] overflow-y-auto bg-[#08080A] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-[#08080A] [&::-webkit-scrollbar-thumb]:bg-[#C5A059]/45 [&::-webkit-scrollbar-thumb]:rounded-full"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex flex-col ${
                  m.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-line break-words ${
                    m.sender === "user"
                      ? "bg-gradient-to-r from-[#C5A059] via-[#E5C77D] to-[#B38728] text-[#08080A] font-semibold"
                      : "bg-[#111015] border border-[#C5A059]/30 text-[#E4E4E7]"
                  }`}
                >
                  {m.text}
                </div>
                {m.sender === "bot" && i > 0 && !isBlocked && (
                  <button
                    type="button"
                    onClick={handleOpenAgendaModal}
                    className="mt-1.5 px-3 py-1.5 rounded-xl bg-[#C5A059]/15 border border-[#C5A059]/45 text-[#EFE2BA] text-[10px] font-semibold hover:bg-[#C5A059]/25 transition cursor-pointer"
                  >
                    📅 Agendar Reunión y Recibir Catálogo PDF →
                  </button>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-[11px] text-[#EFE2BA] italic px-1">
                <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-ping" />
                <span>Analizando y redactando respuesta para su negocio...</span>
              </div>
            )}
          </div>

          {/* NUEVO INDICADOR VISUAL DE MICRÓFONO ESCUCHANDO EN VIVO */}
          {isListening && !isBlocked && (
            <div className="px-3.5 py-2.5 bg-gradient-to-r from-emerald-950/90 via-[#0E1F18] to-emerald-950/90 border-t border-emerald-500/45 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Ecualizador animado de 5 barras de voz */}
                <div className="flex items-end gap-0.5 h-4 shrink-0">
                  <span className="w-1 bg-[#00FF66] rounded-full animate-bounce h-2" />
                  <span
                    className="w-1 bg-[#00FF66] rounded-full animate-bounce h-4"
                    style={{ animationDelay: "120ms" }}
                  />
                  <span
                    className="w-1 bg-[#00FF66] rounded-full animate-bounce h-3"
                    style={{ animationDelay: "240ms" }}
                  />
                  <span
                    className="w-1 bg-[#00FF66] rounded-full animate-bounce h-4"
                    style={{ animationDelay: "360ms" }}
                  />
                  <span
                    className="w-1 bg-[#00FF66] rounded-full animate-bounce h-2"
                    style={{ animationDelay: "480ms" }}
                  />
                </div>
                <div className="truncate">
                  <span className="text-[11px] font-bold text-[#00FF66] block truncate">
                    🎙️ ESCUCHANDO AHORA ({formatTimer(listenSeconds)}) · Hable con normalidad
                  </span>
                  <span className="text-[10px] text-emerald-200/80 block truncate">
                    Su voz se está escribiendo abajo en tiempo real...
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleVoiceMic}
                className="px-2.5 py-1 rounded-lg bg-red-500/20 border border-red-400/50 text-red-200 text-[10px] font-bold shrink-0 hover:bg-red-500/35 cursor-pointer"
              >
                Detener ⏹
              </button>
            </div>
          )}

          {micHint && !isListening && (
            <div className="px-3.5 py-1.5 bg-[#12100E] border-t border-[#C5A059]/25 text-[10px] text-[#EFE2BA]">
              {micHint}
            </div>
          )}

          {/* Barra de Entrada con Botón de Micrófono Inteligente */}
          <form
            onSubmit={handleSend}
            className="p-2.5 sm:p-3 bg-[#0E0D12] border-t border-white/10 flex items-center gap-1.5 sm:gap-2"
          >
            <input
              type="text"
              disabled={isBlocked}
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder={
                isBlocked
                  ? "Sesión bloqueada permanentemente."
                  : isListening
                  ? "Hable ahora... estamos transcribiendo su voz"
                  : "Escriba o toque el micrófono 🎙️ para hablar..."
              }
              className={`flex-1 min-w-0 bg-[#08080A] border rounded-xl px-3 py-2 text-xs text-white outline-none transition ${
                isListening
                  ? "border-[#00FF66] shadow-[0_0_12px_rgba(0,255,102,0.25)]"
                  : "border-white/15 focus:border-[#C5A059]"
              } disabled:opacity-40`}
            />
            <button
              type="button"
              disabled={isBlocked || loading}
              onClick={handleVoiceMic}
              title={isListening ? "Detener micrófono" : "Hablar por micrófono"}
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition cursor-pointer shrink-0 disabled:opacity-40 ${
                isListening
                  ? "border-[#00FF66] bg-[#00FF66]/20 text-[#00FF66] shadow-[0_0_15px_rgba(0,255,102,0.45)] animate-pulse"
                  : "border-white/15 bg-white/5 text-[#EFE2BA] hover:border-[#C5A059]"
              }`}
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="22" />
              </svg>
            </button>
            <button
              type="submit"
              disabled={loading || isBlocked}
              className="px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#E5C77D] to-[#B38728] text-[#08080A] font-bold text-xs cursor-pointer shrink-0 disabled:opacity-40"
            >
              Enviar
            </button>
          </form>

          {/* Pie de enlace directo a WhatsApp */}
          <div className="px-4 py-2 bg-[#08080A] border-t border-white/10 flex items-center justify-between text-[11px]">
            <span className="text-[#A3A3AC]">¿Prefiere atención en WhatsApp?</span>
            <a
              href="https://wa.me/584247383164?text=Hola%20Lhyo%20Group%2C%20les%20escribo%20desde%20su%20sitio%20web%20oficial."
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#EFE2BA] font-semibold hover:underline"
            >
              Abrir WhatsApp →
            </a>
          </div>
        </div>
      )}

      {/* Barra Flotante Inferior Responsiva (No se desborda en ningún teléfono) */}
      <div className="flex items-center gap-1.5 sm:gap-2 rounded-full bg-[#080A10]/95 backdrop-blur-xl border border-[#C5A059]/60 p-1.5 pl-2 sm:pl-2.5 shadow-2xl max-w-full">
        <a
          href="https://www.instagram.com/lhyogroup"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram Oficial Lhyo Group"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/10 bg-white/[0.03] hover:border-[#C5A059] flex items-center justify-center text-[#EFE2BA] transition shrink-0"
        >
          <InstagramSvg />
        </a>
        <a
          href="https://www.linkedin.com/company/lhyogroup"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn Oficial Lhyo Group"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/10 bg-white/[0.03] hover:border-[#C5A059] flex items-center justify-center text-[#EFE2BA] transition shrink-0"
        >
          <LinkedInSvg />
        </a>
        <button
          type="button"
          onClick={() => (chatOpen ? handleCloseAndReset() : setChatOpen(true))}
          className="px-3.5 sm:px-5 h-8 sm:h-9 rounded-full bg-gradient-to-r from-[#C5A059] via-[#E5C77D] to-[#B38728] text-[#08080A] font-bold text-[10px] sm:text-xs tracking-wider uppercase flex items-center gap-2 hover:brightness-105 transition cursor-pointer truncate"
        >
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF66] opacity-95" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00FF66] shadow-[0_0_10px_#00FF66]" />
          </span>
          <span className="truncate">
            {chatOpen ? "Cerrar Asistente IA" : "✦ Asistente IA 24/7 / WhatsApp"}
          </span>
        </button>
      </div>
    </div>
  );
}