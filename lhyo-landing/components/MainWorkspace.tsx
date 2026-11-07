"use client";

import { useState, useEffect } from "react";
import BrandLogo from "./BrandLogo";
import AuditTriggerButton from "./AuditTriggerButton";
import CollapsibleMasterCatalog from "./CollapsibleMasterCatalog";
import DirectContactSection from "./DirectContactSection";
import FloatingOmniDock from "./FloatingOmniDock";

type ActiveView = "inicio" | "catalogo" | "garantia" | "contacto";

const INTRIGUE_PILLS = [
  {
    tag: "CLAVE 01 · ATENCIÓN INMEDIATA 24/7",
    question: "¿Qué ocurre cuando su mejor cliente escribe un domingo a las 2:30 AM?",
    revealTitle: "Mientras su competencia descansa, su empresa atiende\ny agenda citas hoy al instante.",
    revealDesc:
      "El 78% de los clientes contrata a la primera empresa que le responde con claridad y rapidez. Instalamos asistentes inteligentes entrenados con toda la información de su negocio que atienden en WhatsApp e Instagram día y noche, califican al prospecto y agendan la reunión en su calendario.",
    proofStat: "0.4s Velocidad de Respuesta · 0 Oportunidades Perdidas"
  },
  {
    tag: "CLAVE 02 · PRESENCIA Y PRESTIGIO",
    question: "¿Por qué 8 de cada 10 personas cierran una página web en menos de 4 segundos?",
    revealTitle: "Una plataforma moderna de máximo prestigio que\nproyecta autoridad y multiplica sus ventas.",
    revealDesc:
      "Cuando un cliente visita su empresa en internet, evalúa en 3 segundos el prestigio y la solidez de su marca. Construimos plataformas de alta gama con velocidad instantánea y arquitectura interactiva que transforman el interés del visitante en reuniones comerciales.",
    proofStat: "Presencia de Máximo Prestigio desde el Primer Segundo"
  },
  {
    tag: "CLAVE 03 · CONTROL Y TECNOLOGÍA PROPIA",
    question: "¿Qué logra su empresa cuando une todas sus áreas y ventas en una sola pantalla?",
    revealTitle: "Todo su negocio unido en una pantalla\noperando siempre bajo su control total.",
    revealDesc:
      "Multiplica la velocidad de su negocio y elimina gastos en programas separados. Cada cliente se registra y clasifica automáticamente por prioridad mientras toda su operación funciona conectada desde una plataforma Todo-en-Uno creada en exclusiva con la identidad de su empresa.",
    proofStat: "Hasta 85% de Ahorro Anual + Control Ejecutivo Total"
  }
];

const GUARANTEE_TIMELINE_STEPS = [
  {
    step: "PASO 01",
    days: "Día 1 al 2",
    title: "Diagnóstico Ejecutivo y Diseño de Arquitectura",
    simpleDesc:
      "Nos reunimos con usted en una sesión ejecutiva, analizamos los objetivos de su empresa y definimos el plan exacto de implementación sin quitarle tiempo operativo.",
    deliverable: "Mapa de arquitectura aprobado a la medida de su negocio."
  },
  {
    step: "PASO 02",
    days: "Día 3 al 7",
    title: "Construcción, Entrenamiento IA e Integración",
    simpleDesc:
      "Nuestro equipo de ingeniería desarrolla su plataforma, entrena sus asistentes inteligentes con la información de su empresa y enlaza su CRM y calendario.",
    deliverable: "Ecosistema construido al 100% por nuestro equipo técnico."
  },
  {
    step: "PASO 03",
    days: "Día 8 al 9",
    title: "Auditoría de Calidad y Pruebas de Velocidad",
    simpleDesc:
      "Verificamos cada flujo, cada respuesta automática y cada sincronización en teléfonos móviles y computadoras bajo estándar de cero errores.",
    deliverable: "Certificación de velocidad, seguridad y precisión."
  },
  {
    step: "PASO 04",
    days: "Día 10 en adelante",
    title: "Puesta en Marcha y Respaldo Continuo",
    simpleDesc:
      "Activamos su ecosistema en producción para atender y escalar sus ventas las 24 horas, acompañándolo con soporte ejecutivo directo.",
    deliverable: "Su empresa operando al máximo nivel con respaldo continuo."
  }
];

const TRUST_SEALS = [
  {
    title: "CALIDAD SUPERIOR",
    subtitle: "Arquitecturas veloces, sólidas y diseñadas a la medida exacta de las exigencias de su empresa."
  },
  {
    title: "ATENCIÓN 24 HORAS",
    subtitle: "Sus clientes reciben respuesta inmediata, ejecutiva y precisa en cualquier horario del día."
  },
  {
    title: "IMPACTO INMEDIATO",
    subtitle: "Transformamos su negocio en una empresa moderna, admirada y lista para liderar su mercado."
  },
  {
    title: "ALCANCE GLOBAL",
    subtitle: "Operación corporativa activa en Uruguay, Venezuela y cobertura continua a nivel internacional."
  }
];

export default function MainWorkspace() {
  const [activeView, setActiveView] = useState<ActiveView>("inicio");
  const [intrigueIndex, setIntrigueIndex] = useState<number>(0);
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
      if (h === "catalogo" || h === "garantia" || h === "contacto" || h === "inicio") {
        setActiveView(h as ActiveView);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };
    handleHash();
    const viewEventId = `lhyo_view_${Date.now()}`;
    fetch("/api/meta-capi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName: "ViewContent",
        eventId: viewEventId
      })
    }).catch(() => {});
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const navItems: Array<{ id: ActiveView; label: string }> = [
    { id: "inicio", label: "INICIO" },
    { id: "catalogo", label: "SOLUCIONES" },
    { id: "garantia", label: "GARANTÍA" },
    { id: "contacto", label: "CONTACTO" }
  ];

  return (
    <div className="min-h-0 lg:min-h-[calc(100vh-84px)] lg:flex lg:flex-col lg:justify-center flex flex-col justify-between bg-[#050507] text-white">
      <header className="border-b border-white/10 bg-[#050507]/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 h-20 flex justify-between items-center">
          <div onClick={() => switchView("inicio")} className="cursor-pointer">
            <BrandLogo />
          </div>

          <nav className="hidden md:flex items-center gap-9 text-xs font-medium tracking-[0.16em]">
            {navItems.map((tab) => {
              const isActive = activeView === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => switchView(tab.id)}
                  className={`relative py-2 transition-colors duration-200 cursor-pointer ${
                    isActive
                      ? "text-[#FCF6BA] font-semibold"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  <span>{tab.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#C5A059] via-[#FCF6BA] to-[#C5A059] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="flex md:hidden items-center gap-5 text-[11px] font-medium tracking-wider">
            {navItems.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => switchView(tab.id)}
                className={
                  activeView === tab.id
                    ? "text-[#FCF6BA] border-b border-[#C5A059] pb-1 font-semibold"
                    : "text-gray-400"
                }
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="flex-1 min-w-0">
        {activeView === "inicio" && (
          <section className="px-6 pb-20 md:px-16 lg:px-24 max-w-7xl mx-auto">
            <div className="min-h-0 lg:min-h-[calc(100vh-84px)] lg:flex lg:flex-col lg:justify-center pt-8 pb-7 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-semibold text-[#C5A059] uppercase tracking-[0.2em] block mb-3">
                  ✦ TECNOLOGÍA DEL FUTURO E INGENIERÍA DE LUJO · SISTEMAS INTELIGENTES 24/7
                </span>

                <div className="relative mb-9">
                  <div className="relative z-10 max-w-[580px]">
                    <h1 className="text-4xl sm:text-5xl md:text-[52px] font-semibold tracking-tight leading-[1.08] mb-5 text-white max-w-[580px]">
                      Construimos la presencia digital, los sistemas y la inteligencia que llevan su empresa al siguiente nivel
                    </h1>
                    <p className="text-base md:text-lg text-gray-300/90 max-w-[605px] mb-0 font-normal leading-relaxed">
                      Creamos e instalamos exactamente lo que su empresa necesita para liderar su mercado: desde plataformas web de máximo prestigio y atención inteligente 24/7 hasta ecosistemas propios que organizan y multiplican sus ventas en automático.
                    </p>
                  </div>

                  <div
                    aria-hidden="true"
                    className="hidden md:flex items-center justify-end pointer-events-none select-none absolute right-2 lg:right-8 top-[4px] bottom-[2px] z-0"
                  >
                    <svg
                      viewBox="8.5 7.5 96.5 97.5"
                      className="h-full w-auto opacity-45 drop-shadow-[0_24px_40px_rgba(0,0,0,0.95)]"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        <linearGradient id="lhyoMonogramGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                          <stop offset="55%" stopColor="#CBD5E1" stopOpacity="0.78" />
                          <stop offset="100%" stopColor="#C5A059" stopOpacity="0.65" />
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
                    label="AGENDAR REUNIÓN Y RECIBIR CATÁLOGO"
                    selectedPlan="AUDITORÍA GENERAL (Botón Principal Portada)"
                  />
                  <button
                    type="button"
                    onClick={() => switchView("catalogo")}
                    className="h-[52px] px-7 rounded-md border border-[#C5A059]/60 bg-[#0A1128]/70 text-xs font-semibold tracking-[0.06em] uppercase text-[#FCF6BA] hover:border-[#FCF6BA] hover:bg-[#C5A059]/15 transition inline-flex items-center justify-center whitespace-normal sm:whitespace-normal sm:whitespace-normal sm:whitespace-normal sm:whitespace-normal sm:whitespace-nowrap cursor-pointer"
                  >
                    DESCUBRIR QUÉ HACEMOS POR SU NEGOCIO →
                  </button>
                </div>
              </div>

              <div className="max-w-[740px] pt-6 select-none">
                <div className="flex items-center gap-3 mb-3.5">
                  <span className="w-1.5 h-1.5 rotate-45 bg-[#C5A059] shadow-[0_0_10px_#C5A059]" />
                  <div className="h-[1px] flex-1 min-w-0 bg-gradient-to-r from-[#C5A059]/60 via-[#FCF6BA]/25 to-transparent" />
                </div>
                <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-[10px] font-semibold tracking-[0.18em] uppercase text-gray-400">
                  <div className="flex items-center gap-2">
                    <span className="text-[#C5A059]">01</span>
                    <span className="text-[#FCF6BA]/90">VELOCIDAD QUE MULTIPLICA VENTAS</span>
                  </div>
                  <span className="hidden sm:inline-block h-3 w-[1px] bg-white/15" />
                  <div className="flex items-center gap-2">
                    <span className="text-[#C5A059]">02</span>
                    <span className="text-[#FCF6BA]/90">AUTORIDAD Y PRESTIGIO CORPORATIVO</span>
                  </div>
                  <span className="hidden sm:inline-block h-3 w-[1px] bg-white/15" />
                  <div className="flex items-center gap-2">
                    <span className="text-[#C5A059]">03</span>
                    <span className="text-[#FCF6BA]/90">EL FUTURO DE SU EMPRESA HOY</span>
                  </div>
                </div>
              </div>
            </div>

            {/* BLOQUE DE LAS 3 CLAVES EJECUTIVAS (SIN "INTRIGA" NI "PILAR") */}
            <div id="portal-intriga-lhyo" className="pt-14 scroll-mt-20">
              <div className="rounded-3xl bg-gradient-to-br from-[#0A1128]/90 via-[#070A14] to-[#050507] border border-[#C5A059]/45 p-6 sm:p-8 shadow-2xl">
                <div className="pb-5 mb-6 border-b border-white/10">
                  <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-[0.18em] block mb-1">
                    ✦ DIAGNÓSTICO EJECUTIVO EN 10 SEGUNDOS
                  </span>
                  <h2 className="text-lg sm:text-xl font-semibold text-white">
                    Toque cualquiera de estas 3 claves para descubrir cómo transformamos la operación de su empresa:
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-6">
                  {INTRIGUE_PILLS.map((pill, idx) => {
                    const active = intrigueIndex === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setIntrigueIndex(idx)}
                        className={`p-4 sm:p-5 rounded-2xl text-left border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                          active
                            ? "bg-gradient-to-br from-[#C5A059] via-[#FCF6BA] to-[#B38728] text-[#050507] border-[#FCF6BA] shadow-xl scale-[1.01]"
                            : "bg-[#050507]/85 border-white/10 text-gray-200 hover:border-[#C5A059]/55"
                        }`}
                      >
                        <span
                          className={`text-[10px] font-bold uppercase tracking-widest block mb-1.5 ${
                            active ? "text-[#050507]/80" : "text-[#C5A059]"
                          }`}
                        >
                          {pill.tag}
                        </span>
                        <span className="text-xs sm:text-sm font-bold leading-snug">
                          {pill.question}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="p-5 sm:p-6 rounded-2xl bg-[#050507]/95 border border-[#C5A059]/40 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  <div className="space-y-2 w-full min-w-0 max-w-full lg:max-w-3xl overflow-hidden">
                    <span className="inline-block px-3 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/40 text-[11px] font-semibold text-[#FCF6BA]">
                      ✦ {INTRIGUE_PILLS[intrigueIndex].proofStat}
                    </span>
                    <h3 className="text-lg sm:text-xl font-semibold text-white">
                      {INTRIGUE_PILLS[intrigueIndex].revealTitle}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                      {INTRIGUE_PILLS[intrigueIndex].revealDesc}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => switchView("catalogo")}
                    className="h-[46px] px-6 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#FCF6BA] to-[#B38728] text-[#050507] font-bold text-xs uppercase tracking-wider shrink-0 cursor-pointer"
                  >
                    VER LAS 6 SOLUCIONES →
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeView === "catalogo" && (
          <section className="px-6 pt-10 pb-20 md:px-16 lg:px-24 max-w-7xl mx-auto">
            <CollapsibleMasterCatalog />
          </section>
        )}

        {activeView === "garantia" && (
          <section className="px-6 pt-10 pb-20 md:px-16 lg:px-24 max-w-7xl mx-auto">
            <div className="mb-8 border-b border-white/10 pb-5">
              <span className="text-[11px] font-semibold text-[#C5A059] uppercase tracking-[0.16em] block mb-1.5">
                RESPALDO Y COMPROMISO EJECUTIVO
              </span>
              <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
                Nuestra Garantía Corporativa
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch mb-8">
              {TRUST_SEALS.map((seal) => (
                <div
                  key={seal.title}
                  className="seal-card-lhyo p-6 h-full flex flex-col justify-start"
                >
                  <div className="w-8 h-[1.5px] bg-[#C5A059] mb-4" />
                  <h3 className="font-semibold text-sm tracking-wide text-[#FCF6BA] mb-2.5 whitespace-normal sm:whitespace-normal sm:whitespace-normal sm:whitespace-normal sm:whitespace-normal sm:whitespace-nowrap">
                    {seal.title}
                  </h3>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {seal.subtitle}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0A1128]/90 via-[#070A14] to-[#050507] border border-[#C5A059]/45">
              <span className="text-[11px] font-semibold text-[#C5A059] uppercase tracking-[0.16em] block mb-1.5">
                IMPLEMENTACIÓN EJECUTIVA · DE LA ESTRATEGIA A LA PRODUCCIÓN EN 10 DÍAS
              </span>
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-5">
                Toque cada etapa para conocer nuestro protocolo de ejecución:
              </h3>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                {GUARANTEE_TIMELINE_STEPS.map((st, idx) => {
                  const active = activeGuaranteeStep === idx;
                  return (
                    <button
                      key={st.step}
                      type="button"
                      onClick={() => setActiveGuaranteeStep(idx)}
                      className={`p-3.5 rounded-2xl text-left border transition cursor-pointer ${
                        active
                          ? "bg-[#C5A059] text-[#050507] border-[#FCF6BA] font-bold"
                          : "bg-[#050507] text-gray-300 border-white/10 hover:border-[#C5A059]/50"
                      }`}
                    >
                      <span className="text-[10px] uppercase tracking-widest block opacity-80">
                        {st.step} · {st.days}
                      </span>
                      <span className="text-xs font-semibold mt-0.5 block">
                        {st.title}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="p-5 rounded-2xl bg-[#050507] border border-[#C5A059]/40 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
                <div className="space-y-1.5 max-w-[580px]">
                  <div className="text-xs font-bold text-[#FCF6BA] uppercase">
                    {GUARANTEE_TIMELINE_STEPS[activeGuaranteeStep].step} ({GUARANTEE_TIMELINE_STEPS[activeGuaranteeStep].days}) —{" "}
                    {GUARANTEE_TIMELINE_STEPS[activeGuaranteeStep].title}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                    {GUARANTEE_TIMELINE_STEPS[activeGuaranteeStep].simpleDesc}
                  </p>
                  <div className="text-xs text-emerald-400 font-semibold">
                    ✓ Entregable: {GUARANTEE_TIMELINE_STEPS[activeGuaranteeStep].deliverable}
                  </div>
                </div>
                <div className="shrink-0">
                  <AuditTriggerButton
                    label="INICIAR CON EL PASO 01 →"
                    selectedPlan="AUDITORÍA DESDE NUESTRA GARANTÍA"
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {activeView === "contacto" && <DirectContactSection />}
      </div>

      <footer className="w-full max-w-7xl mx-auto px-6 md:px-16 lg:px-24 pt-8 pb-28">
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#C5A059]/45 to-transparent mb-6" />
        <div className="flex flex-col items-center justify-center text-center gap-1.5 text-xs text-gray-400">
          <span className="font-semibold tracking-[0.16em] text-[#FCF6BA]/85">
            © 2026 LHYO GROUP · TODOS LOS DERECHOS RESERVADOS
          </span>
          <span className="text-[11px] tracking-[0.12em] text-gray-500">
            ARQUITECTURA DIGITAL, SISTEMAS INTELIGENTES Y AUTOMATIZACIÓN 24/7 · CEO@LHYOGROUP.COM
          </span>
        </div>
      </footer>

      <FloatingOmniDock />
    </div>
  );
}
