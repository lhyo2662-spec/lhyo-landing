"use client";

import React, { useState } from "react";

export default function DirectContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

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
          facturacion_usd: "CONSULTA_DIRECTA",
          clasificacion: "CONSULTA_DIRECTA",
          servicio_elegido: "Formulario de Contacto Directo",
          objetivo_cliente: message,
          resumen_crm: `CONSULTA DIRECTA || WhatsApp: ${whatsapp} || Mensaje: ${message}`,
          link_videollamada_meet: "https://meet.google.com/krc-vdii-zzh"
        })
      });
    } catch {
      // Continuar
    } finally {
      setSending(false);
      setSent(true);
    }
  };

  return (
    <section id="contacto" className="lhyo-redline-container w-full max-w-6xl mx-auto px-6 pt-10 pb-20 select-none">
      <div className="mb-8 pb-5 border-b border-white/10 text-left">
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#C5A059] block mb-1.5">
          CANALES OFICIALES DE COMUNICACIÓN
        </span>
        <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
          Contacto Directo y Atención Ejecutiva
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch text-left">
        <div className="lg:col-span-5 flex flex-col justify-between gap-3.5">
          <a
            href="https://wa.me/584247383164?text=Hola%20Lhyo%20Group%2C%20les%20escribo%20desde%20su%20sitio%20web%20oficial."
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-2xl border border-[#C5A059]/25 bg-gradient-to-br from-[#12100E] via-[#0B0B0E] to-[#08080A] px-5 py-4 hover:border-[#C5A059]/60 transition-all duration-500 flex-1 flex flex-col justify-center"
          >
            <div className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-[#C5A059]/[0.07] to-transparent skew-x-[-25deg]" />
            <div className="w-7 h-[1.5px] bg-[#C5A059]/85 group-hover:w-12 group-hover:bg-[#EFE2BA] transition-all duration-500 mb-2.5" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C5A059] block mb-1">
              ATENCIÓN INMEDIATA EN WHATSAPP
            </span>
            <h3 className="text-[15px] font-semibold text-[#EFE2BA] group-hover:text-white transition mb-1">
              Iniciar Conversación en WhatsApp <span className="text-[#C5A059]">→</span>
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Respuesta directa de nuestro asistente y equipo comercial para consultas rápidas.
            </p>
          </a>

          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=ceo@lhyogroup.com&su=Consulta%20Corporativa%20-%20Lhyo%20Group"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-2xl border border-[#C5A059]/25 bg-gradient-to-br from-[#12100E] via-[#0B0B0E] to-[#08080A] px-5 py-4 hover:border-[#C5A059]/60 transition-all duration-500 flex-1 flex flex-col justify-center"
          >
            <div className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-[#C5A059]/[0.07] to-transparent skew-x-[-25deg]" />
            <div className="w-7 h-[1.5px] bg-[#C5A059]/85 group-hover:w-12 group-hover:bg-[#EFE2BA] transition-all duration-500 mb-2.5" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C5A059] block mb-1">
              CORREO ELECTRÓNICO CORPORATIVO
            </span>
            <h3 className="text-[15px] font-semibold text-[#EFE2BA] group-hover:text-white transition mb-1">
              ceo@lhyogroup.com <span className="text-[#C5A059]">→</span>
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Dirección General: Lhyonneth Araque (CEO & Founder).
            </p>
          </a>

          <div className="group relative overflow-hidden rounded-2xl border border-[#C5A059]/25 bg-gradient-to-br from-[#12100E] via-[#0B0B0E] to-[#08080A] px-5 py-4 hover:border-[#C5A059]/60 transition-all duration-500">
            <div className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-[#C5A059]/[0.07] to-transparent skew-x-[-25deg]" />
            <div className="w-7 h-[1.5px] bg-[#C5A059]/85 group-hover:w-12 group-hover:bg-[#EFE2BA] transition-all duration-500 mb-2.5" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C5A059] block mb-2.5">
              REDES SOCIALES Y PRESENCIA OFICIAL
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <a
                href="https://www.instagram.com/lhyogroup"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-3 rounded-xl bg-[#111015] border border-white/10 text-xs text-[#EFE2BA] font-medium text-center hover:border-[#C5A059]/60 transition"
              >
                Instagram Oficial →
              </a>
              <a
                href="https://www.linkedin.com/company/lhyogroup"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-3 rounded-xl bg-[#111015] border border-white/10 text-xs text-[#EFE2BA] font-medium text-center hover:border-[#C5A059]/60 transition"
              >
                LinkedIn Oficial →
              </a>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 group relative overflow-hidden rounded-2xl border border-[#C5A059]/25 bg-gradient-to-br from-[#12100E] via-[#0B0B0E] to-[#08080A] p-6 flex flex-col justify-between transition-all duration-500 hover:border-[#C5A059]/50">
          {sent ? (
            <div className="my-auto py-8 text-center space-y-3">
              <div className="w-11 h-11 rounded-full border border-[#C5A059]/60 bg-[#C5A059]/10 text-[#EFE2BA] flex items-center justify-center mx-auto text-base font-semibold">
                ✓
              </div>
              <h3 className="text-lg font-semibold text-[#EFE2BA]">
                ¡Su consulta ha sido recibida con éxito!
              </h3>
              <p className="text-xs text-gray-300 max-w-md mx-auto leading-relaxed">
                Nuestro equipo directivo responderá a su correo electrónico o WhatsApp a la brevedad.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setName("");
                  setEmail("");
                  setWhatsapp("");
                  setMessage("");
                }}
                className="px-5 py-2 rounded-xl border border-[#C5A059]/45 text-xs text-[#EFE2BA] font-medium cursor-pointer"
              >
                Enviar otra consulta
              </button>
            </div>
          ) : (
            <form onSubmit={handleDirectSubmit} className="space-y-3.5">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C5A059] block mb-1">
                  ¿PREFIERE DEJARNOS UN MENSAJE SIN AGENDAR VIDEOLLAMADA?
                </span>
                <h3 className="text-lg sm:text-xl font-semibold text-[#EFE2BA] mb-1">
                  Envíenos su consulta directa
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Su mensaje llegará de inmediato a nuestra dirección general y le responderemos por correo o WhatsApp con la información que necesita.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-300 block mb-1">
                    SU NOMBRE *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: Carlos Mendoza"
                    className="w-full rounded-xl bg-[#111015] border border-white/10 focus:border-[#C5A059] px-3.5 py-2 text-xs text-white placeholder-gray-500 outline-none select-text"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-300 block mb-1">
                    SU CORREO ELECTRÓNICO *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="correo@empresa.com"
                    className="w-full rounded-xl bg-[#111015] border border-white/10 focus:border-[#C5A059] px-3.5 py-2 text-xs text-white placeholder-gray-500 outline-none select-text"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-300 block mb-1">
                  SU NÚMERO DE WHATSAPP (OPCIONAL)
                </label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="Ej: +598 99 000 000"
                  className="w-full rounded-xl bg-[#111015] border border-white/10 focus:border-[#C5A059] px-3.5 py-2 text-xs text-white placeholder-gray-500 outline-none select-text"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-300 block mb-1">
                  ¿EN QUÉ PODEMOS AYUDARLE? *
                </label>
                <textarea
                  rows={2}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escriba aquí su duda, requerimiento o consulta..."
                  className="w-full rounded-xl bg-[#111015] border border-white/10 focus:border-[#C5A059] px-3.5 py-2 text-xs text-white placeholder-gray-500 outline-none resize-none select-text"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#E5C77D] to-[#B38728] text-[#08080A] font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-105 transition cursor-pointer"
              >
                {sending ? "ENVIANDO CONSULTA..." : "ENVIAR CONSULTA DIRECTA →"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
