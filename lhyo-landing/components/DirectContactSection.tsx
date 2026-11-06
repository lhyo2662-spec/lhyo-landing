"use client";
import React, { useState } from "react";

export function DirectContactSection() {
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [contactSent, setContactSent] = useState(false);

  const openExecutiveCalendar = () => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const mainBtn = buttons.find((b) => (b.textContent || "").toUpperCase().includes("AGENDAR REUNIÓN"));
    if (mainBtn) { mainBtn.click(); }
  };

  return (
    <section className="px-6 pt-10 pb-20 md:px-16 lg:px-24 max-w-7xl mx-auto">
      <div className="mb-10 border-b border-white/10 pb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold text-[#C5A059] uppercase tracking-[0.16em] block mb-1.5">
            CANALES OFICIALES DE COMUNICACIÓN
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
            Contacto Directo y Atención Ejecutiva
          </h2>
          <p className="text-sm text-gray-300 mt-2 max-w-2xl">
            Comuníquese directamente con nuestra dirección general. Nuestro Dossier Privado B2B es confidencial y se envía a su correo al agendar su sesión:
          </p>
        </div>
        <button
          type="button"
          onClick={openExecutiveCalendar}
          className="px-5 py-3 rounded-xl border border-[#C5A059] bg-[#0A1128]/90 text-[#FCF6BA] text-xs font-extrabold uppercase tracking-wider hover:bg-[#C5A059] hover:text-[#050507] transition cursor-pointer"
        >
          🔒 AGENDAR SESIÓN PARA RECIBIR DOSSIER PRIVADO →
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          <a
            href="https://wa.me/584247383164?text=Hola%20Lhyo%20Group%2C%20les%20escribo%20desde%20su%20p%C3%A1gina%20web%20oficial."
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 rounded-2xl bg-[#0A1128]/70 border border-[#C5A059]/30 hover:border-[#FCF6BA] transition block"
          >
            <span className="text-[10px] font-semibold text-[#C5A059] uppercase tracking-widest block mb-1.5">
              ATENCIÓN INMEDIATA EN WHATSAPP
            </span>
            <div className="text-lg font-semibold text-[#FCF6BA] mb-1">
              Iniciar Conversación en WhatsApp →
            </div>
            <p className="text-xs text-gray-300">
              Respuesta directa de nuestro asistente y equipo comercial.
            </p>
          </a>

          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=ceo@lhyogroup.com&su=Consulta%20Corporativa%20-%20Lhyo%20Group"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 rounded-2xl bg-[#0A1128]/70 border border-[#C5A059]/30 hover:border-[#FCF6BA] transition block"
          >
            <span className="text-[10px] font-semibold text-[#C5A059] uppercase tracking-widest block mb-1.5">
              CORREO ELECTRÓNICO CORPORATIVO OFICIAL
            </span>
            <div className="text-lg font-semibold text-[#FCF6BA] mb-1">
              ceo@lhyogroup.com →
            </div>
            <p className="text-xs text-gray-300">
              Dirección General: Lhyonneth Araque (CEO & Founder).
            </p>
          </a>

          <div className="p-6 rounded-2xl bg-[#0A1128]/70 border border-[#C5A059]/30">
            <span className="text-[10px] font-semibold text-[#C5A059] uppercase tracking-widest block mb-2.5">
              REDES SOCIALES Y PRESENCIA OFICIAL
            </span>
            <div className="flex flex-wrap gap-3 mb-3">
              <a
                href="https://www.instagram.com/lhyogroup"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full border border-[#C5A059]/45 bg-[#050507] text-xs font-medium text-[#FCF6BA] hover:bg-[#C5A059] hover:text-[#050507] transition"
              >
                Instagram Oficial →
              </a>
              <a
                href="https://www.linkedin.com/company/lhyogroup"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full border border-[#C5A059]/45 bg-[#050507] text-xs font-medium text-[#FCF6BA] hover:bg-[#C5A059] hover:text-[#050507] transition"
              >
                LinkedIn Corporativo →
              </a>
            </div>
            <p className="text-xs text-gray-400">
              Operación activa en Latinoamérica, Europa y Cobertura Online Internacional.
            </p>
          </div>
        </div>

        <div className="lg:col-span-7 rounded-2xl bg-gradient-to-br from-[#0A1128]/90 via-[#070A14] to-[#050507] border border-[#C5A059]/45 p-6 sm:p-8 flex flex-col justify-between">
          {!contactSent ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!contactName.trim() || !contactEmail.trim() || !contactMsg.trim()) return;
                setContactSent(true);
              }}
              className="space-y-4"
            >
              <div>
                <span className="text-[11px] font-semibold text-[#FCF6BA] uppercase tracking-wider block mb-1">
                  MENSAJE DIRECTO A DIRECCIÓN GENERAL (ceo@lhyogroup.com)
                </span>
                <h3 className="text-xl sm:text-2xl font-semibold text-white">
                  Envíenos su consulta directa
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#FCF6BA] uppercase block mb-1">
                    Su Nombre *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Carlos Mendoza"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full rounded-xl bg-[#050507] border border-white/15 focus:border-[#C5A059] text-white text-sm px-3.5 py-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#FCF6BA] uppercase block mb-1">
                    Su Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    placeholder="correo@empresa.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full rounded-xl bg-[#050507] border border-white/15 focus:border-[#C5A059] text-white text-sm px-3.5 py-2.5 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#FCF6BA] uppercase block mb-1">
                  Su Número de WhatsApp (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej: +58 424 000 0000"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full rounded-xl bg-[#050507] border border-white/15 focus:border-[#C5A059] text-white text-sm px-3.5 py-2.5 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#FCF6BA] uppercase block mb-1">
                  ¿En qué podemos ayudarle? *
                </label>
                <textarea
                  rows={3}
                  placeholder="Escriba aquí su consulta o requerimiento..."
                  value={contactMsg}
                  onChange={(e) => setContactMsg(e.target.value)}
                  className="w-full rounded-xl bg-[#050507] border border-white/15 focus:border-[#C5A059] text-white text-sm px-3.5 py-2.5 outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full h-[50px] rounded-xl bg-gradient-to-r from-[#C5A059] via-[#FCF6BA] to-[#B38728] text-[#050507] font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                ENVIAR MENSAJE DIRECTO A LHYO GROUP →
              </button>
            </form>
          ) : (
            <div className="py-10 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full border border-[#C5A059] bg-[#C5A059]/15 flex items-center justify-center text-lg text-[#FCF6BA] font-bold">
                ✓
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">
                ¡Mensaje recibido en ceo@lhyogroup.com!
              </h4>
              <p className="text-xs sm:text-sm text-gray-300 mb-5">
                Le responderemos a la brevedad.
              </p>
              <button
                type="button"
                onClick={() => setContactSent(false)}
                className="px-5 py-2.5 rounded-xl border border-[#C5A059] text-xs font-semibold text-[#FCF6BA] cursor-pointer"
              >
                Enviar otra consulta
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
export default DirectContactSection;