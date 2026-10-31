"use client";

import { useState } from "react";
import AuditTriggerButton from "./AuditTriggerButton";

interface EnterpriseSolution {
  id: string;
  num: string;
  code: string;
  badge: string;
  title: string;
  shortDesc: string;
  statusBadge: string;
  metrics: Array<{ label: string; value: string }>;
  includedItems: string[];
  executionGuarantee: string;
  customOptions: string[];
  idealFor: string;
  crmBaseName: string;
  buttonText: string;
}

const ENTERPRISE_SOLUTIONS: EnterpriseSolution[] = [
  {
    id: "ENT-1",
    num: "01",
    code: "SYS-N8N-SELFHOST",
    badge: "ARQUITECTURA 01 · SOBERANÍA DE AUTOMATIZACIÓN",
    title: "AUTOMATIZACIÓN LIBRE DE COSTOS (Infraestructura n8n)",
    shortDesc:
      "Migramos su operación a n8n en servidores privados (Self-hosted). Eliminamos sus costos mensuales de herramientas de terceros y construimos un motor de procesos ilimitado.",
    statusBadge: "✦ Cero Costo por Operación · Ilimitado",
    metrics: [
      { label: "Límite de Ejecuciones", value: "Ilimitadas (∞)" },
      { label: "Ahorro en Licencias", value: "Hasta 85% Anual" },
      { label: "Latencia de Red", value: "< 35ms (VPS Propio)" }
    ],
    includedItems: [
      "Despliegue de instancia n8n dedicada en servidor privado (VPS / Cloud corporativo) bajo dominio propio.",
      "Eliminación definitiva de cobros por tarea, operación o ejecución mensual de plataformas externas.",
      "Migración íntegra y optimización de flujos existentes desde Make.com o Zapier sin interrupción operativa.",
      "Arquitectura con colas Redis y workers en paralelo para procesar miles de webhooks simultáneos sin caídas.",
      "Control total de credenciales, llaves API y registros de ejecución dentro de su propia infraestructura.",
      "Sistema automatizado de copias de seguridad (Backups diarios cifrados) y monitoreo de salud 24/7."
    ],
    executionGuarantee:
      "Infraestructura llave en mano: Entregamos el servidor privado configurado con certificado SSL, motor n8n en producción y todos sus embudos operando sin facturas por volumen.",
    customOptions: [
      "Despliegue n8n en Servidor Privado (VPS / Cloud Propio)",
      "Migración de flujos desde Make / Zapier (Cero límite de operaciones)",
      "Webhooks de alta frecuencia y colas Redis",
      "Monitoreo 24/7 y respaldo automatizado"
    ],
    idealFor:
      "Empresas con alto volumen de transacciones, agencias y organizaciones que desean escalar sus automatizaciones sin pagar penalizaciones por consumo mensual.",
    crmBaseName: "ENTERPRISE 01 (Infraestructura n8n Self-Hosted)",
    buttonText: "SOLICITAR INFRAESTRUCTURA N8N · AGENDAR AUDITORÍA"
  },
  {
    id: "ENT-2",
    num: "02",
    code: "SYS-RAG-PRIVATE",
    badge: "ARQUITECTURA 02 · INTELIGENCIA DOCUMENTAL BLINDADA",
    title: "AGENTES RAG (Memoria Institucional Privada)",
    shortDesc:
      "Cerebros de IA locales conectados a sus bases de datos, contratos y documentos internos. Privacidad absoluta para que su equipo consulte información corporativa en segundos.",
    statusBadge: "✦ Privacidad Absoluta · IA Institucional",
    metrics: [
      { label: "Precisión Documental", value: "99.4% Verificable" },
      { label: "Fuga de Datos", value: "0% (Aislado)" },
      { label: "Velocidad de Consulta", value: "< 1.2 Segundos" }
    ],
    includedItems: [
      "Indexación vectorial privada de contratos legales, manuales operativos, estados financieros, PDFs y bases de conocimiento.",
      "Respuestas exactas con citación directa de la fuente, página y cláusula del documento oficial consultado.",
      "Aislamiento criptográfico: sus datos corporativos jamás se utilizan para entrenar modelos públicos externos.",
      "Asistente interno disponible 24/7 para directivos, equipos legales, ventas, soporte y recursos humanos.",
      "Sincronización automática en tiempo real cuando se suben o actualizan nuevos archivos en las carpetas de la empresa.",
      "Control granular de permisos por jerarquía (Dirección General, Gerencia, Operaciones y Atención al Cliente)."
    ],
    executionGuarantee:
      "Despliegue blindado: Conectamos el cerebro RAG a su repositorio documental y aplicamos protocolos estrictos contra alucinaciones antes de habilitar el acceso a su equipo.",
    customOptions: [
      "Base de Datos Vectorial Privada (Contratos, PDFs y Manuales)",
      "Agente Interno de Consulta Instantánea para Equipos",
      "Cifrado End-to-End y Cero Entrenamiento Público",
      "Conexión en vivo con ERP / SQL / Google Drive"
    ],
    idealFor:
      "Firmas corporativas, clínicas, constructoras, estudios jurídicos y empresas que manejan información sensible y requieren respuestas internas instantáneas.",
    crmBaseName: "ENTERPRISE 02 (Agentes RAG Memoria Privada)",
    buttonText: "SOLICITAR AGENTE RAG PRIVADO · AGENDAR AUDITORÍA"
  },
  {
    id: "ENT-3",
    num: "03",
    code: "SYS-SAAS-CUSTOM",
    badge: "ARQUITECTURA 03 · ECOSISTEMA DE SOFTWARE PROPIO",
    title: "SAAS CORPORATIVO INTERNO",
    shortDesc:
      "Desarrollo de ecosistemas a medida. Unificamos sus operaciones en un panel de control centralizado, eliminando la dependencia de múltiples suscripciones ineficientes.",
    statusBadge: "✦ Ecosistema Propio · Llave en Mano",
    metrics: [
      { label: "Propiedad del Código", value: "100% Corporativa" },
      { label: "Centralización", value: "Panel Único Web/Móvil" },
      { label: "Escalabilidad", value: "Usuarios Ilimitados" }
    ],
    includedItems: [
      "Diseño y programación de su propia plataforma web ejecutiva con la identidad visual exclusiva de su empresa.",
      "Unificación de CRM comercial, control de proyectos, facturación, inventario y métricas en una sola pantalla.",
      "Eliminación de múltiples licencias mensuales dispersas (consolidación de 5 a 10 herramientas en un único núcleo).",
      "Creación de accesos diferenciados para socios, gerentes, operadores y portal de autogestión para sus clientes.",
      "Conexión bidireccional por API con sus agentes de IA, WhatsApp corporativo y servidores de automatización n8n.",
      "Rendimiento de grado bancario desplegado en bordes globales con carga instantánea en iPhone, Android y Desktop."
    ],
    executionGuarantee:
      "Ingeniería a medida: Construimos el software exacto que pide su operación para que su empresa sea dueña de su propia tecnología sin pagar alquiler por usuario.",
    customOptions: [
      "Dashboard Ejecutivo Centralizado (Operaciones y Finanzas)",
      "Portal Privado para Clientes y Empleados (Roles y Permisos)",
      "Reemplazo de múltiples suscripciones SaaS externas",
      "API Propia conectada a CRM y Agentes IA"
    ],
    idealFor:
      "Empresas en expansión que desean dejar de alquilar múltiples herramientas desconectadas y poseer su propio sistema operativo centralizado.",
    crmBaseName: "ENTERPRISE 03 (SaaS Corporativo Interno)",
    buttonText: "SOLICITAR SAAS CORPORATIVO · AGENDAR AUDITORÍA"
  }
];

export default function EnterpriseCatalog() {
  const [openId, setOpenId] = useState<string | null>("ENT-1");
  const [selectedModules, setSelectedModules] = useState<Record<string, string[]>>({
    "ENT-1": [
      "Despliegue n8n en Servidor Privado (VPS / Cloud Propio)",
      "Migración de flujos desde Make / Zapier (Cero límite de operaciones)"
    ],
    "ENT-2": [
      "Base de Datos Vectorial Privada (Contratos, PDFs y Manuales)",
      "Agente Interno de Consulta Instantánea para Equipos"
    ],
    "ENT-3": [
      "Dashboard Ejecutivo Centralizado (Operaciones y Finanzas)",
      "Reemplazo de múltiples suscripciones SaaS externas"
    ]
  });

  const [monthlySaaSSpend, setMonthlySaaSSpend] = useState<number>(850);
  const [teamMembers, setTeamMembers] = useState<number>(18);

  const annualRecoveredUSD = Math.round(monthlySaaSSpend * 12 * 0.82);
  const hoursRecoveredPerMonth = Math.round(teamMembers * 14);

  const toggleModule = (cardId: string, mod: string) => {
    setSelectedModules((prev) => {
      const current = prev[cardId] || [];
      if (current.includes(mod)) {
        const updated = current.filter((item) => item !== mod);
        return { ...prev, [cardId]: updated.length ? updated : [mod] };
      } else {
        return { ...prev, [cardId]: [...current, mod] };
      }
    });
  };

  return (
    <section className="px-6 pt-10 pb-28 md:px-16 lg:px-24 max-w-7xl mx-auto">
      <div className="mb-12 border-b border-white/10 pb-6 flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <span className="text-[11px] font-semibold text-[#C5A059] uppercase tracking-[0.16em] block mb-2">
            DIVISIÓN CORPORATIVA HIGH-TICKET · LHYOGROUP.COM
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
            INFRAESTRUCTURA ENTERPRISE
          </h2>
        </div>
        <span className="text-sm text-gray-300/90">
          Servidores privados, inteligencia artificial documental aislada y software corporativo propio
        </span>
      </div>

      <div className="grid grid-cols-1 gap-7">
        {ENTERPRISE_SOLUTIONS.map((item) => {
          const isOpen = openId === item.id;
          const userPicks = selectedModules[item.id] || [];
          const progressPercent = Math.max(
            25,
            Math.round((userPicks.length / item.customOptions.length) * 100)
          );
          const customPayload = `${item.crmBaseName} | Módulos: ${userPicks.join(" + ")}`;

          return (
            <article
              key={item.id}
              className={`rounded-2xl transition-all duration-300 p-7 md:p-10 ${
                isOpen
                  ? "bg-gradient-to-br from-[#0A1128]/90 via-[#070A14] to-[#050507] border border-[#C5A059]/55 shadow-[0_24px_60px_-15px_rgba(197,160,89,0.22)]"
                  : "bg-gradient-to-br from-[#0A1128]/45 via-[#060810] to-[#050507] border border-[#C5A059]/25 hover:border-[#C5A059]/50"
              }`}
            >
              <div
                onClick={() => setOpenId((prev) => (prev === item.id ? null : item.id))}
                className="cursor-pointer select-none"
              >
                <div className="flex flex-wrap justify-between items-center text-xs mb-5 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                    <span className="text-[#FCF6BA]/90 font-semibold tracking-[0.14em] uppercase text-[11px]">
                      {item.badge}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-[#FCF6BA] hover:text-white transition flex items-center gap-1.5 mt-2 sm:mt-0">
                    <span>{isOpen ? "Ocultar especificaciones" : "Ver alcance y configurar nodos"}</span>
                    <span className="text-[#C5A059] text-[10px]">{isOpen ? "▲" : "▼"}</span>
                  </span>
                </div>

                <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                  <div className="flex items-baseline gap-5">
                    <span className="hidden sm:inline-block text-3xl md:text-4xl font-light text-[#C5A059]/85 tracking-tighter shrink-0">
                      {item.num}
                    </span>
                    <div>
                      <h3 className="text-2xl md:text-[28px] font-semibold mb-2.5 text-white tracking-tight leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-sm md:text-[15px] text-gray-200 font-normal leading-relaxed max-w-3xl">
                        {item.shortDesc}
                      </p>
                    </div>
                  </div>
                  <div className="text-left md:text-right shrink-0">
                    <span className="text-xs font-medium text-[#FCF6BA] bg-[#C5A059]/15 border border-[#C5A059]/40 rounded-full px-4 py-2 inline-block">
                      {item.statusBadge}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-white/5">
                  {item.metrics.map((m, idx) => (
                    <div
                      key={idx}
                      className="px-4 py-2.5 rounded-xl bg-[#050507]/70 border border-white/5 flex items-center justify-between"
                    >
                      <span className="text-[11px] text-gray-400">{m.label}:</span>
                      <span className="text-xs font-semibold text-[#FCF6BA]">{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {isOpen && (
                <div className="mt-8 pt-8 border-t border-white/10">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
                    <div className="lg:col-span-7 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-semibold text-[#FCF6BA] uppercase tracking-[0.15em] mb-6">
                          Alcance de Ingeniería y Soberanía Tecnológica
                        </h4>
                        <ul className="space-y-4 mb-8">
                          {item.includedItems.map((mod, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-3.5 text-sm md:text-[15px] text-gray-200 font-normal leading-relaxed pb-3.5 border-b border-white/5 last:border-none"
                            >
                              <span className="text-[#C5A059] font-semibold text-sm mt-0.5 shrink-0">
                                ✦
                              </span>
                              <span>{mod}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-4 pt-5 border-t border-white/10">
                        <div className="seal-card-lhyo p-5 text-xs md:text-sm text-gray-200 leading-relaxed">
                          <strong className="text-[#FCF6BA] uppercase tracking-[0.12em] block mb-1 text-[11px] font-semibold">
                            Protocolo de Entrega Corporativa
                          </strong>
                          {item.executionGuarantee}
                        </div>
                        <div className="text-sm text-gray-300 leading-relaxed px-1">
                          <strong className="text-[#FCF6BA] font-semibold">Ideal para:</strong> {item.idealFor}
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-5 rounded-xl border border-[#C5A059]/40 bg-[#050507]/95 p-6 md:p-7 flex flex-col justify-between shadow-xl">
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs font-semibold text-[#FCF6BA] uppercase tracking-[0.12em]">
                            Configuración de Nodos
                          </span>
                          <span className="text-[11px] font-medium text-[#FCF6BA]/80">
                            {userPicks.length} de {item.customOptions.length} activos
                          </span>
                        </div>

                        <div className="w-full h-1 bg-white/10 rounded-full mb-5 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#C5A059] via-[#FCF6BA] to-[#B38728] transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>

                        <p className="text-sm text-gray-200 font-normal mb-4">
                          Seleccione los componentes a incluir en su despliegue:
                        </p>

                        <div className="space-y-2.5 mb-6">
                          {item.customOptions.map((option) => {
                            const isSelected = userPicks.includes(option);
                            return (
                              <button
                                key={option}
                                type="button"
                                onClick={() => toggleModule(item.id, option)}
                                className={`interactive-option-btn w-full text-left px-4 py-3 text-xs md:text-sm font-normal border flex items-center justify-between ${
                                  isSelected
                                    ? "bg-[#C5A059]/15 border-[#C5A059]/75 text-white"
                                    : "bg-[#0A1128]/40 border-white/10 text-gray-400 hover:border-[#C5A059]/40 hover:text-gray-200"
                                }`}
                              >
                                <span className="pr-2">{option}</span>
                                <span
                                  className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full shrink-0 ${
                                    isSelected
                                      ? "bg-[#C5A059] text-[#050507]"
                                      : "text-[#C5A059]/80"
                                  }`}
                                >
                                  {isSelected ? "Activo" : "+ Añadir"}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        <div className="text-xs text-gray-300 bg-[#0A1128]/70 p-4 rounded-lg border-l-2 border-[#C5A059] mb-6 leading-relaxed">
                          <strong className="text-[#FCF6BA] block mb-1 uppercase tracking-wider text-[10px] font-semibold">
                            Resumen técnico de solicitud:
                          </strong>
                          {customPayload}
                        </div>
                      </div>

                      <AuditTriggerButton
                        label={item.buttonText}
                        selectedPlan={customPayload}
                        fullWidth={true}
                      />
                    </div>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* SIMULADOR DE CAPITAL RECUPERADO (ELIMINACIÓN DE SUSCRIPCIONES EXTERNAS) */}
      <div className="mt-16 p-8 md:p-12 rounded-2xl bg-gradient-to-br from-[#0A1128] via-[#060913] to-[#050507] border border-[#C5A059]/50 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <span className="text-xs font-semibold text-[#FCF6BA] uppercase tracking-[0.16em] block mb-2">
              SIMULADOR FINANCIERO · SOBERANÍA TECNOLÓGICA
            </span>
            <h3 className="text-2xl md:text-3xl font-semibold text-white mb-3 tracking-tight">
              Calcule cuánto capital anual recupera su empresa al eliminar licencias de terceros
            </h3>
            <p className="text-sm text-gray-300 mb-6 leading-relaxed">
              Al migrar a un servidor privado <strong>n8n Self-Hosted</strong>, instalar un <strong>Agente RAG Local</strong> y unificar su operación en un <strong>SaaS Corporativo Interno</strong>, su organización elimina el pago perpetuo de múltiples suscripciones:
            </p>

            <div className="space-y-5 bg-[#050507]/90 p-6 rounded-2xl border border-white/10">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-gray-300 uppercase">
                    Gasto Mensual Actual en Herramientas / Automatización:
                  </span>
                  <span className="text-xl font-bold text-[#FCF6BA]">
                    ${monthlySaaSSpend.toLocaleString()} USD / mes
                  </span>
                </div>
                <input
                  type="range"
                  min={200}
                  max={5000}
                  step={50}
                  value={monthlySaaSSpend}
                  onChange={(e) => setMonthlySaaSSpend(Number(e.target.value))}
                  className="w-full accent-[#C5A059] cursor-pointer h-2 bg-[#0A1128] rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-gray-300 uppercase">
                    Tamaño de su Equipo Operativo:
                  </span>
                  <span className="text-xl font-bold text-white">
                    {teamMembers} Colaboradores
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={100}
                  step={5}
                  value={teamMembers}
                  onChange={(e) => setTeamMembers(Number(e.target.value))}
                  className="w-full accent-[#C5A059] cursor-pointer h-2 bg-[#0A1128] rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between bg-[#050507] border border-[#C5A059]/45 rounded-2xl p-6 md:p-8">
            <div>
              <span className="text-[10px] font-semibold text-[#C5A059] uppercase tracking-[0.18em] block mb-4">
                IMPACTO CORPORATIVO PROYECTADO
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-[#0A1128]/75 border border-[#C5A059]/30">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase block mb-1">
                    CAPITAL ANUAL RECUPERADO
                  </span>
                  <span className="text-2xl md:text-3xl font-bold text-[#FCF6BA]">
                    +${annualRecoveredUSD.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-gray-400 block mt-1">
                    USD ahorrados al año
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#0A1128]/75 border border-[#C5A059]/30">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase block mb-1">
                    HORAS EJECUTIVAS LIBERADAS
                  </span>
                  <span className="text-2xl md:text-3xl font-bold text-white">
                    +{hoursRecoveredPerMonth}h
                  </span>
                  <span className="text-[11px] text-gray-400 block mt-1">
                    Recuperadas cada mes
                  </span>
                </div>
              </div>
            </div>

            <AuditTriggerButton
              label="COTIZAR ECOSISTEMA ENTERPRISE COMPLETO →"
              selectedPlan={`ECOSISTEMA ENTERPRISE COMPLETO (n8n + Agente RAG + SaaS Interno) | Ahorro proyectado: $${annualRecoveredUSD} USD/año | Equipo: ${teamMembers} personas`}
              fullWidth={true}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
