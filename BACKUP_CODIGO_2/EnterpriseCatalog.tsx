"use client";

import { useState } from "react";
import AuditTriggerButton from "./AuditTriggerButton";

const ENTERPRISE_SOLUTIONS = [
  {
    id: "ENT-1",
    num: "04",
    badge: "SOLUCIÓN 04 · DUEÑO TOTAL DE TU AUTOMATIZACIÓN",
    title: "Motor Automático Propio (Sin Pagar Mensualidades a Terceros)",
    shortDesc:
      "Deja de pagar alquiler mensual por cada mensaje o tarea. Instalamos el motor automático privado de tu empresa (tecnología n8n en servidor propio) para que todo tu negocio funcione sin límites.",
    plainExplanation:
      "¿Por qué te conviene? Las plataformas comunes te cobran cada vez que tu sistema trabaja. Nosotros te instalamos tu propio motor privado para que atiendas 1,000 o 100,000 clientes sin pagar ni un centavo extra por operación.",
    statusBadge: "✦ Cero Costo por Tarea · Uso Ilimitado",
    metrics: [
      { label: "Capacidad de Trabajo", value: "Ilimitada (∞)" },
      { label: "Ahorro en Alquileres", value: "Hasta 85% Anual" },
      { label: "Dueño del Motor", value: "100% Tu Empresa" }
    ],
    includedItems: [
      "Instalación de tu propio motor automático privado (arquitectura n8n Self-Hosted) exclusivo para tu negocio.",
      "Eliminación definitiva de cobros mensuales por cada mensaje, correo o cliente registrado.",
      "Traslado completo y mejora de tus procesos actuales sin detener ni un minuto la atención de tu empresa.",
      "Capacidad para procesar miles de clientes simultáneos al instante sin bloqueos ni límites.",
      "Privacidad total: todas tus contraseñas, contactos y movimientos quedan dentro de tu propio servidor.",
      "Copias de seguridad automáticas todos los días y supervisión técnica 24/7."
    ],
    executionGuarantee:
      "Entrega llave en mano: Configuramos tu servidor privado, conectamos tus canales y te entregamos tu motor funcionando sin facturas por consumo.",
    customOptions: [
      "Tener mi propio servidor automático exclusivo para mi empresa",
      "Eliminar los cobros mensuales por cantidad de mensajes o tareas",
      "Conectar mi WhatsApp, Correo, Calendario y CRM sin límites",
      "Respaldo diario automático y soporte técnico continuo"
    ],
    crmBaseName: "SOLUCIÓN 04 · Motor Automático Propio (n8n Self-Hosted)",
    buttonText: "QUIERO MI PROPIO MOTOR AUTOMÁTICO · AGENDAR"
  },
  {
    id: "ENT-2",
    num: "05",
    badge: "SOLUCIÓN 05 · INTELIGENCIA CON MEMORIA FOTOGRÁFICA DE TU NEGOCIO",
    title: "Cerebro Privado con la Memoria de tu Empresa (IA Interna)",
    shortDesc:
      "Imagina un asistente experto que se ha leído todos tus contratos, precios, manuales y documentos, listo para responder cualquier pregunta a ti o a tu equipo en 1 segundo y en total secreto.",
    plainExplanation:
      "¿Por qué te conviene? En lugar de que tú o tus empleados pierdan horas buscando un dato entre cientos de carpetas o PDFs, le preguntas al Cerebro Privado de tu empresa y te da la respuesta exacta con página y cláusula al instante.",
    statusBadge: "✦ Secreto Total · Respuesta en 1 Segundo",
    metrics: [
      { label: "Precisión al Responder", value: "99.4% Exacta" },
      { label: "Seguridad de tus Datos", value: "100% Blindada" },
      { label: "Velocidad de Búsqueda", value: "Menos de 1 Segundo" }
    ],
    includedItems: [
      "Conexión de tu propio cerebro de Inteligencia Artificial (tecnología RAG privada) a tus contratos, listas de precios, PDFs y hojas de Excel.",
      "Respuestas inmediatas indicando exactamente en qué archivo y en qué página se encuentra la información.",
      "Privacidad bancaria absoluta: tus documentos jamás salen a internet público ni nadie externo puede verlos.",
      "Disponible 24/7 para que el dueño, gerentes o vendedores resuelvan dudas internas en segundos.",
      "Aprendizaje instantáneo: cada vez que agregas un documento o precio nuevo, el sistema lo memoriza en el acto.",
      "Control por niveles: tú eliges qué archivos puede consultar cada miembro de tu equipo."
    ],
    executionGuarantee:
      "Despliegue blindado: Entrenamos el cerebro privado con tus documentos reales y garantizamos que responda únicamente con datos exactos de tu empresa.",
    customOptions: [
      "Conectar mis contratos, PDFs, listas de precios y manuales internos",
      "Buscador inteligente privado para mí y mi equipo de trabajo",
      "Blindaje de seguridad (Cero salida de datos a internet público)",
      "Aprendizaje automático cuando subo nuevos archivos o Excel"
    ],
    crmBaseName: "SOLUCIÓN 05 · Cerebro Privado con Memoria de Empresa (Agente RAG)",
    buttonText: "QUIERO MI CEREBRO PRIVADO IA · AGENDAR"
  },
  {
    id: "ENT-3",
    num: "06",
    badge: "SOLUCIÓN 06 · TODA TU EMPRESA EN UNA SOLA PANTALLA",
    title: "Tu Propio Programa y Panel Todo-en-Uno (Software a Medida)",
    shortDesc:
      "Deja de abrir 6 programas distintos y pagar múltiples suscripciones mensuales. Creamos la plataforma oficial de tu empresa con tu logo para que controles ventas, clientes, agenda y finanzas en un solo lugar.",
    plainExplanation:
      "¿Por qué te conviene? En vez de alquilar varios programas sueltos que no se entienden entre sí, construimos el sistema propio de tu negocio a tu gusto para que veas todo desde tu celular o computadora con un solo clic.",
    statusBadge: "✦ Tu Propia Plataforma · Todo en 1 Lugar",
    metrics: [
      { label: "Dueño del Sistema", value: "100% Tu Marca" },
      { label: "Control de tu Negocio", value: "1 Sola Pantalla" },
      { label: "Miembros de tu Equipo", value: "Sin Cobro Extra" }
    ],
    includedItems: [
      "Desarrollo de tu propio programa privado en internet con el nombre, colores y logo oficial de tu negocio.",
      "Unificación total: clientes (CRM), agenda de citas, ventas del mes, pagos y métricas en una sola pantalla clara.",
      "Ahorro inmediato al cancelar varias suscripciones mensuales de herramientas externas innecesarias.",
      "Accesos elegantes para tus empleados y un espacio privado para que tus clientes consulten sus servicios.",
      "Conectado en vivo con tu asistente de WhatsApp 24/7, tu calendario y tu motor automático.",
      "Funciona con máxima velocidad y comodidad desde cualquier iPhone, Android, tablet o computadora."
    ],
    executionGuarantee:
      "Hecho a tu medida: Diseñamos y programamos el panel exacto que necesita tu operación para que seas dueño de tu propia tecnología para siempre.",
    customOptions: [
      "Panel único para controlar ventas, clientes, agenda y finanzas",
      "Accesos para mi equipo de trabajo y portal para mis clientes",
      "Reemplazar varios programas alquilados por uno solo propio",
      "Diseño de lujo con el logo de mi empresa para celular y PC"
    ],
    crmBaseName: "SOLUCIÓN 06 · Programa Propio Todo-en-Uno (SaaS Corporativo)",
    buttonText: "QUIERO MI PROPIO PROGRAMA TODO-EN-UNO · AGENDAR"
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
      "Tener mi propio servidor automático exclusivo para mi empresa",
      "Eliminar los cobros mensuales por cantidad de mensajes o tareas"
    ],
    "ENT-2": [
      "Conectar mis contratos, PDFs, listas de precios y manuales internos",
      "Buscador inteligente privado para mí y mi equipo de trabajo"
    ],
    "ENT-3": [
      "Panel único para controlar ventas, clientes, agenda y finanzas",
      "Reemplazar varios programas alquilados por uno solo propio"
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
            SOLUCIONES 04, 05 Y 06 · INDEPENDENCIA Y PODER TOTAL PARA TU NEGOCIO
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
            Sistemas Propios de Alta Gama
          </h2>
        </div>
        <span className="text-sm text-gray-300/90">
          Sé dueño de tu propio motor automático, tu propio cerebro IA y tu propio programa Todo-en-Uno
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
                      ✦ Explicado de forma simple:
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
                    ▶ 1. Probar Demostración Interactiva
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
                    ✦ 2. Qué Incluye Exactamente ({item.includedItems.length} puntos)
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
                      COMPARA TU MOTOR PROPIO VS PLATAFORMAS ALQUILADAS:
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
                        ✦ Tu Motor Propio Lhyo Group
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
                    {[
                      "1. Cliente escribe en WhatsApp",
                      "2. Tu Motor Privado procesa",
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
                      ? "✓ En tu Motor Propio Lhyo Group: Puedes atender 10,000, 50,000 o 100,000 clientes al mes con $0.00 USD de cobro por tarea."
                      : "⚠ En Plataformas Alquiladas: Cada paso consume créditos y te obliga a pagar mensualidades cada vez más caras."}
                  </div>
                </div>
              )}

              {activeTab === "demo" && item.id === "ENT-2" && (
                <div className="p-6 rounded-2xl bg-[#050507] border border-[#C5A059]/35">
                  <p className="text-xs font-semibold text-[#FCF6BA] mb-3">
                    TOCA UNA PREGUNTA PARA VER CÓMO RESPONDE EL CEREBRO PRIVADO DE TU NEGOCIO:
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
                      📄 Archivo encontrado en 0.4s: {RAG_SAMPLES[ragIdx].doc}
                    </div>
                    <p className="text-xs sm:text-sm text-white">{RAG_SAMPLES[ragIdx].a}</p>
                  </div>
                </div>
              )}

              {activeTab === "demo" && item.id === "ENT-3" && (
                <div className="p-6 rounded-2xl bg-[#050507] border border-[#C5A059]/35">
                  <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
                    <span className="text-xs font-semibold text-[#FCF6BA]">
                      MIRA CÓMO SE UNE TODA TU EMPRESA EN 1 PANTALLA:
                    </span>
                    <button
                      type="button"
                      onClick={() => setSaasUnified((v) => !v)}
                      className="px-4 py-1.5 rounded-full bg-[#C5A059] text-[#050507] text-xs font-bold"
                    >
                      {saasUnified ? "Ver Antes (6 Programas Sueltos)" : "✦ Unir Todo en 1 Panel"}
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
                        <span className="text-[10px] text-gray-400 block">MI EQUIPO</span>
                        <span className="text-xs font-bold text-[#FCF6BA]">Sin Cobro Extra</span>
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
              label="SOLICITAR MIS SISTEMAS PROPIOS AHORA →"
              selectedPlan={`PAQUETE COMPLETO DE SISTEMAS PROPIOS (Motor Propio + Cerebro IA + Programa Todo-en-Uno) | Ahorro proyectado: $${annualRecoveredUSD} USD/año`}
              fullWidth={true}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
