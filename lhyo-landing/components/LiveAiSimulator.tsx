"use client";

import { useState } from "react";
import AuditTriggerButton from "./AuditTriggerButton";

interface SimulationScenario {
  id: string;
  label: string;
  clientMsg: string;
  aiReply: string;
  crmAction: string;
  latency: string;
}

const SCENARIOS: SimulationScenario[] = [
  {
    id: "SC-1",
    label: "01. Consulta de Precios a las 2:30 AM",
    clientMsg: "Hola, vi sus servicios en Instagram. ¿Qué costo tiene implementar el sistema en mi negocio?",
    aiReply: "¡Hola! Qué gusto saludarte. En Lhyo Group adaptamos cada solución según tu país y objetivos. ¿Me comentas en qué país operas y si buscas automatizar WhatsApp, tu página web o el paquete completo?",
    crmAction: "PROSPECTO REGISTRADO · ETIQUETA: INTERÉS COMERCIAL · RESPUESTA EN 0.4s",
    latency: "0.4s (Instantáneo 24/7)"
  },
  {
    id: "SC-2",
    label: "02. Agendamiento Automático de Cita",
    clientMsg: "Estoy en Uruguay y quiero el paquete completo. ¿Podemos tener una llamada mañana?",
    aiReply: "Excelente elección. Tengo disponible mañana a las 11:00 AM o a las 03:00 PM (hora Uruguay). Acabo de reservar tu espacio y enviarte a tu correo nuestro Catálogo Privado B2B junto con el enlace de Google Meet.",
    crmAction: "CITA BLOQUEADA EN CALENDARIO · DOSSIER PDF ENVIADO · ALERTA CEO DESPACHADA",
    latency: "0.6s (Sincronización Total)"
  },
  {
    id: "SC-3",
    label: "03. Clasificación Inteligente en CRM",
    clientMsg: "Perfecto, somos una clínica con 40 consultas diarias y buscamos organizar todo el seguimiento.",
    aiReply: "Entendido. He clasificado tu expediente con prioridad ejecutiva (VIP_QUALIFIED) para nuestra sesión. Nuestro director revisará tu caso con las métricas listas.",
    crmAction: "FILA CREADA EN CRM_OFICIAL_LHYO_GROUP · CLASIFICACIÓN: VIP_QUALIFIED",
    latency: "0.3s (Cero Intervención Humana)"
  }
];

export default function LiveAiSimulator() {
  const [activeScenario, setActiveScenario] = useState<SimulationScenario>(SCENARIOS[0]);
  const [dailyMessages, setDailyMessages] = useState<number>(35);

  const monthlyMessages = dailyMessages * 30;
  const hoursSavedPerMonth = Math.round((monthlyMessages * 4) / 60);
  const extraLeadsCaptured = Math.round(monthlyMessages * 0.28);

  return (
    <section className="px-6 py-24 md:px-16 lg:px-24 max-w-7xl mx-auto border-b border-[#1E293B]">
      <div className="mb-12">
        <div className="w-12 h-0.5 bg-[#BF953F] mb-4" />
        <span className="text-xs font-bold text-[#FCF6BA] uppercase tracking-widest block mb-2">
          EXPERIENCIA INTERACTIVA EN TIEMPO REAL
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
          Ponga a prueba nuestra tecnología antes de agendar
        </h2>
        <p className="text-sm md:text-base text-gray-300 max-w-3xl leading-relaxed">
          Descubra en vivo cómo responde un Asistente Inteligente de Lhyo Group y calcule cuánto tiempo y oportunidades comerciales puede recuperar su empresa cada mes:
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Simulador Interactivo de Conversación IA */}
        <div className="lg:col-span-7 luxury-service-card p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-6 border-b border-[#BF953F]/30">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#FCF6BA]">
                  SIMULADOR EN VIVO · AGENTE IA LHYO GROUP
                </span>
              </div>
              <span className="text-[11px] font-bold text-[#BF953F] bg-[#070707] px-3 py-1 border border-[#BF953F]/40">
                Velocidad: {activeScenario.latency}
              </span>
            </div>

            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Seleccione una situación real para ver cómo actúa el sistema:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-6">
              {SCENARIOS.map((sc) => {
                const isSelected = activeScenario.id === sc.id;
                return (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => setActiveScenario(sc)}
                    className={`text-left p-3 text-xs font-bold border transition ${
                      isSelected
                        ? "bg-gradient-to-r from-[#BF953F] to-[#B38728] text-[#070707] border-[#FCF6BA] shadow-md"
                        : "bg-[#070707] text-gray-300 border-[#1E293B] hover:border-[#BF953F]"
                    }`}
                  >
                    {sc.label}
                  </button>
                );
              })}
            </div>

            {/* Pantalla de Chat Simulado */}
            <div className="bg-[#050505] border border-[#1E293B] p-5 space-y-4 mb-6">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-gray-400 uppercase mb-1">
                  Cliente escribiendo a su negocio
                </span>
                <div className="bg-[#0B132B] border border-[#1E293B] text-gray-200 text-xs md:text-sm p-3.5 max-w-md leading-relaxed">
                  “{activeScenario.clientMsg}”
                </div>
              </div>

              <div className="flex flex-col items-start">
                <span className="text-[10px] font-bold text-[#BF953F] uppercase mb-1">
                  Respuesta inmediata de su Asistente Lhyo Group
                </span>
                <div className="bg-gradient-to-r from-[#BF953F]/20 via-[#090D16] to-[#090D16] border border-[#BF953F] text-white text-xs md:text-sm p-4 max-w-lg leading-relaxed shadow-lg">
                  {activeScenario.aiReply}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#090D16] border-l-2 border-[#BF953F] p-3.5 text-[11px] font-mono text-[#FCF6BA] tracking-wide">
            ⚡ ACCIÓN INTERNA AUTOMÁTICA: {activeScenario.crmAction}
          </div>
        </div>

        {/* Calculadora Interactiva de Impacto y Ahorro */}
        <div className="lg:col-span-5 luxury-vault-container p-6 md:p-8 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-[#FCF6BA] uppercase tracking-wider block mb-1">
              CALCULADORA DE IMPACTO OPERATIVO
            </span>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
              ¿Cuántas consultas recibe su negocio al día?
            </h3>

            <div className="bg-[#050505] border border-[#BF953F]/50 p-5 mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-gray-300 uppercase">
                  Mensajes diarios en WhatsApp / IG:
                </span>
                <span className="text-2xl font-extrabold text-[#FCF6BA]">
                  {dailyMessages} / día
                </span>
              </div>

              <input
                type="range"
                min={5}
                max={150}
                step={5}
                value={dailyMessages}
                onChange={(e) => setDailyMessages(Number(e.target.value))}
                className="w-full accent-[#BF953F] cursor-pointer h-2 bg-[#1E293B]"
              />

              <div className="flex justify-between text-[10px] text-gray-500 mt-1.5 font-bold">
                <span>5 al día</span>
                <span>75 al día</span>
                <span>150+ al día</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="seal-card-lhyo p-4">
                <span className="text-[10px] font-bold text-[#BF953F] uppercase block mb-1">
                  CONSULTAS ATENDIDAS AL MES
                </span>
                <span className="text-2xl md:text-3xl font-extrabold text-white">
                  {monthlyMessages.toLocaleString()}
                </span>
                <span className="text-[11px] text-gray-400 block mt-1">
                  100% respondidas en segundos
                </span>
              </div>

              <div className="seal-card-lhyo p-4">
                <span className="text-[10px] font-bold text-[#BF953F] uppercase block mb-1">
                  TIEMPO RECUPERADO AL MES
                </span>
                <span className="text-2xl md:text-3xl font-extrabold text-[#FCF6BA]">
                  +{hoursSavedPerMonth} hrs
                </span>
                <span className="text-[11px] text-gray-400 block mt-1">
                  Sin trabajo manual repetitivo
                </span>
              </div>
            </div>

            <div className="bg-[#090D16] border border-[#1E293B] p-4 mb-6 text-xs text-gray-300 leading-relaxed">
              Con <strong className="text-white">{dailyMessages} consultas diarias</strong>, la atención inmediata 24/7 evita la fuga de prospectos fuera de horario y recupera un estimado de <strong className="text-[#FCF6BA]">+{extraLeadsCaptured} oportunidades de venta adicionales cada mes</strong>.
            </div>
          </div>

          <AuditTriggerButton
            label="IMPLEMENTAR ESTE SISTEMA EN MI NEGOCIO →"
            selectedPlan={`SIMULADOR IA (${dailyMessages} consultas/día | +${hoursSavedPerMonth}h ahorradas/mes)`}
            fullWidth={true}
          />
        </div>
      </div>
    </section>
  );
}
