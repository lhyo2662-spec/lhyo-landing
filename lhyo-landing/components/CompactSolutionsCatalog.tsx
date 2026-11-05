"use client";

import { useState } from "react";

const SOLUTIONS_LIST = [
  {
    id: "01",
    shortLabel: "01 · Asistentes Inteligentes WhatsApp / IG (24/7)",
    category: "SOLUCIÓN 01 · ATENCIÓN Y CONVERSIÓN INMEDIATA",
    badge: "✦ Respuesta inmediata las 24 horas",
    title: "Asistentes Inteligentes para WhatsApp e Instagram (24/7)",
    subtitle: "¿Qué ocurre si un cliente escribe un domingo a las 2:00 AM? Descubra cómo respondemos al instante y agendamos su cita.",
    problem: "Cuando un cliente potencial escribe pidiendo información y tarda horas en recibir respuesta, el interés se enfría y termina comprando en otra empresa.",
    solution: "Instalamos un Asistente Ejecutivo de Inteligencia Artificial en su WhatsApp, Instagram y Sitio Web que atiende al instante las 24 horas, responde dudas con la información exacta de su negocio, califica al cliente y agenda la cita en su calendario."
  },
  {
    id: "02",
    shortLabel: "02 · Plataformas Web Modernas y Catálogos Interactivos",
    category: "SOLUCIÓN 02 · PRESENCIA DIGITAL DE MÁXIMO PRESTIGIO",
    badge: "✦ Presencia de lujo y alta conversión",
    title: "Plataformas Web Modernas y Catálogos Interactivos",
    subtitle: "¿Por qué los clientes abandonan las páginas convencionales tan rápido? Descubra cómo una experiencia interactiva proyecta liderazgo inmediato.",
    problem: "Las páginas web lentas, genéricas o confusas hacen que el visitante desconfíe y abandone en menos de 4 segundos sin dejar sus datos.",
    solution: "Diseñamos y construimos plataformas web corporativas de alto prestigio con carga instantánea, catálogos interactivos y recorridos pensados para transformar cada visita en una oportunidad real de venta."
  },
  {
    id: "03",
    shortLabel: "03 · Organización Automática de Clientes y Ventas (CRM)",
    category: "SOLUCIÓN 03 · CONTROL COMERCIAL AUTOMATIZADO",
    badge: "✦ Orden ejecutivo sin carga manual",
    title: "Organización Automática de Clientes y Ventas (CRM)",
    subtitle: "¿Cuántas oportunidades se pierden por falta de seguimiento? Vea cómo cada prospecto queda registrado y clasificado en tiempo real.",
    problem: "Anotar clientes en cuadernos, hojas sueltas o chats perdidos de WhatsApp provoca olvidos de seguimiento y fugas constantes de dinero.",
    solution: "Conectamos sus canales de atención a un sistema centralizado donde cada prospecto que escribe o agenda queda registrado automáticamente con su nombre, empresa, necesidad y nivel de prioridad."
  },
  {
    id: "04",
    shortLabel: "04 · Automatización Total de Procesos con Tecnología Propia",
    category: "SOLUCIÓN 04 · INDEPENDENCIA Y AUTOMATIZACIÓN SIN LÍMITES",
    badge: "✦ Cero cobro por uso · Capacidad ilimitada",
    title: "Automatización Total de Procesos con Tecnología Propia",
    subtitle: "¿Por qué pagar tarifas mensuales que suben cada vez que su negocio crece, cuando puede ser dueño de su propio sistema automático ilimitado?",
    problem: "Las plataformas tradicionales cobran mensualidades cada vez más caras a medida que su empresa atiende a más clientes o realiza más envíos.",
    solution: "Instalamos el motor de automatización propio de su empresa para conectar todas sus áreas (ventas, correos, agenda, facturación y atención) sin límites de operaciones ni recargos por volumen."
  },
  {
    id: "05",
    shortLabel: "05 · Inteligencia Artificial con la Memoria de su Empresa",
    category: "SOLUCIÓN 05 · EL CEREBRO INTELIGENTE DE SU NEGOCIO",
    badge: "✦ 100% Privada · Respuesta en 1 segundo",
    title: "Inteligencia Artificial Personalizada con la Memoria de su Empresa",
    subtitle: "Imagine preguntarle cualquier precio, contrato o dato interno de su negocio a su propio sistema y recibir la respuesta exacta en 1 segundo.",
    problem: "Buscar precios específicos, cláusulas de contratos, inventario o procedimientos manuales hace perder horas valiosas a usted y a su equipo.",
    solution: "Creamos un cerebro de Inteligencia Artificial privado entrenado únicamente con los documentos, PDFs, tarifarios y manuales de su empresa para responder cualquier consulta interna o comercial en 1 segundo."
  },
  {
    id: "06",
    shortLabel: "06 · Su Propia Plataforma Empresarial Todo-en-Uno",
    category: "SOLUCIÓN 06 · TODA SU EMPRESA EN UNA SOLA PANTALLA",
    badge: "✦ Su propio sistema · Todo en 1 pantalla",
    title: "Su Propia Plataforma Empresarial Todo-en-Uno",
    subtitle: "¿Su equipo abre varios programas desconectados? Vea cómo unificamos toda su empresa en una sola pantalla.",
    problem: "Tener la agenda en un lugar, los clientes en otro y las finanzas en otro genera desorden operativo y dificulta tomar decisiones rápidas.",
    solution: "Desarrollamos la plataforma privada Todo-en-Uno de su empresa con su propio logo y dominio, unificando ventas, prospectos, calendario, equipo y resultados en una sola pantalla ejecutiva."
  }
];

interface Props {
  onSelectSolution?: (interest: string) => void;
}

export default function CompactSolutionsCatalog({ onSelectSolution }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [customizerOpen, setCustomizerOpen] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState("Uruguay");
  const [selectedStage, setSelectedStage] = useState("Negocio en marcha buscando crecer");
  const [allIncluded, setAllIncluded] = useState<boolean>(true);
  const [selectedSixIds, setSelectedSixIds] = useState<string[]>([]);

  const handleToggleAllIncluded = () => {
    if (allIncluded) {
      setAllIncluded(false);
      setSelectedSixIds(["01"]);
    } else {
      setAllIncluded(true);
      setSelectedSixIds([]);
    }
  };

  const handleToggleIndividual = (id: string) => {
    if (allIncluded) return;
    const exists = selectedSixIds.includes(id);
    let nextIds: string[] = [];

    if (exists) {
      if (selectedSixIds.length === 1) return;
      nextIds = selectedSixIds.filter((item) => item !== id);
    } else {
      nextIds = [...selectedSixIds, id];
    }

    if (nextIds.length >= 6) {
      setAllIncluded(true);
      setSelectedSixIds([]);
      return;
    }

    setSelectedSixIds(nextIds);
  };

  const selectedSummaryText = allIncluded
    ? "Paquete Completo (Todo Incluido)"
    : SOLUTIONS_LIST.filter((s) => selectedSixIds.includes(s.id))
        .map((s) => `Solución ${s.id}`)
        .join(" + ");

  return (
    <main className="max-w-6xl mx-auto px-6 pt-10 pb-24 space-y-4">
      {SOLUTIONS_LIST.map((sol) => {
        const isExpanded = openId === sol.id;
        return (
          <div key={sol.id} className="rounded-2xl border border-white/10 bg-[#070A12] hover:border-[#C5A059]/45 transition overflow-hidden">
            <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <span className="text-2xl sm:text-3xl font-light text-[#C5A059] shrink-0 pt-0.5">{sol.id}</span>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold tracking-[0.16em] text-[#C5A059] uppercase">{sol.category}</span>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#0A1128] border border-[#C5A059]/35 text-[#FCF6BA]">{sol.badge}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-white">{sol.title}</h3>
                  <p className="text-xs text-gray-300">{sol.subtitle}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpenId(isExpanded ? null : sol.id)}
                className="px-4 py-2 rounded-full border border-[#C5A059]/45 bg-[#050507] text-[#FCF6BA] text-[11px] font-bold shrink-0 hover:border-[#FCF6BA] transition cursor-pointer"
              >
                {isExpanded ? "Ocultar detalles ▲" : "Ver detalles ▼"}
              </button>
            </div>
            {isExpanded && (
              <div className="px-6 pb-6 pt-4 border-t border-white/10 bg-[#050507]/90">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-white/10 bg-[#080B12] p-4">
                    <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-wider block mb-1">EL DESAFÍO HABITUAL</span>
                    <p className="text-xs text-gray-300 leading-relaxed">{sol.problem}</p>
                  </div>
                  <div className="rounded-xl border border-[#C5A059]/35 bg-[#0A1128]/50 p-4">
                    <span className="text-[10px] font-bold text-[#FCF6BA] uppercase tracking-wider block mb-1">SOLUCIÓN EJECUTIVA LHYO GROUP</span>
                    <p className="text-xs text-gray-200 leading-relaxed">{sol.solution}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <div className="mt-8 rounded-3xl border border-[#C5A059]/55 bg-[#070A12] p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#C5A059] uppercase block mb-1">✦ PROPUESTA ECONÓMICA PERSONALIZADA POR PAÍS</span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">¿Desea recibir nuestro Catálogo Privado PDF con las tarifas para su país?</h3>
          </div>
          <button
            type="button"
            onClick={() => setCustomizerOpen((o) => !o)}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#C5A059] via-[#FCF6BA] to-[#B38728] text-[#050507] font-extrabold text-[11px] uppercase tracking-wider cursor-pointer"
          >
            {customizerOpen ? "OCULTAR OPCIONES ▲" : "PERSONALIZAR PROPUESTA ▼"}
          </button>
        </div>

        {customizerOpen && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
              <div className="rounded-2xl border border-white/10 bg-[#050507] p-4 space-y-2.5">
                <span className="text-[11px] font-bold text-[#FCF6BA] uppercase tracking-wider block mb-2">1. PAÍS DE OPERACIÓN</span>
                {["Uruguay", "Venezuela", "Otro País / Internacional"].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedCountry(c)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold transition flex items-center justify-between cursor-pointer border ${
                      selectedCountry === c ? "bg-[#12100B] border-[#C5A059] text-white" : "bg-[#080B12] border-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    <span>{c}</span>
                    {selectedCountry === c && <span className="w-2 h-2 rounded-full bg-[#FCF6BA]" />}
                  </button>
                ))}
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#050507] p-4 space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-[#FCF6BA] uppercase tracking-wider">2. SOLUCIÓN A COTIZAR</span>
                  <span className="text-[10px] text-[#C5A059] font-semibold">
                    {allIncluded ? "Todo Incluido Activo" : `${selectedSixIds.length} de 5 seleccionadas`}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleToggleAllIncluded}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-extrabold transition flex items-center justify-between cursor-pointer border ${
                    allIncluded ? "bg-[#12100B] border-[#C5A059] text-white" : "bg-[#080B12] border-white/15 text-gray-300 hover:border-[#C5A059]/60 hover:text-white"
                  }`}
                >
                  <span>Paquete Completo (Todo Incluido)</span>
                  {allIncluded && <span className="w-2 h-2 rounded-full bg-[#FCF6BA]" />}
                </button>

                <div className="pt-1 space-y-1.5">
                  {SOLUTIONS_LIST.map((sol) => {
                    const isChecked = !allIncluded && selectedSixIds.includes(sol.id);
                    return (
                      <button
                        key={sol.id}
                        type="button"
                        disabled={allIncluded}
                        onClick={() => handleToggleIndividual(sol.id)}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-[11px] font-semibold transition flex items-center justify-between border ${
                          allIncluded
                            ? "bg-[#080B12]/40 border-white/5 text-gray-600 cursor-not-allowed opacity-50"
                            : isChecked
                            ? "bg-[#12100B] border-[#C5A059] text-white cursor-pointer"
                            : "bg-[#080B12] border-white/10 text-gray-300 hover:border-[#C5A059]/50 hover:text-white cursor-pointer"
                        }`}
                      >
                        <span className="truncate pr-2">{sol.shortLabel}</span>
                        {allIncluded ? (
                          <span className="text-[9px] text-gray-600 uppercase shrink-0">Incluida</span>
                        ) : isChecked ? (
                          <span className="w-2 h-2 rounded-full bg-[#FCF6BA] shrink-0" />
                        ) : (
                          <span className="w-2 h-2 rounded-full border border-white/25 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#050507] p-4 space-y-2.5">
                <span className="text-[11px] font-bold text-[#FCF6BA] uppercase tracking-wider block mb-2">3. ETAPA ACTUAL</span>
                {["Negocio en marcha buscando crecer", "Proyecto nuevo por lanzar", "Empresa consolidada / Alto volumen"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setSelectedStage(st)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold transition flex items-center justify-between cursor-pointer border ${
                      selectedStage === st ? "bg-[#12100B] border-[#C5A059] text-white" : "bg-[#080B12] border-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    <span>{st}</span>
                    {selectedStage === st && <span className="w-2 h-2 rounded-full bg-[#FCF6BA]" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-gray-300 leading-relaxed">
                <span className="text-[#FCF6BA] font-bold block mb-0.5">Configuración seleccionada para su empresa:</span>
                Propuesta personalizada para <strong className="text-white">{selectedCountry}</strong> · <strong className="text-[#FCF6BA]">{selectedSummaryText}</strong> · Etapa: <span className="text-gray-200">{selectedStage}</span>
              </div>
              <button
                type="button"
                onClick={() => onSelectSolution && onSelectSolution(selectedSummaryText)}
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#FCF6BA] to-[#B38728] text-[#050507] font-extrabold text-xs uppercase tracking-wider shrink-0 cursor-pointer shadow-lg hover:brightness-105 transition"
              >
                RECIBIR MI CATÁLOGO PRIVADO →
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
