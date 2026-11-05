"use client";

import { useState } from "react";
import AuditTriggerButton from "./AuditTriggerButton";

interface SystemPlan {
  id: string;
  num: string;
  badge: string;
  title: string;
  shortDesc: string;
  benefitTag: string;
  includedItems: string[];
  executionGuarantee: string;
  customOptions: string[];
  idealFor: string;
  crmBaseName: string;
  buttonText: string;
}

const SYSTEMS_DATA: SystemPlan[] = [
  {
    id: "PLAN-1",
    num: "01",
    badge: "SERVICIO 01 · ATENCIÓN Y VENTAS AUTOMATIZADAS",
    title: "Asistentes Inteligentes para WhatsApp e Instagram (24/7)",
    shortDesc: "Atienda a cada cliente de forma inmediata sin importar la hora. Implementamos asistentes inteligentes entrenados a la medida de su empresa para responder consultas, brindar información precisa y agendar reuniones comerciales automáticamente.",
    benefitTag: "Respuesta inmediata 24/7",
    includedItems: [
      "Atención continua las 24 horas del día, los 7 días de la semana, sin tiempos de espera.",
      "Comunicación fluida, ejecutiva y alineada con la identidad comercial de su negocio.",
      "Identificación automática de las necesidades e intereses de cada cliente potencial.",
      "Agendamiento directo de citas y reuniones comerciales en su calendario.",
      "Registro ordenado de cada contacto para un control comercial impecable.",
      "Entrenamiento personalizado con su catálogo de servicios, preguntas frecuentes y políticas."
    ],
    executionGuarantee: "Entrega llave en mano: Nuestro equipo configura, entrena y deja el asistente operando directamente en sus canales oficiales con soporte continuo.",
    customOptions: [
      "Automatizar la atención en WhatsApp",
      "Automatizar las respuestas en Instagram",
      "Agendamiento automático de citas en calendario",
      "Cualificación previa de clientes potenciales"
    ],
    idealFor: "Empresas, clínicas, firmas profesionales y comercios que buscan multiplicar su capacidad de respuesta y convertir más conversaciones en ventas.",
    crmBaseName: "PLAN 1 (Asistente WhatsApp/IG 24/7)",
    buttonText: "SOLICITAR ESTE SERVICIO · AGENDAR REUNIÓN"
  },
  {
    id: "PLAN-2",
    num: "02",
    badge: "SERVICIO 02 · PRESENCIA DIGITAL CORPORATIVA",
    title: "Páginas Web Modernas y Catálogos Digitales",
    shortDesc: "Proyecte una imagen sólida, confiable y de alto nivel. Desarrollamos plataformas web rápidas, elegantes e intuitivas que presentan sus servicios con claridad y facilitan el contacto directo con sus clientes.",
    benefitTag: "Imagen ejecutiva y alta conversión",
    includedItems: [
      "Diseño corporativo de alta gama que transmite autoridad y confianza desde el primer instante.",
      "Navegación fluida y velocidad de carga superior en teléfonos móviles y computadoras.",
      "Presentación estructurada y dinámica de todos sus servicios o líneas de negocio.",
      "Integración directa con su calendario de reservas y canales de atención en WhatsApp.",
      "Estructura optimizada para destacar su marca en los motores de búsqueda de internet.",
      "Panel interactivo donde sus visitantes pueden personalizar su solicitud antes de agendar."
    ],
    executionGuarantee: "Desarrollo integral: Nos encargamos de la estructura visual, programación completa, publicación en servidores de alta velocidad y conexión con su agenda.",
    customOptions: [
      "Desarrollo de página web corporativa desde cero",
      "Renovación y modernización de sitio web actual",
      "Integración de catálogo dinámico de servicios",
      "Sistema de agendamiento directo en la web"
    ],
    idealFor: "Organizaciones, consultoras, profesionales y marcas que desean consolidar su prestigio en internet y captar clientes de forma constante.",
    crmBaseName: "PLAN 2 (Página Web Corporativa)",
    buttonText: "SOLICITAR PÁGINA WEB · AGENDAR REUNIÓN"
  },
  {
    id: "PLAN-3",
    num: "03",
    badge: "SERVICIO 03 · GESTIÓN Y CONTROL COMERCIAL",
    title: "Organización Automática de Clientes y Ventas (CRM)",
    shortDesc: "Centralice toda la información de su negocio en un solo lugar. Conectamos sus canales de contacto y su agenda a un sistema inteligente que registra, ordena y clasifica cada oportunidad comercial sin trabajo manual.",
    benefitTag: "Control total de su cartera de clientes",
    includedItems: [
      "Captura y registro automático de los datos de cada nuevo prospecto o cliente.",
      "Clasificación inteligente de contactos según su prioridad y volumen comercial.",
      "Eliminación de tareas operativas repetitivas para ahorrar horas de gestión semanal.",
      "Panel de control estructurado y accesible desde cualquier teléfono o computadora.",
      "Seguimiento comercial organizado para maximizar el cierre de oportunidades.",
      "Historial detallado del servicio exacto que cada cliente seleccionó antes de la reunión."
    ],
    executionGuarantee: "Sincronización total: Dejamos conectada su agenda, sus formularios y su base de datos para que cada nuevo contacto se clasifique en tiempo real.",
    customOptions: [
      "Centralización automática de clientes en CRM",
      "Clasificación de prospectos por nivel de prioridad",
      "Sincronización entre calendario y base de datos",
      "Automatización del flujo de seguimiento comercial"
    ],
    idealFor: "Negocios y equipos comerciales que buscan orden operativo, trazabilidad exacta y eficiencia en el manejo de sus clientes.",
    crmBaseName: "PLAN 3 (Organización y Automatización CRM)",
    buttonText: "SOLICITAR AUTOMATIZACIÓN · AGENDAR REUNIÓN"
  }
];

const FULL_PACKAGE_LABEL = "Paquete Completo (Todo Incluido)";

export default function InteractiveCatalog() {
  const [openId, setOpenId] = useState<string | null>("PLAN-1");

  const [selectedFeatures, setSelectedFeatures] = useState<Record<string, string[]>>({
    "PLAN-1": ["Automatizar la atención en WhatsApp", "Agendamiento automático de citas en calendario"],
    "PLAN-2": ["Desarrollo de página web corporativa desde cero", "Integración de catálogo dinámico de servicios"],
    "PLAN-3": ["Centralización automática de clientes en CRM", "Clasificación de prospectos por nivel de prioridad"]
  });

  const [privCountry, setPrivCountry] = useState<string>("Uruguay");
  const [privInterests, setPrivInterests] = useState<string[]>([FULL_PACKAGE_LABEL]);
  const [privStage, setPrivStage] = useState<string>("Negocio en marcha buscando crecer");

  const togglePlan = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const toggleFeature = (planId: string, feature: string) => {
    setSelectedFeatures((prev) => {
      const current = prev[planId] || [];
      if (current.includes(feature)) {
        return { ...prev, [planId]: current.filter((f) => f !== feature) };
      } else {
        return { ...prev, [planId]: [...current, feature] };
      }
    });
  };

  const handlePrivInterestToggle = (option: string) => {
    if (option === FULL_PACKAGE_LABEL) {
      setPrivInterests([FULL_PACKAGE_LABEL]);
    } else {
      setPrivInterests((prev) => {
        const withoutFull = prev.filter((item) => item !== FULL_PACKAGE_LABEL);
        if (withoutFull.includes(option)) {
          const updated = withoutFull.filter((item) => item !== option);
          return updated.length === 0 ? [FULL_PACKAGE_LABEL] : updated;
        } else {
          return [...withoutFull, option];
        }
      });
    }
  };

  const privateCatalogSummary = `SOLICITUD CATÁLOGO PRIVADO | País: ${privCountry} | Interés: ${privInterests.join(" + ")} | Etapa: ${privStage}`;

  return (
    <div>
      <div className="grid grid-cols-1 gap-7">
        {SYSTEMS_DATA.map((item) => {
          const isOpen = openId === item.id;
          const userPicks = selectedFeatures[item.id] || [];
          const progressPercent = Math.max(25, Math.round((userPicks.length / item.customOptions.length) * 100));
          const customPlanPayload = `${item.crmBaseName} | Selección: ${userPicks.length > 0 ? userPicks.join(" + ") : "Servicio integral"}`;

          return (
            <article
              key={item.id}
              className={`luxury-service-card p-7 md:p-10 ${isOpen ? "luxury-service-card-active" : ""}`}
            >
              <div
                onClick={() => togglePlan(item.id)}
                className="cursor-pointer select-none"
              >
                {/* Cabecera minimalista sin cajas cuadradas */}
                <div className="flex flex-wrap justify-between items-center text-xs mb-5 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#BF953F]" />
                    <span className="text-[#FCF6BA]/90 font-semibold tracking-[0.14em] uppercase text-[11px]">
                      {item.badge}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-[#FCF6BA] hover:text-white transition flex items-center gap-1.5 mt-2 sm:mt-0">
                    <span>{isOpen ? "Ocultar detalles del servicio" : "Ver alcance y personalizar servicio"}</span>
                    <span className="text-[#BF953F] text-[10px]">{isOpen ? "▲" : "▼"}</span>
                  </span>
                </div>

                {/* Título y numeración escultórica limpia (Cero cuadrados alrededor de 01, 02, 03) */}
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                  <div className="flex items-baseline gap-5">
                    <span className="hidden sm:inline-block text-3xl md:text-4xl font-light text-[#BF953F]/80 tracking-tighter shrink-0">
                      {item.num}
                    </span>
                    <div>
                      <h3 className="text-2xl md:text-[28px] font-semibold mb-2.5 text-white tracking-tight leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-sm md:text-[15px] text-gray-300/90 font-normal leading-relaxed max-w-3xl">
                        {item.shortDesc}
                      </p>
                    </div>
                  </div>
                  <div className="text-left md:text-right shrink-0">
                    <span className="text-xs font-medium text-[#FCF6BA] bg-[#BF953F]/10 border border-[#BF953F]/30 rounded-full px-4 py-2 inline-block">
                      ✦ {item.benefitTag}
                    </span>
                  </div>
                </div>
              </div>

              {isOpen && (
                <div className="mt-8 pt-8 border-t border-white/10">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
                    {/* Columna Izquierda: Lista fluida y delicada sin cajas cuadradas alrededor de los checks */}
                    <div className="lg:col-span-7 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-semibold text-[#FCF6BA] uppercase tracking-[0.15em] mb-6">
                          Alcance y Beneficios Incluidos
                        </h4>
                        <ul className="space-y-4 mb-8">
                          {item.includedItems.map((mod, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-3.5 text-sm md:text-[15px] text-gray-200 font-normal leading-relaxed pb-3.5 border-b border-white/5 last:border-none"
                            >
                              <span className="text-[#BF953F] font-semibold text-sm mt-0.5 shrink-0">
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
                            Modalidad de Implementación y Soporte
                          </strong>
                          {item.executionGuarantee}
                        </div>
                        <div className="text-sm text-gray-300 leading-relaxed px-1">
                          <strong className="text-[#FCF6BA] font-semibold">Ideal para:</strong> {item.idealFor}
                        </div>
                      </div>
                    </div>

                    {/* Columna Derecha: Configurador minimalista */}
                    <div className="lg:col-span-5 rounded-xl border border-[#BF953F]/35 bg-[#080B12]/90 p-6 md:p-7 flex flex-col justify-between shadow-xl">
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs font-semibold text-[#FCF6BA] uppercase tracking-[0.12em]">
                            Personalización a Medida
                          </span>
                          <span className="text-[11px] font-medium text-[#FCF6BA]/80">
                            {userPicks.length} de {item.customOptions.length} seleccionadas
                          </span>
                        </div>

                        <div className="w-full h-1 bg-white/10 rounded-full mb-5 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>

                        <p className="text-sm text-gray-200 font-normal mb-4">
                          Seleccione las prioridades que desea implementar en su empresa:
                        </p>

                        <div className="space-y-2.5 mb-6">
                          {item.customOptions.map((option) => {
                            const isSelected = userPicks.includes(option);
                            return (
                              <button
                                key={option}
                                type="button"
                                onClick={() => toggleFeature(item.id, option)}
                                className={`interactive-option-btn w-full text-left px-4 py-3 text-xs md:text-sm font-normal border flex items-center justify-between ${
                                  isSelected
                                    ? "bg-[#BF953F]/15 border-[#BF953F]/70 text-white"
                                    : "bg-white/[0.02] border-white/10 text-gray-400 hover:border-[#BF953F]/40 hover:text-gray-200"
                                }`}
                              >
                                <span className="pr-2">{option}</span>
                                <span
                                  className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full shrink-0 ${
                                    isSelected
                                      ? "bg-[#BF953F] text-[#070707]"
                                      : "text-[#BF953F]/80"
                                  }`}
                                >
                                  {isSelected ? "Incluido" : "+ Añadir"}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        <div className="text-xs text-gray-300 bg-black/50 p-4 rounded-lg border-l-2 border-[#BF953F] mb-6 leading-relaxed">
                          <strong className="text-[#FCF6BA] block mb-1 uppercase tracking-wider text-[10px] font-semibold">
                            Resumen de su configuración:
                          </strong>
                          {customPlanPayload}
                        </div>
                      </div>

                      <div>
                        <AuditTriggerButton
                          label={item.buttonText}
                          selectedPlan={customPlanPayload}
                          fullWidth={true}
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
            Operamos en distintos mercados internacionales, por lo que nuestras tarifas se estructuran de forma personalizada según su región y alcance. Seleccione sus preferencias a continuación para preparar su Catálogo Privado previo a nuestra reunión:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 items-stretch">
          {/* Paso 1: País */}
          <div className="vault-step-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <label className="text-xs font-semibold text-[#FCF6BA] uppercase tracking-wider">
                  1. País de Operación
                </label>
                <span className="text-[10px] font-medium text-[#BF953F]">
                  Paso 01
                </span>
              </div>
              <div className="space-y-2.5">
                {["Uruguay", "Venezuela", "Otro País / Internacional"].map((pais) => {
                  const active = privCountry === pais;
                  return (
                    <button
                      key={pais}
                      type="button"
                      onClick={() => setPrivCountry(pais)}
                      className={`interactive-option-btn w-full text-left px-4 py-3 text-xs md:text-sm border flex justify-between items-center ${
                        active
                          ? "border-[#BF953F] bg-[#BF953F]/15 text-white font-medium"
                          : "border-white/10 bg-white/[0.02] text-gray-400 hover:border-[#BF953F]/40 hover:text-gray-200"
                      }`}
                    >
                      <span>{pais}</span>
                      <span className={`text-xs ${active ? "text-[#FCF6BA]" : "text-transparent"}`}>
                        ●
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Paso 2: Servicios */}
          <div className="vault-step-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <label className="text-xs font-semibold text-[#FCF6BA] uppercase tracking-wider">
                  2. Solución a Cotizar
                </label>
                <span className="text-[10px] font-medium text-[#BF953F]">
                  Paso 02
                </span>
              </div>
              <div className="space-y-2.5">
                {[
                  FULL_PACKAGE_LABEL,
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
                      className={`interactive-option-btn w-full text-left px-4 py-3 text-xs md:text-sm border flex justify-between items-center ${
                        isSelected
                          ? "border-[#BF953F] bg-[#BF953F]/15 text-white font-medium"
                          : "border-white/10 bg-white/[0.02] text-gray-400 hover:border-[#BF953F]/40 hover:text-gray-200"
                      }`}
                    >
                      <span className="pr-2">{interes}</span>
                      <span className={`text-xs ${isSelected ? "text-[#FCF6BA]" : "text-transparent"}`}>
                        ●
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Paso 3: Etapa */}
          <div className="vault-step-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <label className="text-xs font-semibold text-[#FCF6BA] uppercase tracking-wider">
                  3. Etapa Actual
                </label>
                <span className="text-[10px] font-medium text-[#BF953F]">
                  Paso 03
                </span>
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
                          ? "border-[#BF953F] bg-[#BF953F]/15 text-white font-medium"
                          : "border-white/10 bg-white/[0.02] text-gray-400 hover:border-[#BF953F]/40 hover:text-gray-200"
                      }`}
                    >
                      <span className="pr-2">{etapa}</span>
                      <span className={`text-xs ${active ? "text-[#FCF6BA]" : "text-transparent"}`}>
                        ●
                      </span>
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
