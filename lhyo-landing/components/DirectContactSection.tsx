"use client";

import { useState } from "react";
import { SOCIAL_LINKS } from "./FloatingOmniDock";

export default function DirectContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sentOk, setSentOk] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleQuickContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg("Por favor completa tu nombre, correo y mensaje para responderte.");
      return;
    }
    setErrorMsg("");
    setSending(true);

    try {
      const payload = {
        triggerEvent: "BOOKING_CREATED",
        payload: {
          uid: `contacto_${Date.now()}`,
          slotKey: "CONSULTA DIRECTA (Sin Reunión)",
          startTime: "CONSULTA DIRECTA (Sin Reunión)",
          attendees: [{ name: name.trim(), email: email.trim() }],
          responses: {
            company_url: { value: phone.trim() ? `WhatsApp: ${phone.trim()}` : "Consulta Web" },
            facturacion_mensual: { value: "0" },
            cuello_botella: { value: message.trim() },
            plan_elegido: { value: "MENSAJE DIRECTO A CEO@LHYOGROUP.COM" }
          },
          metadata: { source_component: "MENSAJE DIRECTO A CEO@LHYOGROUP.COM" }
        }
      };

      await fetch("/api/webhook-lead?secret=LHYO_SYS_994810_ARKOS_KEY", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      setSentOk(true);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch {
      setErrorMsg("Ocurrió un error al enviar. Puedes escribirnos directo por WhatsApp.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contacto" className="px-6 pt-10 pb-16 md:px-16 lg:px-24 max-w-7xl mx-auto text-sm text-gray-300">
      <div className="mb-10 border-b border-white/10 pb-5">
        <span className="text-[11px] font-semibold text-[#C5A059] uppercase tracking-[0.16em] block mb-1.5">
          CANALES OFICIALES DE COMUNICACIÓN
        </span>
        <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
          Contacto Directo y Atención Ejecutiva
        </h2>
        <p className="text-sm text-gray-300/90 max-w-2xl mt-2">
          Comuníquese directamente con nuestra dirección general o envíenos su consulta para recibir atención inmediata:
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          <a
            href={`https://wa.me/${SOCIAL_LINKS.whatsappPhone}?text=${encodeURIComponent("Hola Lhyo Group, les escribo desde su página web oficial.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="seal-card-lhyo p-6 block cursor-pointer"
          >
            <span className="text-[10px] font-semibold text-[#C5A059] uppercase tracking-[0.16em] block mb-1.5">
              ATENCIÓN INMEDIATA EN WHATSAPP
            </span>
            <div className="text-lg font-semibold text-[#FCF6BA] mb-1">
              Iniciar Conversación en WhatsApp →
            </div>
            <p className="text-xs text-gray-300/90">
              Respuesta directa de nuestro asistente y equipo comercial.
            </p>
          </a>

          <a
            href="mailto:ceo@lhyogroup.com?subject=Consulta%20Corporativa%20-%20Lhyo%20Group"
            className="seal-card-lhyo p-6 block cursor-pointer"
          >
            <span className="text-[10px] font-semibold text-[#C5A059] uppercase tracking-[0.16em] block mb-1.5">
              CORREO ELECTRÓNICO CORPORATIVO OFICIAL
            </span>
            <div className="text-lg font-semibold text-[#FCF6BA] mb-1">
              ceo@lhyogroup.com →
            </div>
            <p className="text-xs text-gray-300/90">
              Dirección General: Lhyonneth Araque (CEO &amp; Founder).
            </p>
          </a>

          <div className="seal-card-lhyo p-6">
            <span className="text-[10px] font-semibold text-[#C5A059] uppercase tracking-[0.16em] block mb-2.5">
              REDES SOCIALES Y PRESENCIA OFICIAL
            </span>
            <div className="flex flex-wrap gap-3 mb-3">
              <a
                href={SOCIAL_LINKS.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full border border-[#C5A059]/45 bg-white/[0.03] text-xs font-medium text-[#FCF6BA] hover:bg-[#C5A059] hover:text-[#050507] transition"
              >
                Instagram Oficial →
              </a>
              <a
                href={SOCIAL_LINKS.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full border border-[#C5A059]/45 bg-white/[0.03] text-xs font-medium text-[#FCF6BA] hover:bg-[#C5A059] hover:text-[#050507] transition"
              >
                LinkedIn Corporativo →
              </a>
            </div>
            <p className="text-xs text-gray-400">
              Operación activa en Uruguay, Venezuela y Cobertura Online Internacional.
            </p>
          </div>
        </div>

        <div className="lg:col-span-7 luxury-service-card p-6 sm:p-8 flex flex-col justify-between">
          {!sentOk ? (
            <form noValidate onSubmit={handleQuickContact} className="space-y-4">
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl bg-[#090D16] border border-white/15 focus:border-[#C5A059] text-white text-sm px-3.5 py-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#FCF6BA] uppercase block mb-1">
                    Su Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    placeholder="correo@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl bg-[#090D16] border border-white/15 focus:border-[#C5A059] text-white text-sm px-3.5 py-2.5 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#FCF6BA] uppercase block mb-1">
                  Su Número de WhatsApp (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej: +598 99 000 000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl bg-[#090D16] border border-white/15 focus:border-[#C5A059] text-white text-sm px-3.5 py-2.5 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#FCF6BA] uppercase block mb-1">
                  ¿En qué podemos ayudarle? *
                </label>
                <textarea
                  rows={3}
                  placeholder="Escriba aquí su consulta o requerimiento..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-xl bg-[#090D16] border border-white/15 focus:border-[#C5A059] text-white text-sm px-3.5 py-2.5 outline-none resize-none"
                />
              </div>

              {errorMsg && (
                <div className="text-xs text-[#FCF6BA] bg-[#C5A059]/15 rounded-lg border-l-2 border-[#C5A059] px-3 py-2">
                  ✦ {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={sending}
                className="btn-primary-lhyo w-full text-xs uppercase tracking-wider"
              >
                {sending ? "ENVIANDO SU CONSULTA..." : "ENVIAR MENSAJE DIRECTO A LHYO GROUP →"}
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
                Hemos registrado su consulta y le responderemos a la brevedad.
              </p>
              <button
                type="button"
                onClick={() => setSentOk(false)}
                className="px-5 py-2.5 rounded-xl border border-[#C5A059] text-xs font-semibold text-[#FCF6BA]"
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
