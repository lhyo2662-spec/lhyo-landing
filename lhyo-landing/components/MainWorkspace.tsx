"use client";

import { useState, useEffect } from "react";
import BrandLogo from "./BrandLogo";
import AuditTriggerButton from "./AuditTriggerButton";
import InteractiveCatalog from "./InteractiveCatalog";
import LiveAiSimulator from "./LiveAiSimulator";
import DirectContactSection from "./DirectContactSection";
import FloatingOmniDock from "./FloatingOmniDock";

type ActiveView = "inicio" | "catalogo" | "garantia" | "contacto";

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
  },
];

export default function MainWorkspace() {
  const [activeView, setActiveView] = useState<ActiveView>("inicio");

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
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const navItems: Array<{ id: ActiveView; label: string }> = [
    { id: "inicio", label: "INICIO" },
    { id: "catalogo", label: "SERVICIOS Y PLANES" },
    { id: "garantia", label: "NUESTRA GARANTÍA" },
    { id: "contacto", label: "CONTACTO" },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#070707] text-white">
      {/* BARRA DE NAVEGACIÓN SIMÉTRICA */}
      <header className="border-b border-white/10 bg-[#070707]/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 h-20 flex justify-between items-center">
          <div onClick={() => switchView("inicio")} className="cursor-pointer">
            <BrandLogo />
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-medium tracking-[0.14em]">
            {navItems.map((tab) => {
              const isActive = activeView === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => switchView(tab.id)}
                  className={`relative py-2 transition-colors duration-200 ${
                    isActive ? "text-[#FCF6BA] font-semibold" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {tab.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#BF953F] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="flex md:hidden items-center gap-4 text-[11px] font-medium tracking-wider">
            {navItems.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => switchView(tab.id)}
                className={
                  activeView === tab.id
                    ? "text-[#FCF6BA] border-b border-[#BF953F] pb-1 font-semibold"
                    : "text-gray-400"
                }
              >
                {tab.id === "catalogo" ? "SERVICIOS" : tab.id === "garantia" ? "GARANTÍA" : tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="flex-1">
        {activeView === "inicio" && (
          <div>
            {/* PORTADA CON LA MISMA DISTANCIA SUPERIOR EXACTA (pt-10) DE NUESTRA GARANTÍA */}
            <section className="relative overflow-hidden border-b border-white/10 px-6 pt-10 pb-16 md:px-16 lg:px-24 max-w-7xl mx-auto">
              <div className="relative z-10 max-w-3xl">
                <span className="text-[11px] font-semibold text-[#BF953F] uppercase tracking-[0.16em] block mb-2">
                  INNOVACIÓN, PRESENCIA DIGITAL Y AUTOMATIZACIÓN COMERCIAL
                </span>
                <h1 className="text-4xl md:text-[54px] font-semibold tracking-tight leading-[1.08] mb-5 text-white">
                  Impulsamos el crecimiento de su negocio con tecnología inteligente y diseño de alto nivel
                </h1>
                <p className="text-base md:text-lg text-gray-300/90 max-w-2xl mb-8 font-normal leading-relaxed">
                  Desarrollamos páginas web corporativas, asistentes inteligentes que atienden a sus clientes las 24 horas y sistemas automatizados que organizan sus ventas con total precisión.
                </p>

                {/* DOS BOTONES SIMÉTRICOS DE IGUAL ALTURA Y UNA SOLA LÍNEA */}
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                  <div className="sm:w-auto">
                    <AuditTriggerButton 
                      label="AGENDAR AUDITORÍA Y RECIBIR CATÁLOGO" 
                      selectedPlan="AUDITORÍA GENERAL (Botón Principal)" 
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => switchView("catalogo")}
                    className="px-7 py-4 rounded-md border border-[#BF953F]/50 bg-white/[0.03] text-xs font-semibold tracking-[0.06em] uppercase text-[#FCF6BA] hover:border-[#FCF6BA] hover:bg-[#BF953F]/15 transition text-center whitespace-nowrap"
                  >
                    EXPLORAR CATÁLOGO DE SERVICIOS →
                  </button>
                </div>
              </div>

              <div
                aria-hidden="true"
                className="pointer-events-none select-none absolute right-6 md:right-14 lg:right-20 top-1/2 -translate-y-1/2 z-0 opacity-25 md:opacity-40 transition-opacity duration-500"
              >
                <svg
                  viewBox="0 0 120 110"
                  className="w-64 h-64 md:w-96 md:h-96 lg:w-[415px] lg:h-[415px] -rotate-[22deg] drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)]"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="lhyoMonogramGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F8FAFC" stopOpacity="0.95" />
                      <stop offset="55%" stopColor="#E2E8F0" stopOpacity="0.75" />
                      <stop offset="100%" stopColor="#BF953F" stopOpacity="0.55" />
                    </linearGradient>
                  </defs>
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
                </svg>
              </div>
            </section>

            <LiveAiSimulator />

            <section className="px-6 py-12 pb-24 md:px-16 lg:px-24 max-w-7xl mx-auto border-b border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button
                  type="button"
                  onClick={() => switchView("catalogo")}
                  className="seal-card-lhyo p-6 text-left cursor-pointer"
                >
                  <span className="text-[10px] font-semibold text-[#BF953F] uppercase tracking-[0.16em] block mb-1.5">
                    01 · SOLUCIONES A MEDIDA
                  </span>
                  <div className="text-lg font-semibold text-[#FCF6BA] mb-1">
                    Catálogo de Servicios y Planes →
                  </div>
                  <p className="text-xs text-gray-300/90 leading-relaxed">
                    Conozca el alcance de cada servicio y configure su Catálogo Privado.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => switchView("garantia")}
                  className="seal-card-lhyo p-6 text-left cursor-pointer"
                >
                  <span className="text-[10px] font-semibold text-[#BF953F] uppercase tracking-[0.16em] block mb-1.5">
                    02 · ESTÁNDAR DE EXCELENCIA
                  </span>
                  <div className="text-lg font-semibold text-[#FCF6BA] mb-1">
                    Nuestra Garantía Corporativa →
                  </div>
                  <p className="text-xs text-gray-300/90 leading-relaxed">
                    Calidad superior, atención 24 horas, implementación integral y presencia global.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => switchView("contacto")}
                  className="seal-card-lhyo p-6 text-left cursor-pointer"
                >
                  <span className="text-[10px] font-semibold text-[#BF953F] uppercase tracking-[0.16em] block mb-1.5">
                    03 · COMUNICACIÓN EJECUTIVA
                  </span>
                  <div className="text-lg font-semibold text-[#FCF6BA] mb-1">
                    Contacto Directo y Redes →
                  </div>
                  <p className="text-xs text-gray-300/90 leading-relaxed">
                    Envíenos una consulta directa o contáctenos por WhatsApp, Instagram y LinkedIn.
                  </p>
                </button>
              </div>
            </section>
          </div>
        )}

        {activeView === "catalogo" && (
          <section className="px-6 pt-10 pb-28 md:px-16 lg:px-24 max-w-7xl mx-auto">
            <div className="mb-12 border-b border-white/10 pb-6 flex flex-col md:flex-row justify-between md:items-end gap-4">
              <div>
                <span className="text-[11px] font-semibold text-[#BF953F] uppercase tracking-[0.16em] block mb-2">
                  SOLUCIONES EMPRESARIALES A MEDIDA
                </span>
                <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
                  Catálogo de Servicios
                </h2>
              </div>
              <span className="text-sm text-gray-300/90">
                Seleccione cualquier servicio para conocer su alcance y personalizar su solicitud
              </span>
            </div>

            <InteractiveCatalog />
          </section>
        )}

        {activeView === "garantia" && (
          <section className="px-6 pt-10 pb-28 md:px-16 lg:px-24 max-w-7xl mx-auto">
            <div className="mb-12 border-b border-white/10 pb-6">
              <span className="text-[11px] font-semibold text-[#BF953F] uppercase tracking-[0.16em] block mb-2">
                RESPALDO Y COMPROMISO EJECUTIVO
              </span>
              <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
                Nuestra Garantía Corporativa
              </h2>
              <p className="text-sm md:text-base text-gray-300/90 max-w-3xl mt-3 leading-relaxed">
                Cada sistema desarrollado por Lhyo Group se construye bajo estándares rigurosos de velocidad, estabilidad y acompañamiento continuo para garantizar el retorno de inversión de su empresa:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-12">
              {TRUST_SEALS.map((seal) => (
                <div
                  key={seal.title}
                  className="seal-card-lhyo p-7 h-full flex flex-col justify-between"
                >
                  <div>
                    <div className="w-8 h-[1.5px] bg-[#BF953F] mb-4" />
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

            <div className="luxury-vault-container p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="max-w-2xl">
                <span className="text-[11px] font-semibold text-[#FCF6BA] uppercase tracking-[0.14em] block mb-1.5">
                  EJECUCIÓN LLAVE EN MANO
                </span>
                <h3 className="text-2xl font-semibold text-white mb-2">
                  Nos encargamos de toda la arquitectura técnica por usted
                </h3>
                <p className="text-sm text-gray-300/90 leading-relaxed">
                  Desde el diseño corporativo hasta el entrenamiento de sus asistentes inteligentes y la conexión con su CRM, nuestro equipo entrega el ecosistema probado y funcionando.
                </p>
              </div>
              <div className="shrink-0">
                <AuditTriggerButton
                  label="AGENDAR AUDITORÍA Y RECIBIR CATÁLOGO"
                  selectedPlan="AUDITORÍA DESDE SECCIÓN NUESTRA GARANTÍA"
                />
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
          <span>SOLUCIONES DIGITALES, PÁGINAS WEB Y AUTOMATIZACIÓN IA</span>
        </div>
      )}

      <FloatingOmniDock />
    </div>
  );
}
