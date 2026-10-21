"use client";

import { useState } from "react";
import AuditTriggerButton from "./AuditTriggerButton";

interface SystemPlan {
  id: string;
  badge: string;
  title: string;
  shortDesc: string;
  benefitTag: string;
  simpleExplanation: string;
  includedItems: string[];
  customOptions: string[];
  idealFor: string;
  crmBaseName: string;
  buttonText: string;
}

const SYSTEMS_DATA: SystemPlan[] = [
  {
    id: "PLAN-1",
    badge: "SERVICIO 1 · ATENCIÓN AL CLIENTE AUTOMÁTICA",
    title: "Asistentes Inteligentes para WhatsApp e Instagram (24/7)",
    shortDesc: "No pierdas más clientes por tardar en contestar. Creamos un asistente virtual inteligente que responde los mensajes de tu negocio día y noche en segundos, aclara dudas como una persona real y agenda tus citas de venta.",
    benefitTag: "Responde en 3 segundos día y noche",
    simpleExplanation: "Se conecta a tu WhatsApp e Instagram con toda la información de tus productos o servicios. Cuando alguien escribe, lo atiende con amabilidad, le pregunta qué necesita y te deja la cita lista en tu calendario.",
    includedItems: [
      "Atención inmediata las 24 horas (incluso fines de semana o mientras duermes).",
      "Respuestas naturales y amables: tus clientes sentirán que hablan con tu mejor vendedor.",
      "Descubre qué busca el cliente y cuál es su presupuesto antes de pasártelo a ti.",
      "Agenda las llamadas o visitas directamente en tu calendario sin que tengas que intervenir.",
      "Guarda el nombre, teléfono y necesidad de cada persona en tu lista de control."
    ],
    customOptions: [
      "Atender mi WhatsApp automáticamente",
      "Atender mis mensajes de Instagram",
      "Que agende citas en mi calendario solo",
      "Filtrar curiosos de clientes reales"
    ],
    idealFor: "Ideal para comercios, profesionales, médicos, clínicas, inmobiliarias y empresas que reciben mensajes todos los días y quieren vender más rápido.",
    crmBaseName: "PLAN 1 (Asistente WhatsApp/IG 24/7)",
    buttonText: "QUIERO ESTE ASISTENTE · AGENDAR CON LHYO"
  },
  {
    id: "PLAN-2",
    badge: "SERVICIO 2 · PRESENCIA EN INTERNET DE PRIMER NIVEL",
    title: "Páginas Web Modernas y Catálogos Interactivos",
    shortDesc: "Tener una página lenta o confusa espanta a las personas. Construimos tu página web elegante, rápida y tan clara que desde un joven de 15 años hasta un adulto de 70 entenderán qué vendes y podrán contratarte con un toque.",
    benefitTag: "Imagen de prestigio y fácil de usar",
    simpleExplanation: "Diseñamos tu vitrina digital a medida para que se vea impecable en cualquier celular o computadora, mostrando tus servicios de forma interactiva y conectada directo a tu agenda y WhatsApp.",
    includedItems: [
      "Diseño elegante y moderno que genera confianza inmediata en quien visita tu negocio.",
      "Carga ultra rápida en cualquier teléfono para que nadie se vaya por esperar.",
      "Catálogo interactivo donde tus clientes pueden tocar cada servicio y ver qué ofreces.",
      "Botones inteligentes conectados directo a tu calendario de citas o WhatsApp.",
      "Preparada para que las personas encuentren tu negocio fácilmente en Google."
    ],
    customOptions: [
      "Crear mi página web desde cero",
      "Renovar mi página web actual",
      "Incluir catálogo interactivo de servicios",
      "Incluir sistema de reservas de citas"
    ],
    idealFor: "Ideal para negocios, marcas personales, consultoras y empresas que quieren verse profesionales y transformar visitantes en clientes reales.",
    crmBaseName: "PLAN 2 (Página Web Moderna)",
    buttonText: "QUIERO MI PÁGINA WEB · AGENDAR CON LHYO"
  },
  {
    id: "PLAN-3",
    badge: "SERVICIO 3 · ORDEN Y CONTROL SIN TRABAJO MANUAL",
    title: "Organización Automática de Clientes y Ventas (CRM)",
    shortDesc: "Olvídate de anotar en cuadernos o perder conversaciones importantes. Conectamos tu agenda y tus redes a una tabla inteligente donde cada cliente queda registrado, ordenado y clasificado automáticamente.",
    benefitTag: "Todo tu negocio ordenado sin esfuerzo",
    simpleExplanation: "Cada vez que una persona se interesa en tus servicios o agenda contigo, el sistema toma sus datos, los guarda en tu hoja de control y te indica cuáles son los clientes más importantes.",
    includedItems: [
      "Registro automático de cada cliente nuevo con su nombre, correo, teléfono y lo que desea comprar.",
      "Clasificación inteligente que separa a los clientes de mayor presupuesto para que los atiendas primero.",
      "Eliminación del trabajo aburrido de copiar y pegar datos a mano todos los días.",
      "Panel claro y fácil de leer desde tu celular o computadora en cualquier momento.",
      "Avisos inmediatos para que nunca olvides dar seguimiento a una venta."
    ],
    customOptions: [
      "Guardar todos mis clientes en una tabla automática",
      "Separar clientes por presupuesto automáticamente",
      "Conectar mi calendario con mi hoja de control",
      "Automatizar el seguimiento de mis ventas"
    ],
    idealFor: "Ideal para dueños de negocio que quieren tener orden total en su lista de clientes y saber exactamente a quién llamar para cerrar más ventas.",
    crmBaseName: "PLAN 3 (Organización y Automatización CRM)",
    buttonText: "QUIERO ORGANIZAR MI NEGOCIO · AGENDAR CON LHYO"
  }
];

export default function InteractiveCatalog() {
  const [openId, setOpenId] = useState<string | null>("PLAN-1");

  // Estado interactivo de lo que la persona marca dentro de cada plan (Punto 3)
  const [selectedFeatures, setSelectedFeatures] = useState<Record<string, string[]>>({
    "PLAN-1": ["Atender mi WhatsApp automáticamente", "Que agende citas en mi calendario solo"],
    "PLAN-2": ["Crear mi página web desde cero", "Incluir catálogo interactivo de servicios"],
    "PLAN-3": ["Guardar todos mis clientes en una tabla automática", "Separar clientes por presupuesto automáticamente"]
  });

  // Estado interactivo para el configurador del Catálogo Privado (Punto 4)
  const [privCountry, setPrivCountry] = useState<string>("Uruguay");
  const [privInterest, setPrivInterest] = useState<string>("Paquete Completo (Todo Incluido)");
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

  const privateCatalogSummary = `SOLICITUD CATÁLOGO PRIVADO | País: ${privCountry} | Interés: ${privInterest} | Etapa: ${privStage}`;

  return (
    <div>
      {/* LISTA DE LOS 3 PLANES INTERACTIVOS */}
      <div className="grid grid-cols-1 gap-6">
        {SYSTEMS_DATA.map((item) => {
          const isOpen = openId === item.id;
          const userPicks = selectedFeatures[item.id] || [];
          const customPlanPayload = `${item.crmBaseName} | Eligió: ${userPicks.length > 0 ? userPicks.join(" + ") : "Servicio completo"}`;

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
                    {isOpen ? "▲ Ocultar detalles de este servicio" : "▼ Toca aquí para abrir y personalizar este servicio"}
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
                    {/* Columna Izquierda: Explicación clara de qué incluye */}
                    <div className="lg:col-span-7">
                      <h4 className="text-sm font-bold text-[#BF953F] uppercase tracking-wide mb-4">
                        ¿Qué incluye este servicio para tu negocio?
                      </h4>
                      <ul className="space-y-3 mb-6">
                        {item.includedItems.map((mod, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm md:text-base text-gray-200">
                            <span className="text-[#BF953F] font-bold">✓</span>
                            <span>{mod}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="text-sm text-gray-300 border-t border-[#1E293B] pt-4 leading-relaxed">
                        <strong className="text-white">En palabras simples:</strong> {item.simpleExplanation}
                      </div>
                      <div className="text-sm text-gray-300 mt-3 leading-relaxed">
                        <strong className="text-white">¿Para quién es ideal?:</strong> {item.idealFor}
                      </div>
                    </div>

                    {/* Columna Derecha: Personalizador Interactivo de este Plan (Punto 3) */}
                    <div className="lg:col-span-5 border border-[#BF953F]/50 bg-[#0B132B]/70 p-6 flex flex-col justify-between">
                      <div>
                        <div className="text-xs font-bold text-[#BF953F] uppercase tracking-wide mb-1">
                          PASO INTERACTIVO · PERSONALIZA TU ELECCIÓN
                        </div>
                        <p className="text-sm text-white font-semibold mb-4">
                          Toca las opciones que más te interesan de este servicio (se enviarán a nuestra llamada):
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
                                <span className="font-bold text-[#BF953F]">
                                  {isSelected ? "✓ Seleccionado" : "+ Elegir"}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        <div className="text-xs text-gray-300 bg-[#070707] p-3 border border-[#1E293B] mb-5">
                          <strong className="text-[#BF953F]">Resumen que recibirá Lhyo:</strong> {customPlanPayload}
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

      {/* SECCIÓN 4: CONFIGURADOR PERSONALIZADO PARA SOLICITAR EL CATÁLOGO PRIVADO (PUNTO 4) */}
      <div className="mt-16 p-8 md:p-10 border-2 border-[#BF953F] bg-[#0B132B]">
        <div className="max-w-3xl mb-8">
          <span className="text-xs font-bold text-[#BF953F] uppercase tracking-wider block mb-2">
            SOLICITUD DE TARIFAS Y PLANES A MEDIDA SEGÚN TU PAÍS
          </span>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
            ¿Deseas recibir nuestro Catálogo Privado con los precios para tu país?
          </h3>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed">
            Como atendemos negocios en distintos países y provincias, entregamos nuestro catálogo de precios de forma personalizada. Selecciona estas 3 opciones rápidas para preparar tu Catálogo Privado antes de nuestra videollamada:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Pregunta Interactiva 1: País */}
          <div className="bg-[#070707] p-5 border border-[#1E293B]">
            <label className="text-xs font-bold text-[#BF953F] uppercase block mb-3">
              1. ¿En qué país está tu negocio?
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

          {/* Pregunta Interactiva 2: Qué precios desea ver */}
          <div className="bg-[#070707] p-5 border border-[#1E293B]">
            <label className="text-xs font-bold text-[#BF953F] uppercase block mb-3">
              2. ¿Qué deseas cotizar en el catálogo?
            </label>
            <div className="space-y-2">
              {[
                "Paquete Completo (Todo Incluido)",
                "Asistente de WhatsApp / IG 24/7",
                "Página Web Moderna",
                "Organización de Clientes (CRM)"
              ].map((interes) => (
                <button
                  key={interes}
                  type="button"
                  onClick={() => setPrivInterest(interes)}
                  className={`w-full text-left px-3 py-2 text-xs md:text-sm font-medium border transition flex justify-between items-center ${
                    privInterest === interes
                      ? "border-[#BF953F] bg-[#BF953F]/20 text-white font-bold"
                      : "border-[#1E293B] text-gray-400 hover:border-gray-600"
                  }`}
                >
                  <span>{interes}</span>
                  {privInterest === interes && <span className="text-[#BF953F]">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Pregunta Interactiva 3: Etapa actual */}
          <div className="bg-[#070707] p-5 border border-[#1E293B]">
            <label className="text-xs font-bold text-[#BF953F] uppercase block mb-3">
              3. ¿En qué etapa está tu negocio hoy?
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
