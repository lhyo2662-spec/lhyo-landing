"use client";

import React, { useState, useEffect, useRef } from "react";

interface ChatMsg {
  role: "user" | "assistant";
  text: string;
}

interface LeadData {
  lead_name: string;
  company_name: string;
  pain_point: string;
  revenue_tier: string;
}

interface SpeechRecognitionResultItem {
  transcript: string;
}

interface SpeechRecognitionEventLike {
  results: {
    length: number;
    [index: number]: {
      isFinal?: boolean;
      [subIndex: number]: SpeechRecognitionResultItem;
    };
  };
}

interface SpeechRecognitionInstance {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

const INITIAL_GREETING =
  "Está interactuando con la dirección de admisiones de Lhyo Group. Cuénteme con total confianza: ¿con quién tengo el gusto, a qué se dedica su empresa o proyecto y qué le gustaría mejorar hoy?";

function deduplicateSpokenSegments(resultsList: SpeechRecognitionEventLike["results"]): string {
  const segments: string[] = [];
  for (let i = 0; i < resultsList.length; i++) {
    const seg = (resultsList[i]?.[0]?.transcript || "").trim();
    if (seg) segments.push(seg);
  }
  if (segments.length === 0) return "";

  const merged: string[] = [];
  for (let i = 0; i < segments.length; i++) {
    const cur = segments[i];
    const prev = merged[merged.length - 1] || "";
    if (!prev) {
      merged.push(cur);
    } else if (cur.toLowerCase().startsWith(prev.toLowerCase())) {
      merged[merged.length - 1] = cur;
    } else if (!prev.toLowerCase().startsWith(cur.toLowerCase()) && cur.toLowerCase() !== prev.toLowerCase()) {
      merged.push(cur);
    }
  }

  const words = merged.join(" ").replace(/\s+/g, " ").trim().split(" ");
  const cleanWords: string[] = [];
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const last = cleanWords[cleanWords.length - 1];
    if (!last || w.toLowerCase() !== last.toLowerCase()) {
      cleanWords.push(w);
    }
  }
  return cleanWords.join(" ");
}

export default function FloatingOmniDock() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: "assistant", text: INITIAL_GREETING }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [turnCount, setTurnCount] = useState(1);
  const [leadState, setLeadState] = useState<LeadData>({
    lead_name: "PENDIENTE",
    company_name: "PENDIENTE",
    pain_point: "PENDIENTE",
    revenue_tier: "PENDIENTE"
  });

  const [isListening, setIsListening] = useState(false);
  const [listenSeconds, setListenSeconds] = useState(0);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prefixTextRef = useRef<string>("");

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, isListening]);

  const stopVoiceRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignorar cierre
      }
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsListening(false);
    setListenSeconds(0);
  };

  const handleCloseAndReset = () => {
    stopVoiceRecognition();
    setChatOpen(false);
    setMessages([{ role: "assistant", text: INITIAL_GREETING }]);
    setInput("");
    setIsBlocked(false);
    setTurnCount(1);
    setLeadState({
      lead_name: "PENDIENTE",
      company_name: "PENDIENTE",
      pain_point: "PENDIENTE",
      revenue_tier: "PENDIENTE"
    });
  };

  const toggleMicrophone = () => {
    if (isBlocked) return;
    if (isListening) {
      stopVoiceRecognition();
      return;
    }

    const win = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionInstance;
      webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
    };
    const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!SpeechRec) return;

    prefixTextRef.current = input.trim();

    const recognition = new SpeechRec();
    recognition.lang = "es-ES";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
      setListenSeconds(0);
      timerRef.current = setInterval(() => {
        setListenSeconds((prev) => prev + 1);
      }, 1000);
    };

    recognition.onresult = (event: SpeechRecognitionEventLike) => {
      const cleanSpoken = deduplicateSpokenSegments(event.results);
      const base = prefixTextRef.current;
      setInput(base ? `${base} ${cleanSpoken}`.trim() : cleanSpoken);
    };

    recognition.onerror = () => stopVoiceRecognition();
    recognition.onend = () => stopVoiceRecognition();

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isBlocked || loading) return;
    if (isListening) stopVoiceRecognition();

    const text = input.trim();
    if (!text) return;

    const updatedHistory: ChatMsg[] = [...messages, { role: "user", text }];
    setMessages(updatedHistory);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat-lhyo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: updatedHistory,
          currentLead: leadState,
          turn_count: turnCount
        })
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            data.reply ||
            "En Lhyo Group estamos listos para escalar su empresa con nuestras 06 Soluciones Oficiales. ¿Con quién tengo el gusto?"
        }
      ]);
      setTurnCount((n) => n + 1);

      if (data.blocked) {
        setIsBlocked(true);
      }

      setLeadState({
        lead_name: data.lead_name || leadState.lead_name,
        company_name: data.company_name || leadState.company_name,
        pain_point: data.pain_point || leadState.pain_point,
        revenue_tier: data.revenue_tier || leadState.revenue_tier
      });
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Es un gusto atenderle en Lhyo Group. ¿Con quién tengo el gusto y qué área de su negocio desea automatizar o escalar hoy?"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-3 sm:right-5 z-[99990] flex flex-col items-end select-none">
      {chatOpen && (
        <div className="mb-3 w-[calc(100vw-24px)] sm:w-[410px] rounded-2xl border border-[#C5A059]/60 bg-[#070910] shadow-[0_25px_90px_rgba(0,0,0,0.96)] overflow-hidden flex flex-col">
          <div className="px-4 py-3 bg-[#0B0E18] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF66] opacity-90" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00FF66] shadow-[0_0_10px_#00FF66]" />
              </span>
              <div>
                <h3 className="text-[11px] sm:text-xs font-extrabold tracking-wider text-white uppercase">
                  ASISTENTE EJECUTIVO IA · LHYO GROUP
                </h3>
                <p className="text-[10px] font-semibold text-[#00FF66]">
                  En Línea 24/7 · Inteligencia Artificial en Vivo
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCloseAndReset}
              className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-gray-300 text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div
            ref={scrollRef}
            className="h-[330px] sm:h-[360px] overflow-y-auto p-4 space-y-3 bg-[#06070C]"
          >
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[87%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-line ${
                    m.role === "user"
                      ? "bg-gradient-to-r from-[#C5A059] via-[#E5C77D] to-[#B38728] text-[#050507] font-semibold"
                      : "bg-[#0B0F1C] border border-[#C5A059]/25 text-[#F2F2F5]"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-[#EFE2BA] px-2">
                <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-ping" />
                <span>Analizando y redactando respuesta ejecutiva...</span>
              </div>
            )}
          </div>

          {isListening && (
            <div className="px-4 py-2 bg-[#071F15] border-t border-[#00FF66]/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-end gap-0.5 h-3.5">
                  <span className="w-1 bg-[#00FF66] animate-pulse h-2 rounded-full" />
                  <span className="w-1 bg-[#00FF66] animate-bounce h-3.5 rounded-full" />
                  <span className="w-1 bg-[#00FF66] animate-pulse h-2.5 rounded-full" />
                  <span className="w-1 bg-[#00FF66] animate-bounce h-3 rounded-full" />
                </div>
                <span className="text-[11px] font-bold text-[#00FF66]">
                  🎙️ ESCUCHANDO AHORA (00:0{listenSeconds}) · Hable con normalidad
                </span>
              </div>
              <button
                type="button"
                onClick={stopVoiceRecognition}
                className="px-2.5 py-0.5 rounded-md bg-red-500/20 border border-red-400/40 text-[10px] text-red-200 font-bold cursor-pointer"
              >
                Listo ⏹
              </button>
            </div>
          )}

          <form
            onSubmit={handleSend}
            className="p-2.5 sm:p-3 bg-[#090C15] border-t border-white/10 flex items-center gap-2"
          >
            <input
              type="text"
              disabled={isBlocked}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isBlocked
                  ? "Sesión bloqueada por protocolo de seguridad."
                  : "Haga cualquier consulta sobre su negocio..."
              }
              className="flex-1 min-w-0 rounded-xl bg-[#05070C] border border-[#C5A059]/35 focus:border-[#C5A059] px-3 py-2 text-xs text-white placeholder-gray-500 outline-none disabled:opacity-40 select-text"
            />
            <button
              type="button"
              disabled={isBlocked}
              onClick={toggleMicrophone}
              title={isListening ? "Detener micrófono" : "Hablar por micrófono"}
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition cursor-pointer shrink-0 ${
                isListening
                  ? "bg-[#00FF66]/20 border-[#00FF66] text-[#00FF66] shadow-[0_0_12px_rgba(0,255,102,0.45)]"
                  : "bg-[#0D111E] border-[#C5A059]/40 text-[#EFE2BA] hover:border-[#C5A059]"
              } disabled:opacity-40`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </button>
            <button
              type="submit"
              disabled={isBlocked || loading}
              className="px-3.5 sm:px-4 h-9 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#E5C77D] to-[#B38728] text-[#050507] font-extrabold text-xs uppercase tracking-wider shadow cursor-pointer disabled:opacity-40 shrink-0"
            >
              Enviar
            </button>
          </form>

          <div className="px-4 py-2 bg-[#05070C] border-t border-white/5 flex items-center justify-between text-[11px]">
            <span className="text-gray-400">¿Prefiere atención en WhatsApp?</span>
            <a
              href="https://wa.me/584247383164?text=Hola%20Lhyo%20Group%2C%20les%20escribo%20desde%20su%20sitio%20web%20oficial."
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#EFE2BA] hover:text-[#C5A059] transition"
            >
              Abrir WhatsApp →
            </a>
          </div>
        </div>
      )}

      <div className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-[#C5A059]/45 bg-[#08090E]/95 backdrop-blur-xl px-2 py-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.9)]">
        <a
          href="https://www.instagram.com/lhyogroup"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram Oficial"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/15 bg-[#10121A] hover:border-[#C5A059] text-[#F2F2F5] flex items-center justify-center transition"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85">
            <rect x="2.5" y="2.5" width="19" height="19" rx="4.5" />
            <circle cx="12" cy="12" r="4.2" />
            <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
          </svg>
        </a>

        <a
          href="https://www.linkedin.com/company/lhyogroup"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn Oficial"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/15 bg-[#10121A] hover:border-[#C5A059] text-[#F2F2F5] flex items-center justify-center transition"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
            <rect x="2.5" y="2.5" width="19" height="19" rx="4.5" stroke="currentColor" strokeWidth="1.85" />
            <circle cx="8.1" cy="8.2" r="1.35" fill="currentColor" />
            <path d="M6.9 10.6H9.3V17.2H6.9V10.6Z" fill="currentColor" />
            <path
              d="M11.1 10.6H13.35V11.55C13.72 10.92 14.48 10.42 15.52 10.42C17.22 10.42 18.1 11.45 18.1 13.38V17.2H15.7V13.82C15.7 12.88 15.32 12.35 14.55 12.35C13.78 12.35 13.45 12.88 13.45 13.82V17.2H11.1V10.6Z"
              fill="currentColor"
            />
          </svg>
        </a>

        <button
          type="button"
          onClick={() => (chatOpen ? handleCloseAndReset() : setChatOpen(true))}
          className="px-3.5 sm:px-5 h-8 sm:h-9 rounded-full bg-gradient-to-r from-[#C5A059] via-[#E5C77D] to-[#B38728] text-[#08080A] font-bold text-[10px] sm:text-xs tracking-wider uppercase flex items-center gap-2 shadow-md hover:brightness-105 transition cursor-pointer"
        >
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF66] opacity-95" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00FF66] shadow-[0_0_10px_#00FF66]" />
          </span>
          <span className="truncate">
            {chatOpen ? "CERRAR ASISTENTE IA" : "✦ ASISTENTE IA 24/7 / WHATSAPP"}
          </span>
        </button>
      </div>
    </div>
  );
}
