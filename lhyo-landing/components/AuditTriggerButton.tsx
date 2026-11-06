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
      "Atienden en menos de 1 segundo día y noche, resuelven dudas con la información de su empresa y agendan citas en automático.",
    impactTitle: "IMPACTO EJECUTIVO SOLUCIÓN 01 — CERO CLIENTES PERDIDOS POR DEMORA",
    impactDetail:
      "Entrenamos e instalamos su Asistente IA 24/7 en WhatsApp e Instagram para calificar prospectos en tiempo real, responder objeciones como un consultor experto y agendar citas directamente en su calendario sin intervención humana.",
    metricBadge: "⚡ Respuesta < 0.8s · Atención 24/7"
  },
  {
    id: "02",
    code: "SOLUCIÓN 02 · PRESENCIA DE ALTO PRESTIGIO",
    title: "Plataformas Web Modernas y Catálogos Interactivos",
    summary:
      "Desarrollamos plataformas corporativas ultrarrápidas (< 0.8s) con estética ejecutiva diseñadas para convertir cada visita en cliente.",
    impactTitle: "IMPACTO EJECUTIVO SOLUCIÓN 02 — AUTORIDAD DIGITAL Y CONVERSIÓN INMEDIATA",
    impactDetail:
      "Sustituimos páginas lentas o genéricas por una plataforma de ingeniería de lujo con catálogos interactivos, cotizadores dinámicos y carga instantánea que multiplica la confianza de sus compradores B2B y B2C.",
    metricBadge: "✦ Carga < 0.8s · Diseño de Élite"
  },
  {
    id: "03",
    code: "SOLUCIÓN 03 · CONTROL COMERCIAL TOTAL",
    title: "Organización Automática de Clientes y Ventas (CRM)",
    summary:
      "Todo prospecto que escribe por WhatsApp, Instagram o su Web queda registrado y clasificado por prioridad sin anotar nada a mano.",
    impactTitle: "IMPACTO EJECUTIVO SOLUCIÓN 03 — TRAZABILIDAD COMERCIAL AUTOMATIZADA",
    impactDetail:
      "Cada cliente que interactúa con su empresa queda registrado automáticamente con su nombre, empresa, necesidad y nivel de presupuesto, eliminando el desorden de chats sueltos y las ventas olvidadas.",
    metricBadge: "📊 100% Trazabilidad · 0 Carga Manual"
  },
  {
    id: "04",
    code: "SOLUCIÓN 04 · INDEPENDENCIA SIN LÍMITES",
    title: "Automatización Total de Procesos con Tecnología Propia",
    summary:
      "Instalamos el motor automático propio de su empresa para conectar ventas, agenda y correos sin pagar tarifas mensuales por volumen.",
    impactTitle: "IMPACTO EJECUTIVO SOLUCIÓN 04 — SOBERANÍA TECNOLÓGICA SIN COBROS POR USO",
    impactDetail:
      "Construimos la tubería invisible propia de su negocio para que sus cotizaciones, correos de confirmación, recordatorios y bases de datos trabajen solos las 24 horas sin depender de licencias caras que suben por volumen.",
    metricBadge: "♾️ Capacidad Ilimitada · Propiedad 100%"
  },
  {
    id: "05",
    code: "SOLUCIÓN 05 · CEREBRO PRIVADO EMPRESARIAL",
    title: "IA Personalizada con la Memoria de su Empresa",
    summary:
      "Entrenamos un cerebro privado con sus contratos, precios y documentos internos para responder cualquier consulta en 1 segundo.",
    impactTitle: "IMPACTO EJECUTIVO SOLUCIÓN 05 — INTELIGENCIA ENTRENADA CON SUS DOCUMENTOS",
    impactDetail:
      "Su propio núcleo de Inteligencia Artificial privado que conoce al milímetro sus manuales, tarifas, catálogo e historial operativo para asistir tanto a sus clientes como a su equipo directivo al instante.",
    metricBadge: "🧠 100% Privado · Precisión Quirúrgica"
  },
  {
    id: "06",
    code: "SOLUCIÓN 06 · TODA SU EMPRESA EN 1 PANTALLA",
    title: "Su Propia Plataforma Empresarial Todo-en-Uno",
    summary:
      "Unificamos ventas, clientes, agenda, finanzas y métricas operativas en un solo panel privado hecho a medida con el logo de su empresa.",
    impactTitle: "IMPACTO EJECUTIVO SOLUCIÓN 06 — ECOSISTEMA EJECUTIVO CENTRALIZADO",
    impactDetail:
      "Deje de abrir múltiples programas desconectados. Diseñamos su centro de mando privado con la identidad visual de su marca donde usted supervisa ventas, citas, clientes e ingresos desde cualquier dispositivo.",
    metricBadge: "🏛️ Todo en 1 Pantalla · Marca Propia"
  }
];

const PAQUETE_COMPLETO_INFO = {
  id: "ALL",
  impactTitle: "★ PAQUETE COMPLETO TODO INCLUIDO — LAS 06 SOLUCIONES UNIFICADAS LLAVE EN MANO",
  impactDetail:
    "Desplegamos en 10 días su ecosistema completo: Plataforma Web de alto prestigio + Asistentes IA 24/7 en WhatsApp e Instagram + CRM Automático + Motor de Automatización Propia + Cerebro IA con la memoria de su empresa + Panel Todo-en-Uno.",
  metricBadge: "👑 PRIORIDAD EJECUTIVA · 06 SOLUCIONES"
};

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
  const [activeDossierCard, setActiveDossierCard] = useState<string>("ALL");

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
      const saved = localStorage.getItem("lhyo_booked_slots_v40");
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
      localStorage.setItem("lhyo_booked_slots_v40", JSON.stringify(updatedBookings));
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
  const selectedImpactObj =
    activeDossierCard === "ALL"
      ? PAQUETE_COMPLETO_INFO
      : OFFICIAL_06_SOLUTIONS.find((s) => s.id === activeDossierCard) || PAQUETE_COMPLETO_INFO;

  const modalContent = open ? (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
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

      {/* PASO 3: DOSSIER CORPORATIVO INTERACTIVO CON LOS EFECTOS DE LAS PESTAÑAS DE GARANTÍA */}
      {step === "dossier" && (
        <div className="relative w-full max-w-5xl rounded-2xl border border-[#C5A059]/75 bg-[#050507] shadow-[0_25px_100px_rgba(0,0,0,0.98)] overflow-hidden text-left my-auto">
          <div className="px-5 py-2.5 bg-[#080B14] border-b border-[#C5A059]/30 flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setStep("confirmed")}
              className="text-xs text-[#C5A059] hover:underline font-semibold cursor-pointer"
            >
              ← Volver atrás
            </button>
            <span className="text-[11px] font-bold tracking-[0.22em] text-[#FCF6BA] uppercase">
              LHYO GROUP · CATÁLOGO OFICIAL DE SOLUCIONES TECNOLÓGICAS B2B
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3.5 py-1 rounded-full bg-gradient-to-r from-[#C5A059] via-[#FCF6BA] to-[#B38728] text-black font-extrabold text-[11px] uppercase cursor-pointer hover:brightness-105 transition"
              >
                DESCARGAR / IMPRIMIR PDF ↓
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
              <svg className="w-[340px] h-[340px]" viewBox="0 0 120 110" fill="none">
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
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
                <div className="lg:col-span-5 rounded-xl border border-white/10 bg-[#080B14]/90 px-4 py-2.5 flex flex-col justify-center text-xs space-y-1">
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

                <div
                  onClick={() => setActiveDossierCard("ALL")}
                  className={`lg:col-span-7 rounded-xl px-5 py-2.5 flex items-center justify-between gap-3 cursor-pointer transition-all duration-300 ${
                    activeDossierCard === "ALL"
                      ? "bg-gradient-to-r from-[#C5A059] via-[#FCF6BA] to-[#B38728] text-[#050507] shadow-[0_12px_35px_rgba(197,160,89,0.3)] -translate-y-0.5"
                      : "border border-[#C5A059]/50 bg-[#080B14]/90 text-white hover:border-[#C5A059] hover:-translate-y-0.5"
                  }`}
                >
                  <div>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-[0.2em] block mb-0.5 ${
                        activeDossierCard === "ALL" ? "text-[#050507]/80" : "text-[#FCF6BA]"
                      }`}
                    >
                      ★ ARQUITECTURA INTEGRAL CORPORATIVA · LLAVE EN MANO
                    </span>
                    <h5 className="text-xs sm:text-sm font-extrabold">
                      Paquete Completo (Todo Incluido · Las 06 Soluciones Oficiales)
                    </h5>
                    <p
                      className={`text-[11px] mt-0.5 ${
                        activeDossierCard === "ALL" ? "text-[#050507]/90 font-medium" : "text-gray-300"
                      }`}
                    >
                      Integración total de las 06 soluciones conectadas entre sí bajo la marca y el control exclusivo de su empresa.
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-[9px] font-extrabold uppercase shrink-0 ${
                      activeDossierCard === "ALL"
                        ? "bg-[#050507] text-[#FCF6BA]"
                        : "border border-[#C5A059]/70 text-[#FCF6BA]"
                    }`}
                  >
                    PRIORIDAD EJECUTIVA
                  </span>
                </div>
              </div>

              {/* Cuadrícula 3x2 Interactiva con los efectos de las pestañas de Garantía */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-stretch">
                {OFFICIAL_06_SOLUTIONS.map((sol) => {
                  const isActive = activeDossierCard === sol.id;
                  return (
                    <div
                      key={sol.id}
                      onClick={() => setActiveDossierCard(sol.id)}
                      className={`group relative overflow-hidden rounded-xl p-3.5 flex flex-col justify-between cursor-pointer transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-br from-[#C5A059] via-[#FCF6BA] to-[#B38728] text-[#050507] shadow-[0_14px_38px_rgba(197,160,89,0.32)] -translate-y-0.5"
                          : "border border-white/10 bg-[#080B14]/90 text-white hover:border-[#C5A059]/65 hover:bg-gradient-to-b hover:from-[#C5A059]/[0.08] hover:to-transparent hover:shadow-[0_12px_35px_rgba(197,160,89,0.14)] hover:-translate-y-0.5"
                      }`}
                    >
                      <div>
                        <div
                          className={`w-7 h-[2px] mb-2 transition-all duration-300 ${
                            isActive
                              ? "w-12 bg-[#050507]"
                              : "bg-[#C5A059] group-hover:w-12 group-hover:bg-[#FCF6BA]"
                          }`}
                        />
                        <div
                          className={`flex items-center justify-between text-[9px] font-bold uppercase tracking-wider mb-1 ${
                            isActive ? "text-[#050507]/80" : "text-[#C5A059]"
                          }`}
                        >
                          <span>{sol.code}</span>
                          <span className="text-xs font-black">{sol.id}</span>
                        </div>
                        <h6 className="text-xs font-extrabold leading-snug mb-1">{sol.title}</h6>
                        <p
                          className={`text-[11px] leading-relaxed ${
                            isActive ? "text-[#050507]/90 font-medium" : "text-gray-300"
                          }`}
                        >
                          {sol.summary}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Barra Interactiva de Entregable (Exactamente como el panel inferior de Garantía) */}
              <div className="rounded-xl border border-[#C5A059]/45 bg-[#080B14]/95 px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FCF6BA] block">
                    {selectedImpactObj.impactTitle}
                  </span>
                  <p className="text-[11px] text-gray-300 mt-0.5">{selectedImpactObj.impactDetail}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/50 text-[#FCF6BA] text-[10px] font-bold shrink-0">
                  {selectedImpactObj.metricBadge}
                </span>
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
