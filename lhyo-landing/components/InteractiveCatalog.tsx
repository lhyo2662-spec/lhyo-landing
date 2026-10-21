"use client";

import { useState } from "react";
import AuditTriggerButton from "./AuditTriggerButton";

interface SystemPlan {
  id: string;
  tag: string;
  title: string;
  shortDesc: string;
  metrics: string;
  architecture: string;
  modules: string[];
  idealFor: string;
}

const SYSTEMS_DATA: SystemPlan[] = [
  {
    id: "SYS-01",
    tag: "AUTOMATIZACIÓN & IA",
    title: "Agentes de IA y Atención Autónoma 24/7",
    shortDesc: "Sistemas conversacionales avanzados en WhatsApp, Instagram y Web que cualifican prospectos, responden dudas y agendan citas automáticamente sin intervención humana.",
    metrics: "DISPONIBILIDAD: 24/7 | RESPUESTA: <2 SEG",
    architecture: "Motor LLM con System Prompt Blindado + API Oficial WhatsApp/Meta + Sincronización de Calendario en Tiempo Real.",
    modules: [
      "Arquitectura conversacional con reglas estrictas (Cero alucinaciones).",
      "Filtro automático de presupuesto y necesidad antes de agendar.",
      "Integración directa con WhatsApp Business API, Instagram DM y Webchat.",
      "Derivación inteligente a humano solo para prospectos High-Ticket cualificados.",
      "Panel de registro automático de cada conversación en tu base de datos CRM."
    ],
    idealFor: "Empresas con flujo constante de mensajes que pierden ventas por demoras en la atención o seguimiento manual."
  },
  {
    id: "SYS-02",
    tag: "ARQUITECTURA DE CONVERSIÓN",
    title: "Ecosistemas Web y Landing Pages de Élite",
    shortDesc: "Desarrollo de plataformas web ultra-rápidas con estética suiza en Negro Obsidiana, diseñadas específicamente para captar clientes y proyectar autoridad absoluta.",
    metrics: "CARGA: <1.2s | OPTIMIZACIÓN: SEO TÉCNICO",
    architecture: "Next.js 14 Server Components + Despliegue en Red Global Edge + Geometría Suiza de Alta Conversión.",
    modules: [
      "Diseño estructural Suizo en Negro Obsidiana (#070707) y Azul Marino (#0B132B).",
      "Programación a medida en código puro (Sin plantillas lentas de WordPress).",
      "Sistema de agendamiento interactivo integrado directamente en la página.",
      "Catálogo interactivo de servicios con embudo de pre-cualificación.",
      "Optimización de SEO Técnico y datos estructurados JSON-LD para buscadores."
    ],
    idealFor: "Negocios B2B, consultoras, clínicas y firmas de servicios que necesitan proyectar prestigio institucional y convertir visitas en citas."
  },
  {
    id: "SYS-03",
    tag: "ECOSISTEMAS DE DATOS & CRM",
    title: "Automatización de Procesos y Tuberías B2B",
    shortDesc: "Conexión total de tu negocio mediante Make.com, Webhooks y bases de datos para que cada cliente registrado dispare alertas, contratos y seguimientos en piloto automático.",
    metrics: "INTEGRACIÓN: API REST | ERRORES: 0%",
    architecture: "Webhooks Bidireccionales + Routers Condicionales en Make.com + Base de Datos Centralizada CRM.",
    modules: [
      "Construcción de tuberías invisibles entre tus formularios, calendario y CRM.",
      "Router condicional que clasifica automáticamente a los clientes según su facturación.",
      "Alertas instantáneas al equipo comercial cuando entra un prospecto VIP.",
      "Generación automática de bases de datos limpias en Google Sheets, Airtable o HubSpot.",
      "Eliminación del 90% de tareas manuales repetitivas de carga de datos."
    ],
    idealFor: "Operaciones en crecimiento que manejan múltiples herramientas desconectadas y necesitan control total de sus leads."
  }
];

export default function InteractiveCatalog() {
  const [openId, setOpenId] = useState<string | null>("SYS-01");

  const togglePlan = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {SYSTEMS_DATA.map((item) => {
        const isOpen = openId === item.id;
        return (
          <article
            key={item.id}
            className="swiss-card p-8 transition-all duration-200"
          >
            <div
              onClick={() => togglePlan(item.id)}
              className="cursor-pointer select-none"
            >
              <div className="flex flex-wrap justify-between items-center text-xs font-mono text-gray-400 mb-4 pb-4 border-b border-[#1E293B]">
                <div className="flex items-center gap-4">
                  <span className="text-white font-bold">ID: {item.id}</span>
                  <span className="text-[#BF953F]">[{item.tag}]</span>
                </div>
                <span className="text-[#BF953F] font-bold tracking-wider mt-2 sm:mt-0">
                  {isOpen ? "[ - OCULTAR ESPECIFICACIONES ]" : "[ + CLIC PARA VER QUÉ INCLUYE ESTE PLAN ]"}
                </span>
              </div>

              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed max-w-3xl">
                    {item.shortDesc}
                  </p>
                </div>
                <div className="text-left md:text-right shrink-0">
                  <span className="text-[11px] font-mono text-[#BF953F] border border-[#1E293B] bg-[#070707] px-3 py-2 inline-block">
                    {item.metrics}
                  </span>
                </div>
              </div>
            </div>

            {isOpen && (
              <div className="mt-8 pt-8 border-t border-[#1E293B] bg-[#070707] p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <div className="text-xs font-mono text-[#BF953F] uppercase tracking-widest mb-4">
                      {"// ENTREGABLES E INFRAESTRUCTURA INCLUIDA EN EL PLAN"}
                    </div>
                    <ul className="space-y-3 mb-6">
                      {item.modules.map((mod, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                          <span className="text-[#BF953F] font-mono font-bold">0{idx + 1}.</span>
                          <span>{mod}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="text-xs font-mono text-gray-400 border-t border-[#1E293B] pt-4">
                      <strong className="text-white">ARQUITECTURA BASE:</strong> {item.architecture}
                    </div>
                  </div>

                  <div className="border border-[#1E293B] bg-[#0B132B]/60 p-6 flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] font-mono text-[#BF953F] uppercase mb-2">
                        PERFIL DE IMPLEMENTACIÓN
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed mb-6">
                        {item.idealFor}
                      </p>
                      <div className="text-[11px] font-mono text-gray-400 bg-[#070707] p-3 border border-[#1E293B] mb-6">
                        NOTA CORPORATIVA: Las tarifas de implementación y mantenimiento se entregan mediante Catálogo Privado tras evaluar el alcance y país de operación en la auditoría.
                      </div>
                    </div>
                    <div>
                      <AuditTriggerButton
                        label={`COTIZAR ${item.id} EN AUDITORÍA`}
                        serviceTag={`plan_${item.id}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
