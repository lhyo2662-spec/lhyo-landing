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
    badge: "SOLUCIÓN 01 · EL VENDEDOR QUE NUNCA DUERME",
    title: "Asistentes Inteligentes para WhatsApp e Instagram (24/7)",
    curiosityHook: "¿Qué pasa si un cliente te escribe un domingo a las 2:00 AM? Mira cómo le respondemos en menos de 1 segundo y agendamos su cita.",
    shortDesc:
      "Atienda a cada cliente de forma inmediata sin importar la hora. Creamos un asistente inteligente entrenado con la información de su negocio que responde preguntas, guía al cliente y agenda citas automáticamente.",
    plainExplanation:
      "Explicado fácil: Si alguien escribe a tu WhatsApp o Instagram pidiendo precios mientras estás ocupado o durmiendo, tu asistente le contesta al instante con amabilidad y te deja la reunión agendada.",
    benefitTag: "Respuesta inmediata las 24 horas",
    metrics: [
      { label: "Velocidad al responder", value: "Menos de 1 segundo" },
      { label: "Horario de atención", value: "24 horas · 365 días" },
      { label: "Citas en tu agenda", value: "100% Automáticas" }
    ],
    includedItems: [
      "Atención continua las 24 horas del día, los 7 días de la semana, sin dejar a ningún cliente esperando.",
      "Respuestas naturales, amables y con el estilo exacto de tu negocio.",
      "Descubre qué necesita cada persona antes de pasarla a una reunión contigo.",
      "Agenda citas directamente en tu calendario sin que tengas que intervenir.",
      "Guarda automáticamente el nombre y teléfono de cada interesado.",
      "Entrenado con tus precios, servicios, horarios y preguntas frecuentes."
    ],
    executionGuarantee:
      "Nosotros hacemos todo por ti: Configuramos, entrenamos y dejamos tu asistente funcionando en tu WhatsApp e Instagram.",
    customOptions: [
      "Responder mensajes en WhatsApp las 24 horas",
      "Responder mensajes y comentarios en Instagram",
      "Agendar citas automáticamente en mi calendario",
      "Preguntar qué busca el cliente antes de agendar"
    ],
    crmBaseName: "SOLUCIÓN 01 · Asistente WhatsApp e Instagram 24/7",
    buttonText: "QUIERO ESTE ASISTENTE 24/7 · AGENDAR"
  },
  {
    id: "SOL-2",
    group: "comercial",
    num: "02",
    shortTabTitle: "02 · Páginas Web y Catálogos de Lujo",
    badge: "SOLUCIÓN 02 · LA VITRINA DIGITAL QUE ENAMORA EN 3 SEGUNDOS",
    title: "Páginas Web Modernas y Catálogos Interactivos",
    curiosityHook: "¿Por qué la gente cierra las páginas comunes tan rápido? Descubre cómo una web interactiva hace que te elijan a ti al instante.",
    shortDesc:
      "Proyecte una imagen impecable y de alto prestigio. Creamos páginas web rápidas, elegantes y muy fáciles de usar en celulares y computadoras para que sus visitantes conozcan lo que ofrece y agenden en un clic.",
    plainExplanation:
      "Explicado fácil: Diseñamos y construimos una plataforma única, veloz e impresionante con la identidad de tu marca para que cada visitante sienta confianza absoluta y decida contratarte al instante.",
    benefitTag: "Imagen de lujo adaptada a tu rubro",
    metrics: [
      { label: "Velocidad al abrir", value: "Menos de 1 segundo" },
      { label: "Se ve perfecto en", value: "iPhone, Android y PC" },
      { label: "Aparece en buscadores", value: "Listo para Google" }
    ],
    includedItems: [
      "Diseño moderno y elegante que transmite confianza total desde el primer segundo.",
      "Funciona súper rápido tanto en teléfonos celulares como en computadoras.",
      "Botones interactivos para que el cliente explore tus servicios sin aburrirse leyendo textos largos.",
      "Conectada directamente a tu WhatsApp y a tu calendario de citas.",
      "Preparada para que las personas encuentren tu negocio cuando busquen en Google.",
      "Catálogo descargable en PDF personalizado con el nombre de cada cliente."
    ],
    executionGuarantee:
      "Entrega completa llave en mano: Diseñamos, programamos y publicamos tu página en internet lista para recibir clientes.",
    customOptions: [
      "Crear mi página web moderna desde cero",
      "Renovar y mejorar la página web que ya tengo",
      "Incluir un catálogo interactivo de mis servicios",
      "Incluir calendario para que reserven citas solos"
    ],
    crmBaseName: "SOLUCIÓN 02 · Página Web Moderna y Catálogo Digital",
    buttonText: "QUIERO MI PÁGINA WEB DE LUJO · AGENDAR"
  },
  {
    id: "SOL-3",
    group: "comercial",
    num: "03",
    shortTabTitle: "03 · Lista de Clientes Automática",
    badge: "SOLUCIÓN 03 · CERO CLIENTES PERDIDOS EN PAPEL O CHATS",
    title: "Organización Automática de Clientes y Ventas",
    curiosityHook: "¿Sabes cuántas ventas se pierden por olvidar dar seguimiento? Mira cómo cada cliente se guarda y ordena solo.",
    shortDesc:
      "Tenga todo su negocio ordenado en un solo lugar. Cada persona que pregunta o agenda queda guardada automáticamente con su nombre, contacto, presupuesto y el servicio que desea comprar.",
    plainExplanation:
      "Explicado fácil: Ya no tienes que anotar nada en cuadernos ni buscar entre cientos de chats. El sistema anota a cada cliente solo, te dice quién está listo para comprar y te avisa al correo al instante.",
    benefitTag: "Orden total sin trabajo manual",
    metrics: [
      { label: "Tiempo anotando a mano", value: "0 Minutos" },
      { label: "Orden de clientes", value: "Por Prioridad e Interés" },
      { label: "Aviso a tu correo", value: "En 1 Segundo" }
    ],
    includedItems: [
      "Anota automáticamente los datos de cada nuevo cliente interesado.",
      "Separa y destaca a los clientes más importantes para que los atiendas primero.",
      "Te ahorra horas de trabajo repetitivo todas las semanas.",
      "Tabla de control clara que puedes revisar desde tu teléfono o computadora.",
      "Envía automáticamente un correo de confirmación con el link de videollamada al cliente.",
      "Te muestra exactamente qué servicio eligió la persona antes de hablar con ella."
    ],
    executionGuarantee:
      "Todo conectado por nosotros: Enlazamos tu página, tu calendario y tu lista de clientes para que todo se guarde solo en tiempo real.",
    customOptions: [
      "Guardar todos mis clientes en una lista automática",
      "Destacar automáticamente a los clientes más importantes",
      "Enviar correos automáticos de confirmación de cita",
      "Recibir una alerta inmediata en mi celular/correo"
    ],
    crmBaseName: "SOLUCIÓN 03 · Organización Automática de Clientes",
    buttonText: "QUIERO ORDENAR MIS CLIENTES · AGENDAR"
  },
  {
    id: "SOL-4",
    group: "propios",
    num: "04",
    shortTabTitle: "04 · Motor Propio Sin Mensualidades",
    badge: "SOLUCIÓN 04 · DUEÑO TOTAL DE TU AUTOMATIZACIÓN",
    title: "Motor Automático Propio (Sin Pagar Alquiler Mensual a Terceros)",
    curiosityHook: "¿Por qué pagar mensualidades toda la vida por cada mensaje enviado cuando puedes ser dueño de tu propio motor ilimitado?",
    shortDesc:
      "Deje de pagar cobros mensuales a otras plataformas cada vez que su negocio atiende clientes. Instalamos un motor automático privado exclusivo para su empresa con capacidad ilimitada.",
    plainExplanation:
      "Explicado fácil: Otras plataformas te cobran cada vez más caro cuando tu negocio crece. Nosotros te instalamos tu propio motor privado para que atiendas a miles de clientes sin pagar ni un dólar extra por tarea.",
    benefitTag: "Cero cobro por tarea · Uso ilimitado",
    metrics: [
      { label: "Tareas y mensajes", value: "Ilimitados (Sin tope)" },
      { label: "Ahorro en alquileres", value: "Hasta 85% al año" },
      { label: "Dueño del motor", value: "100% Tu Empresa" }
    ],
    includedItems: [
      "Instalación de tu propio motor automático en un servidor privado exclusivo para tu empresa.",
      "Eliminación definitiva de cobros mensuales por cantidad de mensajes, correos o clientes atendidos.",
      "Pasamos todas tus automatizaciones actuales a tu nuevo motor sin detener tu negocio ni un minuto.",
      "Capacidad para atender a miles de personas al mismo tiempo sin que se ponga lento.",
      "Seguridad total: toda la información de tu negocio queda bajo tu propio control.",
      "Copias de seguridad automáticas todos los días y soporte técnico continuo."
    ],
    executionGuarantee:
      "Instalación llave en mano: Dejamos tu propio servidor funcionando y conectado a todas tus herramientas sin facturas por consumo.",
    customOptions: [
      "Tener mi propio motor automático exclusivo para mi negocio",
      "Dejar de pagar mensualidades por cantidad de mensajes",
      "Conectar mi WhatsApp, Correo y Agenda sin ningún límite",
      "Respaldo diario automático y cuidado técnico 24/7"
    ],
    crmBaseName: "SOLUCIÓN 04 · Motor Automático Propio Sin Mensualidades",
    buttonText: "QUIERO MI PROPIO MOTOR AUTOMÁTICO · AGENDAR"
  },
  {
    id: "SOL-5",
    group: "propios",
    num: "05",
    shortTabTitle: "05 · Cerebro Privado de tu Negocio",
    badge: "SOLUCIÓN 05 · MEMORIA FOTOGRÁFICA DE TODA TU EMPRESA",
    title: "Cerebro Privado con la Memoria de tu Negocio",
    curiosityHook: "Imagina preguntarle cualquier precio, contrato o regla de tu empresa a una pantalla y recibir el dato exacto en 1 segundo.",
    shortDesc:
      "Un asistente privado para usted y su equipo que se sabe de memoria todos los contratos, listas de precios, documentos y reglas de su negocio para responder cualquier duda interna al instante.",
    plainExplanation:
      "Explicado fácil: En vez de perder horas buscando un dato entre cientos de carpetas o archivos PDF, le preguntas en privado al Cerebro de tu empresa y en 1 segundo te dice la respuesta exacta y en qué página está.",
    benefitTag: "Secreto total · Respuesta en 1 segundo",
    metrics: [
      { label: "Exactitud al responder", value: "99.4% Verificada" },
      { label: "Privacidad de archivos", value: "100% Secreto" },
      { label: "Tiempo de respuesta", value: "Menos de 1 segundo" }
    ],
    includedItems: [
      "Lee y memoriza todos tus contratos, listas de precios, manuales, archivos PDF y tablas de Excel.",
      "Responde en 1 segundo diciéndote exactamente de qué documento y de qué página sacó el dato.",
      "100% privado y secreto: la información de tu negocio jamás sale a internet público.",
      "Disponible las 24 horas para ayudarte a ti, a tus vendedores o a tu equipo de trabajo.",
      "Cada vez que agregas un documento o precio nuevo, lo aprende automáticamente en el acto.",
      "Tú decides qué información puede consultar cada empleado y cuál es solo para ti."
    ],
    executionGuarantee:
      "Configuración blindada: Conectamos tus documentos en privado y verificamos que responda siempre con datos reales y exactos de tu negocio.",
    customOptions: [
      "Conectar mis contratos, listas de precios y documentos",
      "Chat privado de consulta rápida para mí y mi equipo",
      "Privacidad máxima (mis documentos nunca salen a internet)",
      "Aprendizaje automático cuando agrego archivos nuevos"
    ],
    crmBaseName: "SOLUCIÓN 05 · Cerebro Privado con Memoria de Negocio",
    buttonText: "QUIERO EL CEREBRO PRIVADO DE MI NEGOCIO · AGENDAR"
  },
  {
    id: "SOL-6",
    group: "propios",
    num: "06",
    shortTabTitle: "06 · Tu Programa Todo-en-Uno",
    badge: "SOLUCIÓN 06 · TODA TU EMPRESA EN UNA SOLA PANTALLA",
    title: "Tu Propio Programa y Panel Todo-en-Uno con tu Marca",
    curiosityHook: "¿Cansado de abrir 6 programas distintos todos los días? Mira cómo se ve todo tu negocio unido en una sola pantalla con tu logo.",
    shortDesc:
      "Deje de pagar y abrir múltiples programas separados. Creamos el sistema privado de su empresa con su propio logo para controlar ventas, clientes, agenda, equipo y finanzas desde un solo lugar.",
    plainExplanation:
      "Explicado fácil: En lugar de tener tus cosas regadas en varios programas alquilados, te creamos el programa oficial de tu empresa para que manejes todo tu negocio desde una sola pantalla en tu celular o computadora.",
    benefitTag: "Tu propio programa · Todo en 1 pantalla",
    metrics: [
      { label: "Dueño del programa", value: "100% Tu Marca" },
      { label: "Todo tu negocio en", value: "1 Sola Pantalla" },
      { label: "Usuarios de tu equipo", value: "Ilimitados sin cobro" }
    ],
    includedItems: [
      "Creación de tu propio programa privado en internet con el nombre, colores y logo de tu empresa.",
      "Une todo en una sola pantalla: ventas, lista de clientes, agenda de citas, pagos y resultados del mes.",
      "Te permite cancelar múltiples suscripciones mensuales de programas sueltos.",
      "Accesos individuales para tu equipo de trabajo y un área elegante para tus clientes.",
      "Conectado en tiempo real con tu WhatsApp inteligente y tu calendario de citas.",
      "Súper rápido y cómodo de usar desde cualquier iPhone, Android, tablet o computadora."
    ],
    executionGuarantee:
      "Hecho 100% a tu medida: Construimos el panel exacto que necesita tu empresa para que seas dueño de tu propio sistema para siempre.",
    customOptions: [
      "Un solo panel para ver mis ventas, clientes, agenda y pagos",
      "Accesos para mi equipo sin pagar extra por cada usuario",
      "Dejar de pagar varios programas sueltos todos los meses",
      "Personalizado con el logo y los colores de mi empresa"
    ],
    crmBaseName: "SOLUCIÓN 06 · Programa Propio Todo-en-Uno",
    buttonText: "QUIERO MI PROGRAMA TODO-EN-UNO · AGENDAR"
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
                  OPCIÓN {sol.num}
                </span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    isSelected
                      ? "bg-[#050507] text-[#FCF6BA]"
                      : "bg-[#C5A059]/15 text-[#FCF6BA]"
                  }`}
                >
                  {isSelected ? "✓ Viendo ahora" : "Tocar para abrir →"}
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
                : `✦ Abrir todo lo que ofrece (${activeSolution.includedItems.length} puntos)`}
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
                : `⚙ Personalizar a mi gusto (${currentPicks.length} elegidas)`}
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
              <strong className="text-[#FCF6BA]">Garantía Llave en Mano:</strong>{" "}
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


