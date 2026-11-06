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

const ALL_SLOTS = ["09:30 AM", "11:00 AM", "01:00 PM", "03:00 PM", "04:30 PM", "06:00 PM"];

const BASE_OCCUPIED_BY_DATE: Record<string, string[]> = {
  "06 de Noviembre, 2026": ["09:30 AM", "03:00 PM"],
  "07 de Noviembre, 2026": ["11:00 AM", "04:30 PM"],
  "09 de Noviembre, 2026": ["09:30 AM", "01:00 PM"],
  "10 de Noviembre, 2026": ["03:00 PM"],
  "11 de Noviembre, 2026": ["11:00 AM", "06:00 PM"],
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
  const [bookedByUser, setBookedByUser] = useState<Record<string, string[]>>({});

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [companyWeb, setCompanyWeb] = useState("");
  const [monthlyRev, setMonthlyRev] = useState("");
  const [goal, setGoal] = useState("");

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("lhyo_booked_slots_v1");
      if (saved) setBookedByUser(JSON.parse(saved));
    } catch {
      // Ignorar errores de almacenamiento local
    }

    const handleCustomOpen = () => {
      setStep("form");
      setOpen(true);
    };
    window.addEventListener("lhyo-open-audit-modal", handleCustomOpen);
    return () => window.removeEventListener("lhyo-open-audit-modal", handleCustomOpen);
  }, []);

  const getOccupiedForDate = (dateStr: string) => {
    const base = BASE_OCCUPIED_BY_DATE[dateStr] || ["09:30 AM"];
    const userBooked = bookedByUser[dateStr] || [];
    return Array.from(new Set([...base, ...userBooked]));
  };

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    const occupied = getOccupiedForDate(newDate);
    if (occupied.includes(selectedTime)) {
      const firstAvailable = ALL_SLOTS.find((s) => !occupied.includes(s)) || "03:00 PM";
      setSelectedTime(firstAvailable);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;
    setSubmitting(true);

    const nextBooked = {
      ...bookedByUser,
      [selectedDate]: Array.from(new Set([...(bookedByUser[selectedDate] || []), selectedTime]))
    };
    setBookedByUser(nextBooked);
    try {
      localStorage.setItem("lhyo_booked_slots_v1", JSON.stringify(nextBooked));
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

  const occupiedSlots = getOccupiedForDate(selectedDate);

  const modalContent = open ? (
    <div
      id="lhyo-dossier-print-root"
      className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/88 backdrop-blur-md p-2 sm:p-4 overflow-y-auto select-none"
    >
      <style jsx global>{`
        @media print {
          @page {
            size: landscape;
            margin: 6mm;
          }
          body > *:not(#lhyo-dossier-print-root) {
            display: none !important;
          }
          #lhyo-dossier-print-root {
            position: static !important;
            background: #08080a !important;
            padding: 0 !important;
            overflow: visible !important;
          }
          .lhyo-no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* PASO 1: FORMULARIO DE AGENDA EJECUTIVA */}
      {step === "form" && (
        <div className="w-full max-w-[780px] rounded-2xl border border-[#C5A059]/45 bg-[#0A0A0D] shadow-[0_25px_90px_rgba(0,0,0,0.98)] overflow-hidden my-auto">
          <div className="px-6 py-2.5 bg-[#0E0D11] border-b border-white/[0.08] flex items-center justify-between">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs text-[#C5A059] hover:text-[#EFE2BA] transition cursor-pointer"
            >
              ← Volver atrás
            </button>
            <span className="text-[11px] font-semibold tracking-[0.24em] text-[#C5A059] uppercase">
              LHYO GROUP · AGENDA EJECUTIVA
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-3.5 py-1 rounded-full border border-[#C5A059]/35 text-[11px] text-[#E4E4E7] hover:border-[#C5A059] cursor-pointer"
            >
              Cerrar ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-2.5 text-left">
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold text-[#F2F2F5] leading-tight">
                Reserva tu Sesión y Recibe nuestro Catálogo Privado
              </h3>
              <p className="text-xs text-[#A3A3AC] mt-0.5">
                Selecciona un día y horario disponible. Al confirmar, registraremos tu reunión y enviaremos nuestro Catálogo Privado B2B a tu correo electrónico.
              </p>
            </div>

            <div className="px-4 py-2 rounded-xl bg-[#111015] border border-white/[0.06] border-l-2 border-l-[#C5A059]">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C5A059] block">
                SOLICITUD SELECCIONADA:
              </span>
              <span className="text-xs text-[#EFE2BA] font-medium">{preselectedService}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start pt-0.5">
              <div className="sm:col-span-5">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-[#D4D4D8] block mb-1">
                  FECHA DISPONIBLE *
                </label>
                <div className="relative">
                  <select
                    value={selectedDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="w-full appearance-none rounded-xl bg-[#111015] border border-[#C5A059]/45 px-3.5 py-2 text-xs text-[#F2F2F5] font-medium outline-none cursor-pointer"
                  >
                    {Object.keys(BASE_OCCUPIED_BY_DATE).map((d) => (
                      <option key={d} value={d} className="bg-[#0B0B0E] text-[#F2F2F5]">
                        {d}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-[#C5A059]">
                    ▼ Cambiar
                  </span>
                </div>
              </div>

              <div className="sm:col-span-7">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-[#D4D4D8] block mb-1">
                  HORARIO DISPONIBLE *
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {ALL_SLOTS.map((slot) => {
                    const isOccupied = occupiedSlots.includes(slot);
                    const isSelected = selectedTime === slot && !isOccupied;
                    return isOccupied ? (
                      <div
                        key={slot}
                        className="py-1.5 rounded-lg bg-[#0D0D11] border border-white/[0.04] text-[11px] text-gray-600 line-through text-center select-none cursor-not-allowed"
                      >
                        Ocupado
                      </div>
                    ) : (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        className={`py-1.5 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                          isSelected
                            ? "bg-gradient-to-r from-[#C5A059] via-[#E5C77D] to-[#B38728] text-[#08080A] shadow"
                            : "bg-[#111015] border border-white/10 text-[#E4E4E7] hover:border-[#C5A059]/60"
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
                <label className="text-[10px] font-semibold uppercase tracking-wider text-[#D4D4D8] block mb-1">
                  TU NOMBRE COMPLETO *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ej: Carlos Mendoza"
                  className="w-full rounded-xl bg-[#111015] border border-white/10 focus:border-[#C5A059] px-3.5 py-2 text-xs text-[#F2F2F5] placeholder-[#71717A] outline-none select-text"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-[#D4D4D8] block mb-1">
                  TU CORREO ELECTRÓNICO *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Donde recibirás el Catálogo Privado"
                  className="w-full rounded-xl bg-[#111015] border border-white/10 focus:border-[#C5A059] px-3.5 py-2 text-xs text-[#F2F2F5] placeholder-[#71717A] outline-none select-text"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-[#D4D4D8] block mb-1">
                  SITIO WEB O INSTAGRAM DE TU EMPRESA *
                </label>
                <input
                  type="text"
                  required
                  value={companyWeb}
                  onChange={(e) => setCompanyWeb(e.target.value)}
                  placeholder="Ej: @miempresa o www.miempresa.com"
                  className="w-full rounded-xl bg-[#111015] border border-white/10 focus:border-[#C5A059] px-3.5 py-2 text-xs text-[#F2F2F5] placeholder-[#71717A] outline-none select-text"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-[#D4D4D8] block mb-1">
                  FACTURACIÓN MENSUAL ACTUAL EN USD *
                </label>
                <input
                  type="text"
                  required
                  value={monthlyRev}
                  onChange={(e) => setMonthlyRev(e.target.value)}
                  placeholder="Solo números, ej: 10000"
                  className="w-full rounded-xl bg-[#111015] border border-white/10 focus:border-[#C5A059] px-3.5 py-2 text-xs text-[#F2F2F5] placeholder-[#71717A] outline-none select-text"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-[#D4D4D8] block mb-1">
                ¿QUÉ OBJETIVO PRINCIPAL BUSCAS LOGRAR O QUÉ ÁREA DE TU NEGOCIO DESEAS IMPULSAR HOY? *
              </label>
              <textarea
                rows={2}
                required
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="Cuéntanos brevemente qué te gustaría lograr o mejorar en tu empresa..."
                className="w-full rounded-xl bg-[#111015] border border-[#C5A059]/35 focus:border-[#C5A059] px-3.5 py-1.5 text-xs text-[#F2F2F5] placeholder-[#71717A] outline-none resize-none select-text"
              />
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-2.5 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#E5C77D] to-[#B38728] text-[#08080A] font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-105 transition cursor-pointer"
              >
                {submitting ? "REGISTRANDO SESIÓN..." : "CONFIRMAR MI REUNIÓN Y RECIBIR CATÁLOGO PRIVADO →"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PASO 2: PANTALLA DE CONFIRMACIÓN */}
      {step === "confirmed" && (
        <div className="w-full max-w-[680px] rounded-2xl border border-[#C5A059]/45 bg-[#0A0A0D] shadow-2xl overflow-hidden text-center my-auto">
          <div className="px-6 py-3 bg-[#0E0D11] border-b border-white/[0.08] flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep("form")}
              className="text-xs text-[#C5A059] hover:underline cursor-pointer"
            >
              ← Volver atrás
            </button>
            <span className="text-[11px] font-semibold tracking-[0.24em] text-[#C5A059] uppercase">
              LHYO GROUP · AGENDA EJECUTIVA
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-3.5 py-1 rounded-full border border-[#C5A059]/35 text-[11px] text-[#E4E4E7] cursor-pointer"
            >
              Cerrar ✕
            </button>
          </div>

          <div className="p-7 space-y-4">
            <div className="w-12 h-12 rounded-full border border-[#C5A059]/60 bg-[#C5A059]/10 text-[#EFE2BA] flex items-center justify-center mx-auto text-lg font-semibold">
              ✓
            </div>
            <p className="text-[11px] font-semibold tracking-[0.22em] text-[#C5A059] uppercase">
              TURNO RESERVADO Y ENVIADO A TU CORREO
            </p>
            <h3 className="text-2xl font-semibold text-[#F2F2F5]">
              ¡Tu sesión ha quedado confirmada, {fullName}!
            </h3>
            <p className="text-xs text-[#A3A3AC] max-w-lg mx-auto leading-relaxed">
              Hemos reservado tu espacio exclusivo para el <strong className="text-[#EFE2BA]">{selectedDate}</strong> a las{" "}
              <strong className="text-[#EFE2BA]">{selectedTime}</strong> y hemos enviado tu{" "}
              <strong className="text-[#EFE2BA]">Catálogo Privado B2B</strong> junto con el enlace de Google Meet a{" "}
              <strong className="text-[#EFE2BA]">{email}</strong>.
            </p>

            <div className="max-w-lg mx-auto rounded-xl border border-[#C5A059]/30 bg-[#12100E]/90 p-3.5 text-left">
              <p className="text-[11px] font-semibold text-[#EFE2BA] uppercase mb-1">
                ✦ NOTA IMPORTANTE SOBRE LA RECEPCIÓN DE TU CORREO:
              </p>
              <p className="text-[11px] text-[#A3A3AC] leading-relaxed">
                Si no visualizas nuestro mensaje en tu bandeja principal en los próximos 2 minutos, por favor revisa tu carpeta de <strong className="text-[#E4E4E7]">Spam (Correo no deseado)</strong> o <strong className="text-[#E4E4E7]">Promociones</strong> y márcalo como seguro.
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-2.5 pt-1">
              <button
                type="button"
                onClick={() => setStep("dossier")}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#E5C77D] to-[#B38728] text-[#08080A] font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-105 transition cursor-pointer"
              >
                1. ABRIR Y DESCARGAR MI CATÁLOGO PRIVADO (PDF) →
              </button>
              <a
                href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("Sesión Ejecutiva B2B - Lhyo Group")}&details=${encodeURIComponent("Videollamada Oficial Lhyo Group: https://meet.google.com/krc-vdii-zzh")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-2.5 rounded-xl bg-[#111015] border border-[#C5A059]/35 text-[#EFE2BA] font-semibold text-xs uppercase tracking-wider hover:border-[#C5A059] transition"
              >
                2. GUARDAR ESTA REUNIÓN EN GOOGLE CALENDAR →
              </a>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-full py-1.5 text-xs text-[#A3A3AC] hover:text-[#F2F2F5] cursor-pointer"
              >
                Cerrar y volver a la página
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PASO 3: CATÁLOGO OFICIAL CON PALETA EXACTA DE GARANTÍA + REFLEJO HOVER + SELECT-NONE */}
      {step === "dossier" && (
        <div
          onCopy={(e) => e.preventDefault()}
          className="relative w-full max-w-5xl rounded-2xl border border-[#C5A059]/35 bg-[#08080A] shadow-[0_30px_100px_rgba(0,0,0,0.98)] overflow-hidden text-left my-auto select-none"
        >
          {/* Barra superior (oculta al imprimir en PDF) */}
          <div className="lhyo-no-print px-6 py-3 bg-[#0C0B0E] border-b border-[#C5A059]/20 flex flex-wrap items-center justify-between gap-2 select-none">
            <button
              type="button"
              onClick={() => setStep("confirmed")}
              className="text-xs text-[#C5A059] hover:text-[#EFE2BA] font-medium cursor-pointer"
            >
              ← Volver atrás
            </button>
            <span className="text-[11px] font-semibold tracking-[0.22em] text-[#EFE2BA] uppercase">
              LHYO GROUP · CATÁLOGO OFICIAL DE SOLUCIONES TECNOLÓGICAS B2B
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#C5A059] via-[#E5C77D] to-[#B38728] text-[#08080A] font-bold text-[11px] uppercase tracking-wider hover:brightness-105 transition cursor-pointer"
              >
                DESCARGAR / IMPRIMIR PDF (1 PÁGINA) ↓
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-3.5 py-1.5 rounded-full border border-[#C5A059]/35 text-[11px] text-[#E4E4E7] hover:border-[#C5A059] cursor-pointer"
              >
                Cerrar ✕
              </button>
            </div>
          </div>

          <div className="relative p-5 sm:p-6 space-y-3.5 select-none">
            {/* Marca de agua institucional "L" centrada de fondo */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.035] select-none">
              <svg className="w-[340px] h-[340px]" viewBox="0 0 120 110" fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10 42 L40 18 L40 70 L102 70 L84 96 L28 96 L28 80 L10 80 Z M20 46 L30 38 L30 70 L20 70 Z M40 80 L86 80 L80 87 L40 87 Z"
                  fill="#EFE2BA"
                />
                <path d="M48 11 L58 3 L58 63 L48 63 Z" fill="#C5A059" />
              </svg>
            </div>

            {/* Fila Superior con el mismo tono obsidiana cálido y champán de Garantía */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-3 select-none">
              <div className="lg:col-span-5 group relative overflow-hidden rounded-xl bg-gradient-to-br from-[#12100E] via-[#0B0B0E] to-[#08080A] border border-[#C5A059]/20 hover:border-[#C5A059]/50 p-4 flex flex-col justify-center space-y-1 transition-all duration-500 cursor-default">
                <div className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-[#C5A059]/[0.07] to-transparent skew-x-[-25deg]" />
                <div className="text-xs text-[#A3A3AC]">
                  <span className="text-[#EFE2BA] font-semibold">Preparado para:</span>{" "}
                  {fullName || "Dirección Ejecutiva"} ({companyWeb || "Su Empresa"})
                </div>
                <div className="text-xs text-[#A3A3AC]">
                  <span className="text-[#EFE2BA] font-semibold">Fecha y Hora Reservada:</span>{" "}
                  {selectedDate} · {selectedTime}
                </div>
                <div className="text-xs text-[#A3A3AC]">
                  <span className="text-[#EFE2BA] font-semibold">Solicitud:</span> {preselectedService}
                </div>
              </div>

              <div className="lg:col-span-7 group relative overflow-hidden rounded-xl bg-gradient-to-br from-[#14110D] via-[#0C0B0E] to-[#08080A] border border-[#C5A059]/30 hover:border-[#C5A059]/65 p-4 flex items-center justify-between gap-4 transition-all duration-500 cursor-default">
                <div className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-[#C5A059]/[0.08] to-transparent skew-x-[-25deg]" />
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C5A059] block mb-0.5">
                    ★ ARQUITECTURA INTEGRAL CORPORATIVA · LLAVE EN MANO
                  </span>
                  <h4 className="text-sm sm:text-base font-semibold text-[#EFE2BA]">
                    Paquete Completo (Todo Incluido · Las 06 Soluciones Oficiales)
                  </h4>
                  <p className="text-xs text-[#A3A3AC] mt-0.5">
                    Integración total de las 06 soluciones conectadas entre sí bajo la marca y el control exclusivo de su empresa.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border border-[#C5A059]/45 text-[#EFE2BA] bg-[#C5A059]/10 shrink-0">
                  PRIORIDAD EJECUTIVA
                </span>
              </div>
            </div>

            {/* Cuadrícula 3x2 con Colores Exactos de Garantía (175003.png) + Reflejo Hover + Cero Selección de Texto */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 select-none">
              {OFFICIAL_06_SOLUTIONS.map((sol) => (
                <div
                  key={sol.id}
                  className="group relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-[#12100E] via-[#0B0B0E] to-[#08080A] border border-[#C5A059]/20 hover:border-[#C5A059]/55 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(197,160,89,0.12)] cursor-default select-none"
                >
                  {/* Haz de luz reflectivo suave al pasar el cursor */}
                  <div className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-[#C5A059]/[0.07] to-transparent skew-x-[-25deg]" />

                  {/* Línea dorada superior idéntica a las tarjetas de Garantía */}
                  <div className="w-7 h-[1.5px] bg-[#C5A059]/80 group-hover:w-12 group-hover:bg-[#EFE2BA] transition-all duration-500 mb-2.5" />

                  <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.15em] text-[#C5A059] mb-1.5">
                    <span>{sol.code}</span>
                    <span className="text-xs font-bold text-[#C5A059]/80 group-hover:text-[#EFE2BA] transition-colors">
                      {sol.id}
                    </span>
                  </div>

                  {/* Título en tono champán suave (#EFE2BA) sin blanco encandilante */}
                  <h5 className="text-[13px] font-semibold text-[#EFE2BA] leading-snug mb-1.5">
                    {sol.title}
                  </h5>

                  {/* Descripción en gris cálido atenuado (#A3A3AC) idéntico a Garantía */}
                  <p className="text-[11.5px] text-[#A3A3AC] leading-relaxed">
                    {sol.summary}
                  </p>
                </div>
              ))}
            </div>

            <div className="relative z-10 pt-2 border-t border-white/[0.07] flex flex-wrap items-center justify-between text-[11px] text-[#8E8E98] select-none">
              <span>LHYO GROUP · www.lhyogroup.com · ceo@lhyogroup.com</span>
              <span className="text-[#C5A059] font-medium">
                Sala Ejecutiva Google Meet: https://meet.google.com/krc-vdii-zzh
              </span>
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
          "px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#E5C77D] to-[#B38728] text-[#08080A] font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-105 transition cursor-pointer select-none"
        }
      >
        {label}
      </button>
      {mounted && modalContent ? createPortal(modalContent, document.body) : null}
    </>
  );
}