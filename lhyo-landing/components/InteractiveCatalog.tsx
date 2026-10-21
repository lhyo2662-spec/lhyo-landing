"use client";

import { useState } from "react";
import AuditTriggerButton from "./AuditTriggerButton";

interface SystemPlan {
  id: string;
  badge: string;
  title: string;
  shortDesc: string;
  benefitTag: string;
  includedItems: string[];
  customOptions: string[];
  idealFor: string;
  crmBaseName: string;
  buttonText: string;
}

const SYSTEMS_DATA: SystemPlan[] = [
  {
    id: "PLAN-1",
    badge: "SERVICIO 01 · ATENCIÓN Y VENTAS AUTOMATIZADAS",
    title: "Asistentes Inteligentes para WhatsApp e Instagram (24/7)",
    shortDesc: "Atienda a cada cliente de forma inmediata sin importar la hora. Implementamos asistentes inteligentes entrenados a la medida de su empresa para responder consultas, brindar información precisa y agendar reuniones comerciales automáticamente.",
    benefitTag: "Respuesta inmediata 24/7",
    includedItems: [
      "Atención continua las 24 horas del día, los 7 días de la semana, sin tiempos de espera.",
      "Comunicación fluida, profesional y alineada con la identidad de su negocio.",
      "Identificación automática de las necesidades e intereses de cada cliente potencial.",
      "Agendamiento directo de citas y reuniones comerciales en su calendario.",
      "Registro ordenado de cada contacto para un control comercial impecable."
    ],
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
    badge: "SERVICIO 02 · PRESENCIA DIGITAL CORPORATIVA",
    title: "Páginas Web Modernas y Catálogos Digitales",
    shortDesc: "Proyecte una imagen sólida, confiable y de alto nivel. Desarrollamos plataformas web rápidas, elegantes e intuitivas que presentan sus servicios con claridad y facilitan el contacto directo con sus clientes.",
    benefitTag: "Imagen ejecutiva y alta conversión",
    includedItems: [
      "Diseño corporativo de alta gama que transmite autoridad y confianza desde el primer instante.",
      "Navegación fluida y velocidad de carga superior en teléfonos móviles y computadoras.",
      "Presentación estructurada y dinámica de todos sus servicios o líneas de negocio.",
      "Integración directa con su calendario de reservas y canales de contacto.",
      "Estructura optimizada para destacar su marca en los motores de búsqueda."
    ],
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
    badge: "SERVICIO 03 · GESTIÓN Y CONTROL COMERCIAL",
    title: "Organización Automática de Clientes y Ventas (CRM)",
    shortDesc: "Centralice toda la información de su negocio en un solo lugar. Conectamos sus canales de contacto y su agenda a un sistema inteligente que registra, ordena y clasifica cada oportunidad comercial sin trabajo manual.",
    benefitTag: "Control total de su cartera de clientes",
    includedItems: [
      "Captura y registro automático de los datos de cada nuevo prospecto o cliente.",
      "Clasificación inteligente de contactos según su prioridad y volumen comercial.",
      "Eliminación de tareas operativas repetitivas para ahorrar horas de gestión semanal.",
      "Panel de control estructurado y accesible desde cualquier dispositivo.",
      "Seguimiento comercial organizado para maximizar el cierre de oportunidades."
    ],
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

  // Máquina de estado para selección múltiple excluyente en la Columna 2 del Catálogo Privado
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
      {/* LISTA DE LOS 3 PLANES DEL CATÁLOGO */}
      <div className="grid grid-cols-1 gap-6">
        {SYSTEMS_DATA.map((item) => {
          const isOpen = openId === item.id;
          const userPicks = selectedFeatures[item.id] || [];
          const customPlanPayload = `${item.crmBaseName} | Selección: ${userPicks.length > 0 ? userPicks.join(" + ") : "Servicio integral"}`;

          return (
            <article
              key={item.id}
              className="swiss-card p-6 md:p-8 transition-all duration-200"
            >
              <div
                onClick={() => togglePlan(item.id)}
                className="cursor-pointer select-none"
              >
                <div className="flex flex-wrap justify-between items-center text-xs font-bold tracking-wide text-gray-300 mb-4 pb-4 border-b border-[#1E293B]">
                  <span className="text-[#BF953F] uppercase">{item.badge}</span>
                  <span className="text-[#BF953F] font-bold mt-2 sm:mt-0 bg-[#070707] px-3 py-1.5 border border-[#BF953F]/40">
                    {isOpen ? "▲ Ocultar detalles del servicio" : "▼ Ver alcance y personalizar servicio"}
                  </span>
                </div>

                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-2 text-white">{item.title}</h3>
                    <p className="text-base text-gray-300 leading-relaxed max-w-3xl">
                      {item.shortDesc}
                    </p>
                  </div>
                  <div className="text-left md:text-right shrink-0">
                    <span className="text-xs font-semibold text-[#BF953F] border border-[#1E293B] bg-[#070707] px-4 py-2.5 inline-block">
                      ★ {item.benefitTag}
                    </span>
                  </div>
                </div>
              </div>

              {isOpen && (
                <div className="mt-8 pt-8 border-t border-[#1E293B] bg-[#070707] p-6 md:p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Columna Izquierda: Alcance y Perfil Ideal (Sin "En palabras simples") */}
                    <div className="lg:col-span-7 flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-[#BF953F] uppercase tracking-wide mb-4">
                          Alcance y Beneficios Incluidos
                        </h4>
                        <ul className="space-y-3 mb-6">
                          {item.includedItems.map((mod, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-sm md:text-base text-gray-200">
                              <span className="text-[#BF953F] font-bold">✓</span>
                              <span>{mod}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="text-sm text-gray-300 border-t border-[#1E293B] pt-4 leading-relaxed">
                        <strong className="text-white">¿Para quién es ideal?:</strong> {item.idealFor}
                      </div>
                    </div>

                    {/* Columna Derecha: Personalización Ejecutiva del Servicio */}
                    <div className="lg:col-span-5 border border-[#BF953F]/50 bg-[#0B132B]/70 p-6 flex flex-col justify-between">
                      <div>
                        <div className="text-xs font-bold text-[#BF953F] uppercase tracking-wide mb-1">
                          CONFIGURACIÓN A MEDIDA
                        </div>
                        <p className="text-sm text-white font-semibold mb-4">
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
                                className={`w-full text-left px-4 py-3 text-xs md:text-sm font-medium border transition flex items-center justify-between ${
                                  isSelected
                                    ? "bg-[#BF953F]/20 border-[#BF953F] text-white"
                                    : "bg-[#070707] border-[#1E293B] text-gray-400 hover:border-gray-500"
                                }`}
                              >
                                <span>{option}</span>
                                <span className="font-bold text-[#BF953F] ml-2 shrink-0">
                                  {isSelected ? "✓ Incluido" : "+ Añadir"}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        <div className="text-xs text-gray-300 bg-[#070707] p-3 border border-[#1E293B] mb-5">
                          <strong className="text-[#BF953F]">Resumen de solicitud:</strong> {customPlanPayload}
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

      {/* SECCIÓN CATÁLOGO PRIVADO CON MULTISELECCIÓN EXCLUYENTE EN COLUMNA 2 */}
      <div className="mt-16 p-8 md:p-10 border-2 border-[#BF953F] bg-[#0B132B]">
        <div className="max-w-3xl mb-8">
          <span className="text-xs font-bold text-[#BF953F] uppercase tracking-wider block mb-2">
            PROPUESTA ECONÓMICA Y PLANES SEGÚN SU MERCADO
          </span>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
            ¿Deseas recibir nuestro Catálogo Privado con los precios para tu país?
          </h3>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed">
            Operamos en distintos mercados internacionales, por lo que nuestras tarifas se estructuran de forma personalizada según su región y alcance. Seleccione sus preferencias a continuación para preparar su Catálogo Privado previo a nuestra reunión:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Columna 1: País */}
          <div className="bg-[#070707] p-5 border border-[#1E293B]">
            <label className="text-xs font-bold text-[#BF953F] uppercase block mb-3">
              1. ¿EN QUÉ PAÍS ESTÁ TU NEGOCIO?
            </label>
            <div className="space-y-2">
              {["Uruguay", "Venezuela", "Otro País / Internacional"].map((pais) => (
                <button
                  key={pais}
                  type="button"
                  onClick={() => setPrivCountry(pais)}
                  className={`w-full text-left px-3 py-2.5 text-xs md:text-sm font-medium border transition flex justify-between items-center ${
                    privCountry === pais
                      ? "border-[#BF953F] bg-[#BF953F]/20 text-white font-bold"
                      : "border-[#1E293B] text-gray-400 hover:border-gray-600"
                  }`}
                >
                  <span>{pais}</span>
                  {privCountry === pais && <span className="text-[#BF953F]">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Columna 2: Selección Múltiple Excluyente */}
          <div className="bg-[#070707] p-5 border border-[#1E293B]">
            <label className="text-xs font-bold text-[#BF953F] uppercase block mb-3">
              2. ¿QUÉ DESEAS COTIZAR EN EL CATÁLOGO?
            </label>
            <div className="space-y-2">
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
                    className={`w-full text-left px-3 py-2 text-xs md:text-sm font-medium border transition flex justify-between items-center ${
                      isSelected
                        ? "border-[#BF953F] bg-[#BF953F]/20 text-white font-bold"
                        : "border-[#1E293B] text-gray-400 hover:border-gray-600"
                    }`}
                  >
                    <span>{interes}</span>
                    {isSelected && <span className="text-[#BF953F]">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Columna 3: Etapa */}
          <div className="bg-[#070707] p-5 border border-[#1E293B]">
            <label className="text-xs font-bold text-[#BF953F] uppercase block mb-3">
              3. ¿EN QUÉ ETAPA ESTÁ TU NEGOCIO HOY?
            </label>
            <div className="space-y-2">
              {[
                "Negocio en marcha buscando crecer",
                "Proyecto nuevo por lanzar",
                "Empresa consolidada / Alto volumen"
              ].map((etapa) => (
                <button
                  key={etapa}
                  type="button"
                  onClick={() => setPrivStage(etapa)}
                  className={`w-full text-left px-3 py-2.5 text-xs md:text-sm font-medium border transition flex justify-between items-center ${
                    privStage === etapa
                      ? "border-[#BF953F] bg-[#BF953F]/20 text-white font-bold"
                      : "border-[#1E293B] text-gray-400 hover:border-gray-600"
                  }`}
                >
                  <span>{etapa}</span>
                  {privStage === etapa && <span className="text-[#BF953F]">✓</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-[#1E293B]">
          <div className="text-xs md:text-sm text-gray-300">
            <strong className="text-[#BF953F]">Tu solicitud personalizada:</strong> {privateCatalogSummary}
          </div>
          <AuditTriggerButton
            label="SOLICITAR MI CATÁLOGO PRIVADO Y AGENDAR"
            selectedPlan={privateCatalogSummary}
          />
        </div>
      </div>
    </div>
  );
}
