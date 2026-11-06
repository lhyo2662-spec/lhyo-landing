"use client";

import { useState } from "react";

const DAYS = [
  { dayName: "VIE", dayNum: "06", month: "NOV", fullLabel: "Viernes 06 de Noviembre" },
  { dayName: "SAB", dayNum: "07", month: "NOV", fullLabel: "Sábado 07 de Noviembre" },
  { dayName: "LUN", dayNum: "09", month: "NOV", fullLabel: "Lunes 09 de Noviembre" },
  { dayName: "MAR", dayNum: "10", month: "NOV", fullLabel: "Martes 10 de Noviembre" },
  { dayName: "MIE", dayNum: "11", month: "NOV", fullLabel: "Miércoles 11 de Noviembre" }
];

const SLOTS = ["09:00 AM", "10:30 AM", "12:00 PM", "02:30 PM", "04:00 PM", "05:30 PM"];

const OFFICIAL_06_SOLUTIONS_DOSSIER = [
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
      "Creamos un cerebro de Inteligencia Artificial privado entrenado exclusivamente con los contratos, precios, manuales y documentos de su negocio para responder en 1 segundo."
  },
  {
    id: "06",
    code: "SOLUCIÓN 06 · TODA SU EMPRESA EN UNA SOLA PANTALLA",
    title: "Su Propia Plataforma Empresarial Todo-en-Uno",
    summary:
      "Unificamos ventas, clientes, agenda, finanzas y métricas operativas en una sola pantalla privada con el logotipo y el dominio exclusivo de su organización."
  }
];

interface Props {
  preselectedService?: string;
}

export default function DirectContactSection({
  preselectedService = "Paquete Completo (Todo Incluido · Las 06 Soluciones)"
}: Props) {
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState("10:30 AM");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [selectedService, setSelectedService] = useState(preselectedService);
  const [revenue, setRevenue] = useState("Más de $5,000 USD / mes");
  const [objective, setObjective] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showDossier, setShowDossier] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const isHigh = revenue.includes("Más de $5,000");
      const tier = isHigh ? "HIGH_TICKET" : "LOW_TICKET";
      await fetch("https://hook.us2.make.com/krs48cjfzudf4lau3sapwdgdu9lfe1tb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fecha_registro: new Date().toLocaleString("es-VE", { timeZone: "America/Caracas" }),
          horario_cita: `${DAYS[selectedDayIdx].fullLabel} - ${selectedSlot}`,
          nombre_cliente: name,
          email_cliente: email,
          empresa_web: company || "Empresa en Web",
          facturacion_usd: revenue,
          clasificacion: tier,
          servicio_elegido: selectedService,
          objetivo_cliente: objective || selectedService,
          resumen_crm: `RESERVA WEB (${tier}) || Empresa: ${company} || Solución: ${selectedService}`,
          link_videollamada_meet: "https://meet.google.com/krc-vdii-zzh"
        })
      }).catch(() => {});
    } finally {
      setSubmitting(false);
      setShowDossier(true);
    }
  };

  return (
    <main id="contacto" className="max-w-6xl mx-auto px-6 pt-10 pb-24">
      <div className="rounded-3xl border border-[#C5A059]/50 bg-[#070A12] p-6 sm:p-10 shadow-2xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#C5A059] uppercase block mb-1">
              ✦ AGENDAMIENTO EJECUTIVO Y ENTREGA INMEDIATA DE CATÁLOGO PDF
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Elija el Día y la Hora para su Sesión Ejecutiva (15 Minutos)
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setShowDossier(true)}
            className="px-5 py-2.5 rounded-xl border border-[#C5A059]/55 bg-[#050507] text-[#FCF6BA] text-xs font-bold hover:border-[#FCF6BA] transition cursor-pointer"
          >
            📄 PREVISUALIZAR CATÁLOGO CORPORATIVO (06 SOLUCIONES)
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6 rounded-2xl border border-white/10 bg-[#050507] p-5">
            <div>
              <span className="text-[11px] font-bold text-[#FCF6BA] uppercase tracking-wider block mb-3">
                1. SELECCIONE EL DÍA EN EL CALENDARIO
              </span>
              <div className="grid grid-cols-5 gap-2">
                {DAYS.map((d, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedDayIdx(idx)}
                    className={`rounded-xl py-3 px-2 text-center border transition cursor-pointer ${
                      selectedDayIdx === idx
                        ? "bg-gradient-to-b from-[#FCF6BA] to-[#C5A059] text-[#050507] border-[#FCF6BA] font-extrabold"
                        : "bg-[#080B12] border-white/10 text-gray-300 hover:border-[#C5A059]/50"
                    }`}
                  >
                    <span className="text-[9px] block uppercase">{d.dayName}</span>
                    <span className="text-base font-black block">{d.dayNum}</span>
                    <span className="text-[9px] block uppercase">{d.month}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-[#FCF6BA] uppercase tracking-wider block mb-3">
                2. SELECCIONE EL HORARIO (HORA LOCAL)
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                {SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      selectedSlot === slot
                        ? "bg-[#12100B] border-[#C5A059] text-[#FCF6BA]"
                        : "bg-[#080B12] border-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-[#FCF6BA] uppercase block mb-1.5">
                  SU NOMBRE Y CARGO *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Carlos Mendoza · Director"
                  className="w-full rounded-xl bg-[#050507] border border-white/15 focus:border-[#C5A059] px-4 py-3 text-xs text-white outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#FCF6BA] uppercase block mb-1.5">
                  CORREO ELECTRÓNICO *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="director@suempresa.com"
                  className="w-full rounded-xl bg-[#050507] border border-white/15 focus:border-[#C5A059] px-4 py-3 text-xs text-white outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-[#FCF6BA] uppercase block mb-1.5">
                  NOMBRE DE SU EMPRESA O PROYECTO
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Nombre de su negocio"
                  className="w-full rounded-xl bg-[#050507] border border-white/15 focus:border-[#C5A059] px-4 py-3 text-xs text-white outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#FCF6BA] uppercase block mb-1.5">
                  SOLUCIÓN PRINCIPAL DE INTERÉS
                </label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full rounded-xl bg-[#050507] border border-white/15 focus:border-[#C5A059] px-4 py-3 text-xs text-white outline-none"
                >
                  <option>Paquete Completo (Todo Incluido · Las 06 Soluciones)</option>
                  <option>01 · Asistentes Inteligentes para WhatsApp e Instagram (24/7)</option>
                  <option>02 · Plataformas Web Modernas y Catálogos Interactivos</option>
                  <option>03 · Organización Automática de Clientes y Ventas (CRM)</option>
                  <option>04 · Automatización Total de Procesos con Tecnología Propia</option>
                  <option>05 · Inteligencia Artificial Personalizada con la Memoria de su Empresa</option>
                  <option>06 · Su Propia Plataforma Empresarial Todo-en-Uno</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-[#FCF6BA] uppercase block mb-1.5">
                  NIVEL DE FACTURACIÓN MENSUAL ACTUAL
                </label>
                <select
                  value={revenue}
                  onChange={(e) => setRevenue(e.target.value)}
                  className="w-full rounded-xl bg-[#050507] border border-white/15 focus:border-[#C5A059] px-4 py-3 text-xs text-white outline-none"
                >
                  <option>Más de $5,000 USD / mes</option>
                  <option>Menos de $5,000 USD / mes o Etapa inicial</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#FCF6BA] uppercase block mb-1.5">
                  OBJETIVO PRINCIPAL EN SU NEGOCIO
                </label>
                <input
                  type="text"
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  placeholder="¿Qué desea mejorar o automatizar primero?"
                  className="w-full rounded-xl bg-[#050507] border border-white/15 focus:border-[#C5A059] px-4 py-3 text-xs text-white outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#FCF6BA] to-[#B38728] text-[#050507] font-extrabold text-xs uppercase tracking-wider cursor-pointer shadow-lg hover:brightness-105 transition"
            >
              {submitting
                ? "REGISTRANDO CITA EJECUTIVA..."
                : "CONFIRMAR VIDEOLLAMADA Y ABRIR CATÁLOGO CORPORATIVO PDF →"}
            </button>
          </form>
        </div>
      </div>

      {/* MODAL DEL CATÁLOGO / DOSSIER CORPORATIVO POST-AGENDAMIENTO CON LAS 06 SOLUCIONES Y MARCA DE AGUA "L" */}
      {showDossier && (
        <div className="fixed inset-0 z-[9500] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl rounded-3xl border border-[#C5A059]/75 bg-[#050507] p-7 sm:p-10 shadow-2xl overflow-hidden my-8 space-y-6">
            {/* MARCA DE AGUA GIGANTE DEL MONOGRAMA "L" DE LHYO GROUP EN EL FONDO (INTACTA) */}
            <div className="pointer-events-none select-none absolute inset-0 flex items-center justify-center opacity-[0.06]">
              <svg className="w-[460px] h-[460px]" viewBox="0 0 120 110" fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10 42 L40 18 L40 70 L102 70 L84 96 L28 96 L28 80 L10 80 Z M20 46 L30 38 L30 70 L20 70 Z M40 80 L86 80 L80 87 L40 87 Z"
                  fill="#FFFFFF"
                />
                <path d="M48 11 L58 3 L58 63 L48 63 Z" fill="#C5A059" />
              </svg>
            </div>

            {/* ENCABEZADO DEL DOSSIER */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-[#C5A059]/35 pb-4">
              <div className="flex items-center gap-2.5">
                <svg className="w-7 h-7" viewBox="0 0 120 110" fill="none">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10 42 L40 18 L40 70 L102 70 L84 96 L28 96 L28 80 L10 80 Z M20 46 L30 38 L30 70 L20 70 Z M40 80 L86 80 L80 87 L40 87 Z"
                    fill="#FFFFFF"
                  />
                  <path d="M48 11 L58 3 L58 63 L48 63 Z" fill="#C5A059" />
                </svg>
                <div className="text-base sm:text-lg font-black tracking-[0.16em] text-white">
                  LHYO <span className="text-[#C5A059]">|</span> GROUP · CATÁLOGO EJECUTIVO OFICIAL
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#FCF6BA] to-[#B38728] text-[#050507] font-extrabold text-xs uppercase cursor-pointer"
                >
                  🖨️ Descargar / Guardar como PDF
                </button>
                <button
                  type="button"
                  onClick={() => setShowDossier(false)}
                  className="w-8 h-8 rounded-full bg-white/10 text-white text-xs flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* FICHA DE CITA DEL CLIENTE */}
            <div className="relative z-10 rounded-2xl bg-[#0A1128]/55 border border-[#C5A059]/40 p-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-gray-200">
              <div>
                <strong className="text-[#FCF6BA]">Preparado para:</strong> {name || "Dirección Ejecutiva"}
              </div>
              <div>
                <strong className="text-[#FCF6BA]">Empresa / Organización:</strong> {company || "Su Empresa"}
              </div>
              <div>
                <strong className="text-[#FCF6BA]">Fecha y Hora Reservada:</strong>{" "}
                {DAYS[selectedDayIdx].fullLabel} · {selectedSlot}
              </div>
              <div>
                <strong className="text-[#FCF6BA]">Solución Seleccionada:</strong> {selectedService}
              </div>
            </div>

            {/* BLOQUE DESTACADO PAQUETE COMPLETO (TODO INCLUIDO) */}
            <div className="relative z-10 rounded-2xl border border-[#C5A059]/60 bg-gradient-to-r from-[#0A1128] via-[#101835] to-[#050507] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-extrabold tracking-[0.18em] text-[#FCF6BA] uppercase block">
                  ★ ARQUITECTURA INTEGRAL CORPORATIVA · LLAVE EN MANO
                </span>
                <h4 className="text-sm sm:text-base font-extrabold text-white">
                  Paquete Completo (Todo Incluido · Las 06 Soluciones Oficiales)
                </h4>
                <p className="text-xs text-gray-300 mt-0.5">
                  Integración total de las 06 soluciones conectadas entre sí bajo la marca y el control exclusivo de su empresa.
                </p>
              </div>
              <span className="px-3.5 py-1.5 rounded-full bg-[#C5A059]/20 border border-[#C5A059] text-[#FCF6BA] text-[10px] font-extrabold uppercase shrink-0">
                Prioridad Ejecutiva
              </span>
            </div>

            {/* CUADRÍCULA SIMÉTRICA CON LAS 06 SOLUCIONES OFICIALES */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              {OFFICIAL_06_SOLUTIONS_DOSSIER.map((sol) => (
                <div
                  key={sol.id}
                  className="p-4 rounded-2xl border border-white/10 bg-[#080B12]/90 space-y-1.5 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-wider">
                        {sol.code}
                      </span>
                      <span className="text-xs font-black text-[#FCF6BA]">{sol.id}</span>
                    </div>
                    <div className="font-extrabold text-white text-sm leading-snug">{sol.title}</div>
                  </div>
                  <p className="text-gray-300 leading-relaxed text-[11px]">{sol.summary}</p>
                </div>
              ))}
            </div>

            {/* PIE DE PÁGINA OFICIAL DEL DOSSIER */}
            <div className="relative z-10 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-400">
              <span>www.lhyogroup.com · ceo@lhyogroup.com</span>
              <span className="text-[#FCF6BA] font-semibold">
                Sala Ejecutiva Google Meet: https://meet.google.com/krc-vdii-zzh
              </span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}