"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface AuditButtonProps {
  label?: string;
  selectedPlan?: string;
  fullWidth?: boolean;
}

const TIME_SLOTS = [
  "09:30 AM",
  "11:00 AM",
  "01:00 PM",
  "03:00 PM",
  "04:30 PM",
  "06:00 PM",
];

export default function AuditTriggerButton({
  label = "AGENDAR AUDITORÍA Y RECIBIR CATÁLOGO",
  selectedPlan = "AUDITORÍA GENERAL (Botón Principal)",
  fullWidth = false,
}: AuditButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [companyUrl, setCompanyUrl] = useState("");
  const [revenue, setRevenue] = useState("");
  const [objective, setObjective] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("11:00 AM");

  useEffect(() => {
    setMounted(true);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split("T")[0]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !revenue || !objective) return;

    setIsSubmitting(true);
    try {
      const payload = {
        triggerEvent: "BOOKING_CREATED",
        payload: {
          uid: `lhyo_${Date.now()}`,
          startTime: `${selectedDate} | ${selectedTime}`,
          attendees: [{ name: fullName, email: email }],
          responses: {
            company_url: { value: companyUrl || "No especificada" },
            facturacion_mensual: { value: String(revenue) },
            cuello_botella: { value: objective },
            plan_elegido: { value: selectedPlan },
          },
          metadata: { source_component: selectedPlan },
        },
      };

      await fetch("/api/webhook-lead?secret=LHYO_SYS_994810_ARKOS_KEY", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setIsSuccess(true);
    } catch (error) {
      console.error("Error registrando reserva:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setIsOpen(false);
    setIsSuccess(false);
  };

  const modalUI = isOpen ? (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl border border-[#BF953F] bg-[#070707] p-6 md:p-10 shadow-[0_25px_70px_rgba(191,149,63,0.28)] my-8">
        <button
          type="button"
          onClick={resetAndClose}
          className="absolute top-5 right-5 w-9 h-9 border border-[#1E293B] bg-[#0B132B] text-gray-300 hover:text-[#FCF6BA] hover:border-[#BF953F] flex items-center justify-center font-bold text-sm transition"
        >
          ✕
        </button>

        {!isSuccess ? (
          <div>
            <div className="w-12 h-0.5 bg-[#BF953F] mb-3" />
            <span className="text-[11px] font-bold text-[#FCF6BA] uppercase tracking-widest block mb-1">
              LHYO GROUP · AGENDA EJECUTIVA OFICIAL
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Reserva tu Sesión y Recibe nuestro Catálogo Privado
            </h3>
            <p className="text-xs md:text-sm text-gray-300 mb-6 leading-relaxed">
              Completa tus datos a continuación. Al confirmar, registraremos tu reunión y te enviaremos a tu correo nuestro Catálogo Privado B2B personalizado para tu empresa.
            </p>

            <div className="bg-[#0B132B]/70 border-l-2 border-[#BF953F] p-3.5 mb-6 text-xs text-gray-200">
              <strong className="text-[#FCF6BA] uppercase tracking-wider block mb-0.5">
                Solicitud seleccionada:
              </strong>
              {selectedPlan}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#FCF6BA] uppercase block mb-1.5">
                    Fecha preferida *
                  </label>
                  <input
                    type="date"
                    required
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-[#090D16] border border-[#1E293B] focus:border-[#BF953F] text-white text-sm px-3.5 py-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#FCF6BA] uppercase block mb-1.5">
                    Horario disponible *
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full bg-[#090D16] border border-[#1E293B] focus:border-[#BF953F] text-white text-sm px-3.5 py-2.5 outline-none"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot} className="bg-[#070707]">
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#FCF6BA] uppercase block mb-1.5">
                    Tu Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Carlos Mendoza"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#090D16] border border-[#1E293B] focus:border-[#BF953F] text-white text-sm px-3.5 py-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#FCF6BA] uppercase block mb-1.5">
                    Tu Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Donde recibirás el Catálogo Privado"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#090D16] border border-[#1E293B] focus:border-[#BF953F] text-white text-sm px-3.5 py-2.5 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#FCF6BA] uppercase block mb-1.5">
                    Sitio Web o Instagram de tu Empresa *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: @miempresa o www.miempresa.com"
                    value={companyUrl}
                    onChange={(e) => setCompanyUrl(e.target.value)}
                    className="w-full bg-[#090D16] border border-[#1E293B] focus:border-[#BF953F] text-white text-sm px-3.5 py-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#FCF6BA] uppercase block mb-1.5">
                    Facturación Mensual Actual en USD *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="Solo números, ej: 10000"
                    value={revenue}
                    onChange={(e) => setRevenue(e.target.value)}
                    className="w-full bg-[#090D16] border border-[#1E293B] focus:border-[#BF953F] text-white text-sm px-3.5 py-2.5 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#FCF6BA] uppercase block mb-1.5">
                  ¿Qué objetivo principal buscas lograr o qué área de tu negocio deseas impulsar hoy? *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Cuéntanos brevemente qué te gustaría lograr o mejorar en tu empresa..."
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  className="w-full bg-[#090D16] border border-[#1E293B] focus:border-[#BF953F] text-white text-sm px-3.5 py-2.5 outline-none resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary-lhyo w-full text-sm uppercase tracking-wider"
                >
                  {isSubmitting
                    ? "REGISTRANDO TU SOLICITUD Y PREPARANDO CATÁLOGO..."
                    : "CONFIRMAR MI REUNIÓN Y RECIBIR CATÁLOGO PRIVADO →"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="py-8 text-center">
            <div className="w-16 h-16 mx-auto mb-5 border-2 border-[#BF953F] bg-[#BF953F]/15 flex items-center justify-center text-2xl text-[#FCF6BA] font-bold">
              ✓
            </div>
            <span className="text-xs font-bold text-[#BF953F] uppercase tracking-widest block mb-2">
              SOLICITUD REGISTRADA CON ÉXITO
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              ¡Tu sesión ha quedado agendada, {fullName}!
            </h3>
            <p className="text-sm md:text-base text-gray-300 max-w-lg mx-auto mb-6 leading-relaxed">
              Hemos registrado tu reunión para el <strong>{selectedDate}</strong> a las <strong>{selectedTime}</strong>. Nuestro sistema está generando tu expediente personalizado y en breves minutos recibirás nuestro <strong>Catálogo Privado B2B</strong> directamente en <strong>{email}</strong>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6">
              <a
                href={`/api/dossier?ceo=${encodeURIComponent(fullName)}&empresa=${encodeURIComponent(companyUrl || "Mi Empresa")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary-lhyo text-xs uppercase"
              >
                VER MI CATÁLOGO PRIVADO AHORA MISMO →
              </a>
              <button
                type="button"
                onClick={resetAndClose}
                className="px-6 py-4 border border-[#1E293B] bg-[#090D16] text-xs font-bold text-gray-300 hover:border-[#BF953F] hover:text-white transition"
              >
                VOLVER A LA PÁGINA
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`btn-primary-lhyo ${fullWidth ? "w-full" : ""}`}
      >
        {label}
      </button>
      {mounted && modalUI ? createPortal(modalUI, document.body) : null}
    </>
  );
}
