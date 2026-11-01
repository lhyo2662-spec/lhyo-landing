"use client";

import { useState, useEffect, useMemo } from "react";
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

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const DAY_HEADERS = ["LU", "MA", "MI", "JU", "VI", "SA", "DO"];

const STORAGE_KEY = "lhyo_booked_slots_v20";

function formatYMD(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

function formatDisplayDate(ymd: string): string {
  if (!ymd) return "";
  const [y, m, d] = ymd.split("-");
  const monthIdx = parseInt(m, 10) - 1;
  return `${d} de ${MONTH_NAMES[monthIdx] || m}, ${y}`;
}

export default function AuditTriggerButton({
  label = "AGENDAR AUDITORÍA Y RECIBIR CATÁLOGO",
  selectedPlan = "AUDITORÍA GENERAL (Botón Principal)",
  fullWidth = false,
}: AuditButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(9);
  const [minDateYMD, setMinDateYMD] = useState("");

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("01:00 PM");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [companyUrl, setCompanyUrl] = useState("");
  const [revenue, setRevenue] = useState("");
  const [objective, setObjective] = useState("");

  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetAndClose = () => {
    setIsOpen(false);
    setIsSuccess(false);
    setCalendarOpen(false);
    setErrors({});
  };

  useEffect(() => {
    setMounted(true);
    const now = new Date();
    const todayYMD = formatYMD(now.getFullYear(), now.getMonth(), now.getDate());
    setMinDateYMD(todayYMD);

    const nextDay = new Date(now);
    nextDay.setDate(nextDay.getDate() + 1);
    if (nextDay.getDay() === 0) {
      nextDay.setDate(nextDay.getDate() + 1);
    }
    const defaultYMD = formatYMD(nextDay.getFullYear(), nextDay.getMonth(), nextDay.getDate());
    setSelectedDate(defaultYMD);
    setViewYear(nextDay.getFullYear());
    setViewMonth(nextDay.getMonth());

    try {
      const localSaved = localStorage.getItem(STORAGE_KEY);
      if (localSaved) {
        setBookedSlots(JSON.parse(localSaved));
      }
    } catch {}

    fetch("/api/webhook-lead")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data?.bookedSlots)) {
          setBookedSlots((prev) => Array.from(new Set([...prev, ...data.bookedSlots])));
        }
      })
      .catch(() => {});
  }, []);

  // Bloquear el scroll del fondo y permitir cerrar con tecla ESC en cualquier computadora
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        resetAndClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!selectedDate) return;
    const currentKey = `${selectedDate} | ${selectedTime}`;
    if (bookedSlots.includes(currentKey)) {
      const firstFree = TIME_SLOTS.find((t) => !bookedSlots.includes(`${selectedDate} | ${t}`));
      if (firstFree) {
        setSelectedTime(firstFree);
      }
    }
  }, [selectedDate, bookedSlots, selectedTime]);

  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const startOffset = (firstDayOfMonth.getDay() + 6) % 7;

    const cells: Array<{ day: number | null; ymd: string; disabled: boolean }> = [];

    for (let i = 0; i < startOffset; i++) {
      cells.push({ day: null, ymd: "", disabled: true });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const ymd = formatYMD(viewYear, viewMonth, d);
      const dateObj = new Date(viewYear, viewMonth, d);
      const isSunday = dateObj.getDay() === 0;
      const isPast = minDateYMD ? ymd < minDateYMD : false;
      const allSlotsTaken = TIME_SLOTS.every((slot) => bookedSlots.includes(`${ymd} | ${slot}`));

      cells.push({
        day: d,
        ymd,
        disabled: isPast || isSunday || allSlotsTaken,
      });
    }
    return cells;
  }, [viewYear, viewMonth, minDateYMD, bookedSlots]);

  const goPrevMonth = () => {
    const now = new Date();
    if (viewYear === now.getFullYear() && viewMonth <= now.getMonth()) return;
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const slotKey = `${selectedDate} | ${selectedTime}`;

    if (!selectedDate || (minDateYMD && selectedDate < minDateYMD)) {
      newErrors.date = "Selecciona una fecha disponible en el calendario.";
    }
    if (bookedSlots.includes(slotKey)) {
      newErrors.time = "Este horario ya se encuentra reservado. Elige otra hora.";
    }
    if (!fullName.trim()) {
      newErrors.fullName = "Ingresa tu nombre completo para personalizar tu catálogo.";
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Ingresa un correo electrónico válido.";
    }
    if (!companyUrl.trim()) {
      newErrors.companyUrl = "Indica el nombre, sitio web o Instagram de tu empresa.";
    }
    if (!revenue.trim() || isNaN(Number(revenue))) {
      newErrors.revenue = "Indica tu facturación mensual aproximada en números (ej: 10000).";
    }
    if (!objective.trim()) {
      newErrors.objective = "Coméntanos brevemente qué área deseas impulsar en tu negocio.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const slotKey = `${selectedDate} | ${selectedTime}`;
    const cleanRevenue = Number(String(revenue).replace(/[^0-9.]/g, "")) || 0;

    try {
      const payload = {
        triggerEvent: "BOOKING_CREATED",
        payload: {
          uid: `lhyo_${Date.now()}`,
          slotKey: slotKey,
          startTime: slotKey,
          attendees: [{ name: fullName.trim(), email: email.trim() }],
          responses: {
            company_url: { value: companyUrl.trim() },
            facturacion_mensual: { value: String(cleanRevenue) },
            cuello_botella: { value: objective.trim() },
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

      const updatedSlots = Array.from(new Set([...bookedSlots, slotKey]));
      setBookedSlots(updatedSlots);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSlots));
      } catch {}

      setIsSuccess(true);
    } catch (error) {
      console.error("Error registrando reserva:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const slotFullString = `${selectedDate} | ${selectedTime}`;

  const modalUI = isOpen ? (
    <div
      onClick={resetAndClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/88 backdrop-blur-md p-3 sm:p-5 md:p-6"
    >
      {/* CONTENEDOR CON ALTURA MÁXIMA CONTROLADA (90dvh) PARA QUE JAMÁS SE CORTE ARRIBA EN IPHONE, ANDROID NI LAPTOP */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[90dvh] flex flex-col rounded-2xl border border-[#BF953F]/65 bg-[#070707] shadow-[0_25px_75px_rgba(191,149,63,0.32)] overflow-hidden"
      >
        {/* BARRA SUPERIOR FIJA E INAMOVIBLE (SIEMPRE VISIBLE EN TODO DISPOSITIVO CON BOTÓN VOLVER Y BOTÓN X) */}
        <div className="shrink-0 flex items-center justify-between px-5 sm:px-7 py-3.5 bg-[#090D16] border-b border-white/10">
          <button
            type="button"
            onClick={resetAndClose}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-300 hover:text-[#FCF6BA] transition cursor-pointer"
          >
            <span className="text-[#BF953F] text-sm">←</span>
            <span>Volver atrás</span>
          </button>

          <span className="hidden sm:inline-block text-[10px] font-semibold text-[#FCF6BA]/80 uppercase tracking-[0.16em]">
            LHYO GROUP · AGENDA EJECUTIVA
          </span>

          <button
            type="button"
            onClick={resetAndClose}
            aria-label="Cerrar ventana"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#BF953F]/50 bg-[#BF953F]/10 hover:bg-[#BF953F] text-[#FCF6BA] hover:text-[#070707] text-xs font-semibold transition cursor-pointer"
          >
            <span>Cerrar</span>
            <span className="text-xs font-bold leading-none">✕</span>
          </button>
        </div>

        {/* CUERPO INTERNO CON DESPLAZAMIENTO SUAVE */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 md:p-8">
          {!isSuccess ? (
            <div>
              <h3 className="text-xl sm:text-2xl md:text-[26px] font-semibold text-white mb-1.5 tracking-tight">
                Reserva tu Sesión y Recibe nuestro Catálogo Privado
              </h3>
              <p className="text-xs sm:text-sm text-gray-300/90 mb-4 leading-relaxed">
                Selecciona un día y horario disponible. Al confirmar, registraremos tu reunión y enviaremos nuestro Catálogo Privado B2B a tu correo electrónico.
              </p>

              <div className="bg-white/[0.03] rounded-lg border-l-2 border-[#BF953F] p-3 mb-5 text-xs text-gray-200">
                <strong className="text-[#FCF6BA] uppercase tracking-wider block mb-0.5 text-[10px]">
                  Solicitud seleccionada:
                </strong>
                {selectedPlan}
              </div>

              <form noValidate onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-6 relative">
                    <label className="text-[11px] font-semibold text-[#FCF6BA] uppercase block mb-1.5">
                      Fecha Disponible *
                    </label>
                    <button
                      type="button"
                      onClick={() => setCalendarOpen((o) => !o)}
                      className="w-full rounded-lg bg-[#090D16] border border-[#BF953F]/50 hover:border-[#FCF6BA] text-white text-xs sm:text-sm px-3.5 py-2.5 flex items-center justify-between transition"
                    >
                      <span className="font-medium text-[#FCF6BA]">
                        {formatDisplayDate(selectedDate)}
                      </span>
                      <span className="text-xs text-[#BF953F] font-semibold">
                        {calendarOpen ? "▲ Cerrar" : "▼ Cambiar"}
                      </span>
                    </button>

                    {calendarOpen && (
                      <div className="mt-2 p-3.5 rounded-xl bg-[#050505] border border-[#BF953F] shadow-2xl z-50">
                        <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-white/10">
                          <button
                            type="button"
                            onClick={goPrevMonth}
                            className="px-2.5 py-1 rounded bg-white/5 text-xs font-semibold text-[#FCF6BA]"
                          >
                            ◀
                          </button>
                          <span className="text-xs font-semibold uppercase tracking-widest text-[#FCF6BA]">
                            {MONTH_NAMES[viewMonth]} {viewYear}
                          </span>
                          <button
                            type="button"
                            onClick={goNextMonth}
                            className="px-2.5 py-1 rounded bg-white/5 text-xs font-semibold text-[#FCF6BA]"
                          >
                            ▶
                          </button>
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-center mb-1">
                          {DAY_HEADERS.map((dh) => (
                            <div key={dh} className="text-[10px] font-semibold text-[#BF953F] py-0.5">
                              {dh}
                            </div>
                          ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                          {calendarDays.map((cell, idx) => {
                            if (!cell.day) return <div key={idx} className="h-7" />;
                            const isSelected = cell.ymd === selectedDate;
                            return (
                              <button
                                key={cell.ymd}
                                type="button"
                                disabled={cell.disabled}
                                onClick={() => {
                                  setSelectedDate(cell.ymd);
                                  setCalendarOpen(false);
                                }}
                                className={`h-7 rounded text-xs font-medium transition flex items-center justify-center ${
                                  cell.disabled
                                    ? "text-gray-600 opacity-30 cursor-not-allowed line-through"
                                    : isSelected
                                    ? "bg-[#BF953F] text-[#070707] font-bold"
                                    : "bg-[#090D16] text-gray-200 hover:border hover:border-[#BF953F]"
                                }`}
                              >
                                {cell.day}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-6">
                    <label className="text-[11px] font-semibold text-[#FCF6BA] uppercase block mb-1.5">
                      Horario Disponible *
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {TIME_SLOTS.map((slot) => {
                        const isTaken = bookedSlots.includes(`${selectedDate} | ${slot}`);
                        const isPicked = selectedTime === slot && !isTaken;
                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={isTaken}
                            onClick={() => setSelectedTime(slot)}
                            className={`py-2 px-1.5 rounded-lg text-xs font-medium border transition text-center ${
                              isTaken
                                ? "bg-black/40 border-white/5 text-gray-600 opacity-40 cursor-not-allowed line-through"
                                : isPicked
                                ? "bg-[#BF953F] text-[#070707] border-[#FCF6BA] font-semibold"
                                : "bg-[#090D16] border-white/10 text-gray-300 hover:border-[#BF953F]"
                            }`}
                          >
                            {isTaken ? "Ocupado" : slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[11px] font-semibold text-[#FCF6BA] uppercase block mb-1">
                      Tu Nombre Completo *
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Carlos Mendoza"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-lg bg-[#090D16] border border-white/15 focus:border-[#BF953F] text-white text-xs sm:text-sm px-3.5 py-2.5 outline-none transition"
                    />
                    {errors.fullName && <div className="mt-1 text-[11px] text-[#FCF6BA]">✦ {errors.fullName}</div>}
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#FCF6BA] uppercase block mb-1">
                      Tu Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      placeholder="Donde recibirás el Catálogo Privado"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg bg-[#090D16] border border-white/15 focus:border-[#BF953F] text-white text-xs sm:text-sm px-3.5 py-2.5 outline-none transition"
                    />
                    {errors.email && <div className="mt-1 text-[11px] text-[#FCF6BA]">✦ {errors.email}</div>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[11px] font-semibold text-[#FCF6BA] uppercase block mb-1">
                      Sitio Web o Instagram de tu Empresa *
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: @miempresa o www.miempresa.com"
                      value={companyUrl}
                      onChange={(e) => setCompanyUrl(e.target.value)}
                      className="w-full rounded-lg bg-[#090D16] border border-white/15 focus:border-[#BF953F] text-white text-xs sm:text-sm px-3.5 py-2.5 outline-none transition"
                    />
                    {errors.companyUrl && <div className="mt-1 text-[11px] text-[#FCF6BA]">✦ {errors.companyUrl}</div>}
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#FCF6BA] uppercase block mb-1">
                      Facturación Mensual Actual en USD *
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="Solo números, ej: 10000"
                      value={revenue}
                      onChange={(e) => setRevenue(e.target.value.replace(/[^0-9]/g, ""))}
                      className="w-full rounded-lg bg-[#090D16] border border-white/15 focus:border-[#BF953F] text-white text-xs sm:text-sm px-3.5 py-2.5 outline-none transition"
                    />
                    {errors.revenue && <div className="mt-1 text-[11px] text-[#FCF6BA]">✦ {errors.revenue}</div>}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#FCF6BA] uppercase block mb-1">
                    ¿Qué objetivo principal buscas lograr o qué área de tu negocio deseas impulsar hoy? *
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Cuéntanos brevemente qué te gustaría lograr o mejorar en tu empresa..."
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    className="w-full rounded-lg bg-[#090D16] border border-white/15 focus:border-[#BF953F] text-white text-xs sm:text-sm px-3.5 py-2 outline-none resize-none transition"
                  />
                  {errors.objective && <div className="mt-1 text-[11px] text-[#FCF6BA]">✦ {errors.objective}</div>}
                </div>

                <div className="pt-1 flex flex-col sm:flex-row gap-3 items-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary-lhyo w-full text-xs uppercase tracking-wider"
                  >
                    {isSubmitting
                      ? "SINCRONIZANDO AGENDA Y ENVIANDO CATÁLOGO..."
                      : "CONFIRMAR MI REUNIÓN Y RECIBIR CATÁLOGO PRIVADO →"}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="py-4 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full border border-[#BF953F] bg-[#BF953F]/15 flex items-center justify-center text-lg text-[#FCF6BA] font-semibold">
                ✓
              </div>
              <span className="text-xs font-semibold text-[#BF953F] uppercase tracking-[0.16em] block mb-1.5">
                TURNO RESERVADO Y ENVIADO A TU CORREO
              </span>
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2.5">
                ¡Tu sesión ha quedado confirmada, {fullName}!
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 max-w-lg mx-auto mb-5 leading-relaxed">
                Hemos reservado tu espacio exclusivo para el <strong>{formatDisplayDate(selectedDate)}</strong> a las <strong>{selectedTime}</strong> y hemos enviado tu <strong>Catálogo Privado B2B</strong> junto con el enlace de <strong>Google Meet</strong> a <strong>{email}</strong>.
              </p>

              <div className="max-w-lg mx-auto mb-5 p-3.5 rounded-xl bg-white/[0.03] border border-[#BF953F]/45 text-xs text-gray-200 leading-relaxed text-left">
                <strong className="text-[#FCF6BA] uppercase tracking-wider block mb-1 text-[11px]">
                  ✦ Nota importante sobre la recepción de tu correo:
                </strong>
                Si no visualizas nuestro mensaje en tu bandeja principal en los próximos 2 minutos, por favor revisa tu carpeta de <strong>Spam (Correo no deseado)</strong> o <strong>Promociones</strong> y márcalo como seguro para acceder a tu Catálogo Privado y a tu enlace de videollamada.
              </div>

              <div className="flex flex-col gap-2.5 max-w-md mx-auto">
                <a
                  href={`/api/dossier?ceo=${encodeURIComponent(fullName)}&empresa=${encodeURIComponent(companyUrl || "Mi Empresa")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary-lhyo text-xs uppercase w-full"
                >
                  1. ABRIR Y DESCARGAR MI CATÁLOGO PRIVADO (PDF) →
                </a>
                <a
                  href={`/api/agendar-calendario?slot=${encodeURIComponent(slotFullString)}&ceo=${encodeURIComponent(fullName)}&email=${encodeURIComponent(email)}&empresa=${encodeURIComponent(companyUrl)}&plan=${encodeURIComponent(selectedPlan)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-lg border border-[#BF953F]/60 bg-[#090D16] text-xs font-semibold text-[#FCF6BA] hover:bg-[#BF953F]/15 transition uppercase tracking-wider w-full"
                >
                  2. GUARDAR ESTA REUNIÓN EN GOOGLE CALENDAR →
                </a>
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="px-6 py-2.5 text-xs font-medium text-gray-400 hover:text-white transition"
                >
                  Cerrar y volver a la página
                </button>
              </div>
            </div>
          )}
        </div>
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
