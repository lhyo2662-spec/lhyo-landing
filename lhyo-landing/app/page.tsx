import { Metadata } from "next";
import AuditTriggerButton from "@/components/AuditTriggerButton";

export const metadata: Metadata = {
  title: "LHYO GROUP | Arquitectura de Sistemas, IA y Crecimiento B2B",
  description: "Infraestructura de sistemas, automatización y agendamiento B2B de alta conversión.",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://lhyogroup.com" },
  openGraph: {
    title: "LHYO GROUP | Ingeniería de Conversión y Automatización",
    description: "Sistemas automatizados y agendamiento B2B para escalar operaciones.",
    url: "https://lhyogroup.com",
    siteName: "Lhyo Group",
    type: "website",
  },
};

const CATALOG_SERVICES = [
  {
    id: "SYS-01",
    tag: "AUTOMATIZACIÓN & IA",
    title: "Arquitectura de Agentes y Flujos Autónomos",
    desc: "Sistemas inteligentes integrados a tus canales de captación para eliminar la fricción operativa.",
    metrics: "LATENCIA: 0ms | DISPONIBILIDAD: 99.9%",
  },
  {
    id: "SYS-02",
    tag: "ARQUITECTURA DE CONVERSIÓN",
    title: "Ecosistemas Web de Élite",
    desc: "Interfaces ultra-rápidas diseñadas con retícula suiza y optimizadas para la conversión B2B.",
    metrics: "CARGA: <1.2s | DISEÑO: SUIZO",
  },
  {
    id: "SYS-03",
    tag: "ECOSISTEMAS B2B HIGH-TICKET",
    title: "Tuberías de Datos y CRMs",
    desc: "Conexión directa entre pasarelas de agendamiento, webhooks y bases de datos automatizadas.",
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

      <section className="border-b border-[#1E293B] px-6 py-28 md:px-16 lg:px-24 max-w-7xl mx-auto">
        <div className="mb-4 text-xs font-mono tracking-widest text-[#BF953F] uppercase">
          {"[ SISTEMA OPERATIVO DE ESCALADO B2B // V.2026 ]"}
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-none mb-8 max-w-4xl">
          Ingeniería de Sistemas y Automatización para Escalar sin Fricción
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12 font-light">
          Diseñamos la infraestructura invisible que cualifica, agenda y sincroniza a tus clientes potenciales de forma 100% autónoma.
        </p>
        <AuditTriggerButton label="AGENDAR AUDITORÍA" serviceTag="hero_cta" />
      </section>

      <section className="px-6 py-24 md:px-16 lg:px-24 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12 border-b border-[#1E293B] pb-6">
          <div>
            <span className="text-xs font-mono text-[#BF953F] uppercase tracking-widest">
              {"// INFRAESTRUCTURA DE SERVICIOS"}
            </span>
            <h2 className="text-3xl font-bold mt-2">CATÁLOGO DE SISTEMAS</h2>
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
          <AuditTriggerButton label="AGENDAR AUDITORÍA" serviceTag="catalog_footer_cta" />
        </div>
      </section>
    </main>
  );
}