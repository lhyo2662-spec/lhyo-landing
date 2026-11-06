"use client";

import React, { useState } from "react";

export default function DirectContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sentOk, setSentOk] = useState(false);

  const handleDirectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSending(true);
    const nowVe = new Date().toLocaleString("es-VE", { timeZone: "America/Caracas" });

    try {
      await fetch("https://hook.us2.make.com/krs48cjfzudf4lau3sapwdgdu9lfe1tb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fecha_registro: nowVe,
          horario_cita: "Consulta Directa (Sin Videollamada)",
          nombre_cliente: name,
          email_cliente: email,
          empresa_web: whatsapp || "No especificado",
          facturacion_usd: "Consulta Directa",
          clasificacion: "DIRECT_CONTACT",
          servicio_elegido: "MENSAJE DIRECTO SECCIÓN CONTACTO",
          objetivo_cliente: message,
          resumen_crm: `CONSULTA DIRECTA || WhatsApp: ${whatsapp} || Mensaje: ${message}`,
          link_videollamada_meet: "https://meet.google.com/krc-vdii-zzh"
        })
      });
    } catch {} finally {
      setSending(false);
      setSentOk(true);
      setName("");
      setEmail("");
      setWhatsapp("");
      setMessage("");
    }
  };

  return (
    <section id="contacto" className="w-full max-w-5xl mx-auto px-6 pt-10 pb-14 text-left">
      <div className="border-b border-white/10 pb-5 mb-7">
        <div className="w-8 h-[2px] bg-[#C5A059] mb-3" />
        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#C5A059] mb-1.5">
          CANALES OFICIALES DE COMUNICACIÓN
        </p>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Contacto Directo y Atención Ejecutiva
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          <div className="rounded-2xl border border-white/10 bg-[#080B14]/90 p-5 hover:border-[#C5A059]/50 transition">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] block mb-1.5">
              ATENCIÓN INMEDIATA EN WHATSAPP
            </span>
            <a
              href="https://wa.me/584247383164?text=Hola%20Lhyo%20Group%2C%20les%20escribo%20desde%20su%20sitio%20web%20oficial."
              target="_blank"
              rel="noopener noreferrer"
              className="text-base sm:text-lg font-extrabold text-white hover:text-[#FCF6BA] transition inline-flex items-center gap-1.5"
            >
              Iniciar Conversación en WhatsApp <span className="text-[#C5A059]">→</span>
            </a>
            <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
              Respuesta directa de nuestro asistente y equipo comercial para consultas rápidas.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#080B14]/90 p-5 hover:border-[#C5A059]/50 transition">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] block mb-1.5">
              CORREO ELECTRÓNICO CORPORATIVO
            </span>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=ceo@lhyogroup.com&su=Consulta%20Corporativa%20%7C%20Lhyo%20Group"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base sm:text-lg font-extrabold text-white hover:text-[#FCF6BA] transition inline-flex items-center gap-1.5"
            >
              ceo@lhyogroup.com <span className="text-[#C5A059]">→</span>
            </a>
            <p className="text-xs text-gray-400 mt-1.5">
              Dirección General: Lhyonneth Araque (CEO & Founder).
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#080B14]/90 p-5 hover:border-[#C5A059]/50 transition">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] block mb-2.5">
              REDES SOCIALES Y PRESENCIA OFICIAL
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <a
                href="https://www.instagram.com/lhyogroup"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl border border-white/10 bg-white/[0.02] hover:border-[#C5A059] text-xs font-bold text-white text-center transition"
              >
                Instagram Oficial →
              </a>
              <a
                href="https://www.linkedin.com/company/lhyogroup"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl border border-white/10 bg-white/[0.02] hover:border-[#C5A059] text-xs font-bold text-white text-center transition"
              >
                LinkedIn Oficial →
              </a>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#080B14]/90 p-6 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] block mb-1">
              ¿PREFIERE DEJARNOS UN MENSAJE SIN AGENDAR VIDEOLLAMADA?
            </span>
            <h3 className="text-xl font-extrabold text-white mb-1">Envíenos su consulta directa</h3>
            <p className="text-xs text-gray-400 mb-4">
              Su mensaje llegará de inmediato a nuestra dirección general y le responderemos por correo o WhatsApp con la información que necesita.
            </p>
          </div>

          <form onSubmit={handleDirectSubmit} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-white block mb-1">
                  SU NOMBRE *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Carlos Mendoza"
                  className="w-full rounded-xl bg-[#050507] border border-white/10 focus:border-[#C5A059] px-3.5 py-2.5 text-xs text-white outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-white block mb-1">
                  SU CORREO ELECTRÓNICO *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@empresa.com"
                  className="w-full rounded-xl bg-[#050507] border border-white/10 focus:border-[#C5A059] px-3.5 py-2.5 text-xs text-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-white block mb-1">
                SU NÚMERO DE WHATSAPP (OPCIONAL)
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="Ej: +598 99 000 000"
                className="w-full rounded-xl bg-[#050507] border border-white/10 focus:border-[#C5A059] px-3.5 py-2.5 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-white block mb-1">
                ¿EN QUÉ PODEMOS AYUDARLE? *
              </label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escriba aquí su duda, requerimiento o consulta..."
                className="w-full rounded-xl bg-[#050507] border border-white/10 focus:border-[#C5A059] px-3.5 py-2 text-xs text-white outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#FCF6BA] to-[#B38728] text-[#050507] font-extrabold text-xs uppercase tracking-wider shadow-lg hover:brightness-105 transition cursor-pointer"
            >
              {sending ? "ENVIANDO CONSULTA..." : sentOk ? "✓ CONSULTA ENVIADA CON ÉXITO" : "ENVIAR CONSULTA DIRECTA →"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
