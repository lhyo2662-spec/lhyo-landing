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
    shortTabTitle: "04 · Automatización con Tecnología Propia",
    badge: "SOLUCIÓN 04 · INDEPENDENCIA Y AUTOMATIZACIÓN SIN LÍMITES",
    title: "Automatización Total de Procesos con Tecnología Propia",
    curiosityHook: "¿Por qué pagar tarifas mensuales que suben cada vez que su negocio crece, cuando puede ser dueño de su propio sistema automático ilimitado?",
    shortDesc:
      "Libere a su empresa de pagar suscripciones mensuales por cada mensaje o tarea realizada. Instalamos una central de automatización privada y exclusiva para su negocio que ejecuta todos sus procesos sin límites de uso.",
    plainExplanation:
      "En resumen ejecutivo: En lugar de alquilar plataformas externas que le cobran más caro a medida que usted atiende más clientes, instalamos el sistema automático propio de su empresa para que opere sin límites ni cobros extra.",
    benefitTag: "Cero cobro por uso · Capacidad ilimitada",
    metrics: [
      { label: "Operaciones y envíos", value: "Ilimitados (∞)" },
      { label: "Ahorro en suscripciones", value: "Hasta 85% Anual" },
      { label: "Dueño del sistema", value: "100% Su Empresa" }
    ],
    includedItems: [
      "Instalación de una central automática privada y exclusiva para su empresa, sin depender de terceros.",
      "Eliminación definitiva de cobros mensuales por cantidad de mensajes, correos o clientes atendidos.",
      "Conexión total entre sus canales de atención, su agenda y su base de clientes trabajando en piloto automático.",
      "Capacidad industrial para atender a miles de clientes al mismo tiempo con respuesta instantánea.",
      "Privacidad absoluta: toda la información y los contactos de su negocio permanecen bajo su control exclusivo.",
      "Respaldo diario automático y supervisión técnica continua para garantizar cero interrupciones."
    ],
    executionGuarantee:
      "Entregamos su central automática privada funcionando al 100% y conectada a todo su negocio para que escale sus ventas sin facturas mensuales por volumen.",
    customOptions: [
      "Tener el sistema automático propio y exclusivo de mi empresa",
      "Eliminar cobros mensuales por cantidad de clientes o mensajes",
      "Conectar mi WhatsApp, Correo, Agenda y Clientes sin límites",
      "Respaldo diario automático y soporte técnico continuo"
    ],
    crmBaseName: "SOLUCIÓN 04 · Automatización Total Propia (Sin Mensualidades)",
    buttonText: "SOLICITAR AUTOMATIZACIÓN PROPIA · AGENDAR"
  },
  {
    id: "SOL-5",
    group: "propios",
    num: "05",
    shortTabTitle: "05 · Inteligencia Artificial Personalizada",
    badge: "SOLUCIÓN 05 · EL CEREBRO INTELIGENTE DE SU NEGOCIO",
    title: "Inteligencia Artificial Personalizada con la Memoria de su Empresa",
    curiosityHook: "Imagine preguntarle cualquier precio, contrato o dato interno de su negocio a su propio sistema y recibir la respuesta exacta en 1 segundo.",
    shortDesc:
      "Creamos una Inteligencia Artificial privada entrenada exclusivamente con los documentos, precios, contratos y reglas de su negocio, lista para resolver cualquier consulta de usted o de su equipo al instante.",
    plainExplanation:
      "En resumen ejecutivo: Es como tener a un director experto con memoria fotográfica que conoce cada archivo, precio y documento de su empresa, disponible las 24 horas en privado para responder cualquier duda en 1 segundo.",
    benefitTag: "100% Privada · Respuesta en 1 segundo",
    metrics: [
      { label: "Exactitud al responder", value: "99.4% Verificada" },
      { label: "Seguridad de sus datos", value: "100% Confidencial" },
      { label: "Velocidad de consulta", value: "Menos de 1 segundo" }
    ],
    includedItems: [
      "Entrenamiento de su propia Inteligencia Artificial con sus contratos, listas de precios, manuales y archivos de Excel o PDF.",
      "Respuestas inmediatas en 1 segundo indicando exactamente en qué documento y página se encuentra el dato.",
      "Secreto empresarial blindado: la información de su negocio es 100% privada y nadie externo tiene acceso a ella.",
      "Asistencia continua 24/7 para ahorrar horas de búsqueda a usted, a sus vendedores y a su equipo de trabajo.",
      "Aprendizaje inmediato: cada vez que usted actualiza un precio o sube un documento nuevo, el sistema lo aprende al instante.",
      "Permisos personalizados para que usted decida qué información puede consultar cada empleado."
    ],
    executionGuarantee:
      "Dejamos su Inteligencia Artificial privada entrenada con la información real de su negocio, garantizando respuestas exactas y confidencialidad absoluta.",
    customOptions: [
      "Entrenar mi propia IA con los documentos y precios de mi empresa",
      "Buscador inteligente privado para mí y mi equipo de trabajo",
      "Blindaje de confidencialidad (mis archivos nunca salen a internet)",
      "Actualización instantánea al agregar nuevos documentos o precios"
    ],
    crmBaseName: "SOLUCIÓN 05 · Inteligencia Artificial Personalizada de Empresa",
    buttonText: "SOLICITAR MI IA PERSONALIZADA · AGENDAR"
  },
  {
    id: "SOL-6",
    group: "propios",
    num: "06",
    shortTabTitle: "06 · Su Plataforma Empresarial Todo-en-Uno",
    badge: "SOLUCIÓN 06 · TODA SU EMPRESA EN UNA SOLA PANTALLA",
    title: "Su Propia Plataforma Empresarial Todo-en-Uno",
    curiosityHook: "¿Su equipo pierde tiempo abriendo múltiples programas desconectados? Vea cómo unificamos ventas, clientes, agenda y finanzas en una sola pantalla con su marca.",
    shortDesc:
      "Deje de depender de múltiples programas sueltos y costosos. Construimos la plataforma privada oficial de su empresa con su propio logo para que controle ventas, clientes, agenda y resultados desde un solo lugar.",
    plainExplanation:
      "En resumen ejecutivo: En lugar de tener su negocio dividido en varias herramientas alquiladas que no se conectan entre sí, creamos el programa propio de su empresa a la medida para que maneje toda su operación desde una sola pantalla en su celular o computadora.",
    benefitTag: "Su propio sistema · Todo en 1 pantalla",
    metrics: [
      { label: "Propiedad del sistema", value: "100% Su Marca" },
      { label: "Control del negocio", value: "1 Sola Pantalla" },
      { label: "Accesos para su equipo", value: "Ilimitados sin cobro" }
    ],
    includedItems: [
      "Creación de la plataforma privada oficial de su empresa en internet con su nombre, sus colores y su logo.",
      "Todo su negocio unido en una sola pantalla: control de ventas, lista de clientes, agenda de citas, pagos y métricas.",
      "Ahorro inmediato al cancelar múltiples mensualidades de programas externos que ya no necesitará.",
      "Accesos ilimitados para los miembros de su equipo y un área exclusiva de alto prestigio para sus clientes.",
      "Sincronización en vivo con sus asistentes inteligentes 24/7 y su calendario comercial.",
      "Navegación rápida, intuitiva y cómoda desde cualquier teléfono (iPhone o Android), tablet o computadora."
    ],
    executionGuarantee:
      "Construimos la plataforma exacta que necesita su operación para que su empresa sea dueña de su propia tecnología para siempre, sin pagar alquileres por usuario.",
    customOptions: [
      "Unificar mis ventas, clientes, agenda y pagos en una sola pantalla",
      "Accesos ilimitados para mi equipo sin pagos extras por usuario",
      "Dejar de pagar múltiples programas sueltos todos los meses",
      "Diseño exclusivo con el logo y los colores de mi empresa"
    ],
    crmBaseName: "SOLUCIÓN 06 · Plataforma Empresarial Todo-en-Uno a Medida",
    buttonText: "SOLICITAR MI PLATAFORMA TODO-EN-UNO · AGENDAR"
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

