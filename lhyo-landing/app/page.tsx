import { Metadata } from "next";
import AuditTriggerButton from "@/components/AuditTriggerButton";

export const metadata: Metadata = {
  title: "LHYO GROUP | Arquitectura de Sistemas, IA y Crecimiento B2B",
  description: "Infraestructura de IA, agentes autónomos 24/7 y sistemas web de alta conversión. Eliminamos la latencia humana para escalar empresas B2B. Agenda hoy.",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://lhyogroup.com" },
  openGraph: {
    title: "LHYO GROUP | Ingeniería de Conversión y Automatización",
    description: "Tu crecimiento está secuestrado por la latencia humana. Desplegamos ecosistemas de IA y arquitecturas de conversión B2B que operan y venden 24/7 sin fricción.",
    url: "https://lhyogroup.com",
    siteName: "Lhyo Group",
    type: "website",
  },
};

const CATALOG_SERVICES = [
  {
    id: "SYS-01",
    tag: "AUTOMATIZACIÓN & IA",
    title: "Empleados Digitales & Agentes Cognitivos IA",
    desc: "Olvida los bots rígidos que frustran a tus clientes. Desplegamos agentes entrenados con la base de datos de tu empresa que resuelven objeciones, califican leads y agendan reuniones en WhatsApp o Instagram a las 3:00 AM como tu mejor cerrador.",
    metrics: "LATENCIA: 0ms | DISPONIBILIDAD: 99.9%",
  },
  {
    id: "SYS-02",
    tag: "ARQUITECTURA DE CONVERSIÓN",
    title: "Ingeniería Web de Élite & Embudos B2B",
    desc: "Una web que solo luce bien es un pasivo financiero. Construimos arquitecturas persuasivas bajo rigor estético suizo y neuroventas con un único propósito matemático: transformar tráfico frío en citas calificadas de alto valor.",
    metrics: "CARGA: <1.2s | DISEÑO: SUIZO",
  },
  {
    id: "SYS-03",
    tag: "ECOSISTEMAS B2B HIGH-TICKET",
    title: "Interconexión de Sistemas & Flujos Autónomos",
    desc: "Si tu equipo mueve datos manualmente entre plataformas, estás quemando capital. Conectamos tu CRM, pasarelas de pago, calendarios y canales de adquisición en un sistema nervioso central sin errores humanos ni fugas de dinero.",
    metrics: "INTEGRACIÓN: API REST / WEBHOOKS",
  },
];

export default function LandingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Lhyo Group",
    "url": "https://lhyogroup.com",
    "founder": { "@type": "Person", "name": "Lhyonneth Araque" },
    "description": "Agencia B2B de Automatización de Sistemas, Inteligencia Artificial y Estrategia de Conversión.",
  };

  return (
    <main className="min-h-screen bg-[#070707] text-white selection:bg-[#BF953F] selection:text-[#070707]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* SECCIÓN HERO - Retícula Suiza */}
      <section className="border-b border-[#1E293B] px-6 py-28 md:px-16 lg:px-24 max-w-7xl mx-auto">
        <div className="mb-4 text-xs font-mono tracking-widest text-[#BF953F] uppercase">
          [ SISTEMA OPERATIVO DE ESCALADO B2B // V.2026 ]
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-none mb-8 max-w-4xl">
          Tu crecimiento está secuestrado por la latencia humana. Nosotros lo liberamos con Inteligencia Artificial.
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12 font-light">
          Diseñamos, entrenamos e implementamos ecosistemas automatizados y agentes digitales B2B. Operan 24/7, no piden vacaciones y califican prospectos en milisegundos. Tu empresa al ritmo de las máquinas.
        </p>
        <AuditTriggerButton label="AGENDAR AUDITORÍA DE ESCALABILIDAD" serviceTag="hero_cta" />
      </section>

      {/* SECCIÓN CATÁLOGO - Tarjetas 1px sin sombras difusas */}
      <section className="px-6 py-24 md:px-16 lg:px-24 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12 border-b border-[#1E293B] pb-6">
          <div>
            <span className="text-xs font-mono text-[#BF953F] uppercase tracking-widest">
              // INFRAESTRUCTURA DE SERVICIOS
            </span>
            <h2 className="text-3xl font-bold mt-2">ARSENAL DE ÉLITE CORPORATIVA</h2>
          </div>
          <span className="text-xs font-mono text-gray-500 hidden md:block">
            STATUS: ONLINE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CATALOG_SERVICES.map((item) => (
            <article key={item.id} className="swiss-card p-8 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center text-xs font-mono text-gray-400 mb-6 pb-4 border-b border-[#1E293B]">
                  <span>ID: {item.id}</span>
                  <span className="text-[#BF953F]">{item.tag}</span>
                </div>
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-8">
                  {item.desc}
                </p>
              </div>
              <div className="pt-4 border-t border-[#1E293B] flex justify-between items-center">
                <span className="text-[11px] font-mono text-gray-500">{item.metrics}</span>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 text-center">
          <AuditTriggerButton label="APLICAR PARA UNA AUDITORÍA HOY" serviceTag="catalog_footer_cta" />
        </div>
      </section>
    </main>
  );
}