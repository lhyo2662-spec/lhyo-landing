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

const STORAGE_KEY = "lhyo_booked_slots_v10";

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

  // Estado del Calendario Personalizado Lhyo Group
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(9);
  const [minDateYMD, setMinDateYMD] = useState("");

  // Campos del formulario
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("11:00 AM");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [companyUrl, setCompanyUrl] = useState("");
  const [revenue, setRevenue] = useState("");
  const [objective, setObjective] = useState("");

  // Registro de turnos ocupados y errores de validación elegantes
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
    const now = new Date();
    const todayYMD = formatYMD(now.getFullYear(), now.getMonth(), now.getDate());
    setMinDateYMD(todayYMD);

    // Por defecto iniciar en el próximo día hábil disponible (mañana, o lunes si mañana es domingo)
    const nextDay = new Date(now);
    nextDay.setDate(nextDay.getDate() + 1);
    if (nextDay.getDay() === 0) {
      nextDay.setDate(nextDay.getDate() + 1);
    }
    const defaultYMD = formatYMD(nextDay.getFullYear(), nextDay.getMonth(), nextDay.getDate());
    setSelectedDate(defaultYMD);
    setViewYear(nextDay.getFullYear());
    setViewMonth(nextDay.getMonth());

    // Cargar turnos ya ocupados desde memoria local y desde el servidor
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

  // Si la hora seleccionada está ocupada en ese día, saltar automáticamente a la primera hora libre
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

  // Construcción matemática de los días del mes (Lunes a Domingo)
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    // Convertir Domingo=0..Sábado=6 a Lunes=0..Domingo=6
    const startOffset = (firstDayOfMonth.getDay() + 6) % 7;

    const cells: Array<{ day: number | null; ymd: string; disabled: boolean; fullyBooked: boolean }> = [];

    for (let i = 0; i < startOffset; i++) {
      cells.push({ day: null, ymd: "", disabled: true, fullyBooked: false });
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
        fullyBooked: allSlotsTaken,
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

  // Validador Ejecutivo Personalizado (Sin carteles blancos anticuados del navegador)
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const slotKey = `${selectedDate} | ${selectedTime}`;

    if (!selectedDate || (minDateYMD && selectedDate < minDateYMD)) {
      newErrors.date = "Selecciona una fecha vigente en el calendario.";
    }
    if (bookedSlots.includes(slotKey)) {
      newErrors.time = "Este horario ya se encuentra reservado. Elige otra hora.";
    }
    if (!fullName.trim()) {
      newErrors.fullName = "Ingresa tu nombre y apellido para personalizar tu expediente.";
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Ingresa un correo electrónico válido donde enviaremos el catálogo.";
    }
    if (!companyUrl.trim()) {
      newErrors.companyUrl = "Indica el nombre, sitio web o Instagram de tu negocio.";
    }
    if (!revenue.trim() || isNaN(Number(revenue))) {
      newErrors.revenue = "Indica tu facturación mensual aproximada en números (ej: 10000).";
    }
    if (!objective.trim()) {
      newErrors.objective = "Coméntanos brevemente qué área deseas impulsar en tu empresa.";
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
    const autoTier = cleanRevenue >= 5000 ? "VIP_QUALIFIED" : "LOW_QUALIFIED";

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

      const res = await fetch("/api/webhook-lead?secret=LHYO_SYS_994810_ARKOS_KEY", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 409) {
        setErrors({ time: "Este turno acaba de ser ocupado. Por favor elige otro horario." });
        setBookedSlots((prev) => Array.from(new Set([...prev, slotKey])));
        setIsSubmitting(false);
        return;
      }

      // Si por alguna razón el servidor reporta fallo con Make, disparo directo de respaldo hacia Make.com
      if (!res.ok) {
        const directMakePayload = {
          timestamp: new Date().toISOString(),
          event_type: "BOOKING_CREATED",
          lead_data: {
            full_name: fullName.trim(),
            email: email.trim(),
            company_url: companyUrl.trim(),
            monthly_revenue_usd: cleanRevenue,
            bottleneck: objective.trim(),
            selected_plan: selectedPlan,
            classification: autoTier,
          },
          booking_meta: {
            booking_uid: `lhyo_${Date.now()}`,
            start_time: slotKey,
            source_component: selectedPlan,
          },
        };
        await fetch("https://hook.us2.make.com/hx3nve3zt02sp8wkejegujyb5pyxiy6l", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(directMakePayload),
        }).catch(() => {});
      }

      // Bloquear inmediatamente la fecha y hora para que no se pueda repetir
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

  const resetAndClose = () => {
    setIsOpen(false);
    setIsSuccess(false);
    setCalendarOpen(false);
    setErrors({});
  };

  const modalUI = isOpen ? (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/88 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl border border-[#BF953F] bg-[#070707] p-6 md:p-10 shadow-[0_25px_75px_rgba(191,149,63,0.32)] my-8">
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
              Selecciona un día y horario disponible. Al confirmar, registraremos tu espacio exclusivo y enviaremos nuestro Catálogo Privado B2B a tu correo electrónico.
            </p>

            <div className="bg-[#0B132B]/70 border-l-2 border-[#BF953F] p-3.5 mb-6 text-xs text-gray-200">
              <strong className="text-[#FCF6BA] uppercase tracking-wider block mb-0.5">
                Solicitud seleccionada:
              </strong>
              {selectedPlan}
            </div>

            <form noValidate onSubmit={handleSubmit} className="space-y-5">
              {/* SELECTOR DE FECHA CON CALENDARIO SUIZO PROPIO EN NEGRO Y ORO */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                <div className="md:col-span-6 relative">
                  <label className="text-xs font-bold text-[#FCF6BA] uppercase block mb-2">
                    Fecha Disponible *
                  </label>
                  <button
                    type="button"
                    onClick={() => setCalendarOpen((o) => !o)}
                    className={`w-full bg-[#090D16] border ${
                      errors.date ? "border-[#FCF6BA]" : "border-[#BF953F]/60 hover:border-[#FCF6BA]"
                    } text-white text-sm px-4 py-3 flex items-center justify-between transition`}
                  >
                    <span className="font-semibold text-[#FCF6BA]">
                      {formatDisplayDate(selectedDate)}
                    </span>
                    <span className="text-xs text-[#BF953F] font-bold uppercase tracking-wider">
                      {calendarOpen ? "▲ Cerrar" : "▼ Cambiar Día"}
                    </span>
                  </button>

                  {errors.date && (
                    <div className="mt-1.5 text-[11px] text-[#FCF6BA] bg-[#BF953F]/15 border-l-2 border-[#BF953F] px-2.5 py-1">
                      ✦ {errors.date}
                    </div>
                  )}

                  {/* DESPLEGABLE DE CALENDARIO INTERACTIVO SUIZO */}
                  {calendarOpen && (
                    <div className="mt-2 p-4 bg-[#050505] border border-[#BF953F] shadow-[0_18px_45px_rgba(0,0,0,0.95)] z-50">
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#1E293B]">
                        <button
                          type="button"
                          onClick={goPrevMonth}
                          className="px-2.5 py-1 border border-[#1E293B] bg-[#0B132B] text-xs font-bold text-[#FCF6BA] hover:border-[#BF953F]"
                        >
                          ◀
                        </button>
                        <span className="text-xs font-bold uppercase tracking-widest text-[#FCF6BA]">
                          {MONTH_NAMES[viewMonth]} {viewYear}
                        </span>
                        <button
                          type="button"
                          onClick={goNextMonth}
                          className="px-2.5 py-1 border border-[#1E293B] bg-[#0B132B] text-xs font-bold text-[#FCF6BA] hover:border-[#BF953F]"
                        >
                          ▶
                        </button>
                      </div>

                      <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
                        {DAY_HEADERS.map((dh) => (
                          <div key={dh} className="text-[10px] font-bold text-[#BF953F] py-1">
                            {dh}
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((cell, idx) => {
                          if (!cell.day) {
                            return <div key={idx} className="h-8" />;
                          }
                          const isSelected = cell.ymd === selectedDate;
                          return (
                            <button
                              key={cell.ymd}
                              type="button"
                              disabled={cell.disabled}
                              onClick={() => {
                                setSelectedDate(cell.ymd);
                                setCalendarOpen(false);
                                setErrors((prev) => ({ ...prev, date: "" }));
                              }}
                              className={`h-8 text-xs font-bold transition flex items-center justify-center border ${
                                cell.disabled
                                  ? "bg-[#070707] border-transparent text-gray-600 opacity-30 cursor-not-allowed line-through"
                                  : isSelected
                                  ? "bg-gradient-to-br from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#070707] border-[#FCF6BA] shadow-md scale-105"
                                  : "bg-[#090D16] border-[#1E293B] text-gray-200 hover:border-[#BF953F] hover:text-[#FCF6BA]"
                              }`}
                            >
                              {cell.day}
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-3 pt-2 border-t border-[#1E293B] flex justify-between items-center text-[10px] text-gray-400">
                        <span>* Días pasados y domingos bloqueados</span>
                        <span className="text-[#FCF6BA]">Zona horaria local</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* BOTONES INTERACTIVOS DE HORARIO CON BLOQUEO DE TURNOS OCUPADOS */}
                <div className="md:col-span-6">
                  <label className="text-xs font-bold text-[#FCF6BA] uppercase block mb-2">
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
                          onClick={() => {
                            setSelectedTime(slot);
                            setErrors((prev) => ({ ...prev, time: "" }));
                          }}
                          className={`py-2.5 px-2 text-xs font-bold border transition text-center ${
                            isTaken
                              ? "bg-[#050505] border-[#1E293B]/50 text-gray-600 opacity-40 cursor-not-allowed line-through"
                              : isPicked
                              ? "bg-gradient-to-r from-[#BF953F] to-[#B38728] text-[#070707] border-[#FCF6BA] shadow-md"
                              : "bg-[#090D16] border-[#1E293B] text-gray-300 hover:border-[#BF953F] hover:text-white"
                          }`}
                        >
                          {isTaken ? "OCUPADO" : slot}
                        </button>
                      );
                    })}
                  </div>
                  {errors.time && (
                    <div className="mt-1.5 text-[11px] text-[#FCF6BA] bg-[#BF953F]/15 border-l-2 border-[#BF953F] px-2.5 py-1">
                      ✦ {errors.time}
                    </div>
                  )}
                </div>
              </div>

              {/* DATOS DEL EJECUTIVO CON VALIDACIÓN PERSONALIZADA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#FCF6BA] uppercase block mb-1.5">
                    Tu Nombre Completo *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Carlos Mendoza"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: "" }));
                    }}
                    className={`w-full bg-[#090D16] border ${
                      errors.fullName
                        ? "border-[#FCF6BA] shadow-[0_0_12px_rgba(191,149,63,0.35)]"
                        : "border-[#1E293B] focus:border-[#BF953F]"
                    } text-white text-sm px-3.5 py-2.5 outline-none transition`}
                  />
                  {errors.fullName && (
                    <div className="mt-1.5 text-[11px] text-[#FCF6BA] bg-[#BF953F]/15 border-l-2 border-[#BF953F] px-2.5 py-1">
                      ✦ {errors.fullName}
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-[#FCF6BA] uppercase block mb-1.5">
                    Tu Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    placeholder="Donde recibirás el Catálogo Privado"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                    }}
                    className={`w-full bg-[#090D16] border ${
                      errors.email
                        ? "border-[#FCF6BA] shadow-[0_0_12px_rgba(191,149,63,0.35)]"
                        : "border-[#1E293B] focus:border-[#BF953F]"
                    } text-white text-sm px-3.5 py-2.5 outline-none transition`}
                  />
                  {errors.email && (
                    <div className="mt-1.5 text-[11px] text-[#FCF6BA] bg-[#BF953F]/15 border-l-2 border-[#BF953F] px-2.5 py-1">
                      ✦ {errors.email}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#FCF6BA] uppercase block mb-1.5">
                    Sitio Web o Instagram de tu Empresa *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: @miempresa o www.miempresa.com"
                    value={companyUrl}
                    onChange={(e) => {
                      setCompanyUrl(e.target.value);
                      if (errors.companyUrl) setErrors((prev) => ({ ...prev, companyUrl: "" }));
                    }}
                    className={`w-full bg-[#090D16] border ${
                      errors.companyUrl
                        ? "border-[#FCF6BA] shadow-[0_0_12px_rgba(191,149,63,0.35)]"
                        : "border-[#1E293B] focus:border-[#BF953F]"
                    } text-white text-sm px-3.5 py-2.5 outline-none transition`}
                  />
                  {errors.companyUrl && (
                    <div className="mt-1.5 text-[11px] text-[#FCF6BA] bg-[#BF953F]/15 border-l-2 border-[#BF953F] px-2.5 py-1">
                      ✦ {errors.companyUrl}
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-[#FCF6BA] uppercase block mb-1.5">
                    Facturación Mensual Actual en USD *
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Solo números, ej: 10000"
                    value={revenue}
                    onChange={(e) => {
                      const onlyNums = e.target.value.replace(/[^0-9]/g, "");
                      setRevenue(onlyNums);
                      if (errors.revenue) setErrors((prev) => ({ ...prev, revenue: "" }));
                    }}
                    className={`w-full bg-[#090D16] border ${
                      errors.revenue
                        ? "border-[#FCF6BA] shadow-[0_0_12px_rgba(191,149,63,0.35)]"
                        : "border-[#1E293B] focus:border-[#BF953F]"
                    } text-white text-sm px-3.5 py-2.5 outline-none transition`}
                  />
                  {errors.revenue && (
                    <div className="mt-1.5 text-[11px] text-[#FCF6BA] bg-[#BF953F]/15 border-l-2 border-[#BF953F] px-2.5 py-1">
                      ✦ {errors.revenue}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#FCF6BA] uppercase block mb-1.5">
                  ¿Qué objetivo principal buscas lograr o qué área de tu negocio deseas impulsar hoy? *
                </label>
                <textarea
                  rows={2}
                  placeholder="Cuéntanos brevemente qué te gustaría lograr o mejorar en tu empresa..."
                  value={objective}
                  onChange={(e) => {
                    setObjective(e.target.value);
                    if (errors.objective) setErrors((prev) => ({ ...prev, objective: "" }));
                  }}
                  className={`w-full bg-[#090D16] border ${
                    errors.objective
                      ? "border-[#FCF6BA] shadow-[0_0_12px_rgba(191,149,63,0.35)]"
                      : "border-[#1E293B] focus:border-[#BF953F]"
                  } text-white text-sm px-3.5 py-2.5 outline-none resize-none transition`}
                />
                {errors.objective && (
                  <div className="mt-1.5 text-[11px] text-[#FCF6BA] bg-[#BF953F]/15 border-l-2 border-[#BF953F] px-2.5 py-1">
                    ✦ {errors.objective}
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary-lhyo w-full text-sm uppercase tracking-wider"
                >
                  {isSubmitting
                    ? "SINCRONIZANDO AGENDA Y ENVIANDO CATÁLOGO A TU CORREO..."
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
              TURNO BLOQUEADO Y REGISTRADO CON ÉXITO
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              ¡Tu sesión ha quedado confirmada, {fullName}!
            </h3>
            <p className="text-sm md:text-base text-gray-300 max-w-lg mx-auto mb-6 leading-relaxed">
              Hemos reservado en exclusiva tu espacio para el <strong>{formatDisplayDate(selectedDate)}</strong> a las <strong>{selectedTime}</strong>. Nuestro sistema ya registró tu solicitud y enviará tu <strong>Catálogo Privado B2B</strong> directamente a <strong>{email}</strong>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6">
              <a
                href={`/api/dossier?ceo=${encodeURIComponent(fullName)}&empresa=${encodeURIComponent(companyUrl || "Mi Empresa")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary-lhyo text-xs uppercase"
              >
                ABRIR MI CATÁLOGO PRIVADO AHORA MISMO →
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

