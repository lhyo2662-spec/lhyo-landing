"use client";

import { useState } from "react";
import AuditTriggerButton from "./AuditTriggerButton";

const ENTERPRISE_SOLUTIONS = [
  {
    id: "ENT-1",
    num: "01",
    badge: "ARQUITECTURA 01 · AUTOMATIZACIÓN PROPIA SIN MENSUALIDADES",
    title: "AUTOMATIZACIÓN LIBRE DE COSTOS (Infraestructura n8n)",
    shortDesc:
      "Migramos su operación a n8n en servidores privados (Self-hosted). Eliminamos sus costos mensuales de herramientas de terceros y construimos un motor de procesos ilimitado.",
    plainExplanation:
      "En palabras simples: En lugar de pagar mensualidades caras en otras plataformas cada vez que tu sistema envía un mensaje o registra un cliente, instalamos tu propio motor automático privado para que tengas operaciones ilimitadas a costo $0 por tarea.",
    statusBadge: "✦ Cero Costo por Operación · Ilimitado",
    metrics: [
      { label: "Límite de Tareas", value: "Ilimitadas (∞)" },
      { label: "Ahorro en Licencias", value: "Hasta 85% Anual" },
      { label: "Dueño del Sistema", value: "100% Tu Empresa" }
    ],
    includedItems: [
      "Instalación de tu propio motor de automatización n8n en un servidor privado exclusivo para tu empresa (sin depender de nadie).",
      "Eliminación definitiva de cobros mensuales por cada mensaje, tarea o cliente atendido en plataformas de terceros.",
      "Traslado completo y mejora de todas tus automatizaciones actuales sin detener ni un minuto el funcionamiento de tu negocio.",
      "Capacidad industrial para atender miles de mensajes, correos y registros al mismo tiempo sin colapsos ni demoras.",
      "Control total y privacidad absoluta de las contraseñas, contactos y movimientos de tu empresa.",
      "Copias de seguridad automáticas todos los días y vigilancia técnica 24/7 para que nunca deje de funcionar."
    ],
    executionGuarantee:
      "Entrega llave en mano: Configuramos tu servidor privado, trasladamos todos tus procesos y dejamos tu motor trabajando en automático sin facturas por volumen.",
    customOptions: [
      "Instalación de servidor privado n8n exclusivo para mi empresa",
      "Eliminar cobros mensuales por cantidad de tareas o mensajes",
      "Conectar WhatsApp, Correo, Calendario y CRM sin límites",
      "Respaldo diario automático y soporte técnico continuo"
    ],
    crmBaseName: "ENTERPRISE 01 (Infraestructura n8n Self-Hosted)",
    buttonText: "SOLICITAR INFRAESTRUCTURA N8N · AGENDAR AUDITORÍA"
  },
  {
    id: "ENT-2",
    num: "02",
    badge: "ARQUITECTURA 02 · CEREBRO INTELIGENTE CON LOS DOCUMENTOS DE TU EMPRESA",
    title: "AGENTES RAG (Memoria Institucional Privada)",
    shortDesc:
      "Cerebros de IA locales conectados a sus bases de datos, contratos y documentos internos. Privacidad absoluta para que su equipo consulte información corporativa en segundos.",
    plainExplanation:
      "En palabras simples: Es como tener un director experto con memoria fotográfica que se ha leído todos los contratos, listas de precios, PDFs y manuales de tu negocio, listo para responder cualquier duda a ti o a tu equipo en 1 segundo sin que tu información salga a internet.",
    statusBadge: "✦ Privacidad Absoluta · Memoria Exacta",
    metrics: [
      { label: "Exactitud de Respuesta", value: "99.4% Con Fuente" },
      { label: "Fuga de Información", value: "0% (100% Privado)" },
      { label: "Tiempo de Búsqueda", value: "Menos de 1 Segundo" }
    ],
    includedItems: [
      "Lectura y memorización inteligente de todos tus contratos, tarifarios, manuales, catálogos en PDF y hojas de Excel.",
      "Respuestas exactas en 1 segundo indicando exactamente en qué documento y en qué página está el dato.",
      "Máxima confidencialidad bancaria: los secretos y documentos de tu empresa están blindados y nadie externo puede verlos.",
      "Disponible las 24 horas para que tú, tus vendedores o tu equipo resuelvan dudas al instante sin buscar entre miles de carpetas.",
      "Actualización automática: cada vez que subes un archivo o precio nuevo, el cerebro lo aprende al instante.",
      "Niveles de acceso seguros: tú decides qué información puede consultar cada empleado y qué información es solo para el dueño."
    ],
    executionGuarantee:
      "Despliegue blindado: Conectamos el asistente privado a los documentos de tu empresa y verificamos que responda con exactitud milimétrica sin inventar jamás un dato.",
    customOptions: [
      "Conectar contratos, PDFs, listas de precios y manuales internos",
      "Asistente privado en vivo para el dueño y el equipo de trabajo",
      "Blindaje de privacidad (Cero salida de datos a internet público)",
      "Actualización automática al subir nuevos documentos o Excel"
    ],
    crmBaseName: "ENTERPRISE 02 (Agentes RAG Memoria Privada)",
    buttonText: "SOLICITAR AGENTE RAG PRIVADO · AGENDAR AUDITORÍA"
  },
  {
    id: "ENT-3",
    num: "03",
    badge: "ARQUITECTURA 03 · EL PROGRAMA OFICIAL DE TU EMPRESA TODO EN UNO",
    title: "SAAS CORPORATIVO INTERNO",
    shortDesc:
      "Desarrollo de ecosistemas a medida. Unificamos sus operaciones en un panel de control centralizado, eliminando la dependencia de múltiples suscripciones ineficientes.",
    plainExplanation:
      "En palabras simples: En vez de tener 6 programas distintos abiertos y pagar 6 suscripciones todos los meses, creamos el sistema privado de tu empresa con tu propio logo para que controles ventas, clientes, agenda y finanzas desde una sola pantalla en tu celular o computadora.",
    statusBadge: "✦ Tu Propio Software · Todo en 1 Panel",
    metrics: [
      { label: "Dueño del Programa", value: "100% Tu Marca" },
      { label: "Todo Conectado", value: "1 Sola Pantalla" },
      { label: "Límite de Usuarios", value: "Sin Cobro Extra" }
    ],
    includedItems: [
      "Creación de tu propia plataforma privada en internet con el nombre, los colores y el logo oficial de tu empresa.",
      "Todo tu negocio en una sola pantalla: control de ventas, lista de clientes (CRM), agenda de citas, pagos y resultados del mes.",
      "Ahorro inmediato al cancelar múltiples suscripciones mensuales de programas sueltos que no se comunican entre sí.",
      "Accesos personalizados para tu equipo de trabajo y un portal elegante para que tus clientes vean el avance de sus servicios.",
      "Conectado directamente con tu WhatsApp inteligente, tu calendario y tu base de datos en tiempo real.",
      "Diseño ultra rápido y fácil de usar desde cualquier iPhone, teléfono Android, tablet o computadora."
    ],
    executionGuarantee:
      "Ingeniería a medida: Construimos el sistema exacto que necesita tu negocio para que seas dueño de tu propia plataforma sin pagar alquiler mensual por cada empleado.",
    customOptions: [
      "Panel de control único para ver ventas, clientes y finanzas",
      "Accesos para mi equipo de trabajo y portal para mis clientes",
      "Unificar mis herramientas actuales para dejar de pagar varias mensualidades",
      "Diseño personalizado con el logo de mi empresa para celular y PC"
    ],
    crmBaseName: "ENTERPRISE 03 (SaaS Corporativo Interno)",
    buttonText: "SOLICITAR SAAS CORPORATIVO · AGENDAR AUDITORÍA"
  }
];

const RAG_SAMPLES = [
  {
    q: "“¿Cuál es la cláusula de garantía en nuestros contratos?”",
    doc: "Contrato_Marco_Corporativo_2026.pdf · Pág. 14",
    a: "Cláusula 8.2: Toda implementación cuenta con garantía técnica continua, respaldo diario cifrado y soporte prioritario con respuesta menor a 15 minutos."
  },
  {
    q: "“¿Cuál es el precio y margen del paquete corporativo?”",
    doc: "Matriz_Precios_Confidencial_Q4.xlsx · Hoja 1",
    a: "El retorno de inversión promedio se alcanza en los primeros 45 días al sustituir costos de licencias externas y horas manuales de atención."
  },
  {
    q: "“¿Qué pasos sigue el equipo cuando entra un cliente VIP?”",
    doc: "Manual_Operativo_Ventas_B2B.pdf · Pág. 4",
    a: "Protocolo VIP: 1) Clasificación automática en CRM, 2) Envío instantáneo de Catálogo Privado PDF, 3) Apertura de sala Google Meet para sesión ejecutiva."
  }
];

export default function EnterpriseCatalog() {
  const [stageTabs, setStageTabs] = useState<Record<string, string>>({
    "ENT-1": "demo",
    "ENT-2": "demo",
    "ENT-3": "demo"
  });
  const [n8nCompareMode, setN8nCompareMode] = useState<string>("lhyo");
  const [ragIdx, setRagIdx] = useState<number>(0);
  const [saasUnified, setSaasUnified] = useState<boolean>(true);

  const [selectedModules, setSelectedModules] = useState<Record<string, string[]>>({
    "ENT-1": [
      "Instalación de servidor privado n8n exclusivo para mi empresa",
      "Eliminar cobros mensuales por cantidad de tareas o mensajes"
    ],
    "ENT-2": [
      "Conectar contratos, PDFs, listas de precios y manuales internos",
      "Asistente privado en vivo para el dueño y el equipo de trabajo"
    ],
    "ENT-3": [
      "Panel de control único para ver ventas, clientes y finanzas",
      "Unificar mis herramientas actuales para dejar de pagar varias mensualidades"
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
          Interactúe con cada demostración para conocer cómo transformamos la operación de su empresa
        </span>
      </div>

      <div className="space-y-10">
        {ENTERPRISE_SOLUTIONS.map((item) => {
          const activeTab = stageTabs[item.id] || "demo";
          const userPicks = selectedModules[item.id] || [];
          const customPayload = `${item.crmBaseName} | Selección: ${userPicks.join(" + ")}`;

          return (
            <article
              key={item.id}
              className="rounded-3xl bg-gradient-to-br from-[#0A1128]/90 via-[#070A14] to-[#050507] border border-[#C5A059]/45 p-6 sm:p-8 md:p-10 shadow-2xl transition-all duration-300 hover:border-[#C5A059]/75"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#FCF6BA]">
                    {item.badge}
                  </span>
                </div>
                <span className="text-xs font-semibold text-[#FCF6BA] bg-[#C5A059]/15 border border-[#C5A059]/40 rounded-full px-4 py-1.5">
                  {item.statusBadge}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-7">
                <div className="lg:col-span-7">
                  <div className="flex items-baseline gap-4 mb-2">
                    <span className="text-3xl md:text-4xl font-light text-[#C5A059] tracking-tighter">
                      {item.num}
                    </span>
                    <h3 className="text-2xl md:text-[28px] font-semibold text-white tracking-tight leading-snug">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-sm md:text-[15px] text-gray-200 leading-relaxed mb-4">
                    {item.shortDesc}
                  </p>
                  <div className="p-4 rounded-2xl bg-[#0A1128]/90 border-l-2 border-[#C5A059] text-xs sm:text-sm text-gray-200 leading-relaxed">
                    <strong className="text-[#FCF6BA] font-semibold block mb-0.5">
                      ✦ ¿Qué significa esto para tu negocio?
                    </strong>
                    {item.plainExplanation}
                  </div>
                </div>

                <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2.5">
                  {item.metrics.map((m, idx) => (
                    <div
                      key={idx}
                      className="px-4 py-3 rounded-xl bg-[#050507]/85 border border-white/10 flex items-center justify-between"
                    >
                      <span className="text-xs text-gray-400">{m.label}</span>
                      <span className="text-xs sm:text-sm font-bold text-[#FCF6BA]">
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-white/10 mb-6">
                <div className="flex flex-wrap gap-2 bg-[#050507] p-1.5 rounded-2xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => setStageTabs((p) => ({ ...p, [item.id]: "demo" }))}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      activeTab === "demo"
                        ? "bg-[#C5A059] text-[#050507]"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    ▶ 1. Ver Demostración Interactiva
                  </button>
                  <button
                    type="button"
                    onClick={() => setStageTabs((p) => ({ ...p, [item.id]: "incluye" }))}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      activeTab === "incluye"
                        ? "bg-[#C5A059] text-[#050507]"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    ✦ 2. Todo lo que Incluye ({item.includedItems.length} puntos)
                  </button>
                  <button
                    type="button"
                    onClick={() => setStageTabs((p) => ({ ...p, [item.id]: "personalizar" }))}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      activeTab === "personalizar"
                        ? "bg-[#C5A059] text-[#050507]"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    ⚙ 3. Personalizar a Medida ({userPicks.length} activos)
                  </button>
                </div>

                <AuditTriggerButton
                  label={item.buttonText}
                  selectedPlan={customPayload}
                />
              </div>

              {activeTab === "demo" && item.id === "ENT-1" && (
                <div className="p-6 rounded-2xl bg-[#050507] border border-[#C5A059]/35">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
                    <span className="text-xs font-semibold text-[#FCF6BA]">
                      COMPARADOR INTERACTIVO EN VIVO:
                    </span>
                    <div className="flex rounded-full bg-[#0A1128] p-1 border border-white/10">
                      <button
                        type="button"
                        onClick={() => setN8nCompareMode("tradicional")}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          n8nCompareMode === "tradicional"
                            ? "bg-red-500/20 text-red-200"
                            : "text-gray-400"
                        }`}
                      >
                        Plataformas Alquiladas
                      </button>
                      <button
                        type="button"
                        onClick={() => setN8nCompareMode("lhyo")}
                        className={`px-3.5 py-1 rounded-full text-xs font-semibold ${
                          n8nCompareMode === "lhyo"
                            ? "bg-[#C5A059] text-[#050507]"
                            : "text-gray-400"
                        }`}
                      >
                        ✦ Tu Servidor Propio Lhyo Group
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
                    {[
                      "1. Cliente escribe en WhatsApp",
                      "2. Tu Servidor n8n procesa",
                      "3. Se guarda en tu CRM",
                      "4. Envía Catálogo + Meet"
                    ].map((step, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-[#0A1128]/90 border border-[#C5A059]/60 text-xs font-semibold text-white">
                        {step}
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-gray-200 p-3.5 rounded-xl bg-[#0A1128]/50 border border-white/10">
                    {n8nCompareMode === "lhyo"
                      ? "✓ Resultado en tu Servidor Propio Lhyo Group: Puedes procesar 10,000, 50,000 o 100,000 tareas al mes con $0.00 USD de cobro por operación."
                      : "⚠ Resultado en Plataformas Alquiladas: Cada mensaje o paso consume créditos y te obliga a pagar planes cada vez más caros mes tras mes."}
                  </div>
                </div>
              )}

              {activeTab === "demo" && item.id === "ENT-2" && (
                <div className="p-6 rounded-2xl bg-[#050507] border border-[#C5A059]/35">
                  <p className="text-xs font-semibold text-[#FCF6BA] mb-3">
                    TOCA UNA PREGUNTA PARA VER CÓMO RESPONDE EL CEREBRO PRIVADO LEYENDO TUS ARCHIVOS:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mb-4">
                    {RAG_SAMPLES.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setRagIdx(idx)}
                        className={`p-3 rounded-xl text-left text-xs font-semibold border transition ${
                          ragIdx === idx
                            ? "bg-[#C5A059] text-[#050507] border-[#FCF6BA]"
                            : "bg-[#0A1128]/60 text-gray-300 border-white/10"
                        }`}
                      >
                        {s.q}
                      </button>
                    ))}
                  </div>
                  <div className="p-4 rounded-xl bg-[#0A1128]/85 border border-[#C5A059]/45">
                    <div className="text-[11px] text-[#FCF6BA] font-semibold mb-1">
                      📄 Fuente encontrada en 0.4s: {RAG_SAMPLES[ragIdx].doc}
                    </div>
                    <p className="text-xs sm:text-sm text-white">{RAG_SAMPLES[ragIdx].a}</p>
                  </div>
                </div>
              )}

              {activeTab === "demo" && item.id === "ENT-3" && (
                <div className="p-6 rounded-2xl bg-[#050507] border border-[#C5A059]/35">
                  <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
                    <span className="text-xs font-semibold text-[#FCF6BA]">
                      MIRA CÓMO SE UNIFICA TODA TU EMPRESA EN 1 SOLO LUGAR:
                    </span>
                    <button
                      type="button"
                      onClick={() => setSaasUnified((v) => !v)}
                      className="px-4 py-1.5 rounded-full bg-[#C5A059] text-[#050507] text-xs font-bold"
                    >
                      {saasUnified ? "Ver Antes (6 Programas Sueltos)" : "✦ Unificar en 1 Panel"}
                    </button>
                  </div>
                  {!saasUnified ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-gray-300">
                      {[
                        "CRM Externo ($99/mes)",
                        "Agenda Externa ($29/mes)",
                        "Chat Externo ($79/mes)",
                        "Hojas de Excel Sueltas",
                        "Facturación ($65/mes)",
                        "Reportes ($49/mes)"
                      ].map((a, i) => (
                        <div key={i} className="p-3 rounded-xl bg-red-950/25 border border-red-400/30">
                          {a}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-[#0A1128] border border-[#C5A059]/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                      <div className="p-3 rounded-lg bg-[#050507]">
                        <span className="text-[10px] text-gray-400 block">VENTAS Y CRM</span>
                        <span className="text-xs font-bold text-white">Integrado</span>
                      </div>
                      <div className="p-3 rounded-lg bg-[#050507]">
                        <span className="text-[10px] text-gray-400 block">AGENDA</span>
                        <span className="text-xs font-bold text-[#FCF6BA]">Sincronizada</span>
                      </div>
                      <div className="p-3 rounded-lg bg-[#050507]">
                        <span className="text-[10px] text-gray-400 block">WHATSAPP IA</span>
                        <span className="text-xs font-bold text-white">Activo 24/7</span>
                      </div>
                      <div className="p-3 rounded-lg bg-[#050507]">
                        <span className="text-[10px] text-gray-400 block">USUARIOS</span>
                        <span className="text-xs font-bold text-[#FCF6BA]">Ilimitados</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "incluye" && (
                <div className="p-6 rounded-2xl bg-[#050507] border border-[#C5A059]/35">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-4">
                    {item.includedItems.map((spec, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-[#0A1128]/55 border border-white/10 flex items-start gap-3 text-xs sm:text-sm text-gray-200 leading-relaxed"
                      >
                        <span className="text-[#C5A059] font-bold">✦</span>
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 rounded-xl bg-[#0A1128]/90 border border-[#C5A059]/35 text-xs text-gray-200">
                    <strong className="text-[#FCF6BA] uppercase block mb-0.5">
                      Garantía de Entrega Llave en Mano:
                    </strong>
                    {item.executionGuarantee}
                  </div>
                </div>
              )}

              {activeTab === "personalizar" && (
                <div className="p-6 rounded-2xl bg-[#050507] border border-[#C5A059]/35">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {item.customOptions.map((option) => {
                      const isSelected = userPicks.includes(option);
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => toggleModule(item.id, option)}
                          className={`rounded-xl text-left px-4 py-3 text-xs sm:text-sm border transition flex items-center justify-between ${
                            isSelected
                              ? "bg-[#C5A059]/15 border-[#C5A059] text-white"
                              : "bg-[#0A1128]/40 border-white/10 text-gray-400"
                          }`}
                        >
                          <span className="pr-2">{option}</span>
                          <span className="text-[11px] font-semibold text-[#FCF6BA]">
                            {isSelected ? "✓ Incluido" : "+ Añadir"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* CALCULADORA INTERACTIVA DE AHORRO ANUAL */}
      <div className="mt-14 p-8 md:p-10 rounded-3xl bg-gradient-to-br from-[#0A1128] via-[#060913] to-[#050507] border border-[#C5A059]/50 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <span className="text-xs font-semibold text-[#FCF6BA] uppercase tracking-[0.16em] block mb-2">
              CALCULADORA INTERACTIVA DE AHORRO EMPRESARIAL
            </span>
            <h3 className="text-2xl md:text-3xl font-semibold text-white mb-2.5 tracking-tight">
              ¿Cuánto dinero recupera tu negocio al dejar de alquilar programas externos?
            </h3>
            <div className="space-y-4 bg-[#050507]/90 p-5 rounded-2xl border border-white/10 mt-4">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-semibold text-gray-300">
                    Gasto mensual actual en programas y suscripciones:
                  </span>
                  <span className="text-lg font-bold text-[#FCF6BA]">
                    ${monthlySaaSSpend.toLocaleString()} USD / mes
                  </span>
                </div>
                <input
                  type="range"
                  min={150}
                  max={5000}
                  step={50}
                  value={monthlySaaSSpend}
                  onChange={(e) => setMonthlySaaSSpend(Number(e.target.value))}
                  className="w-full accent-[#C5A059] cursor-pointer"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-semibold text-gray-300">
                    Personas en tu equipo de trabajo:
                  </span>
                  <span className="text-lg font-bold text-white">{teamMembers} Personas</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={100}
                  step={2}
                  value={teamMembers}
                  onChange={(e) => setTeamMembers(Number(e.target.value))}
                  className="w-full accent-[#C5A059] cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#050507] border border-[#C5A059]/45 rounded-2xl p-6 flex flex-col justify-between">
            <div className="grid grid-cols-2 gap-3.5 mb-5">
              <div className="p-4 rounded-xl bg-[#0A1128]/75 border border-[#C5A059]/30">
                <span className="text-[10px] font-semibold text-gray-400 uppercase block mb-1">
                  AHORRO ANUAL ESTIMADO
                </span>
                <span className="text-2xl font-bold text-[#FCF6BA]">
                  +${annualRecoveredUSD.toLocaleString()}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-[#0A1128]/75 border border-[#C5A059]/30">
                <span className="text-[10px] font-semibold text-gray-400 uppercase block mb-1">
                  TIEMPO RECUPERADO
                </span>
                <span className="text-2xl font-bold text-white">+{hoursRecoveredPerMonth} hrs/mes</span>
              </div>
            </div>

            <AuditTriggerButton
              label="SOLICITAR PAQUETE ENTERPRISE COMPLETO →"
              selectedPlan={`ECOSISTEMA ENTERPRISE COMPLETO (n8n + Agente RAG + SaaS Interno) | Ahorro proyectado: $${annualRecoveredUSD} USD/año`}
              fullWidth={true}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
