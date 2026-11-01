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
            plan_elegido: { value: "MENSAJE DIRECTO DESDE SECCIÓN CONTACTO" }
          },
          metadata: { source_component: "MENSAJE DIRECTO DESDE SECCIÓN CONTACTO" }
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
    <section id="contacto" className="px-6 pt-10 pb-28 md:px-16 lg:px-24 max-w-7xl mx-auto text-sm text-gray-300">
      {/* Cabecera idéntica en distancia y medidas a Nuestra Garantía */}
      <div className="mb-12 border-b border-white/10 pb-6">
        <span className="text-[11px] font-semibold text-[#BF953F] uppercase tracking-[0.16em] block mb-2">
          CANALES OFICIALES DE COMUNICACIÓN
        </span>
        <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
          Contacto Directo y Atención Ejecutiva
        </h2>
        <p className="text-sm md:text-base text-gray-300/90 max-w-3xl mt-3 leading-relaxed">
          Comuníquese directamente con nuestra dirección general a través de nuestros canales ejecutivos o envíenos su consulta para recibir atención inmediata:
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-16 border-b border-white/10 items-stretch">
        <div className="lg:col-span-5 flex flex-col justify-between gap-5">
          <a
            href={`https://wa.me/${SOCIAL_LINKS.whatsappPhone}?text=${encodeURIComponent("Hola Lhyo Group, les escribo desde su página web oficial.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="seal-card-lhyo p-6 block cursor-pointer"
          >
            <span className="text-[10px] font-semibold text-[#BF953F] uppercase tracking-[0.16em] block mb-1.5">
              ATENCIÓN INMEDIATA EN WHATSAPP
            </span>
            <div className="text-lg font-semibold text-[#FCF6BA] mb-1">
              Iniciar Conversación en WhatsApp →
            </div>
            <p className="text-xs text-gray-300/90 leading-relaxed">
              Respuesta directa de nuestro asistente y equipo comercial para consultas rápidas.
            </p>
          </a>

          <a
            href={`mailto:${SOCIAL_LINKS.emailAddress}?subject=Consulta%20Corporativa%20-%20Lhyo%20Group`}
            className="seal-card-lhyo p-6 block cursor-pointer"
          >
            <span className="text-[10px] font-semibold text-[#BF953F] uppercase tracking-[0.16em] block mb-1.5">
              CORREO ELECTRÓNICO CORPORATIVO
            </span>
            <div className="text-lg font-semibold text-[#FCF6BA] mb-1">
              {SOCIAL_LINKS.emailAddress} →
            </div>
            <p className="text-xs text-gray-300/90 leading-relaxed">
              Dirección General: Lhyonneth Araque (CEO & Founder).
            </p>
          </a>

          <div className="seal-card-lhyo p-6">
            <span className="text-[10px] font-semibold text-[#BF953F] uppercase tracking-[0.16em] block mb-3">
              REDES SOCIALES Y PRESENCIA OFICIAL
            </span>
            <div className="flex flex-wrap gap-3 mb-3.5">
              <a
                href={SOCIAL_LINKS.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full border border-[#BF953F]/45 bg-white/[0.03] text-xs font-medium text-[#FCF6BA] hover:bg-[#BF953F] hover:text-[#070707] transition"
              >
                Instagram Oficial →
              </a>
              <a
                href={SOCIAL_LINKS.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full border border-[#BF953F]/45 bg-white/[0.03] text-xs font-medium text-[#FCF6BA] hover:bg-[#BF953F] hover:text-[#070707] transition"
              >
                LinkedIn Corporativo →
              </a>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Operación activa en Uruguay (Montevideo), Venezuela (Mérida / Nacional) y Cobertura Online Internacional.
            </p>
          </div>
        </div>

        <div className="lg:col-span-7 luxury-service-card p-7 md:p-9 flex flex-col justify-between">
          {!sentOk ? (
            <form noValidate onSubmit={handleQuickContact} className="space-y-4">
              <div>
                <span className="text-[11px] font-semibold text-[#FCF6BA] uppercase tracking-[0.14em] block mb-1">
                  ATENCIÓN PERSONALIZADA
                </span>
                <h3 className="text-xl md:text-2xl font-semibold text-white mb-2">
                  Envíenos su consulta directa
                </h3>
                <p className="text-xs text-gray-300/90 mb-4 leading-relaxed">
                  Su mensaje llegará de inmediato a nuestra dirección general y le responderemos por correo o WhatsApp con la información que necesita.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#FCF6BA] uppercase block mb-1.5">
                    Su Nombre *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Carlos Mendoza"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg bg-[#090D16] border border-white/15 focus:border-[#BF953F] text-white text-sm px-3.5 py-2.5 outline-none transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#FCF6BA] uppercase block mb-1.5">
                    Su Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    placeholder="correo@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg bg-[#090D16] border border-white/15 focus:border-[#BF953F] text-white text-sm px-3.5 py-2.5 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#FCF6BA] uppercase block mb-1.5">
                  Su Número de WhatsApp (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej: +598 99 000 000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg bg-[#090D16] border border-white/15 focus:border-[#BF953F] text-white text-sm px-3.5 py-2.5 outline-none transition"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#FCF6BA] uppercase block mb-1.5">
                  ¿En qué podemos ayudarle? *
                </label>
                <textarea
                  rows={3}
                  placeholder="Escriba aquí su duda, requerimiento o consulta..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-lg bg-[#090D16] border border-white/15 focus:border-[#BF953F] text-white text-sm px-3.5 py-2.5 outline-none resize-none transition"
                />
              </div>

              {errorMsg && (
                <div className="text-xs text-[#FCF6BA] bg-[#BF953F]/15 rounded-lg border-l-2 border-[#BF953F] px-3 py-2">
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
              <div className="w-14 h-14 mx-auto mb-4 rounded-full border border-[#BF953F] bg-[#BF953F]/15 flex items-center justify-center text-xl text-[#FCF6BA] font-semibold">
                ✓
              </div>
              <h4 className="text-2xl font-semibold text-white mb-2">
                ¡Mensaje recibido con éxito!
              </h4>
              <p className="text-sm text-gray-300 max-w-md mx-auto mb-6">
                Hemos registrado su consulta en nuestro sistema y le contactaremos a la brevedad.
              </p>
              <button
                type="button"
                onClick={() => setSentOk(false)}
                className="px-6 py-3 rounded-lg border border-[#BF953F] text-xs font-semibold text-[#FCF6BA] hover:bg-[#BF953F]/20 transition uppercase"
              >
                Enviar otra consulta
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-4">
        <span>© 2026 LHYO GROUP. TODOS LOS DERECHOS RESERVADOS.</span>
        <span>SOLUCIONES DIGITALES, PÁGINAS WEB Y AUTOMATIZACIÓN IA</span>
      </div>
    </section>
  );
}
