"use client";

import { useState } from "react";

export const SOCIAL_LINKS = {
  whatsappPhone: "59800000000",
  instagramUrl: "https://www.instagram.com/lhyogroup",
  linkedinUrl: "https://www.linkedin.com/company/lhyogroup",
  emailAddress: "lhyoaraque2662@gmail.com"
};

const QUICK_BOT_OPTIONS = [
  {
    label: "🤖 Quiero automatizar mi WhatsApp / Instagram",
    text: "Hola Lhyo Group, estoy en su página web y me gustaría recibir información sobre los Asistentes Inteligentes 24/7 para WhatsApp e Instagram."
  },
  {
    label: "💻 Quiero cotizar una Página Web Moderna",
    text: "Hola Lhyo Group, visité su web y quiero cotizar el desarrollo de una Página Web Corporativa para mi negocio."
  },
  {
    label: "📊 Quiero organizar mis clientes con un CRM",
    text: "Hola Lhyo Group, me interesa implementar el sistema de Organización Automática de Clientes (CRM)."
  },
  {
    label: "💬 Hacer una consulta rápida sin agendar reunión",
    text: "Hola Lhyo Group, tengo una consulta rápida sobre sus servicios antes de agendar una sesión."
  }
];

export default function FloatingOmniDock() {
  const [chatOpen, setChatOpen] = useState(false);

  const buildWaUrl = (msg: string) =>
    `https://wa.me/${SOCIAL_LINKS.whatsappPhone}?text=${encodeURIComponent(msg)}`;

  return (
    <div className="fixed bottom-5 right-5 z-[9000] flex flex-col items-end gap-3 select-none">
      {/* Ventana de Chatbot Rápido para quienes no desean agendar aún */}
      {chatOpen && (
        <div className="w-80 sm:w-96 border border-[#BF953F] bg-[#070707] shadow-[0_20px_60px_rgba(0,0,0,0.95)] p-5 mb-1">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1E293B]">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <span className="text-xs font-bold text-[#FCF6BA] block tracking-wider">
                  ASISTENTE DIRECTO · LHYO GROUP
                </span>
                <span className="text-[10px] text-gray-400 block">
                   ¿Prefieres hablar por chat antes de agendar?
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setChatOpen(false)}
              className="w-7 h-7 border border-[#1E293B] bg-[#0B132B] text-gray-300 hover:text-white text-xs font-bold flex items-center justify-center"
            >
              ✕
            </button>
          </div>

          <p className="text-xs text-gray-300 mb-3 leading-relaxed">
            Selecciona tu consulta para iniciar conversación inmediata en nuestro WhatsApp o escríbenos por nuestras redes oficiales:
          </p>

          <div className="space-y-2 mb-4">
            {QUICK_BOT_OPTIONS.map((opt, i) => (
              <a
                key={i}
                href={buildWaUrl(opt.text)}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-left px-3.5 py-2.5 text-xs font-medium bg-[#090D16] border border-[#1E293B] text-gray-200 hover:border-[#BF953F] hover:text-[#FCF6BA] transition"
              >
                {opt.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-[#1E293B] flex items-center justify-between text-[11px] text-gray-400">
            <span>Canales Oficiales:</span>
            <div className="flex items-center gap-3">
              <a
                href={SOCIAL_LINKS.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FCF6BA] hover:underline font-bold"
              >
                Instagram
              </a>
              <a
                href={SOCIAL_LINKS.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FCF6BA] hover:underline font-bold"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Barra Flotante de Iconos: Instagram + LinkedIn + Botón Principal de Chat/WhatsApp */}
      <div className="flex items-center gap-2.5 bg-[#070707]/95 backdrop-blur-md border border-[#BF953F]/70 p-2 shadow-[0_12px_35px_rgba(191,149,63,0.3)]">
        {/* Instagram */}
        <a
          href={SOCIAL_LINKS.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Instagram Oficial Lhyo Group"
          className="w-10 h-10 border border-[#1E293B] bg-[#090D16] hover:border-[#FCF6BA] hover:bg-[#BF953F]/20 flex items-center justify-center text-[#FCF6BA] transition"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </a>

        {/* LinkedIn */}
        <a
          href={SOCIAL_LINKS.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="LinkedIn Oficial Lhyo Group"
          className="w-10 h-10 border border-[#1E293B] bg-[#090D16] hover:border-[#FCF6BA] hover:bg-[#BF953F]/20 flex items-center justify-center text-[#FCF6BA] transition"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
          </svg>
        </a>

        {/* Botón Activador de Chatbot / WhatsApp */}
        <button
          type="button"
          onClick={() => setChatOpen((o) => !o)}
          className="px-4 h-10 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#070707] font-extrabold text-xs tracking-wider uppercase flex items-center gap-2 hover:brightness-110 transition"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z" />
          </svg>
          <span>{chatOpen ? "CERRAR CHAT" : "HABLAR POR CHAT / WHATSAPP"}</span>
        </button>
      </div>
    </div>
  );
}
