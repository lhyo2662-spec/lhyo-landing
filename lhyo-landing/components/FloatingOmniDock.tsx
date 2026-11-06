"use client";

import React, { useState, useRef, useEffect } from "react";

const INITIAL_MESSAGE =
  "Está interactuando con la infraestructura cognitiva de Lhyo Group. Soy su Asistente Ejecutivo de Inteligencia Artificial.\n\nPara brindarle una asesoría a la medida de su negocio, cuénteme: ¿con quién tengo el gusto, a qué se dedica su empresa y qué le gustaría mejorar o automatizar hoy?";

interface ChatMsg {
  sender: "bot" | "user";
  text: string;
  blocked?: boolean;
  showAgendaBtn?: boolean;
}

export default function FloatingOmniDock() {
  const [chatOpen, setChatOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    { sender: "bot", text: INITIAL_MESSAGE }
  ]);
  const [leadState, setLeadState] = useState({
    lead_name: "PENDIENTE",
    company_name: "PENDIENTE",
    pain_point: "PENDIENTE",
    revenue_tier: "PENDIENTE",
    turn_count: 0
  });
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleCloseAndResetMemory = () => {
    setChatOpen(false);
    setIsBlocked(false);
    setIsListening(false);
    setInputMsg("");
    setMessages([{ sender: "bot", text: INITIAL_MESSAGE }]);
    setLeadState({
      lead_name: "PENDIENTE",
      company_name: "PENDIENTE",
      pain_point: "PENDIENTE",
      revenue_tier: "PENDIENTE",
      turn_count: 0
    });
  };

  const handleVoiceMic = () => {
    if (isBlocked || loading) return;
    const w = window as unknown as {
      SpeechRecognition?: new () => {
        lang: string;
        interimResults: boolean;
        onresult: (e: { results: { transcript: string }[][] }) => void;
        onerror: () => void;
        onend: () => void;
        start: () => void;
      };
      webkitSpeechRecognition?: new () => {
        lang: string;
        interimResults: boolean;
        onresult: (e: { results: { transcript: string }[][] }) => void;
        onerror: () => void;
        onend: () => void;
        start: () => void;
      };
    };
    const SpeechRec = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SpeechRec) return;
    const recognition = new SpeechRec();
    recognition.lang = "es-ES";
    recognition.interimResults = false;
    setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      if (transcript) {
        setInputMsg((prev) => (prev ? `${prev} ${transcript}` : transcript));
      }
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const userText = inputMsg.trim();
    if (!userText || loading || isBlocked) return;
    setInputMsg("");

    const nextMessages: ChatMsg[] = [...messages, { sender: "user", text: userText }];
    setMessages(nextMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/chat-lhyo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          history: nextMessages,
          currentLead: leadState
        })
      });

      const data = await res.json();
      setLeadState({
        lead_name: data.lead_name || leadState.lead_name,
        company_name: data.company_name || leadState.company_name,
        pain_point: data.pain_point || leadState.pain_point,
        revenue_tier: data.revenue_tier || leadState.revenue_tier,
        turn_count: data.turn_count || leadState.turn_count + 1
      });

      if (data.blocked) {
        setIsBlocked(true);
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text:
            data.reply ||
            "Con todo gusto le orientamos. ¿Con quién tengo el gusto y qué área de su negocio desea impulsar?",
          blocked: Boolean(data.blocked),
          showAgendaBtn: Boolean(data.ready_for_crm)
        }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Estoy en línea para asistirle. Cuénteme: ¿cuál es su nombre y qué área de su negocio le gustaría automatizar o mejorar hoy?"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const openExecutiveAgendaModal = () => {
    window.dispatchEvent(new CustomEvent("lhyo-open-audit-modal"));
  };

  return (
    <div className="fixed bottom-5 right-5 z-[9000] flex flex-col items-end gap-3 select-none">
      {chatOpen && (
        <div className="w-[350px] sm:w-[415px] rounded-2xl border border-[#C5A059]/75 bg-[#050507]/95 backdrop-blur-xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden mb-1">
          <div className="px-4 py-3.5 bg-gradient-to-r from-[#0A1128] via-[#091024] to-[#050507] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-90 ${
                    isBlocked ? "bg-red-500" : "bg-[#00FF66]"
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-3 w-3 ${
                    isBlocked ? "bg-red-500" : "bg-[#00FF66] shadow-[0_0_12px_#00FF66]"
                  }`}
                />
              </span>
              <div>
                <span className="text-xs font-bold text-[#FCF6BA] uppercase tracking-wider block">
                  ASISTENTE EJECUTIVO IA · LHYO GROUP
                </span>
                <span
                  className={`text-[10px] font-semibold ${
                    isBlocked ? "text-red-400" : "text-[#00FF66]"
                  }`}
                >
                  {isBlocked
                    ? "Sesión Bloqueada por Seguridad"
                    : "En Línea 24/7 · Inteligencia Artificial en Vivo"}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCloseAndResetMemory}
              title="Cerrar y limpiar memoria de sesión"
              className="w-7 h-7 rounded-full bg-white/5 text-gray-300 text-xs flex items-center justify-center cursor-pointer hover:text-white"
            >
              ✕
            </button>
          </div>

          <div
            ref={scrollRef}
            className="p-4 space-y-3 max-h-[320px] overflow-y-auto bg-[#050507]"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[87%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-line ${
                    m.sender === "user"
                      ? "bg-gradient-to-r from-[#C5A059] via-[#FCF6BA] to-[#B38728] text-[#050507] font-semibold"
                      : m.blocked
                      ? "bg-red-950/90 border border-red-500/60 text-red-200 font-semibold"
                      : "bg-[#0A1128]/90 border border-[#C5A059]/45 text-gray-100"
                  }`}
                >
                  {m.text}
                  {m.showAgendaBtn && (
                    <button
                      type="button"
                      onClick={openExecutiveAgendaModal}
                      className="mt-3 w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#FCF6BA] to-[#B38728] text-[#050507] font-extrabold text-[11px] uppercase tracking-wider shadow-lg cursor-pointer block text-center"
                    >
                      📅 Agendar Reunión y Recibir Catálogo PDF →
                    </button>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-[11px] text-[#FCF6BA] italic">Analizando y redactando...</div>
            )}
          </div>

          <form
            onSubmit={handleSend}
            className="p-3 bg-[#0A1128]/60 border-t border-white/10 flex items-center gap-2"
          >
            <input
              type="text"
              disabled={isBlocked}
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder={
                isBlocked
                  ? "Sesión bloqueada permanentemente."
                  : "Haga cualquier consulta sobre su negocio..."
              }
              className="flex-1 bg-[#050507] border border-white/15 focus:border-[#C5A059] rounded-xl px-3 py-2 text-xs text-white outline-none disabled:opacity-40"
            />
            <button
              type="button"
              disabled={isBlocked}
              onClick={handleVoiceMic}
              title="Hablar por micrófono"
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition cursor-pointer disabled:opacity-40 ${
                isListening
                  ? "bg-red-500/20 border-red-400 text-red-400 animate-pulse"
                  : "bg-[#050507] border-[#C5A059]/50 text-[#FCF6BA] hover:border-[#C5A059]"
              }`}
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
              disabled={loading || isBlocked}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#FCF6BA] to-[#B38728] text-[#050507] font-bold text-xs cursor-pointer disabled:opacity-40"
            >
              Enviar
            </button>
          </form>

          <div className="px-4 py-2.5 bg-[#050507] border-t border-white/10 flex items-center justify-between text-[11px]">
            <span className="text-gray-400">¿Prefiere atención en WhatsApp?</span>
            <a
              href="https://wa.me/584247383164?text=Hola%20Lhyo%20Group%2C%20les%20escribo%20desde%20su%20sitio%20web%20oficial."
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FCF6BA] font-bold hover:underline"
            >
              Abrir WhatsApp →
            </a>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 rounded-full bg-[#080A10]/95 backdrop-blur-xl border border-[#C5A059]/60 p-1.5 pl-2.5 shadow-2xl">
        <a
          href="https://www.instagram.com/lhyogroup"
          target="_blank"
          rel="noopener noreferrer"
          title="Instagram Oficial Lhyo Group"
          className="w-9 h-9 rounded-full border border-white/10 bg-white/[0.03] hover:border-[#C5A059] flex items-center justify-center text-[#FCF6BA] transition"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </a>
        <a
          href="https://www.linkedin.com/company/lhyogroup"
          target="_blank"
          rel="noopener noreferrer"
          title="LinkedIn Corporativo Lhyo Group"
          className="w-9 h-9 rounded-full border border-white/10 bg-white/[0.03] hover:border-[#C5A059] flex items-center justify-center text-[#FCF6BA] transition"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
          </svg>
        </a>
        <button
          type="button"
          onClick={() => (chatOpen ? handleCloseAndResetMemory() : setChatOpen(true))}
          className="px-5 h-9 rounded-full bg-gradient-to-r from-[#C5A059] via-[#FCF6BA] to-[#B38728] text-[#050507] font-bold text-xs tracking-wider uppercase flex items-center gap-2.5 hover:brightness-105 transition cursor-pointer"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF66] opacity-90" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00FF66] border border-black/30 shadow-[0_0_10px_#00FF66]" />
          </span>
          <span>{chatOpen ? "Cerrar Asistente IA" : "✦ Asistente IA 24/7 / WhatsApp"}</span>
        </button>
      </div>
    </div>
  );
}
