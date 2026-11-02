"use client";

import { useState } from "react";
import AuditTriggerButton from "./AuditTriggerButton";

export interface SimpleSolutionItem {
  id: string;
  group: "comercial" | "propios";
  num: string;
  shortTabTitle: string;
  badge: string;
  title: string;
  curiosityHook: string;
  shortDesc: string;
  plainExplanation: string;
  benefitTag: string;
  metrics: Array<{ label: string; value: string }>;
  includedItems: string[];
  executionGuarantee: string;
  customOptions: string[];
  crmBaseName: string;
  buttonText: string;
}

export const ALL_SOLUTIONS_DATA: SimpleSolutionItem[] = [
  {
    id: "SOL-1",
    group: "comercial",
    num: "01",
    shortTabTitle: "01 · Atención 24/7 en WhatsApp e IG",
    badge: "SOLUCIÓN 01 · ATENCIÓN Y CONVERSIÓN INMEDIATA",
    title: "Asistentes Inteligentes para WhatsApp e Instagram (24/7)",
    curiosityHook: "¿Qué ocurre si un cliente escribe un domingo a las 2:00 AM? Descubra cómo respondemos en menos de 1 segundo y agendamos su cita.",
    shortDesc:
      "Atienda a cada cliente de forma inmediata sin importar la hora. Creamos un asistente inteligente entrenado con la información de su negocio que responde preguntas, guía al cliente y agenda citas automáticamente.",
    plainExplanation:
      "En resumen ejecutivo: Cuando un cliente potencial escribe a su WhatsApp o Instagram solicitando información fuera de horario, su asistente le responde al instante con precisión y deja la reunión agendada en su calendario.",
    benefitTag: "Respuesta inmediata las 24 horas",
    metrics: [
      { label: "Velocidad al responder", value: "Menos de 1 segundo" },
      { label: "Horario de atención", value: "24 horas · 365 días" },
      { label: "Citas en su agenda", value: "100% Automáticas" }
    ],
    includedItems: [
      "Atención continua las 24 horas del día, los 7 días de la semana, sin dejar a ningún cliente esperando.",
      "Respuestas naturales, ejecutivas y alineadas con la identidad exacta de su empresa.",
      "Identificación de las necesidades de cada prospecto antes de agendar su reunión.",
      "Reserva directa de citas en su calendario sin intervención manual.",
      "Registro automático del nombre, teléfono y requerimiento de cada interesado.",
      "Entrenamiento completo con sus tarifas, servicios, horarios y preguntas frecuentes."
    ],
    executionGuarantee:
      "Configuramos, entrenamos y dejamos su asistente operando directamente en sus canales oficiales de WhatsApp e Instagram con respaldo continuo.",
    customOptions: [
      "Responder mensajes en WhatsApp las 24 horas",
      "Responder mensajes y comentarios en Instagram",
      "Agendar citas automáticamente en mi calendario",
      "Calificar el interés del cliente antes de agendar"
    ],
    crmBaseName: "SOLUCIÓN 01 · Asistente WhatsApp e Instagram 24/7",
    buttonText: "SOLICITAR ESTE ASISTENTE 24/7 · AGENDAR"
  },
  {
    id: "SOL-2",
    group: "comercial",
    num: "02",
    shortTabTitle: "02 · Plataformas Web y Catálogos de Lujo",
    badge: "SOLUCIÓN 02 · PRESENCIA DIGITAL DE MÁXIMO PRESTIGIO",
    title: "Plataformas Web Modernas y Catálogos Interactivos",
    curiosityHook: "¿Por qué los clientes abandonan las páginas convencionales tan rápido? Descubra cómo una experiencia interactiva proyecta liderazgo inmediato.",
    shortDesc:
      "Proyecte una imagen impecable y de máximo prestigio en su sector. Desarrollamos plataformas rápidas, elegantes y 100% adaptadas a la esencia de su empresa para convertir visitantes en clientes.",
    plainExplanation:
      "En resumen ejecutivo: Diseñamos y construimos una plataforma única, veloz e impresionante con la identidad de su marca para que cada visitante perciba autoridad absoluta y decida contratarle al instante.",
    benefitTag: "Presencia de lujo y alta conversión",
    metrics: [
      { label: "Velocidad al abrir", value: "Menos de 1 segundo" },
      { label: "Diseño exclusivo", value: "100% Alta Gama" },
      { label: "Posicionamiento", value: "Optimizado para Google" }
    ],
    includedItems: [
      "Diseño corporativo de alta gama que transmite solidez y confianza desde el primer segundo.",
      "Rendimiento ultrarrápido tanto en teléfonos móviles (iPhone y Android) como en computadoras.",
      "Módulos interactivos para que sus clientes exploren sus servicios de forma ágil y atractiva.",
      "Integración directa con su WhatsApp corporativo y su calendario ejecutivo de reservas.",
      "Estructura técnica optimizada para destacar su empresa en los motores de búsqueda (Google).",
      "Catálogo corporativo descargable en PDF personalizado con el nombre de cada prospecto."
    ],
    executionGuarantee:
      "Diseñamos, programamos y publicamos su plataforma en servidores de alta velocidad, lista para convertir visitantes en clientes desde el primer día.",
    customOptions: [
      "Desarrollar mi plataforma web moderna desde cero",
      "Renovar y elevar el nivel de mi sitio web actual",
      "Incluir un catálogo interactivo de mis servicios",
      "Incluir sistema de reserva de citas en línea"
    ],
    crmBaseName: "SOLUCIÓN 02 · Plataforma Web Moderna y Catálogo Digital",
    buttonText: "SOLICITAR MI PLATAFORMA WEB · AGENDAR"
  },
  {
    id: "SOL-3",
    group: "comercial",
    num: "03",
    shortTabTitle: "03 · Control Automático de Clientes (CRM)",
    badge: "SOLUCIÓN 03 · CONTROL COMERCIAL AUTOMATIZADO",
    title: "Organización Automática de Clientes y Ventas (CRM)",
    curiosityHook: "¿Cuántas oportunidades se pierden por falta de seguimiento? Vea cómo cada prospecto queda registrado y clasificado en tiempo real.",
    shortDesc:
      "Tenga toda su operación comercial ordenada en un solo lugar. Cada persona que consulta o agenda queda registrada automáticamente con su nombre, contacto, presupuesto y el servicio de su interés.",
    plainExplanation:
      "En resumen ejecutivo: Elimine el registro manual en hojas sueltas o chats dispersos. El sistema organiza a cada cliente automáticamente, destaca a los prospectos prioritarios y le notifica al instante.",
    benefitTag: "Orden ejecutivo sin carga manual",
    metrics: [
      { label: "Registro manual", value: "0 Minutos" },
      { label: "Clasificación", value: "Por Prioridad e Interés" },
      { label: "Notificación", value: "En 1 Segundo" }
    ],
    includedItems: [
      "Captura y registro automático de los datos de cada nuevo cliente potencial.",
      "Clasificación inteligente de prospectos según su volumen comercial y prioridad.",
      "Ahorro de horas semanales al eliminar tareas administrativas repetitivas.",
      "Panel de control claro y accesible desde cualquier teléfono o computadora.",
      "Envío automático de confirmación de cita con enlace de videollamada al cliente.",
      "Historial exacto de la solución que cada cliente seleccionó antes de la reunión."
    ],
    executionGuarantee:
      "Enlazamos su plataforma, su calendario y su base de datos comercial para que cada oportunidad quede registrada y clasificada en tiempo real.",
    customOptions: [
      "Registrar todos mis clientes en una base automática",
      "Clasificar automáticamente a los clientes prioritarios",
      "Enviar confirmaciones automáticas de reunión por correo",
      "Recibir alertas instantáneas de nuevos clientes"
    ],
    crmBaseName: "SOLUCIÓN 03 · Organización Automática de Clientes (CRM)",
    buttonText: "SOLICITAR CONTROL AUTOMÁTICO CRM · AGENDAR"
  },
  {
    id: "SOL-4",
    group: "propios",
    num: "04",
    shortTabTitle: "04 · Motor Propio Libre de Costos",
    badge: "SOLUCIÓN 04 · SOBERANÍA DE AUTOMATIZACIÓN (N8N)",
    title: "Automatización Libre de Costos (Servidor Privado Propio)",
    curiosityHook: "¿Por qué pagar tarifas mensuales crecientes por cada tarea cuando su empresa puede ser dueña de su propio motor ilimitado?",
    shortDesc:
      "Migramos su operación a n8n en servidores privados (Self-hosted). Eliminamos sus costos mensuales de herramientas de terceros y construimos un motor de procesos ilimitado.",
    plainExplanation:
      "En resumen ejecutivo: En lugar de pagar costosas suscripciones externas que aumentan con cada mensaje o tarea, instalamos el motor automático privado de su empresa para operar sin límites.",
    benefitTag: "Cero costo por operación · Ilimitado",
    metrics: [
      { label: "Operaciones y flujos", value: "Ilimitados (∞)" },
      { label: "Ahorro en licencias", value: "Hasta 85% Anual" },
      { label: "Propiedad del motor", value: "100% Su Empresa" }
    ],
    includedItems: [
      "Despliegue de su propio motor de automatización n8n en un servidor privado exclusivo para su empresa.",
      "Eliminación definitiva de cobros mensuales por volumen de mensajes, tareas o ejecuciones.",
      "Migración íntegra de sus flujos actuales sin interrumpir ni un minuto su operación.",
      "Capacidad de alto rendimiento para procesar miles de solicitudes simultáneas sin latencia.",
      "Soberanía absoluta: todas sus credenciales, contactos y procesos permanecen en su servidor.",
      "Copias de seguridad automatizadas diariamente y monitoreo técnico continuo 24/7."
    ],
    executionGuarantee:
      "Entregamos su servidor privado configurado, seguro y conectado a todos sus canales para operar sin límites ni cargos por volumen.",
    customOptions: [
      "Instalar mi propio servidor privado de automatización (n8n)",
      "Eliminar cobros mensuales por volumen de operaciones",
      "Conectar WhatsApp, Correo, Agenda y CRM sin límites",
      "Respaldo diario cifrado y monitoreo continuo 24/7"
    ],
    crmBaseName: "SOLUCIÓN 04 · Automatización Libre de Costos (n8n Self-Hosted)",
    buttonText: "SOLICITAR MOTOR PROPIO N8N · AGENDAR"
  },
  {
    id: "SOL-5",
    group: "propios",
    num: "05",
    shortTabTitle: "05 · Agentes IA con Memoria Privada",
    badge: "SOLUCIÓN 05 · INTELIGENCIA DOCUMENTAL PRIVADA (RAG)",
    title: "Agentes RAG (Memoria Institucional Privada)",
    curiosityHook: "Imagine consultar cualquier contrato, tarifario o documento interno de su empresa y recibir la respuesta exacta en 1 segundo.",
    shortDesc:
      "Cerebros de IA locales conectados a sus bases de datos, contratos y documentos internos. Privacidad absoluta para que su equipo consulte información corporativa en segundos.",
    plainExplanation:
      "En resumen ejecutivo: En lugar de perder horas buscando datos entre cientos de carpetas o archivos PDF, su equipo consulta en privado al Cerebro de su empresa y obtiene el dato exacto con página y cláusula al instante.",
    benefitTag: "Privacidad absoluta · Consulta en 1s",
    metrics: [
      { label: "Precisión documental", value: "99.4% Verificable" },
      { label: "Privacidad de datos", value: "100% Aislada" },
      { label: "Velocidad de consulta", value: "Menos de 1 segundo" }
    ],
    includedItems: [
      "Conexión segura con sus contratos legales, tarifarios, manuales operativos, PDFs y hojas de cálculo.",
      "Respuestas inmediatas citando el documento exacto y la página de origen.",
      "Confidencialidad corporativa total: su información jamás se comparte ni sale a internet público.",
      "Disponible 24/7 para agilizar el trabajo de directivos, gerentes, ventas y atención al cliente.",
      "Sincronización instantánea cada vez que su empresa añade o actualiza un documento.",
      "Control de acceso por niveles según el cargo de cada integrante de su organización."
    ],
    executionGuarantee:
      "Conectamos sus repositorios internos bajo estricto blindaje de seguridad y validamos respuestas 100% fieles a la documentación de su empresa.",
    customOptions: [
      "Conectar contratos, listas de precios, PDFs y manuales internos",
      "Asistente privado de consulta rápida para directivos y equipo",
      "Aislamiento de seguridad (cero salida de datos a internet público)",
      "Actualización automática al incorporar nuevos documentos"
    ],
    crmBaseName: "SOLUCIÓN 05 · Agentes RAG (Memoria Institucional Privada)",
    buttonText: "SOLICITAR AGENTE IA PRIVADO · AGENDAR"
  },
  {
    id: "SOL-6",
    group: "propios",
    num: "06",
    shortTabTitle: "06 · SaaS Corporativo Todo-en-Uno",
    badge: "SOLUCIÓN 06 · ECOSISTEMA DE SOFTWARE PROPIO",
    title: "SaaS Corporativo Interno (Panel Centralizado a Medida)",
    curiosityHook: "¿Su operación depende de múltiples programas desconectados? Vea cómo unificamos toda su empresa en un solo panel con su propia marca.",
    shortDesc:
      "Desarrollo de ecosistemas a medida. Unificamos sus operaciones en un panel de control centralizado, eliminando la dependencia de múltiples suscripciones ineficientes.",
    plainExplanation:
      "En resumen ejecutivo: En lugar de pagar múltiples licencias mensuales en plataformas separadas, desarrollamos el software oficial de su empresa con su logo para dirigir ventas, clientes, agenda y finanzas desde una sola pantalla.",
    benefitTag: "Su propio software · Panel único",
    metrics: [
      { label: "Propiedad del sistema", value: "100% Su Marca" },
      { label: "Control operativo", value: "1 Sola Pantalla" },
      { label: "Usuarios de su equipo", value: "Ilimitados sin cargos" }
    ],
    includedItems: [
      "Desarrollo de su propia plataforma privada en la nube con el nombre, colores y logo de su empresa.",
      "Centralización total: ventas, cartera de clientes (CRM), agenda, pagos y métricas en una sola interfaz.",
      "Ahorro directo al eliminar múltiples suscripciones mensuales de herramientas externas.",
      "Perfiles personalizados para su equipo de trabajo y portal exclusivo para sus clientes.",
      "Sincronización en vivo con sus asistentes inteligentes 24/7 y su calendario corporativo.",
      "Acceso rápido y seguro desde cualquier iPhone, Android, tablet o computadora."
    ],
    executionGuarantee:
      "Construimos la plataforma exacta que requiere su operación para que su empresa sea dueña de su propia tecnología sin pagar licencias por usuario.",
    customOptions: [
      "Panel centralizado para dirigir ventas, clientes, agenda y finanzas",
      "Accesos ilimitados para mi equipo sin pagos extras por usuario",
      "Reemplazar múltiples suscripciones mensuales por un sistema propio",
      "Plataforma personalizada con el logo e identidad de mi empresa"
    ],
    crmBaseName: "SOLUCIÓN 06 · SaaS Corporativo Interno (Panel Propio)",
    buttonText: "SOLICITAR MI SAAS CORPORATIVO · AGENDAR"
  }
];

export default function CompactSolutionStage({
  groupFilter,
  sectionEyebrow,
  sectionTitle,
  sectionSubtitle
}: {
  groupFilter: "comercial" | "propios";
  sectionEyebrow: string;
  sectionTitle: string;
  sectionSubtitle: string;
}) {
  const solutionsList = ALL_SOLUTIONS_DATA.filter((s) => s.group === groupFilter);
  const [selectedId, setSelectedId] = useState(solutionsList[0].id);
  const [openDrawer, setOpenDrawer] = useState<string | null>(null);

  const [customPicks, setCustomPicks] = useState<Record<string, string[]>>(() => {
    const init: Record<string, string[]> = {};
    solutionsList.forEach((s) => {
      init[s.id] = [s.customOptions[0], s.customOptions[1]];
    });
    return init;
  });

  const activeSolution =
    solutionsList.find((s) => s.id === selectedId) || solutionsList[0];
  const currentPicks = customPicks[activeSolution.id] || [];
  const customPayload = `${activeSolution.crmBaseName} | Selección: ${currentPicks.join(" + ")}`;

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

  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-5 flex flex-col md:flex-row justify-between md:items-end gap-3">
        <div>
          <span className="text-[11px] font-semibold text-[#C5A059] uppercase tracking-[0.16em] block mb-1.5">
            {sectionEyebrow}
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
            {sectionTitle}
          </h2>
        </div>
        <span className="text-xs sm:text-sm text-gray-300/90">{sectionSubtitle}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {solutionsList.map((sol) => {
          const isSelected = sol.id === activeSolution.id;
          return (
            <button
              key={sol.id}
              type="button"
              onClick={() => setSelectedId(sol.id)}
              className={`p-5 rounded-2xl text-left border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "bg-gradient-to-br from-[#C5A059] via-[#FCF6BA] to-[#B38728] text-[#050507] border-[#FCF6BA] shadow-xl scale-[1.01]"
                  : "bg-[#0A1128]/70 border-white/10 text-gray-200 hover:border-[#C5A059]/60"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-[10px] font-bold uppercase tracking-widest ${
                    isSelected ? "text-[#050507]/80" : "text-[#C5A059]"
                  }`}
                >
                  SOLUCIÓN {sol.num}
                </span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    isSelected
                      ? "bg-[#050507] text-[#FCF6BA]"
                      : "bg-[#C5A059]/15 text-[#FCF6BA]"
                  }`}
                >
                  {isSelected ? "✓ Activa" : "Explorar →"}
                </span>
              </div>
              <div className="text-base font-bold leading-snug">{sol.shortTabTitle}</div>
            </button>
          );
        })}
      </div>

      <article className="rounded-3xl bg-gradient-to-br from-[#0A1128]/90 via-[#070A14] to-[#050507] border border-[#C5A059]/50 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-white/10">
          <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#FCF6BA]">
            ✦ {activeSolution.badge}
          </span>
          <span className="text-xs font-semibold text-[#FCF6BA] bg-[#C5A059]/15 border border-[#C5A059]/40 rounded-full px-4 py-1">
            ✦ {activeSolution.benefitTag}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center mb-6">
          <div className="lg:col-span-8">
            <div className="flex items-baseline gap-3.5 mb-2">
              <span className="text-3xl font-light text-[#C5A059]">{activeSolution.num}</span>
              <h3 className="text-2xl sm:text-[26px] font-semibold text-white tracking-tight">
                {activeSolution.title}
              </h3>
            </div>
            <p className="text-sm text-gray-200 leading-relaxed mb-3.5">
              {activeSolution.shortDesc}
            </p>
            <div className="p-3.5 rounded-2xl bg-[#0A1128]/90 border-l-2 border-[#C5A059] text-xs sm:text-sm text-gray-200">
              <strong className="text-[#FCF6BA] font-semibold">
                ✦ {activeSolution.plainExplanation}
              </strong>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-2">
            {activeSolution.metrics.map((m, i) => (
              <div
                key={i}
                className="px-4 py-2.5 rounded-xl bg-[#050507]/90 border border-white/10 flex items-center justify-between"
              >
                <span className="text-xs text-gray-400">{m.label}</span>
                <span className="text-xs font-bold text-[#FCF6BA]">{m.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                setOpenDrawer((p) => (p === "incluye" ? null : "incluye"))
              }
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                openDrawer === "incluye"
                  ? "bg-[#C5A059] text-[#050507] border-[#FCF6BA]"
                  : "bg-[#050507] text-[#FCF6BA] border-[#C5A059]/45 hover:border-[#FCF6BA]"
              }`}
            >
              {openDrawer === "incluye"
                ? "▲ Ocultar detalles"
                : `✦ Alcance Incluido (${activeSolution.includedItems.length} puntos)`}
            </button>

            <button
              type="button"
              onClick={() =>
                setOpenDrawer((p) => (p === "personalizar" ? null : "personalizar"))
              }
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                openDrawer === "personalizar"
                  ? "bg-[#C5A059] text-[#050507] border-[#FCF6BA]"
                  : "bg-[#050507] text-gray-200 border-white/15 hover:border-[#C5A059]"
              }`}
            >
              {openDrawer === "personalizar"
                ? "▲ Ocultar opciones"
                : `⚙ Configurar a Medida (${currentPicks.length} activos)`}
            </button>
          </div>

          <AuditTriggerButton
            label={activeSolution.buttonText}
            selectedPlan={customPayload}
          />
        </div>

        {openDrawer === "incluye" && (
          <div className="mt-5 pt-5 border-t border-white/10 p-5 rounded-2xl bg-[#050507]/90 border border-[#C5A059]/35">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              {activeSolution.includedItems.map((item, idx) => (
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
              {activeSolution.executionGuarantee}
            </div>
          </div>
        )}

        {openDrawer === "personalizar" && (
          <div className="mt-5 pt-5 border-t border-white/10 p-5 rounded-2xl bg-[#050507]/90 border border-[#C5A059]/35">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {activeSolution.customOptions.map((opt) => {
                const sel = currentPicks.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => togglePick(activeSolution.id, opt)}
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
      </article>
    </div>
  );
}
