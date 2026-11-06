"use client";

import React, { useState, useEffect } from "react";

interface AuditTriggerButtonProps {
  label?: string;
  preselectedService?: string;
  className?: string;
}

const OFFICIAL_06_SOLUTIONS = [
  {
    id: "01",
    code: "SOLUCIÓN 01 · ATENCIÓN Y CONVERSIÓN INMEDIATA",
    title: "Asistentes Inteligentes para WhatsApp e Instagram (24/7)",
    summary:
      "Atienden en menos de 1 segundo día y noche, responden cualquier consulta con la información exacta de su empresa, califican al prospecto y agendan citas en automático."
  },
  {
    id: "02",
    code: "SOLUCIÓN 02 · PRESENCIA DIGITAL DE MÁXIMO PRESTIGIO",
    title: "Plataformas Web Modernas y Catálogos Interactivos",
    summary:
      "Desarrollamos plataformas corporativas ultrarrápidas (< 0.8s) con estética ejecutiva y catálogos interactivos diseñados para transformar cada visita en una reunión comercial."
  },
  {
    id: "03",
    code: "SOLUCIÓN 03 · CONTROL COMERCIAL AUTOMATIZADO",
    title: "Organización Automática de Clientes y Ventas (CRM)",
    summary:
      "Todo cliente potencial que escribe por WhatsApp, Instagram o su Sitio Web queda registrado, ordenado y clasificado por prioridad en tiempo real sin anotar nada a mano."
  },
  {
    id: "04",
    code: "SOLUCIÓN 04 · INDEPENDENCIA Y AUTOMATIZACIÓN SIN LÍMITES",
    title: "Automatización Total de Procesos con Tecnología Propia",
    summary:
      "Instalamos el motor de automatización propio de su empresa para conectar ventas, correos, agenda y facturación sin pagar tarifas mensuales externas que suben por volumen."
  },
  {
    id: "05",
    code: "SOLUCIÓN 05 · EL CEREBRO INTELIGENTE DE SU NEGOCIO",
    title: "Inteligencia Artificial Personalizada con la Memoria de su Empresa",
    summary:
      "Creamos un cerebro de Inteligencia Artificial privado entrenado con sus contratos, precios y documentos internos para responder cualquier consulta en 1 segundo."
  },
  {
    id: "06",
    code: "SOLUCIÓN 06 · TODA SU EMPRESA EN UNA SOLA PANTALLA",
    title: "Su Propia Plataforma Empresarial Todo-en-Uno",
    summary:
      "Unificamos ventas, clientes, agenda, finanzas y métricas operativas en un solo panel privado hecho a la medida y con el logo exclusivo de su empresa."
  }
];

const ALL_TIME_SLOTS = ["09:30 AM", "11:00 AM", "01:00 PM", "03:00 PM", "04:30 PM", "06:00 PM"];

// Cada fecha tiene su propia matriz de turnos ocupados diferente
const BASE_OCCUPIED_BY_DATE: Record<string, string[]> = {
  "06 de Noviembre, 2026": ["09:30 AM", "01:00 PM"],
  "07 de Noviembre, 2026": ["11:00 AM", "04:30 PM"],
  "09 de Noviembre, 2026": ["09:30 AM", "03:00 PM", "06:00 PM"],
  "10 de Noviembre, 2026": ["01:00 PM"],
  "11 de Noviembre, 2026": ["09:30 AM", "04:30 PM"],
  "12 de Noviembre, 2026": ["11:00 AM"]
};

const AVAILABLE_DATES = Object.keys(BASE_OCCUPIED_BY_DATE);

export default function AuditTriggerButton({
  label = "AGENDAR REUNIÓN Y RECIBIR CATÁLOGO",
  preselectedService = "AUDITORÍA GENERAL (Botón Principal Portada)",
  className = ""
}: AuditTriggerButtonProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"form" | "confirmed" | "dossier">("form");
  const [submitting, setSubmitting] = useState(false);

  const [selectedDate, setSelectedDate] = useState(AVAILABLE_DATES[0]);
  const [selectedTime, setSelectedTime] = useState("11:00 AM");
  const [customBooked, setCustomBooked] = useState<Record<string, string[]>>({});

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [companyWeb, setCompanyWeb] = useState("");
  const [monthlyRev, setMonthlyRev] = useState("");
  const [goal, setGoal] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("lhyo_booked_slots_v37");
      if (saved) setCustomBooked(JSON.parse(saved));
    } catch {
      // Ignorar errores de storage
    }
    const handleCustomOpen = () => {
      setStep("form");
      setOpen(true);
    };
    window.addEventListener("lhyo-open-audit-modal", handleCustomOpen);
    return () => window.removeEventListener("lhyo-open-audit-modal", handleCustomOpen);
  }, []);

  const getOccupiedForDate = (dateStr: string) => {
    const base = BASE_OCCUPIED_BY_DATE[dateStr] || [];
    const userBooked = customBooked[dateStr] || [];
    return Array.from(new Set([...base, ...userBooked]));
  };

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    const occupied = getOccupiedForDate(newDate);
    if (occupied.includes(selectedTime)) {
      const firstFree = ALL_TIME_SLOTS.find((t) => !occupied.includes(t)) || "11:00 AM";
      setSelectedTime(firstFree);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;
    setSubmitting(true);

    // Guardar como Ocupado ese horario en esa fecha específica
    const updatedBooked = {
      ...customBooked,
      [selectedDate]: Array.from(new Set([...(customBooked[selectedDate] || []), selectedTime]))
    };
    setCustomBooked(updatedBooked);
    try {
      localStorage.setItem("lhyo_booked_slots_v37", JSON.stringify(updatedBooked));
    } catch {
      // Ignorar
    }

    const revNumber = parseFloat(monthlyRev.replace(/[^0-9.]/g, "")) || 0;
    const tier = revNumber >= 5000 ? "HIGH_TICKET" : "LOW_TICKET";
    const nowVe = new Date().toLocaleString("es-VE", { timeZone: "America/Caracas" });

    try {
      await fetch("https://hook.us2.make.com/krs48cjfzudf4lau3sapwdgdu9lfe1tb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fecha_registro: nowVe,
          horario_cita: `${selectedDate} - ${selectedTime}`,
          nombre_cliente: fullName,
          email_cliente: email,
          empresa_web: companyWeb || "No especificada",
          facturacion_usd: monthlyRev || "0",
          clasificacion: tier,
          servicio_elegido: preselectedService,
          objetivo_cliente: goal || "Diagnóstico Ejecutivo",
          resumen_crm: `AGENDA WEB (${tier}) || Empresa: ${companyWeb} || Horario: ${selectedDate} ${selectedTime}`,
          link_videollamada_meet: "https://meet.google.com/krc-vdii-zzh"
        })
      });
    } catch {
      // Continuar a confirmación
    } finally {
      setSubmitting(false);
      setStep("confirmed");
    }
  };

  const occupiedNow = getOccupiedForDate(selectedDate);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setStep("form");
          setOpen(true);
        }}
        className={
          className ||
          "px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#FCF6BA] to-[#B38728] text-[#050507] font-extrabold text-xs uppercase tracking-wider shadow-lg hover:brightness-105 transition cursor-pointer"
        }
      >
        {label}
      </button>

      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-3 overflow-y-auto">
          {step === "form" && (
            <div className="w-full max-w-[760px] rounded-2xl border border-[#C5A059]/60 bg-[#050507] shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden my-auto">
              <div className="px-5 py-2 bg-[#080B14] border-b border-white/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-xs text-[#C5A059] hover:underline cursor-pointer"
                >
                  ← Volver atrás
                </button>
                <span className="text-[11px] font-bold tracking-[0.22em] text-[#C5A059] uppercase">
                  LHYO GROUP · AGENDA EJECUTIVA
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-3 py-1 rounded-full border border-[#C5A059]/40 text-[11px] text-gray-200 hover:text-white cursor-pointer"
                >
                  Cerrar ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="px-6 py-3.5 space-y-2.5 text-left">
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                    Reserva tu Sesión y Recibe nuestro Catálogo Privado
                  </h3>
                  <p className="text-xs text-gray-300 mt-0.5">
                    Selecciona un día y horario disponible. Al confirmar, registraremos tu reunión y enviaremos nuestro Catálogo Privado B2B a tu correo electrónico.
                  </p>
                </div>

                <div className="px-3.5 py-2 rounded-xl bg-white/[0.03] border-l-2 border-[#C5A059]">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#C5A059] block">
                    SOLICITUD SELECCIONADA:
                  </span>
                  <span className="text-xs text-white font-semibold">{preselectedService}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
                  <div className="sm:col-span-6">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#FCF6BA] block mb-1">
                      FECHA DISPONIBLE *
                    </label>
                    <div className="relative">
                      <select
                        value={selectedDate}
                        onChange={(e) => handleDateChange(e.target.value)}
                        className="w-full rounded-xl bg-[#0A0E17] border border-[#C5A059]/60 px-3.5 py-2 text-xs text-white font-semibold outline-none appearance-none cursor-pointer"
                      >
                        {AVAILABLE_DATES.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-[#C5A059]">
                        ▼ Cambiar
                      </span>
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#FCF6BA] block mb-1">
                      HORARIO DISPONIBLE *
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {ALL_TIME_SLOTS.map((slot) => {
                        const isOccupied = occupiedNow.includes(slot);
                        return isOccupied ? (
                          <div
                            key={slot}
                            className="py-1.5 rounded-lg bg-[#080B12] border border-white/5 text-[11px] text-gray-600 line-through text-center select-none"
                          >
                            Ocupado
                          </div>
                        ) : (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedTime(slot)}
                            className={`py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                              selectedTime === slot
                                ? "bg-gradient-to-r from-[#C5A059] via-[#FCF6BA] to-[#B38728] text-black shadow"
                                : "bg-[#0A0E17] border border-white/10 text-gray-200 hover:border-[#C5A059]"
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#FCF6BA] block mb-1">
                      TU NOMBRE COMPLETO *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ej: Carlos Mendoza"
                      className="w-full rounded-xl bg-[#0A0E17] border border-white/10 focus:border-[#C5A059] px-3.5 py-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#FCF6BA] block mb-1">
                      TU CORREO ELECTRÓNICO *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Donde recibirás el Catálogo Privado"
                      className="w-full rounded-xl bg-[#0A0E17] border border-white/10 focus:border-[#C5A059] px-3.5 py-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#FCF6BA] block mb-1">
                      SITIO WEB O INSTAGRAM DE TU EMPRESA *
                    </label>
                    <input
                      type="text"
                      required
                      value={companyWeb}
                      onChange={(e) => setCompanyWeb(e.target.value)}
                      placeholder="Ej: @miempresa o www.miempresa.com"
                      className="w-full rounded-xl bg-[#0A0E17] border border-white/10 focus:border-[#C5A059] px-3.5 py-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#FCF6BA] block mb-1">
                      FACTURACIÓN MENSUAL ACTUAL EN USD *
                    </label>
                    <input
                      type="text"
                      required
                      value={monthlyRev}
                      onChange={(e) => setMonthlyRev(e.target.value)}
                      placeholder="Solo números, ej: 10000"
                      className="w-full rounded-xl bg-[#0A0E17] border border-white/10 focus:border-[#C5A059] px-3.5 py-2 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#FCF6BA] block mb-1">
                    ¿QUÉ OBJETIVO PRINCIPAL BUSCAS LOGRAR O QUÉ ÁREA DE TU NEGOCIO DESEAS IMPULSAR HOY? *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="Cuéntanos brevemente qué te gustaría lograr o mejorar en tu empresa..."
                    className="w-full rounded-xl bg-[#0A0E17] border border-[#C5A059]/50 px-3.5 py-1.5 text-xs text-white outline-none resize-none"
                  />
                </div>

                <div className="pt-0.5">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto min-w-[380px] py-3 px-6 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#FCF6BA] to-[#B38728] text-[#050507] font-extrabold text-xs uppercase tracking-wider shadow-lg hover:brightness-105 transition cursor-pointer"
                  >
                    {submitting
                      ? "REGISTRANDO REUNIÓN..."
                      : "CONFIRMAR MI REUNIÓN Y RECIBIR CATÁLOGO PRIVADO →"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === "confirmed" && (
            <div className="w-full max-w-[680px] rounded-2xl border border-[#C5A059]/60 bg-[#050507] shadow-2xl overflow-hidden text-center my-auto">
              <div className="px-5 py-2.5 bg-[#080B14] border-b border-white/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep("form")}
                  className="text-xs text-[#C5A059] cursor-pointer"
                >
                  ← Volver atrás
                </button>
                <span className="text-[11px] font-bold tracking-[0.22em] text-[#C5A059] uppercase">
                  LHYO GROUP · AGENDA EJECUTIVA
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-3 py-1 rounded-full border border-[#C5A059]/40 text-[11px] text-gray-200 cursor-pointer"
                >
                  Cerrar ✕
                </button>
              </div>

              <div className="p-6 sm:p-7 space-y-4">
                <div className="w-12 h-12 rounded-full border border-[#C5A059]/60 bg-[#C5A059]/10 text-[#FCF6BA] flex items-center justify-center mx-auto text-lg font-bold">
                  ✓
                </div>
                <p className="text-[11px] font-bold tracking-[0.22em] text-[#C5A059] uppercase">
                  TURNO RESERVADO Y ENVIADO A TU CORREO
                </p>
                <h3 className="text-2xl font-extrabold text-white">
                  ¡Tu sesión ha quedado confirmada, {fullName}!
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 max-w-lg mx-auto leading-relaxed">
                  Hemos reservado tu espacio exclusivo para el <strong>{selectedDate}</strong> a las{" "}
                  <strong>{selectedTime}</strong> y hemos enviado tu <strong>Catálogo Privado B2B</strong> junto con el enlace de{" "}
                  <strong>Google Meet</strong> a <strong>{email}</strong>.
                </p>

                <div className="max-w-lg mx-auto rounded-xl border border-[#C5A059]/35 bg-[#0A0D14] p-4 text-left space-y-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#FCF6BA]">
                    ✦ NOTA IMPORTANTE SOBRE LA RECEPCIÓN DE TU CORREO:
                  </p>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Si no visualizas nuestro mensaje en tu bandeja principal en los próximos 2 minutos, por favor revisa tu carpeta de{" "}
                    <strong>Spam (Correo no deseado)</strong> o <strong>Promociones</strong> y márcalo como seguro para acceder a tu Catálogo Privado y a tu enlace de videollamada.
                  </p>
                </div>

                <div className="max-w-md mx-auto space-y-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setStep("dossier")}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#FCF6BA] to-[#B38728] text-[#050507] font-extrabold text-xs uppercase tracking-wider shadow-lg hover:brightness-105 transition cursor-pointer"
                  >
                    1. ABRIR Y DESCARGAR MI CATÁLOGO PRIVADO (PDF) →
                  </button>
                  <a
                    href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Sesi%C3%B3n+Ejecutiva+Lhyo+Group&details=Videollamada+Google+Meet:+https://meet.google.com/krc-vdii-zzh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-2.5 rounded-xl bg-[#080B14] border border-[#C5A059]/40 text-white font-bold text-xs uppercase tracking-wider hover:border-[#C5A059] transition"
                  >
                    2. GUARDAR ESTA REUNIÓN EN GOOGLE CALENDAR →
                  </a>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="w-full py-1 text-xs text-gray-400 hover:text-white cursor-pointer"
                  >
                    Cerrar y volver a la página
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === "dossier" && (
            <div className="relative w-full max-w-4xl rounded-2xl border border-[#C5A059]/70 bg-[#050507] p-5 sm:p-6 shadow-2xl overflow-y-auto max-h-[92vh] text-left">
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.045]">
                <svg className="w-[360px] h-[360px]" viewBox="0 0 120 110" fill="none">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10 42 L40 18 L40 70 L102 70 L84 96 L28 96 L28 80 L10 80 Z M20 46 L30 38 L30 70 L20 70 Z M40 80 L86 80 L80 87 L40 87 Z"
                    fill="#FFFFFF"
                  />
                  <path d="M48 11 L58 3 L58 63 L48 63 Z" fill="#C5A059" />
                </svg>
              </div>

              <div className="relative z-10 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#C5A059]/30">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C5A059]">
                      DOSSIER EJECUTIVO CONFIDENCIAL · LHYO GROUP
                    </p>
                    <h4 className="text-lg font-extrabold text-white">
                      Catálogo Oficial de Soluciones Tecnológicas B2B
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#FCF6BA] to-[#B38728] text-black font-extrabold text-xs uppercase cursor-pointer"
                    >
                      Imprimir / Guardar PDF ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep("confirmed")}
                      className="px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-gray-300 cursor-pointer"
                    >
                      ← Volver
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#080B14]/90 p-3.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[#FCF6BA] font-bold">Preparado para:</span>{" "}
                    {fullName || "Dirección Ejecutiva"}
                  </div>
                  <div>
                    <span className="text-[#FCF6BA] font-bold">Empresa / Organización:</span>{" "}
                    {companyWeb || "Su Empresa"}
                  </div>
                  <div>
                    <span className="text-[#FCF6BA] font-bold">Fecha y Hora Reservada:</span>{" "}
                    {selectedDate} · {selectedTime}
                  </div>
                  <div>
                    <span className="text-[#FCF6BA] font-bold">Solución Seleccionada:</span>{" "}
                    {preselectedService}
                  </div>
                </div>

                <div className="rounded-xl border border-[#C5A059]/50 bg-[#090E1C]/90 p-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#FCF6BA] block">
                      ★ ARQUITECTURA INTEGRAL CORPORATIVA · LLAVE EN MANO
                    </span>
                    <h5 className="text-sm font-extrabold text-white">
                      Paquete Completo (Todo Incluido · Las 06 Soluciones Oficiales)
                    </h5>
                    <p className="text-xs text-gray-300">
                      Integración total de las 06 soluciones conectadas entre sí bajo la marca y el control exclusivo de su empresa.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase border border-[#C5A059] text-[#FCF6BA]">
                    PRIORIDAD EJECUTIVA
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {OFFICIAL_06_SOLUTIONS.map((sol) => (
                    <div
                      key={sol.id}
                      className="rounded-xl border border-white/10 bg-[#080B14]/90 p-3.5 space-y-1"
                    >
                      <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-[#C5A059]">
                        <span>{sol.code}</span>
                        <span className="text-white text-xs font-black">{sol.id}</span>
                      </div>
                      <h6 className="text-xs sm:text-sm font-extrabold text-white leading-snug">
                        {sol.title}
                      </h6>
                      <p className="text-[11px] text-gray-300 leading-relaxed">{sol.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
