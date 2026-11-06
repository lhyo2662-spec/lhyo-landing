"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface AuditTriggerButtonProps {
  label?: string;
  preselectedService?: string;
  className?: string;
}

const OFFICIAL_06_SOLUTIONS = [
  {
    id: "01",
    code: "SOLUCIÓN 01 · ATENCIÓN INMEDIATA 24/7",
    title: "Asistentes Inteligentes para WhatsApp e Instagram (24/7)",
    summary:
      "Atienden en menos de 1 segundo día y noche, resuelven dudas con la información de su empresa y agendan citas en automático."
  },
  {
    id: "02",
    code: "SOLUCIÓN 02 · PRESENCIA DE ALTO PRESTIGIO",
    title: "Plataformas Web Modernas y Catálogos Interactivos",
    summary:
      "Desarrollamos plataformas corporativas ultrarrápidas (< 0.8s) con estética ejecutiva diseñadas para convertir cada visita en cliente."
  },
  {
    id: "03",
    code: "SOLUCIÓN 03 · CONTROL COMERCIAL TOTAL",
    title: "Organización Automática de Clientes y Ventas (CRM)",
    summary:
      "Todo prospecto que escribe por WhatsApp, Instagram o su Web queda registrado y clasificado por prioridad sin anotar nada a mano."
  },
  {
    id: "04",
    code: "SOLUCIÓN 04 · INDEPENDENCIA SIN LÍMITES",
    title: "Automatización Total de Procesos con Tecnología Propia",
    summary:
      "Instalamos el motor automático propio de su empresa para conectar ventas, agenda y correos sin pagar tarifas mensuales por volumen."
  },
  {
    id: "05",
    code: "SOLUCIÓN 05 · CEREBRO PRIVADO EMPRESARIAL",
    title: "IA Personalizada con la Memoria de su Empresa",
    summary:
      "Entrenamos un cerebro privado con sus contratos, precios y documentos internos para responder cualquier consulta en 1 segundo."
  },
  {
    id: "06",
    code: "SOLUCIÓN 06 · TODA SU EMPRESA EN 1 PANTALLA",
    title: "Su Propia Plataforma Empresarial Todo-en-Uno",
    summary:
      "Unificamos ventas, clientes, agenda, finanzas y métricas operativas en un solo panel privado hecho a medida con el logo de su empresa."
  }
];

const ALL_TIME_SLOTS = ["09:30 AM", "11:00 AM", "01:00 PM", "03:00 PM", "04:30 PM", "06:00 PM"];

const BASE_OCCUPIED_BY_DATE: Record<string, string[]> = {
  "06 de Noviembre, 2026": ["09:30 AM", "01:00 PM"],
  "07 de Noviembre, 2026": ["11:00 AM", "04:30 PM"],
  "09 de Noviembre, 2026": ["09:30 AM", "03:00 PM"],
  "10 de Noviembre, 2026": ["01:00 PM", "06:00 PM"],
  "11 de Noviembre, 2026": ["11:00 AM", "03:00 PM"],
  "12 de Noviembre, 2026": ["11:00 AM"]
};

export default function AuditTriggerButton({
  label = "AGENDAR REUNIÓN Y RECIBIR CATÁLOGO",
  preselectedService = "AUDITORÍA GENERAL (Botón Principal Portada)",
  className = ""
}: AuditTriggerButtonProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<"form" | "confirmed" | "dossier">("form");
  const [submitting, setSubmitting] = useState(false);

  const [selectedDate, setSelectedDate] = useState("09 de Noviembre, 2026");
  const [selectedTime, setSelectedTime] = useState("11:00 AM");
  const [userBookedByDate, setUserBookedByDate] = useState<Record<string, string[]>>({});
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [companyWeb, setCompanyWeb] = useState("");
  const [monthlyRev, setMonthlyRev] = useState("");
  const [goal, setGoal] = useState("");

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("lhyo_booked_slots_v41");
      if (saved) setUserBookedByDate(JSON.parse(saved));
    } catch {}
    const handleCustomOpen = () => {
      setStep("form");
      setOpen(true);
    };
    window.addEventListener("lhyo-open-audit-modal", handleCustomOpen);
    return () => window.removeEventListener("lhyo-open-audit-modal", handleCustomOpen);
  }, []);

  const getOccupiedForDate = (dateStr: string) => {
    const base = BASE_OCCUPIED_BY_DATE[dateStr] || ["09:30 AM"];
    const extra = userBookedByDate[dateStr] || [];
    return Array.from(new Set([...base, ...extra]));
  };

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    const occupied = getOccupiedForDate(newDate);
    if (occupied.includes(selectedTime)) {
      const firstAvailable = ALL_TIME_SLOTS.find((s) => !occupied.includes(s)) || "03:00 PM";
      setSelectedTime(firstAvailable);
    }
  };

  const handlePrintSinglePageDossier = () => {
    if (typeof window === "undefined") return;
    document.body.classList.add("lhyo-printing-single-page");
    window.print();
    setTimeout(() => {
      document.body.classList.remove("lhyo-printing-single-page");
    }, 600);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;
    setSubmitting(true);

    const updatedBookings = {
      ...userBookedByDate,
      [selectedDate]: Array.from(new Set([...(userBookedByDate[selectedDate] || []), selectedTime]))
    };
    setUserBookedByDate(updatedBookings);
    try {
      localStorage.setItem("lhyo_booked_slots_v41", JSON.stringify(updatedBookings));
    } catch {}

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
    } catch {} finally {
      setSubmitting(false);
      setStep("confirmed");
    }
  };

  const occupiedNow = getOccupiedForDate(selectedDate);

  const modalContent = open ? (
    <div
      id="lhyo-dossier-print-root"
      className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-4 overflow-y-auto"
    >
      {/* REGLA CSS DE IMPRESIÓN DE 1 SOLA PÁGINA EXACTA (CORRIGE LAS 3 PÁGINAS DE CAPTURA 170047.PNG) */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            @page {
              size: A4 landscape;
              margin: 5mm;
            }
            html, body {
              width: 100% !important;
              height: 100% !important;
              max-height: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
              overflow: hidden !important;
              background: #050507 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body > *:not(#lhyo-dossier-print-root) {
              display: none !important;
            }
            #lhyo-dossier-print-root {
              position: static !important;
              width: 100% !important;
              height: auto !important;
              max-height: 100% !important;
              padding: 0 !important;
              margin: 0 !important;
              overflow: hidden !important;
              background: #050507 !important;
              display: block !important;
            }
            #lhyo-dossier-single-sheet {
              width: 100% !important;
              max-width: 100% !important;
              margin: 0 !important;
              box-shadow: none !important;
              page-break-after: avoid !important;
              page-break-before: avoid !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            .lhyo-no-print {
              display: none !important;
            }
          }
        `
      }} />

      {step === "form" && (
        <div className="w-full max-w-3xl rounded-2xl border border-[#C5A059]/65 bg-[#050507] shadow-[0_25px_90px_rgba(0,0,0,0.98)] overflow-hidden my-auto">
          <div className="px-6 py-2.5 bg-[#080B14] border-b border-white/10 flex items-center justify-between">
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
              className="px-3.5 py-1 rounded-full border border-[#C5A059]/50 text-xs text-gray-200 hover:text-white cursor-pointer"
            >
              Cerrar ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-2.5 text-left">
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white leading-tight">
                Reserva tu Sesión y Recibe nuestro Catálogo Privado
              </h3>
              <p className="text-xs text-gray-300 mt-0.5">
                Selecciona un día y horario disponible. Al confirmar, registraremos tu reunión y enviaremos nuestro Catálogo Privado B2B a tu correo electrónico.
              </p>
            </div>

            <div className="rounded-xl bg-[#0B0F1A] border border-white/10 border-l-2 border-l-[#C5A059] px-4 py-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] block">
                SOLICITUD SELECCIONADA:
              </span>
              <span className="text-xs font-semibold text-white">{preselectedService}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
              <div className="sm:col-span-5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#FCF6BA] block mb-1">
                  FECHA DISPONIBLE *
                </label>
                <div className="relative">
                  <select
                    value={selectedDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="w-full appearance-none rounded-xl bg-[#0B0F1A] border border-[#C5A059]/60 px-3.5 py-2 text-xs text-white font-semibold outline-none cursor-pointer"
                  >
                    {Object.keys(BASE_OCCUPIED_BY_DATE).map((d) => (
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

              <div className="sm:col-span-7">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#FCF6BA] block mb-1">
                  HORARIO DISPONIBLE *
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {ALL_TIME_SLOTS.map((slot) => {
                    const isOccupied = occupiedNow.includes(slot);
                    const isSelected = selectedTime === slot && !isOccupied;
                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={isOccupied}
                        onClick={() => setSelectedTime(slot)}
                        className={`py-1.5 rounded-lg text-xs font-bold transition ${
                          isOccupied
                            ? "bg-[#080B12] border border-white/5 text-gray-600 line-through cursor-not-allowed"
                            : isSelected
                            ? "bg-gradient-to-r from-[#C5A059] via-[#FCF6BA] to-[#B38728] text-[#050507] shadow cursor-pointer"
                            : "bg-[#0B0F1A] border border-white/10 text-white hover:border-[#C5A059] cursor-pointer"
                        }`}
                      >
                        {isOccupied ? "Ocupado" : slot}
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
                  className="w-full rounded-xl bg-[#0B0F1A] border border-white/15 focus:border-[#C5A059] px-3.5 py-2 text-xs text-white outline-none"
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
                  className="w-full rounded-xl bg-[#0B0F1A] border border-white/15 focus:border-[#C5A059] px-3.5 py-2 text-xs text-white outline-none"
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
                  className="w-full rounded-xl bg-[#0B0F1A] border border-white/15 focus:border-[#C5A059] px-3.5 py-2 text-xs text-white outline-none"
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
                  className="w-full rounded-xl bg-[#0B0F1A] border border-white/15 focus:border-[#C5A059] px-3.5 py-2 text-xs text-white outline-none"
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
                className="w-full rounded-xl bg-[#0B0F1A] border border-[#C5A059]/60 px-3.5 py-2 text-xs text-white outline-none resize-none"
              />
            </div>

            <div className="pt-0.5">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#FCF6BA] to-[#B38728] text-[#050507] font-extrabold text-xs uppercase tracking-wider shadow-lg hover:brightness-105 transition cursor-pointer"
              >
                {submitting ? "REGISTRANDO REUNIÓN..." : "CONFIRMAR MI REUNIÓN Y RECIBIR CATÁLOGO PRIVADO →"}
              </button>
            </div>
          </form>
        </div>
      )}

      {step === "confirmed" && (
        <div className="w-full max-w-2xl rounded-2xl border border-[#C5A059]/65 bg-[#050507] shadow-2xl overflow-hidden text-center my-auto">
          <div className="px-6 py-3 bg-[#080B14] border-b border-white/10 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep("form")}
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
              className="px-3.5 py-1 rounded-full border border-[#C5A059]/50 text-xs text-gray-200 cursor-pointer"
            >
              Cerrar ✕
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-4">
            <div className="w-12 h-12 rounded-full border border-[#C5A059] bg-[#C5A059]/10 text-[#FCF6BA] flex items-center justify-center mx-auto text-lg font-bold">
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

            <div className="max-w-md mx-auto space-y-2.5 pt-1">
              <button
                type="button"
                onClick={() => setStep("dossier")}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#FCF6BA] to-[#B38728] text-[#050507] font-extrabold text-xs uppercase tracking-wider shadow-lg hover:brightness-105 transition cursor-pointer"
              >
                1. ABRIR Y DESCARGAR MI CATÁLOGO PRIVADO (PDF) →
              </button>
              <a
                href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Sesi%C3%B3n+Ejecutiva+Lhyo+Group"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 rounded-xl bg-[#080B14] border border-white/15 hover:border-[#C5A059] text-white font-bold text-xs uppercase tracking-wider transition"
              >
                2. GUARDAR ESTA REUNIÓN EN GOOGLE CALENDAR →
              </a>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-full pt-1 text-xs text-gray-400 hover:text-white cursor-pointer"
              >
                Cerrar y volver a la página
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PASO 3: CATÁLOGO OFICIAL CON DISEÑO REFLECTIVO ELEGANTE DE GARANTÍA + IMPRESIÓN EN 1 SOLA PÁGINA */}
      {step === "dossier" && (
        <div
          id="lhyo-dossier-single-sheet"
          className="relative w-full max-w-5xl rounded-2xl border border-[#C5A059]/70 bg-[#050507] shadow-[0_25px_100px_rgba(0,0,0,0.98)] overflow-hidden text-left my-auto"
        >
          <div className="px-5 py-2.5 bg-[#080B14] border-b border-[#C5A059]/30 flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setStep("confirmed")}
              className="lhyo-no-print text-xs text-[#C5A059] hover:underline font-semibold cursor-pointer"
            >
              ← Volver atrás
            </button>
            <span className="text-[11px] font-bold tracking-[0.22em] text-[#FCF6BA] uppercase">
              LHYO GROUP · CATÁLOGO OFICIAL DE SOLUCIONES TECNOLÓGICAS B2B
            </span>
            <div className="lhyo-no-print flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrintSinglePageDossier}
                className="px-3.5 py-1 rounded-full bg-gradient-to-r from-[#C5A059] via-[#FCF6BA] to-[#B38728] text-black font-extrabold text-[11px] uppercase cursor-pointer hover:brightness-105 transition"
              >
                DESCARGAR / IMPRIMIR PDF (1 PÁGINA) ↓
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-3 py-1 rounded-full border border-[#C5A059]/50 text-[11px] text-gray-200 hover:text-white cursor-pointer"
              >
                Cerrar ✕
              </button>
            </div>
          </div>

          <div className="relative p-4 sm:p-5">
            {/* Marca de agua gigante del monograma L */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.045]">
              <svg className="w-[330px] h-[330px]" viewBox="0 0 120 110" fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10 42 L40 18 L40 70 L102 70 L84 96 L28 96 L28 80 L10 80 Z M20 46 L30 38 L30 70 L20 70 Z M40 80 L86 80 L80 87 L40 87 Z"
                  fill="#FFFFFF"
                />
                <path d="M48 11 L58 3 L58 63 L48 63 Z" fill="#C5A059" />
              </svg>
            </div>

            <div className="relative z-10 space-y-3">
              {/* Fila Superior: Datos de Reserva + Paquete Completo con Efecto Reflectivo */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
                <div className="group relative overflow-hidden lg:col-span-5 rounded-xl border border-white/10 bg-[#080B14]/95 px-4 py-2.5 flex flex-col justify-center text-xs space-y-1 transition-all duration-500 hover:border-[#C5A059]/75 hover:shadow-[0_12px_35px_rgba(197,160,89,0.16)]">
                  <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#FCF6BA]/12 to-transparent skew-x-[-25deg] transition-transform duration-700 ease-out group-hover:translate-x-full" />
                  <div>
                    <span className="text-[#FCF6BA] font-bold">Preparado para:</span>{" "}
                    {fullName || "Dirección Ejecutiva"} ({companyWeb || "Su Empresa"})
                  </div>
                  <div>
                    <span className="text-[#FCF6BA] font-bold">Fecha y Hora Reservada:</span>{" "}
                    {selectedDate} · {selectedTime}
                  </div>
                  <div>
                    <span className="text-[#FCF6BA] font-bold">Solicitud:</span> {preselectedService}
                  </div>
                </div>

                <div className="group relative overflow-hidden lg:col-span-7 rounded-xl border border-[#C5A059]/55 bg-[#080B14]/95 px-5 py-2.5 flex items-center justify-between gap-3 transition-all duration-500 hover:-translate-y-0.5 hover:border-[#FCF6BA]/90 hover:bg-gradient-to-b hover:from-[#C5A059]/[0.12] hover:to-[#080B14] hover:shadow-[0_14px_40px_rgba(197,160,89,0.22)]">
                  <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#FCF6BA]/15 to-transparent skew-x-[-25deg] transition-transform duration-700 ease-out group-hover:translate-x-full" />
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#FCF6BA] block mb-0.5">
                      ★ ARQUITECTURA INTEGRAL CORPORATIVA · LLAVE EN MANO
                    </span>
                    <h5 className="text-xs sm:text-sm font-extrabold text-white group-hover:text-[#FCF6BA] transition-colors">
                      Paquete Completo (Todo Incluido · Las 06 Soluciones Oficiales)
                    </h5>
                    <p className="text-[11px] text-gray-300 mt-0.5">
                      Integración total de las 06 soluciones conectadas entre sí bajo la marca y el control exclusivo de su empresa.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[9px] font-extrabold uppercase border border-[#C5A059]/80 text-[#FCF6BA] bg-[#C5A059]/10 shrink-0">
                    PRIORIDAD EJECUTIVA
                  </span>
                </div>
              </div>

              {/* Cuadrícula 3x2 con el Diseño Reflectivo Elegante de Garantía (Sin relleno amarillo chillón) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-stretch">
                {OFFICIAL_06_SOLUTIONS.map((sol) => (
                  <div
                    key={sol.id}
                    className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#080B14]/95 p-3.5 flex flex-col justify-between transition-all duration-500 hover:-translate-y-1 hover:border-[#C5A059]/80 hover:bg-gradient-to-b hover:from-[#C5A059]/[0.11] hover:to-[#080B14]/95 hover:shadow-[0_14px_38px_rgba(197,160,89,0.20)]"
                  >
                    {/* Haz de luz reflectivo diagonal al pasar el mouse */}
                    <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#FCF6BA]/15 to-transparent skew-x-[-25deg] transition-transform duration-700 ease-out group-hover:translate-x-full" />
                    <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_0%,rgba(197,160,89,0.16),transparent_70%)]" />

                    <div className="relative z-10">
                      <div className="w-7 h-[2px] bg-[#C5A059] mb-2 transition-all duration-500 group-hover:w-14 group-hover:bg-[#FCF6BA] group-hover:shadow-[0_0_10px_#FCF6BA]" />
                      <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-[#C5A059] group-hover:text-[#FCF6BA] transition-colors mb-1">
                        <span>{sol.code}</span>
                        <span className="text-white/90 text-xs font-black">{sol.id}</span>
                      </div>
                      <h6 className="text-xs font-extrabold text-white group-hover:text-[#FCF6BA] transition-colors leading-snug mb-1">
                        {sol.title}
                      </h6>
                      <p className="text-[11px] text-gray-300 leading-relaxed">{sol.summary}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-1.5 border-t border-white/10 flex flex-wrap items-center justify-between text-[10px] text-gray-400">
                <span>LHYO GROUP · www.lhyogroup.com · ceo@lhyogroup.com</span>
                <span className="text-[#FCF6BA] font-semibold">
                  Sala Ejecutiva Google Meet: https://meet.google.com/krc-vdii-zzh
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  ) : null;

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
      {mounted && open ? createPortal(modalContent, document.body) : null}
    </>
  );
}