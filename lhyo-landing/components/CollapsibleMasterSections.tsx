"use client";

import { useState } from "react";
import CompactSolutionsCatalog from "./CompactSolutionsCatalog";
import DirectContactSection from "./DirectContactSection";

const CLAVES_EJECUTIVAS = [
  {
    id: "clave-01",
    label: "CLAVE 01 Â· ATENCIÃ“N INMEDIATA 24/7",
    qLine1: "Â¿QuÃ© ocurre cuando su mejor cliente",
    qLine2: "escribe un domingo a las 2:30 AM?",
    badge: "âœ¦ AtenciÃ³n Inmediata 24/7 Â· Cero Oportunidades Perdidas",
    hLine1: "Mientras su competencia descansa, su empresa responde",
    hLine2: "y agenda al instante",
    description:
      "El 78% de los clientes contrata a la primera empresa que le responde con claridad y rapidez. Instalamos asistentes inteligentes entrenados con toda la informaciÃ³n de su negocio que atienden en WhatsApp e Instagram dÃ­a y noche, califican al prospecto y agendan la reuniÃ³n en su calendario."
  },
  {
    id: "clave-02",
    label: "CLAVE 02 Â· PRESENCIA Y PRESTIGIO",
    qLine1: "Â¿Por quÃ© 8 de cada 10 personas cierran",
    qLine2: "una pÃ¡gina web en menos de 4 segundos?",
    badge: "âœ¦ Presencia de MÃ¡ximo Prestigio desde el Primer Segundo",
    hLine1: "Una plataforma de alto prestigio que proyecta",
    hLine2: "autoridad y multiplica ventas",
    description:
      "Cuando un cliente visita su empresa en internet, evalÃºa en pocos segundos el prestigio y la solidez de su marca. Construimos plataformas de alta gama con velocidad instantÃ¡nea y arquitectura interactiva que transforman el interÃ©s del visitante en reuniones comerciales."
  },
  {
    id: "clave-03",
    label: "CLAVE 03 Â· CONTROL Y TECNOLOGÃA PROPIA",
    qLine1: "Â¿QuÃ© logra su empresa cuando une todas",
    qLine2: "sus Ã¡reas y ventas en una sola pantalla?",
    badge: "âœ¦ Hasta 85% de Ahorro Anual + Control Ejecutivo Total",
    hLine1: "Todo su negocio unido en una pantalla",
    hLine2: "bajo su control total",
    description:
      "Multiplica la velocidad de su negocio y elimina gastos en programas separados. Cada cliente se registra y clasifica automÃ¡ticamente por prioridad mientras toda su operaciÃ³n funciona conectada desde una plataforma Todo-en-Uno creada en exclusiva con la identidad de su empresa."
  }
];

export default function CollapsibleMasterSections() {
  const [activeTab, setActiveTab] = useState<"inicio" | "soluciones" | "garantia" | "contacto">("inicio");
  const [activeClaveIdx, setActiveClaveIdx] = useState(0);
  const [preselectedInterest, setPreselectedInterest] = useState("Paquete Completo (Todo Incluido)");

  const currentClave = CLAVES_EJECUTIVAS[activeClaveIdx];

  return (
    <div className="min-h-0 lg:min-h-[calc(100vh-84px)] lg:flex lg:flex-col lg:justify-center bg-[#050507] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050507]/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setActiveTab("inicio")}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <svg className="w-7 h-7" viewBox="0 0 120 110" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10 42 L40 18 L40 70 L102 70 L84 96 L28 96 L28 80 L10 80 Z M20 46 L30 38 L30 70 L20 70 Z M40 80 L86 80 L80 87 L40 87 Z"
                fill="#FFFFFF"
              />
              <path d="M48 11 L58 3 L58 63 L48 63 Z" fill="#C5A059" />
            </svg>
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl font-black tracking-[0.16em] text-white">LHYO</span>
              <span className="text-[#C5A059] font-light">|</span>
              <span className="text-[11px] sm:text-xs font-medium tracking-[0.28em] text-gray-300 uppercase">
                GROUP
              </span>
            </div>
          </button>

          <nav className="flex items-center gap-6 sm:gap-9">
            {[
              { id: "inicio", label: "INICIO" },
              { id: "soluciones", label: "SOLUCIONES" },
              { id: "garantia", label: "GARANTÃA" },
              { id: "contacto", label: "CONTACTO" }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as "inicio" | "soluciones" | "garantia" | "contacto")}
                className={`text-xs font-bold tracking-[0.18em] uppercase pb-1.5 transition cursor-pointer border-b-2 ${
                  activeTab === tab.id
                    ? "text-[#FCF6BA] border-[#C5A059]"
                    : "text-gray-300 border-transparent hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {activeTab === "inicio" && (
        <main className="max-w-7xl mx-auto px-6 pt-6 pb-16 pb-24 space-y-16">
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="text-[11px] font-bold tracking-[0.22em] text-[#C5A059] uppercase">
                âœ¦ TECNOLOGÃA DEL FUTURO E INGENIERÃA DE LUJO Â· SISTEMAS INTELIGENTES 24/7
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.08] max-w-[580px]">
                Construimos la presencia digital, los sistemas y la inteligencia que llevan su empresa al siguiente nivel
              </h1>

              <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-[580px]">
                Creamos e instalamos exactamente lo que su empresa necesita para liderar su mercado: desde plataformas web de mÃ¡ximo prestigio y atenciÃ³n inteligente 24/7 hasta ecosistemas propios que organizan y multiplican sus ventas en automÃ¡tico.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("contacto")}
                  className="px-7 py-4 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#FCF6BA] to-[#B38728] text-[#050507] font-extrabold text-xs tracking-[0.14em] uppercase shadow-[0_12px_35px_rgba(197,160,89,0.3)] hover:brightness-105 transition cursor-pointer"
                >
                  AGENDAR REUNIÃ“N Y RECIBIR CATÃLOGO
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("soluciones")}
                  className="px-7 py-4 rounded-xl bg-[#0A1128]/80 border border-[#C5A059]/45 text-[#FCF6BA] font-bold text-xs tracking-[0.14em] uppercase hover:border-[#FCF6BA] transition cursor-pointer"
                >
                  DESCUBRIR QUÃ‰ HACEMOS POR SU NEGOCIO â†’
                </button>
              </div>

              <div className="pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-bold tracking-[0.16em] text-[#FCF6BA] uppercase">
                <div>01 VELOCIDAD QUE MULTIPLICA VENTAS</div>
                <div>02 AUTORIDAD Y PRESTIGIO CORPORATIVO</div>
                <div>03 EL FUTURO DE SU EMPRESA HOY</div>
              </div>
            </div>

            <div className="lg:col-span-5 flex items-center justify-center">
              <svg className="w-72 h-72 sm:w-96 sm:h-96" viewBox="8.5 7.5 96.5 97.5" fill="none">
                <g transform="rotate(-22 60 55)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10 42 L40 18 L40 70 L102 70 L84 96 L28 96 L28 80 L10 80 Z M20 46 L30 38 L30 70 L20 70 Z M40 80 L86 80 L80 87 L40 87 Z"
                    fill="#9CA3AF"
                  />
                  <path d="M48 11 L58 3 L58 63 L48 63 Z" fill="#C5A059" />
                </g>
              </svg>
            </div>
          </section>

          <section className="rounded-3xl border border-[#C5A059]/35 bg-[#070A12] p-7 sm:p-10 shadow-2xl space-y-7">
            <div className="border-b border-white/10 pb-5">
              <span className="text-[11px] font-bold tracking-[0.2em] text-[#C5A059] uppercase block mb-1.5">
                âœ¦ DIAGNÃ“STICO EJECUTIVO EN 10 SEGUNDOS
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Toque cualquiera de estas 3 claves para descubrir cÃ³mo transformamos la operaciÃ³n de su empresa:
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {CLAVES_EJECUTIVAS.map((c, idx) => {
                const isSelected = activeClaveIdx === idx;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveClaveIdx(idx)}
                    className={`text-left rounded-2xl p-5 transition cursor-pointer border ${
                      isSelected
                        ? "bg-gradient-to-br from-[#FCF6BA] via-[#D5B263] to-[#B38728] text-[#050507] border-[#FCF6BA] shadow-[0_12px_35px_rgba(197,160,89,0.35)]"
                        : "bg-[#050507] border-white/10 text-white hover:border-[#C5A059]/60"
                    }`}
                  >
                    <span
                      className={`text-[10px] font-extrabold tracking-[0.15em] uppercase block mb-2 ${
                        isSelected ? "text-[#050507]/80" : "text-[#C5A059]"
                      }`}
                    >
                      {c.label}
                    </span>
                    <p className="text-sm sm:text-[15px] font-bold leading-snug">
                      <span className="block">{c.qLine1}</span>
                      <span className="block">{c.qLine2}</span>
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="rounded-2xl border border-[#C5A059]/35 bg-[#050507] p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-3 w-full min-w-0 max-w-full lg:max-w-3xl overflow-hidden">
                <span className="inline-block px-3.5 py-1 rounded-full bg-[#0A1128] border border-[#C5A059]/40 text-[11px] font-semibold text-[#FCF6BA]">
                  {currentClave.badge}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight whitespace-pre-line">
                  <span className="block">{currentClave.hLine1}</span>
                  <span className="block">{currentClave.hLine2}</span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  {currentClave.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab("soluciones")}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#FCF6BA] to-[#B38728] text-[#050507] font-extrabold text-xs uppercase tracking-wider shrink-0 shadow-lg hover:brightness-105 transition cursor-pointer"
              >
                VER LAS 6 SOLUCIONES â†’
              </button>
            </div>
          </section>
        </main>
      )}

      {activeTab === "soluciones" && (
        <CompactSolutionsCatalog
          onSelectSolution={(interest) => {
            setPreselectedInterest(interest);
            setActiveTab("contacto");
          }}
        />
      )}

      {activeTab === "garantia" && (
        <main className="max-w-7xl mx-auto px-6 pt-6 pb-16 pb-24">
          <div className="rounded-3xl border border-[#C5A059]/45 bg-[#070A12] p-8 sm:p-12 shadow-2xl space-y-6">
            <span className="text-[11px] font-bold tracking-[0.22em] text-[#C5A059] uppercase block">
              âœ¦ COMPROMISO EJECUTIVO Y RESPALDO TÃ‰CNICO POR CONTRATO
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              GarantÃ­a de Funcionamiento, Propiedad Total y Entrega Llave en Mano
            </h2>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed w-full min-w-0 max-w-full lg:max-w-3xl overflow-hidden">
              En Lhyo Group diseÃ±amos, instalamos y dejamos funcionando cada sistema a la medida exacta de su empresa con respaldo directo de ingenierÃ­a.
            </p>
          </div>
        </main>
      )}

      {activeTab === "contacto" && <DirectContactSection />}
    </div>
  );
}




