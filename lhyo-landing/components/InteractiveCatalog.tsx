"use client";

import { useState } from "react";
import AuditTriggerButton from "./AuditTriggerButton";

const SYSTEMS_DATA = [
  {
    id: "PLAN-1",
    num: "01",
    badge: "SERVICIO 01 · ATENCIÓN Y VENTAS AUTOMATIZADAS",
    title: "Asistentes Inteligentes para WhatsApp e Instagram (24/7)",
    shortDesc:
      "Atienda a cada cliente de forma inmediata sin importar la hora. Implementamos asistentes inteligentes entrenados a la medida de su empresa para responder consultas, brindar información precisa y agendar reuniones comerciales automáticamente.",
    plainExplanation:
      "En palabras simples: Si un cliente te escribe un domingo a las 11:00 PM preguntando precios, tu asistente le responde en menos de 1 segundo como tu mejor vendedor, le aclara sus dudas y te deja la cita agendada para el día siguiente.",
    benefitTag: "Respuesta inmediata 24/7",
    metrics: [
      { label: "Velocidad de Respuesta", value: "0.4 Segundos" },
      { label: "Horario de Atención", value: "24/7 los 365 Días" },
      { label: "Citas Agendadas", value: "100% Automáticas" }
    ],
    includedItems: [
      "Atención continua las 24 horas del día, los 7 días de la semana, sin tiempos de espera.",
      "Comunicación fluida, ejecutiva y alineada con la identidad comercial de su negocio.",
      "Identificación automática de las necesidades e intereses de cada cliente potencial.",
      "Agendamiento directo de citas y reuniones comerciales en su calendario.",
      "Registro ordenado de cada contacto para un control comercial impecable.",
      "Entrenamiento personalizado con su catálogo de servicios, preguntas frecuentes y políticas."
    ],
    executionGuarantee:
      "Entrega llave en mano: Nuestro equipo configura, entrena y deja el asistente operando directamente en sus canales oficiales con soporte continuo.",
    customOptions: [
      "Automatizar la atención en WhatsApp",
      "Automatizar las respuestas en Instagram",
      "Agendamiento automático de citas en calendario",
      "Cualificación previa de clientes potenciales"
    ],
    crmBaseName: "PLAN 1 (Asistente WhatsApp/IG 24/7)",
    buttonText: "SOLICITAR ESTE SERVICIO · AGENDAR REUNIÓN"
  },
  {
    id: "PLAN-2",
    num: "02",
    badge: "SERVICIO 02 · PRESENCIA DIGITAL CORPORATIVA",
    title: "Páginas Web Modernas y Catálogos Digitales",
    shortDesc:
      "Proyecte una imagen sólida, confiable y de alto nivel. Desarrollamos plataformas web rápidas, elegantes e intuitivas que presentan sus servicios con claridad y facilitan el contacto directo con sus clientes.",
    plainExplanation:
      "En palabras simples: Construimos tu vitrina digital de lujo (igual de rápida, interactiva y elegante que esta misma página que estás usando ahora) para que cuando un cliente busque tu negocio sienta confianza total y te contrate en un clic.",
    benefitTag: "Imagen ejecutiva y alta conversión",
    metrics: [
      { label: "Tiempo de Carga", value: "< 0.8 Segundos" },
      { label: "Adaptación Móvil", value: "100% iPhone/Android/PC" },
      { label: "Posicionamiento", value: "SEO Google Incluido" }
    ],
    includedItems: [
      "Diseño corporativo de alta gama que transmite autoridad y confianza desde el primer instante.",
      "Navegación fluida y velocidad de carga superior en teléfonos móviles y computadoras.",
      "Presentación estructurada y dinámica de todos sus servicios o líneas de negocio.",
      "Integración directa con su calendario de reservas y canales de atención en WhatsApp.",
      "Estructura optimizada para destacar su marca en los motores de búsqueda de internet.",
      "Panel interactivo donde sus visitantes pueden personalizar su solicitud antes de agendar."
    ],
    executionGuarantee:
      "Desarrollo integral: Nos encargamos de la estructura visual, programación completa, publicación en servidores de alta velocidad y conexión con su agenda.",
    customOptions: [
      "Desarrollo de página web corporativa desde cero",
      "Renovación y modernización de sitio web actual",
      "Integración de catálogo dinámico de servicios",
      "Sistema de agendamiento directo en la web"
    ],
    crmBaseName: "PLAN 2 (Página Web Corporativa)",
    buttonText: "SOLICITAR PÁGINA WEB · AGENDAR REUNIÓN"
  },
  {
    id: "PLAN-3",
    num: "03",
    badge: "SERVICIO 03 · GESTIÓN Y CONTROL COMERCIAL",
    title: "Organización Automática de Clientes y Ventas (CRM)",
    shortDesc:
      "Centralice toda la información de su negocio en un solo lugar. Conectamos sus canales de contacto y su agenda a un sistema inteligente que registra, ordena y clasifica cada oportunidad comercial sin trabajo manual.",
    plainExplanation:
      "En palabras simples: Olvídate de anotar clientes en papel o perder chats importantes. Cada persona interesada queda guardada y ordenada sola en tu tabla de control con su nombre, correo, presupuesto y qué servicio quiere comprar.",
    benefitTag: "Control total de su cartera de clientes",
    metrics: [
      { label: "Trabajo Manual", value: "0 Minutos (Automático)" },
      { label: "Clasificación", value: "Por Presupuesto / VIP" },
      { label: "Notificaciones", value: "Al Instante a tu Correo" }
    ],
    includedItems: [
      "Captura y registro automático de los datos de cada nuevo prospecto o cliente.",
      "Clasificación inteligente de contactos según su prioridad y volumen comercial.",
      "Eliminación de tareas operativas repetitivas para ahorrar horas de gestión semanal.",
      "Panel de control estructurado y accesible desde cualquier teléfono o computadora.",
      "Seguimiento comercial organizado para maximizar el cierre de oportunidades.",
      "Historial detallado del servicio exacto que cada cliente seleccionó antes de la reunión."
    ],
    executionGuarantee:
      "Sincronización total: Dejamos conectada su agenda, sus formularios y su base de datos para que cada nuevo contacto se clasifique en tiempo real.",
    customOptions: [
      "Centralización automática de clientes en CRM",
      "Clasificación de prospectos por nivel de prioridad",
      "Sincronización entre calendario y base de datos",
      "Automatización del flujo de seguimiento comercial"
    ],
    crmBaseName: "PLAN 3 (Organización y Automatización CRM)",
    buttonText: "SOLICITAR AUTOMATIZACIÓN · AGENDAR REUNIÓN"
  }
];

const WA_FLOWS = [
  {
    title: "1. Consulta de Precio",
    user: "Hola, ¿qué precio tiene el servicio y cómo puedo agendar?",
    bot: "¡Hola! Qué gusto saludarte. Te comparto nuestras opciones según tu objetivo y puedo agendarte una sesión ahora mismo. ¿Prefieres mañana a las 11:00 AM o a las 03:00 PM?",
    tag: "Respondido en 0.4 segundos · 24/7"
  },
  {
    title: "2. Cierre de Cita",
    user: "Me queda perfecto mañana a las 11:00 AM.",
    bot: "¡Listo! Tu cita quedó reservada para mañana a las 11:00 AM. Ya envié a tu correo nuestro Catálogo Privado PDF y el enlace de videollamada.",
    tag: "Cita bloqueada + Correo enviado automáticamente"
  }
];

const CRM_SAMPLE_LEADS = [
  {
    name: "Dra. Valeria Gómez (Clínica Dental)",
    budget: "$12,000 USD/mes",
    tier: "VIP_QUALIFIED",
    service: "Asistente WhatsApp 24/7 + Agenda Automática",
    action: "Guardado en Fila #1 · Catálogo PDF enviado · Cita creada en Google Meet"
  },
  {
    name: "Estudio Jurídico Mendoza & Asoc.",
    budget: "$25,000 USD/mes",
    tier: "VIP_ENTERPRISE",
    service: "Página Web de Lujo + Agente RAG de Contratos",
    action: "Guardado en Fila #2 · Alerta prioritaria enviada al CEO · Sala Meet activa"
  }
];

const FULL_PACKAGE_LABEL = "Paquete Completo (Todo Incluido)";

export default function InteractiveCatalog() {
  const [stageTabs, setStageTabs] = useState<Record<string, string>>({
    "PLAN-1": "demo",
    "PLAN-2": "demo",
    "PLAN-3": "demo"
  });
  const [waStep, setWaStep] = useState<number>(0);
  const [webMode, setWebMode] = useState<string>("lhyo");
  const [crmLeadIdx, setCrmLeadIdx] = useState<number>(0);

  const [selectedFeatures, setSelectedFeatures] = useState<Record<string, string[]>>({
    "PLAN-1": ["Automatizar la atención en WhatsApp", "Agendamiento automático de citas en calendario"],
    "PLAN-2": ["Desarrollo de página web corporativa desde cero", "Integración de catálogo dinámico de servicios"],
    "PLAN-3": ["Centralización automática de clientes en CRM", "Clasificación de prospectos por nivel de prioridad"]
  });

  const [privCountry, setPrivCountry] = useState<string>("Uruguay");
  const [privInterests, setPrivInterests] = useState<string[]>([FULL_PACKAGE_LABEL]);
  const [privStage, setPrivStage] = useState<string>("Negocio en marcha buscando crecer");

  const toggleFeature = (planId: string, feature: string) => {
    setSelectedFeatures((prev) => {
      const current = prev[planId] || [];
      if (current.includes(feature)) {
        const updated = current.filter((f) => f !== feature);
        return { ...prev, [planId]: updated.length ? updated : [feature] };
      } else {
        return { ...prev, [planId]: [...current, feature] };
      }
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
    <div>
      <div className="space-y-10">
        {SYSTEMS_DATA.map((item) => {
          const activeTab = stageTabs[item.id] || "demo";
          const userPicks = selectedFeatures[item.id] || [];
          const customPlanPayload = `${item.crmBaseName} | Selección: ${userPicks.join(" + ")}`;

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
                  ✦ {item.benefitTag}
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
                      ✦ ¿Cómo te ayuda esto en el día a día?
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
                    ▶ 1. Ver Demostración en Vivo
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
                    ⚙ 3. Personalizar ({userPicks.length} activos)
                  </button>
                </div>

                <AuditTriggerButton
                  label={item.buttonText}
                  selectedPlan={customPlanPayload}
                />
              </div>

              {activeTab === "demo" && item.id === "PLAN-1" && (
                <div className="p-6 rounded-2xl bg-[#050507] border border-[#C5A059]/35">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-white/10">
                    <span className="text-xs font-semibold text-[#FCF6BA]">
                      PRUEBA EN VIVO CÓMO ATIENDE Y AGENDA TU ASISTENTE 24/7:
                    </span>
                    <div className="flex gap-2">
                      {WA_FLOWS.map((f, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setWaStep(i)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                            waStep === i
                              ? "bg-[#C5A059] text-[#050507]"
                              : "bg-[#0A1128] text-gray-300 border border-white/10"
                          }`}
                        >
                          {f.title}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3 bg-[#0A1128]/50 p-4 rounded-xl border border-white/10">
                    <div className="flex justify-end">
                      <div className="bg-[#050507] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-gray-200 max-w-md">
                        Cliente: “{WA_FLOWS[waStep].user}”
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-[#0A1128] border border-[#C5A059] rounded-xl px-4 py-3 text-xs text-white max-w-lg">
                        <span className="text-[10px] font-bold text-[#FCF6BA] block mb-1">
                          ✦ TU ASISTENTE LHYO GROUP ({WA_FLOWS[waStep].tag})
                        </span>
                        {WA_FLOWS[waStep].bot}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "demo" && item.id === "PLAN-2" && (
                <div className="p-6 rounded-2xl bg-[#050507] border border-[#C5A059]/35">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-white/10">
                    <span className="text-xs font-semibold text-[#FCF6BA]">
                      COMPARA LA DIFERENCIA DE IMAGEN Y VELOCIDAD:
                    </span>
                    <div className="flex rounded-full bg-[#0A1128] p-1 border border-white/10">
                      <button
                        type="button"
                        onClick={() => setWebMode("antigua")}
                        className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer ${
                          webMode === "antigua" ? "bg-red-500/20 text-red-200" : "text-gray-400"
                        }`}
                      >
                        Página Tradicional Lenta
                      </button>
                      <button
                        type="button"
                        onClick={() => setWebMode("lhyo")}
                        className={`px-3.5 py-1 rounded-full text-xs font-semibold cursor-pointer ${
                          webMode === "lhyo" ? "bg-[#C5A059] text-[#050507]" : "text-gray-400"
                        }`}
                      >
                        ✦ Plataforma Lhyo Group
                      </button>
                    </div>
                  </div>
                  {webMode === "antigua" ? (
                    <div className="p-4 rounded-xl bg-red-950/20 border border-red-400/30 text-xs text-gray-300">
                      ✗ Página común o antigua: Tarda más de 5 segundos en abrir en celulares, satura con textos largos que nadie lee y el visitante se va sin agendar.
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-[#0A1128]/85 border border-[#C5A059]/50 text-xs text-gray-200">
                      ✓ Tu Plataforma Interactiva Lhyo Group: Abre al instante en iPhone, Android y PC, cautiva al visitante con demostraciones interactivas y convierte visitas en citas agendadas.
                    </div>
                  )}
                </div>
              )}

              {activeTab === "demo" && item.id === "PLAN-3" && (
                <div className="p-6 rounded-2xl bg-[#050507] border border-[#C5A059]/35">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-white/10">
                    <span className="text-xs font-semibold text-[#FCF6BA]">
                      SIMULA CÓMO SE ORDENA CADA CLIENTE EN TU CRM AUTOMÁTICO:
                    </span>
                    <div className="flex gap-2">
                      {CRM_SAMPLE_LEADS.map((l, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCrmLeadIdx(idx)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer ${
                            crmLeadIdx === idx
                              ? "bg-[#C5A059] text-[#050507]"
                              : "bg-[#0A1128] text-gray-300 border border-white/10"
                          }`}
                        >
                          Simular Cliente #{idx + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#0A1128]/80 border border-[#C5A059]/50 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-gray-400 block">CLIENTE REGISTRADO</span>
                      <strong className="text-white">{CRM_SAMPLE_LEADS[crmLeadIdx].name}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 block">FACTURACIÓN / PRIORIDAD</span>
                      <strong className="text-[#FCF6BA]">
                        {CRM_SAMPLE_LEADS[crmLeadIdx].budget} ({CRM_SAMPLE_LEADS[crmLeadIdx].tier})
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 block">SERVICIO ELEGIDO</span>
                      <strong className="text-white">{CRM_SAMPLE_LEADS[crmLeadIdx].service}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 block">ESTADO AUTOMÁTICO</span>
                      <strong className="text-emerald-400">{CRM_SAMPLE_LEADS[crmLeadIdx].action}</strong>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "incluye" && (
                <div className="p-6 rounded-2xl bg-[#050507] border border-[#C5A059]/35">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-4">
                    {item.includedItems.map((mod, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-[#0A1128]/55 border border-white/10 flex items-start gap-3 text-xs sm:text-sm text-gray-200 leading-relaxed"
                      >
                        <span className="text-[#C5A059] font-bold">✦</span>
                        <span>{mod}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 rounded-xl bg-[#0A1128]/90 border border-[#C5A059]/35 text-xs text-gray-200">
                    <strong className="text-[#FCF6BA] uppercase block mb-0.5">
                      Modalidad de Implementación y Soporte:
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
                          onClick={() => toggleFeature(item.id, option)}
                          className={`rounded-xl text-left px-4 py-3 text-xs sm:text-sm border transition flex items-center justify-between cursor-pointer ${
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

      {/* BÓVEDA INTERACTIVA DE CATÁLOGO PRIVADO */}
      <div className="mt-16 p-8 md:p-12 luxury-vault-container">
        <div className="max-w-3xl mb-10">
          <span className="text-xs font-semibold text-[#FCF6BA] uppercase tracking-[0.16em] block mb-2">
            PROPUESTA ECONÓMICA Y PLANES SEGÚN SU MERCADO
          </span>
          <h3 className="text-2xl md:text-4xl font-semibold text-white mb-4 tracking-tight">
            ¿Deseas recibir nuestro Catálogo Privado con los precios para tu país?
          </h3>
          <p className="text-sm md:text-[15px] text-gray-300 font-normal leading-relaxed">
            Seleccione sus preferencias a continuación para preparar su Catálogo Privado previo a nuestra reunión:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 items-stretch">
          <div className="vault-step-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <label className="text-xs font-semibold text-[#FCF6BA] uppercase tracking-wider">
                  1. País de Operación
                </label>
                <span className="text-[10px] font-medium text-[#C5A059]">Paso 01</span>
              </div>
              <div className="space-y-2.5">
                {["Latinoamérica", "Europa", "Estados Unidos / Norteamérica", "Otra Región / Global"].map((pais) => {
                  const active = privCountry === pais;
                  return (
                    <button
                      key={pais}
                      type="button"
                      onClick={() => setPrivCountry(pais)}
                      className={`interactive-option-btn w-full text-left px-4 py-3 text-xs md:text-sm border flex justify-between items-center ${
                        active
                          ? "border-[#C5A059] bg-[#C5A059]/15 text-white font-medium"
                          : "border-white/10 bg-white/[0.02] text-gray-400"
                      }`}
                    >
                      <span>{pais}</span>
                      <span className={`text-xs ${active ? "text-[#FCF6BA]" : "text-transparent"}`}>●</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="vault-step-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <label className="text-xs font-semibold text-[#FCF6BA] uppercase tracking-wider">
                  2. Solución a Cotizar
                </label>
                <span className="text-[10px] font-medium text-[#C5A059]">Paso 02</span>
              </div>
              <div className="space-y-2.5">
                {[
                  FULL_PACKAGE_LABEL,
                  "Infraestructura Enterprise (n8n / RAG / SaaS)",
                  "Asistente de WhatsApp / IG 24/7",
                  "Página Web Moderna",
                  "Organización de Clientes (CRM)"
                ].map((interes) => {
                  const isSelected = privInterests.includes(interes);
                  return (
                    <button
                      key={interes}
                      type="button"
                      onClick={() => handlePrivInterestToggle(interes)}
                      className={`interactive-option-btn w-full text-left px-4 py-2.5 text-xs md:text-sm border flex justify-between items-center ${
                        isSelected
                          ? "border-[#C5A059] bg-[#C5A059]/15 text-white font-medium"
                          : "border-white/10 bg-white/[0.02] text-gray-400"
                      }`}
                    >
                      <span className="pr-2">{interes}</span>
                      <span className={`text-xs ${isSelected ? "text-[#FCF6BA]" : "text-transparent"}`}>●</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="vault-step-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <label className="text-xs font-semibold text-[#FCF6BA] uppercase tracking-wider">
                  3. Etapa Actual
                </label>
                <span className="text-[10px] font-medium text-[#C5A059]">Paso 03</span>
              </div>
              <div className="space-y-2.5">
                {[
                  "Negocio en marcha buscando crecer",
                  "Proyecto nuevo por lanzar",
                  "Empresa consolidada / Alto volumen"
                ].map((etapa) => {
                  const active = privStage === etapa;
                  return (
                    <button
                      key={etapa}
                      type="button"
                      onClick={() => setPrivStage(etapa)}
                      className={`interactive-option-btn w-full text-left px-4 py-3 text-xs md:text-sm border flex justify-between items-center ${
                        active
                          ? "border-[#C5A059] bg-[#C5A059]/15 text-white font-medium"
                          : "border-white/10 bg-white/[0.02] text-gray-400"
                      }`}
                    >
                      <span className="pr-2">{etapa}</span>
                      <span className={`text-xs ${active ? "text-[#FCF6BA]" : "text-transparent"}`}>●</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 pt-6 border-t border-white/10">
          <div className="text-xs md:text-sm text-gray-300 leading-relaxed">
            <strong className="text-[#FCF6BA] uppercase tracking-wider text-[11px] font-semibold block mb-1">
              Configuración lista para enviar a su correo:
            </strong>
            {privateCatalogSummary}
          </div>
          <div className="shrink-0">
            <AuditTriggerButton
              label="SOLICITAR MI CATÁLOGO PRIVADO Y AGENDAR"
              selectedPlan={privateCatalogSummary}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
