"use client";

import React, { useState } from "react";

export default function DirectContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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
          horario_cita: "Consulta Directa (Sección Contacto)",
          nombre_cliente: name,
          email_cliente: email,
          empresa_web: whatsapp || "No especificado",
          facturacion_usd: "Consulta Directa",
          clasificacion: "CONSULTA_DIRECTA",
          servicio_elegido: "MENSAJE DIRECTO SECCIÓN CONTACTO",
          objetivo_cliente: message,
          resumen_crm: `CONSULTA DIRECTA || WhatsApp: ${whatsapp || "N/A"} || Mensaje: ${message}`,
          link_videollamada_meet: "https://meet.google.com/krc-vdii-zzh"
        })
      });
    } catch {
      // Confirmación inmediata
    } finally {
      setSending(false);
      setSent(true);
    }
  };

  return (
    <section id="contacto" className="relative max-w-5xl mx-auto px-6 pt-12 pb-14">
      <div className="border-b border-white/10 pb-4 mb-6">
        <div className="w-8 h-[2px] bg-[#C5A059] mb-2.5" />
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#C5A059] mb-1">
          CANALES OFICIALES DE COMUNICACIÓN
        </p>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Contacto Directo y Atención Ejecutiva
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-5 flex flex-col justify-between gap-3.5">
          <div className="flex-1 rounded-2xl border border-[#C5A059]/30 bg-[#080B12]/95 px-5 py-3.5 flex flex-col justify-center hover:border-[#C5A059]/60 transition">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-1">
              ATENCIÓN INMEDIATA EN WHATSAPP
            </p>
            <a
              href="https://wa.me/584247383164?text=Hola%20Lhyo%20Group%2C%20deseo%20realizar%20una%20consulta%20ejecutiva."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-base sm:text-lg font-extrabold text-white hover:text-[#FCF6BA] transition mb-0.5"
            >
              <span>Iniciar Conversación en WhatsApp</span>
              <span className="text-[#C5A059]">→</span>
            </a>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Respuesta directa de nuestro asistente y equipo comercial para consultas rápidas.
            </p>
          </div>

          <div className="flex-1 rounded-2xl border border-[#C5A059]/30 bg-[#080B12]/95 px-5 py-3.5 flex flex-col justify-center hover:border-[#C5A059]/60 transition">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-1">
              CORREO ELECTRÓNICO CORPORATIVO
            </p>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=ceo@lhyogroup.com"
              target="_blank"
              rel="noopener noreferrer"
              title="Abrir Gmail con ceo@lhyogroup.com como destinatario"
              className="inline-flex items-center gap-1.5 text-base sm:text-lg font-extrabold text-white hover:text-[#FCF6BA] transition mb-0.5 cursor-pointer"
            >
              <span>ceo@lhyogroup.com</span>
              <span className="text-[#C5A059]">→</span>
            </a>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Dirección General: Lhyonneth Araque (CEO &amp; Founder).
            </p>
          </div>

          <div className="rounded-2xl border border-[#C5A059]/30 bg-[#080B12]/95 px-5 py-3.5 flex flex-col justify-center hover:border-[#C5A059]/60 transition">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-2">
              REDES SOCIALES Y PRESENCIA OFICIAL
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <a
                href="https://www.instagram.com/lhyogroup"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-white/10 bg-[#050507] px-3 py-2 text-xs font-bold text-gray-200 hover:border-[#C5A059] hover:text-[#FCF6BA] transition text-center"
              >
                Instagram Oficial →
              </a>
              <a
                href="https://www.linkedin.com/company/lhyogroup"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-white/10 bg-[#050507] px-3 py-2 text-xs font-bold text-gray-200 hover:border-[#C5A059] hover:text-[#FCF6BA] transition text-center"
              >
                LinkedIn Oficial →
              </a>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 rounded-2xl border border-[#C5A059]/30 bg-[#080B12]/95 px-6 py-4 shadow-2xl flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C5A059] mb-0.5">
              ¿PREFIERE DEJARNOS UN MENSAJE SIN AGENDAR VIDEOLLAMADA?
            </p>
            <h3 className="text-lg sm:text-xl font-extrabold text-white mb-1">
              Envíenos su consulta directa
            </h3>
            <p className="text-[11px] text-gray-400 leading-relaxed mb-3">
              Su mensaje llegará de inmediato a nuestra dirección general y le responderemos por correo o WhatsApp con la información que necesita.
            </p>
          </div>

          {sent ? (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-5 text-center space-y-2.5 my-auto">
              <p className="text-xs font-bold text-emerald-300">
                ✓ Su consulta ha sido recibida por la Dirección General de Lhyo Group.
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
                className="px-4 py-1.5 rounded-xl bg-white/10 text-xs font-semibold text-white cursor-pointer"
              >
                Enviar otra consulta
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-300 block mb-1">
                    SU NOMBRE *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: Carlos Mendoza"
                    className="w-full rounded-xl bg-[#0B0F1A] border border-white/10 focus:border-[#C5A059] px-3 py-1.5 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-300 block mb-1">
                    SU CORREO ELECTRÓNICO *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="correo@empresa.com"
                    className="w-full rounded-xl bg-[#0B0F1A] border border-white/10 focus:border-[#C5A059] px-3 py-1.5 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-300 block mb-1">
                  SU NÚMERO DE WHATSAPP (OPCIONAL)
                </label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="Ej: +598 99 000 000"
                  className="w-full rounded-xl bg-[#0B0F1A] border border-white/10 focus:border-[#C5A059] px-3 py-1.5 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-300 block mb-1">
                  ¿EN QUÉ PODEMOS AYUDARLE? *
                </label>
                <textarea
                  rows={2}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escriba aquí su duda, requerimiento o consulta..."
                  className="w-full rounded-xl bg-[#0B0F1A] border border-white/10 focus:border-[#C5A059] px-3 py-1.5 text-xs text-white outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#FCF6BA] to-[#B38728] text-[#050507] font-extrabold text-xs uppercase tracking-wider shadow-lg hover:brightness-105 transition cursor-pointer"
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
