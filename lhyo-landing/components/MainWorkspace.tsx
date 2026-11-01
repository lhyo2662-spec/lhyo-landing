"use client";

import { useState, useEffect } from "react";
import BrandLogo from "./BrandLogo";
import AuditTriggerButton from "./AuditTriggerButton";
import InteractiveCatalog from "./InteractiveCatalog";
import EnterpriseCatalog from "./EnterpriseCatalog";
import LiveAiSimulator from "./LiveAiSimulator";
import DirectContactSection from "./DirectContactSection";
import FloatingOmniDock from "./FloatingOmniDock";

type ActiveView = "inicio" | "enterprise" | "catalogo" | "garantia" | "contacto";

const QUICK_DIAGNOSTIC_GOALS = [
  {
    id: "GOAL-1",
    num: "01",
    title: "Responder en WhatsApp e Instagram al instante (24/7)",
    problem: "“Mis clientes escriben preguntando precios o citas y si tardo en responder se van con la competencia.”",
    solutionTitle: "Asistente Inteligente 24/7 Entrenado con tu Negocio",
    solutionDesc:
      "Responde en 0.4 segundos a cualquier hora, resuelve dudas con amabilidad, califica al cliente y agenda la cita directamente en tu calendario.",
    metric: "+65% más citas agendadas fuera de horario",
    targetView: "catalogo" as ActiveView,
    planName: "PLAN 1 (Asistente WhatsApp/IG 24/7) | Diagnóstico Rápido Portada"
  },
  {
    id: "GOAL-2",
    num: "02",
    title: "Tener una Página Web de Lujo que venda por mí",
    problem: "“Mi negocio no tiene página web o la que tengo se ve antigua, lenta y no convierte visitantes en clientes.”",
    solutionTitle: "Plataforma Web Moderna + Catálogo Interactivo",
    solutionDesc:
      "Diseñamos una web ultra rápida y elegante en celulares y computadoras, con simuladores interactivos y agendamiento directo en 1 clic.",
    metric: "Imagen de prestigio internacional desde el día 1",
    targetView: "catalogo" as ActiveView,
    planName: "PLAN 2 (Página Web Corporativa) | Diagnóstico Rápido Portada"
  },
  {
    id: "GOAL-3",
    num: "03",
    title: "Organizar todos mis clientes y ventas en automático (CRM)",
    problem: "“Tengo contactos regados en chats y cuadernos; pierdo el seguimiento de quién compró y quién falta por cerrar.”",
    solutionTitle: "Sistema CRM Automatizado + Clasificación VIP",
    solutionDesc:
      "Cada persona que escribe o agenda queda registrada automáticamente con su nombre, teléfono, presupuesto y servicio de interés.",
    metric: "100% de control comercial con 0 horas de carga manual",
    targetView: "catalogo" as ActiveView,
    planName: "PLAN 3 (Organización y Automatización CRM) | Diagnóstico Rápido Portada"
  },
  {
    id: "GOAL-4",
    num: "04",
    title: "Eliminar mensualidades caras con mi Propio Sistema (Enterprise)",
    problem: "“Pago demasiadas suscripciones mensuales y quiero ser dueño de mi propio servidor, mi IA privada y mi propio programa.”",
    solutionTitle: "Infraestructura Enterprise (n8n + Agente RAG + SaaS Interno)",
    solutionDesc:
      "Instalamos tu propio servidor de automatización sin límites, un cerebro de IA conectado a tus contratos privados y un panel único con tu marca.",
    metric: "Hasta 85% de ahorro anual en licencias de terceros",
    targetView: "enterprise" as ActiveView,
    planName: "ECOSISTEMA ENTERPRISE COMPLETO | Diagnóstico Rápido Portada"
  }
];

const GUARANTEE_TIMELINE_STEPS = [
  {
    step: "ETAPA 01",
    days: "Día 1 al 2",
    title: "Auditoría y Mapa Exacto de tu Negocio",
    simpleDesc:
      "Nos reunimos contigo por Google Meet, entendemos cómo vendes hoy y diseñamos el plano exacto de lo que vamos a automatizar sin quitarte tiempo.",
    deliverable: "Mapa de arquitectura + Dossier de implementación aprobado."
  },
  {
    step: "ETAPA 02",
    days: "Día 3 al 7",
    title: "Construcción de Web, Entrenamiento de IA y Conexiones",
    simpleDesc:
      "Nuestro equipo programa tu plataforma, entrena tu Asistente Inteligente con tus precios y servicios, y conecta tu CRM y calendario.",
    deliverable: "Sistema construido al 100% por nuestro equipo técnico."
  },
  {
    step: "ETAPA 03",
    days: "Día 8 al 9",
    title: "Pruebas de Velocidad y Blindaje Cero Errores",
    simpleDesc:
      "Probamos cada botón, cada respuesta del asistente, el envío automático de correos y el registro en tu base de datos en celulares y computadoras.",
    deliverable: "Certificación de latencia cero y funcionamiento 24/7."
  },
  {
    step: "ETAPA 04",
    days: "Día 10 en adelante",
    title: "Lanzamiento Llave en Mano y Acompañamiento Continuo",
    simpleDesc:
      "Encendemos el sistema en vivo para que empieces a recibir clientes automáticamente, con soporte técnico directo de Lhyo Group.",
    deliverable: "Tu negocio operando en automático + Soporte ejecutivo."
  }
];

const TRUST_SEALS = [
  {
    title: "CALIDAD SUPERIOR",
    subtitle: "Sistemas veloces, estables y desarrollados a la medida de su empresa."
  },
  {
    title: "ATENCIÓN 24 HORAS",
    subtitle: "Sus clientes reciben respuesta inmediata y profesional en todo momento."
  },
  {
    title: "IMPLEMENTACIÓN INTEGRAL",
    subtitle: "Ejecución llave en mano donde configuramos todo el sistema por usted."
  },
  {
    title: "PRESENCIA GLOBAL",
    subtitle: "Operación activa en Uruguay, Venezuela y cobertura a nivel internacional."
  }
];

export default function MainWorkspace() {
  const [activeView, setActiveView] = useState<ActiveView>("inicio");
  const [selectedGoalId, setSelectedGoalId] = useState<string>("GOAL-1");
  const [activeGuaranteeStep, setActiveGuaranteeStep] = useState<number>(0);

  const switchView = (view: ActiveView) => {
    setActiveView(view);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleHash = () => {
      const h = window.location.hash.replace("#", "").toLowerCase();
      if (h === "enterprise" || h === "catalogo" || h === "garantia" || h === "contacto" || h === "inicio") {
        setActiveView(h as ActiveView);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const navItems: Array<{ id: ActiveView; label: string; highlight?: boolean }> = [
    { id: "inicio", label: "INICIO" },
    { id: "enterprise", label: "INFRAESTRUCTURA ENTERPRISE", highlight: true },
    { id: "catalogo", label: "SERVICIOS Y PLANES" },
    { id: "garantia", label: "NUESTRA GARANTÍA" },
    { id: "contacto", label: "CONTACTO" }
  ];

  const activeGoalObj =
    QUICK_DIAGNOSTIC_GOALS.find((g) => g.id === selectedGoalId) ||
    QUICK_DIAGNOSTIC_GOALS[0];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#050507] text-white">
      <header className="border-b border-white/10 bg-[#050507]/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 h-20 flex justify-between items-center">
          <div onClick={() => switchView("inicio")} className="cursor-pointer">
            <BrandLogo />
          </div>

          <nav className="hidden lg:flex items-center gap-7 text-xs font-medium tracking-[0.14em]">
            {navItems.map((tab) => {
              const isActive = activeView === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => switchView(tab.id)}
                  className={`relative py-2 transition-colors duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? "text-[#FCF6BA] font-semibold"
                      : tab.highlight
                      ? "text-[#C5A059] hover:text-[#FCF6BA]"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {tab.highlight && <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />}
                  <span>{tab.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#C5A059] via-[#FCF6BA] to-[#C5A059] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="flex lg:hidden items-center gap-3 text-[10px] font-medium tracking-wider overflow-x-auto">
            {navItems.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => switchView(tab.id)}
                className={
                  activeView === tab.id
                    ? "text-[#FCF6BA] border-b border-[#C5A059] pb-1 font-semibold whitespace-nowrap"
                    : "text-gray-400 whitespace-nowrap"
                }
              >
                {tab.id === "enterprise"
                  ? "✦ ENTERPRISE"
                  : tab.id === "catalogo"
                  ? "SERVICIOS"
                  : tab.id === "garantia"
                  ? "GARANTÍA"
                  : tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="flex-1">
        {activeView === "inicio" && (
          <div>
            {/* PORTADA PRINCIPAL CON TITULAR CLARO Y MAGNÉTICO + MONOGRAMA "L" ANCLADO */}
            <section className="relative overflow-hidden border-b border-white/10 px-6 pt-10 pb-16 md:px-16 lg:px-24 max-w-7xl mx-auto">
              <span className="text-[11px] font-semibold text-[#C5A059] uppercase tracking-[0.16em] block mb-3">
                TECNOLOGÍA INTELIGENTE, PÁGINAS WEB DE LUJO Y AUTOMATIZACIÓN 24/7
              </span>

              <div className="relative mb-9">
                <div className="relative z-10 max-w-[680px]">
                  <h1 className="text-4xl sm:text-5xl md:text-[52px] font-semibold tracking-tight leading-[1.08] mb-6 text-white">
                    Hacemos que su negocio atienda en segundos, multiplique sus ventas y funcione en automático las 24 horas
                  </h1>
                  <p className="text-base md:text-lg text-gray-300/90 max-w-[590px] mb-0 font-normal leading-relaxed">
                    Creamos páginas web de primer nivel, asistentes con Inteligencia Artificial para WhatsApp e Instagram y sistemas propios que organizan todos sus clientes sin trabajo manual.
                  </p>
                </div>

                <div
                  aria-hidden="true"
                  className="hidden md:flex items-center justify-end pointer-events-none select-none absolute right-2 lg:right-8 top-[4px] bottom-[2px] z-0"
                >
                  <svg
                    viewBox="8.5 7.5 96.5 97.5"
                    className="h-full w-auto opacity-40 drop-shadow-[0_24px_40px_rgba(0,0,0,0.9)]"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient id="lhyoMonogramGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#F8FAFC" stopOpacity="0.95" />
                        <stop offset="55%" stopColor="#CBD5E1" stopOpacity="0.78" />
                        <stop offset="100%" stopColor="#C5A059" stopOpacity="0.60" />
                      </linearGradient>
                    </defs>
                    <g transform="rotate(-22 60 55)">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10 42 L40 18 L40 70 L102 70 L84 96 L28 96 L28 80 L10 80 Z M20 46 L30 38 L30 70 L20 70 Z M40 80 L86 80 L80 87 L40 87 Z"
                        fill="url(#lhyoMonogramGrad)"
                      />
                      <path
                        d="M48 11 L58 3 L58 63 L48 63 Z"
                        fill="url(#lhyoMonogramGrad)"
                      />
                    </g>
                  </svg>
                </div>
              </div>

              <div className="relative z-10 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                <AuditTriggerButton 
                  label="AGENDAR AUDITORÍA Y RECIBIR CATÁLOGO" 
                  selectedPlan="AUDITORÍA GENERAL (Botón Principal)" 
                />
                <button
                  type="button"
                  onClick={() => switchView("enterprise")}
                  className="h-[52px] px-7 rounded-md border border-[#C5A059]/55 bg-white/[0.03] text-xs font-semibold tracking-[0.06em] uppercase text-[#FCF6BA] hover:border-[#FCF6BA] hover:bg-[#C5A059]/15 transition inline-flex items-center justify-center whitespace-nowrap"
                >
                  EXPLORAR INFRAESTRUCTURA ENTERPRISE →
                </button>
              </div>
            </section>

            {/* DIAGNÓSTICO INTERACTIVO EN 1 CLIC ESTILO APPLE */}
            <section className="px-6 py-16 md:px-16 lg:px-24 max-w-7xl mx-auto border-b border-white/10">
              <div className="mb-8">
                <span className="text-[11px] font-semibold text-[#C5A059] uppercase tracking-[0.16em] block mb-2">
                  DIAGNÓSTICO INTERACTIVO EN 1 CLIC · SIN LEER TEXTOS LARGOS
                </span>
                <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                  ¿Qué es lo primero que te gustaría lograr hoy en tu negocio?
                </h2>
                <p className="text-xs sm:text-sm text-gray-300 mt-1">
                  Toca cualquiera de las 4 metas para ver al instante cómo lo resolvemos por ti:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
                {QUICK_DIAGNOSTIC_GOALS.map((g) => {
                  const active = g.id === selectedGoalId;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setSelectedGoalId(g.id)}
                      className={`p-5 rounded-2xl text-left border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                        active
                          ? "bg-gradient-to-br from-[#C5A059] via-[#FCF6BA] to-[#B38728] text-[#050507] border-[#FCF6BA] shadow-xl scale-[1.01]"
                          : "bg-[#0A1128]/65 border-white/10 text-gray-200 hover:border-[#C5A059]/50"
                      }`}
                    >
                      <span
                        className={`text-xs font-bold uppercase tracking-widest block mb-2 ${
                          active ? "text-[#050507]/80" : "text-[#C5A059]"
                        }`}
                      >
                        META {g.num}
                      </span>
                      <span className="text-sm font-bold leading-snug">{g.title}</span>
                    </button>
                  );
                })}
              </div>

              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0A1128]/90 via-[#070A14] to-[#050507] border border-[#C5A059]/50 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-8 space-y-3">
                  <div className="inline-block px-3.5 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/40 text-xs font-semibold text-[#FCF6BA]">
                    ✦ {activeGoalObj.metric}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-400 italic">
                    Situación común: {activeGoalObj.problem}
                  </p>
                  <h3 className="text-xl sm:text-2xl font-semibold text-white">
                    Solución Lhyo Group: {activeGoalObj.solutionTitle}
                  </h3>
                  <p className="text-sm text-gray-200 leading-relaxed">
                    {activeGoalObj.solutionDesc}
                  </p>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-3">
                  <AuditTriggerButton
                    label="QUIERO ESTA SOLUCIÓN →"
                    selectedPlan={activeGoalObj.planName}
                    fullWidth={true}
                  />
                  <button
                    type="button"
                    onClick={() => switchView(activeGoalObj.targetView)}
                    className="w-full h-[46px] rounded-xl border border-[#C5A059]/50 bg-[#050507] text-xs font-semibold text-[#FCF6BA] hover:bg-[#C5A059]/15 transition cursor-pointer"
                  >
                    Ver demostración completa →
                  </button>
                </div>
              </div>
            </section>

            <LiveAiSimulator />
          </div>
        )}

        {activeView === "enterprise" && (
          <EnterpriseCatalog />
        )}

        {activeView === "catalogo" && (
          <section className="px-6 pt-10 pb-28 md:px-16 lg:px-24 max-w-7xl mx-auto">
            <div className="mb-12 border-b border-white/10 pb-6 flex flex-col md:flex-row justify-between md:items-end gap-4">
              <div>
                <span className="text-[11px] font-semibold text-[#C5A059] uppercase tracking-[0.16em] block mb-2">
                  SOLUCIONES EMPRESARIALES A MEDIDA
                </span>
                <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
                  Catálogo de Servicios y Planes
                </h2>
              </div>
              <span className="text-sm text-gray-300/90">
                Pruebe cada servicio en vivo, conozca sus beneficios en lenguaje claro y personalice su solicitud
              </span>
            </div>

            <InteractiveCatalog />
          </section>
        )}

        {activeView === "garantia" && (
          <section className="px-6 pt-10 pb-28 md:px-16 lg:px-24 max-w-7xl mx-auto">
            <div className="mb-12 border-b border-white/10 pb-6">
              <span className="text-[11px] font-semibold text-[#C5A059] uppercase tracking-[0.16em] block mb-2">
                RESPALDO Y COMPROMISO EJECUTIVO
              </span>
              <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
                Nuestra Garantía Corporativa
              </h2>
              <p className="text-sm md:text-base text-gray-300/90 max-w-3xl mt-3 leading-relaxed">
                Cada sistema desarrollado por Lhyo Group se construye bajo estándares rigurosos de velocidad, estabilidad y acompañamiento continuo:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-12">
              {TRUST_SEALS.map((seal) => (
                <div
                  key={seal.title}
                  className="seal-card-lhyo p-7 h-full flex flex-col justify-between"
                >
                  <div>
                    <div className="w-8 h-[1.5px] bg-[#C5A059] mb-4" />
                    <h3 className="font-semibold text-base tracking-wide text-[#FCF6BA] mb-2">
                      {seal.title}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {seal.subtitle}
                  </p>
                </div>
              ))}
            </div>

            {/* RUTA INTERACTIVA DE IMPLEMENTACIÓN PASO A PASO */}
            <div className="p-8 md:p-10 rounded-3xl bg-gradient-to-br from-[#0A1128]/90 via-[#070A14] to-[#050507] border border-[#C5A059]/45 mb-12">
              <span className="text-[11px] font-semibold text-[#C5A059] uppercase tracking-[0.16em] block mb-2">
                PROCESO LLAVE EN MANO · CERO COMPLICACIONES PARA TI
              </span>
              <h3 className="text-2xl font-semibold text-white mb-6">
                ¿Cómo instalamos todo el sistema en tu empresa paso a paso?
              </h3>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                {GUARANTEE_TIMELINE_STEPS.map((st, idx) => {
                  const active = activeGuaranteeStep === idx;
                  return (
                    <button
                      key={st.step}
                      type="button"
                      onClick={() => setActiveGuaranteeStep(idx)}
                      className={`p-4 rounded-2xl text-left border transition cursor-pointer ${
                        active
                          ? "bg-[#C5A059] text-[#050507] border-[#FCF6BA] font-bold"
                          : "bg-[#050507] text-gray-300 border-white/10 hover:border-[#C5A059]/50"
                      }`}
                    >
                      <span className="text-[10px] uppercase tracking-widest block opacity-80">
                        {st.step} · {st.days}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold mt-1 block">
                        {st.title}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="p-6 rounded-2xl bg-[#050507] border border-[#C5A059]/40 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="text-xs font-bold text-[#FCF6BA] uppercase tracking-wider">
                    {GUARANTEE_TIMELINE_STEPS[activeGuaranteeStep].step} ({GUARANTEE_TIMELINE_STEPS[activeGuaranteeStep].days}) —{" "}
                    {GUARANTEE_TIMELINE_STEPS[activeGuaranteeStep].title}
                  </div>
                  <p className="text-sm text-gray-200 leading-relaxed">
                    {GUARANTEE_TIMELINE_STEPS[activeGuaranteeStep].simpleDesc}
                  </p>
                  <div className="text-xs text-emerald-400 font-semibold">
                    ✓ Entregable garantizado: {GUARANTEE_TIMELINE_STEPS[activeGuaranteeStep].deliverable}
                  </div>
                </div>
                <div className="shrink-0">
                  <AuditTriggerButton
                    label="COMENZAR CON LA ETAPA 01 →"
                    selectedPlan="AUDITORÍA DESDE SECCIÓN NUESTRA GARANTÍA"
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {activeView === "contacto" && (
          <DirectContactSection />
        )}
      </div>

      {activeView !== "contacto" && (
        <div className="px-6 py-8 pb-24 md:px-16 lg:px-24 max-w-7xl mx-auto w-full flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-4">
          <span>© 2026 LHYO GROUP. TODOS LOS DERECHOS RESERVADOS.</span>
          <span>SOLUCIONES DIGITALES, PÁGINAS WEB E INFRAESTRUCTURA ENTERPRISE</span>
        </div>
      )}

      <FloatingOmniDock />
    </div>
  );
}
