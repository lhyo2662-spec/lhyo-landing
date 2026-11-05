"use client";

import { useState, useRef } from "react";
import AuditTriggerButton from "./AuditTriggerButton";
import { ALL_SOLUTIONS_DATA } from "./CompactSolutionStage";

export default function CollapsibleMasterCatalog() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<Record<string, string>>({});
  const [vaultExpanded, setVaultExpanded] = useState<boolean>(false);
  const cardRefs = useRef<Record<string, HTMLElement | null>>({});
  const vaultRef = useRef<HTMLDivElement | null>(null);

  const [customPicks, setCustomPicks] = useState<Record<string, string[]>>(() => {
    const init: Record<string, string[]> = {};
    ALL_SOLUTIONS_DATA.forEach((s) => {
      init[s.id] = [s.customOptions[0], s.customOptions[1]];
    });
    return init;
  });

  const [privCountry, setPrivCountry] = useState("Latinoamérica");
  const [privInterests, setPrivInterests] = useState(["01 · Asistentes Inteligentes WhatsApp / IG (24/7)"]);
  const [privStage, setPrivStage] = useState("Negocio en marcha buscando crecer");

  const toggleAccordion = (id: string) => {
    const isOpening = expandedId !== id;
    setExpandedId(isOpening ? id : null);

    if (isOpening) {
      setTimeout(() => {
        const el = cardRefs.current[id];
        if (el && typeof window !== "undefined") {
          const headerOffset = 94;
          const elementPosition = el.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: Math.max(0, elementPosition - headerOffset),
            behavior: "smooth"
          });
        }
      }, 90);
    }
  };

  const toggleVaultDrawer = () => {
    const nextState = !vaultExpanded;
    setVaultExpanded(nextState);
    if (nextState) {
      setTimeout(() => {
        if (vaultRef.current && typeof window !== "undefined") {
          const headerOffset = 94;
          const elementPosition = vaultRef.current.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: Math.max(0, elementPosition - headerOffset),
            behavior: "smooth"
          });
        }
      }, 90);
    }
  };

  const togglePick = (solId: string, opt: string) => {
    setCustomPicks((prev) => {
      const list = prev[solId] || [];
      if (list.includes(opt)) {
        const next = list.filter((x) => x !== opt);
        return { ...prev, [solId]: next.length ? next : [opt] };
      }
      return { ...prev, [solId]: [...list, opt] };
    });
  };

  const handlePrivInterestToggle = (option: string) => {
    setPrivInterests((prev) => {
      if (prev.includes(option)) {
        return prev.length > 1 ? prev.filter((item) => item !== option) : prev;
      }
      return [...prev, option];
    });
  };

  const privateCatalogSummary = `Propuesta personalizada para ${privCountry} · Soluciones: ${privInterests.join(" + ")} · Etapa: ${privStage}`;

  return (
    <div className="space-y-4">
      <div className="border-b border-white/10 pb-6 mb-8 flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <span className="text-[11px] font-semibold text-[#C5A059] uppercase tracking-[0.16em] block mb-2">
            ARQUITECTURA DE SOLUCIONES · TODO EN UN SOLO LUGAR
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
            Catálogo Oficial de Soluciones
          </h2>
        </div>
        <span className="text-xs sm:text-sm text-gray-300/90">
          Toque cualquiera de nuestras 6 soluciones para desplegar su alcance y configurarla a medida
        </span>
      </div>

      <div className="space-y-3.5">
        {ALL_SOLUTIONS_DATA.map((sol) => {
          const isExpanded = expandedId === sol.id;
          const currentTab = activeSubTab[sol.id] || "incluye";
          const userPicks = customPicks[sol.id] || [];
          const customPayload = `${sol.crmBaseName} | Selección: ${userPicks.join(" + ")}`;

          return (
            <article
              key={sol.id}
              ref={(el) => {
                cardRefs.current[sol.id] = el;
              }}
              className={`scroll-mt-24 rounded-2xl transition-all duration-300 overflow-hidden ${
                isExpanded
                  ? "bg-gradient-to-br from-[#0A1128]/95 via-[#070A14] to-[#050507] border border-[#C5A059]/65 shadow-2xl"
                  : "bg-[#0A1128]/45 hover:bg-[#0A1128]/70 border border-white/10 hover:border-[#C5A059]/45"
              }`}
            >
              <div
                onClick={() => toggleAccordion(sol.id)}
                className="p-5 sm:p-6 cursor-pointer select-none flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start sm:items-center gap-4 sm:gap-5">
                  <span
                    className={`text-2xl sm:text-3xl font-light tracking-tighter shrink-0 ${
                      isExpanded ? "text-[#FCF6BA]" : "text-[#C5A059]"
                    }`}
                  >
                    {sol.num}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#C5A059]">
                        {sol.badge}
                      </span>
                      <span className="hidden sm:inline-block text-[10px] font-medium text-[#FCF6BA] bg-[#C5A059]/15 border border-[#C5A059]/35 rounded-full px-2.5 py-0.5">
                        ✦ {sol.benefitTag}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
                      {sol.title}
                    </h3>
                    {!isExpanded && (
                      <p className="text-xs text-gray-300/85 mt-1 ">
                        {sol.curiosityHook}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end shrink-0">
                  <span
                    className={`px-4 py-2 rounded-full text-xs font-semibold border transition flex items-center gap-2 ${
                      isExpanded
                        ? "bg-[#C5A059] text-[#050507] border-[#FCF6BA]"
                        : "bg-[#050507]/80 text-[#FCF6BA] border-[#C5A059]/40"
                    }`}
                  >
                    <span>{isExpanded ? "Recoger detalles ▲" : "Desplegar solución ▼"}</span>
                  </span>
                </div>
              </div>

              {isExpanded && (
                <div className="px-5 pb-6 sm:px-7 sm:pb-8 pt-4 border-t border-white/10 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    <div className="lg:col-span-8 space-y-3">
                      <p className="text-sm text-gray-200 leading-relaxed">
                        {sol.shortDesc}
                      </p>
                      <div className="p-4 rounded-2xl bg-[#050507]/90 border-l-2 border-[#C5A059] text-xs sm:text-sm text-gray-200">
                        <strong className="text-[#FCF6BA] font-semibold">
                          ✦ {sol.plainExplanation}
                        </strong>
                      </div>
                    </div>

                    <div className="lg:col-span-4 space-y-2">
                      {sol.metrics.map((m, i) => (
                        <div
                          key={i}
                          className="px-4 py-2.5 rounded-xl bg-[#050507] border border-white/10 flex items-center justify-between"
                        >
                          <span className="text-xs text-gray-400">{m.label}</span>
                          <span className="text-xs font-bold text-[#FCF6BA]">{m.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
                    <div className="flex flex-wrap gap-2 bg-[#050507] p-1.5 rounded-2xl border border-white/10">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveSubTab((p) => ({ ...p, [sol.id]: "incluye" }))
                        }
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                          currentTab === "incluye"
                            ? "bg-[#C5A059] text-[#050507]"
                            : "text-gray-300 hover:text-white"
                        }`}
                      >
                        ✦ 1. Alcance Incluido ({sol.includedItems.length} puntos)
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setActiveSubTab((p) => ({ ...p, [sol.id]: "personalizar" }))
                        }
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                          currentTab === "personalizar"
                            ? "bg-[#C5A059] text-[#050507]"
                            : "text-gray-300 hover:text-white"
                        }`}
                      >
                        ⚙ 2. Configurar a Medida ({userPicks.length} activos)
                      </button>
                    </div>

                    <AuditTriggerButton
                      label={sol.buttonText}
                      selectedPlan={customPayload}
                    />
                  </div>

                  {currentTab === "incluye" && (
                    <div className="p-5 rounded-2xl bg-[#050507]/90 border border-[#C5A059]/35">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        {sol.includedItems.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 rounded-xl bg-[#0A1128]/60 border border-white/10 flex items-start gap-2.5 text-xs sm:text-sm text-gray-200"
                          >
                            <span className="text-[#C5A059] font-bold">✦</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                      <div className="p-3.5 rounded-xl bg-[#0A1128] border border-[#C5A059]/40 text-xs text-gray-200">
                        <strong className="text-[#FCF6BA]">✦ El resultado en su empresa:</strong>{" "}
                        {sol.executionGuarantee}
                      </div>
                    </div>
                  )}

                  {currentTab === "personalizar" && (
                    <div className="p-5 rounded-2xl bg-[#050507]/90 border border-[#C5A059]/35">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {sol.customOptions.map((opt) => {
                          const sel = userPicks.includes(opt);
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => togglePick(sol.id, opt)}
                              className={`rounded-xl text-left px-4 py-3 text-xs sm:text-sm border flex items-center justify-between cursor-pointer ${
                                sel
                                  ? "bg-[#C5A059]/15 border-[#C5A059] text-white"
                                  : "bg-[#0A1128]/40 border-white/10 text-gray-400"
                              }`}
                            >
                              <span>{opt}</span>
                              <span className="text-[11px] font-semibold text-[#FCF6BA]">
                                {sel ? "✓ Incluido" : "+ Añadir"}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>

      <div
        ref={vaultRef}
        className="mt-8 scroll-mt-24 rounded-2xl border border-[#C5A059]/50 bg-gradient-to-r from-[#0A1128]/90 via-[#070A14] to-[#050507] overflow-hidden"
      >
        <div
          onClick={toggleVaultDrawer}
          className="p-6 cursor-pointer select-none flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <span className="text-[10px] font-semibold text-[#FCF6BA] uppercase tracking-[0.16em] block mb-1">
              ✦ PROPUESTA ECONÓMICA PERSONALIZADA POR PAÍS
            </span>
            <h3 className="text-xl sm:text-2xl font-semibold text-white">
              ¿Desea recibir nuestro Catálogo Privado PDF con las tarifas para su país?
            </h3>
          </div>
          <span className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#C5A059] via-[#FCF6BA] to-[#B38728] text-[#050507] text-xs font-bold uppercase tracking-wider shrink-0 self-start sm:self-center">
            {vaultExpanded ? "Recoger ventana ▲" : "Configurar mi Catálogo ▼"}
          </span>
        </div>

        {vaultExpanded && (
          <div className="px-6 pb-7 pt-4 border-t border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
              <div className="p-5 rounded-xl bg-[#050507]/85 border border-white/10">
                <label className="text-xs font-semibold text-[#FCF6BA] uppercase block mb-3">
                  1. País de Operación
                </label>
                <div className="space-y-2">
                  {["Latinoamérica", "Europa", "Estados Unidos / Norteamérica", "Otra Región / Global"].map((pais) => (
                    <button
                      key={pais}
                      type="button"
                      onClick={() => setPrivCountry(pais)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs border flex justify-between items-center cursor-pointer ${
                        privCountry === pais
                          ? "border-[#C5A059] bg-[#C5A059]/15 text-white font-semibold"
                          : "border-white/10 text-gray-400"
                      }`}
                    >
                      <span>{pais}</span>
                      <span>{privCountry === pais ? "●" : ""}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-xl bg-[#050507]/85 border border-white/10">
                <label className="text-xs font-semibold text-[#FCF6BA] uppercase block mb-3">
                  2. Solución a Cotizar
                </label>
                <div className="space-y-2">
                  {[
                    "01 · Asistentes Inteligentes WhatsApp / IG (24/7)", "02 · Plataformas Web y Catálogos Interactivos", "03 · Organización Automática de Clientes (CRM)", "04 · Automatización Total con Tecnología Propia", "05 · IA Personalizada con la Memoria de su Empresa", "06 · Plataforma Empresarial Todo-en-Uno"
                  ].map((interes) => {
                    const sel = privInterests.includes(interes);
                    return (
                      <button
                        key={interes}
                        type="button"
                        onClick={() => handlePrivInterestToggle(interes)}
                        className={`w-full text-left px-3.5 py-2 rounded-lg text-xs border flex justify-between items-center cursor-pointer ${
                          sel
                            ? "border-[#C5A059] bg-[#C5A059]/15 text-white font-semibold"
                            : "border-white/10 text-gray-400"
                        }`}
                      >
                        <span>{interes}</span>
                        <span>{sel ? "●" : ""}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-5 rounded-xl bg-[#050507]/85 border border-white/10">
                <label className="text-xs font-semibold text-[#FCF6BA] uppercase block mb-3">
                  3. Etapa Actual
                </label>
                <div className="space-y-2">
                  {[
                    "Negocio en marcha buscando crecer",
                    "Proyecto nuevo por lanzar",
                    "Empresa consolidada / Alto volumen"
                  ].map((etapa) => (
                    <button
                      key={etapa}
                      type="button"
                      onClick={() => setPrivStage(etapa)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs border flex justify-between items-center cursor-pointer ${
                        privStage === etapa
                          ? "border-[#C5A059] bg-[#C5A059]/15 text-white font-semibold"
                          : "border-white/10 text-gray-400"
                      }`}
                    >
                      <span>{etapa}</span>
                      <span>{privStage === etapa ? "●" : ""}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-white/10">
              <div className="text-xs text-gray-300">
                <strong className="text-[#FCF6BA] block">Resumen de su solicitud:</strong>
                {privateCatalogSummary}
              </div>
              <AuditTriggerButton
                label="RECIBIR MI CATÁLOGO PRIVADO →"
                selectedPlan={privateCatalogSummary}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

