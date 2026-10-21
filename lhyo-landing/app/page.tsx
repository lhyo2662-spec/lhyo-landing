import { Metadata } from "next";
import AuditTriggerButton from "@/components/AuditTriggerButton";
import InteractiveCatalog from "@/components/InteractiveCatalog";

export const metadata: Metadata = {
  title: "LHYO GROUP | Arquitectura de Sistemas, IA y Automatización",
  description: "Infraestructura de sistemas, automatización e inteligencia artificial para escalar operaciones.",
  robots: { index: true, follow: true },
};

const TRUST_SEALS = [
  { code: "SEAL-01", title: "ARQUITECTURA SUIZA", subtitle: "Diseño de Alta Precisión" },
  { code: "SEAL-02", title: "LATENCIA CERO", subtitle: "Infraestructura Edge Cloud" },
  { code: "SEAL-03", title: "SEGURIDAD API", subtitle: "Webhooks Encriptados" },
  { code: "SEAL-04", title: "ALCANCE GLOBAL", subtitle: "Operación Multi-País" },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#070707] text-white selection:bg-[#BF953F] selection:text-[#070707]">
      <header className="border-b border-[#1E293B] bg-[#070707]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-[#BF953F] bg-[#0B132B] flex items-center justify-center font-mono font-bold text-[#BF953F] text-sm">
              LG
            </div>
            <div>
              <span className="font-bold tracking-widest text-sm block">LHYO GROUP</span>
              <span className="text-[10px] font-mono text-gray-400 block">SYSTEMS & AUTOMATION</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-xs font-mono text-gray-400">
            <a href="#catalogo" className="hover:text-[#BF953F] transition">PLANES Y SISTEMAS</a>
            <a href="#garantia" className="hover:text-[#BF953F] transition">SELLOS DE CALIDAD</a>
            <a href="#contacto" className="hover:text-[#BF953F] transition">CONTACTO</a>
          </div>
        </div>
      </header>

      <section className="border-b border-[#1E293B] px-6 py-24 md:px-16 lg:px-24 max-w-7xl mx-auto">
        <div className="mb-4 text-xs font-mono tracking-widest text-[#BF953F] uppercase">
          {"[ INFRAESTRUCTURA DIGITAL & AUTOMATIZACIÓN // V.2026 ]"}
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-none mb-8 max-w-4xl">
          Ingeniería de Sistemas y Automatización para Escalar sin Fricción
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12 font-light">
          Construimos la infraestructura tecnológica, páginas web de élite y agentes de inteligencia artificial que captan, filtran y agendan clientes para tu negocio de forma 100% autónoma.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <AuditTriggerButton label="AGENDAR AUDITORÍA Y RECIBIR CATÁLOGO" serviceTag="hero_cta" />
        </div>
      </section>

      <section id="garantia" className="border-b border-[#1E293B] bg-[#0B132B]/40">
        <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {TRUST_SEALS.map((seal) => (
            <div key={seal.code} className="border border-[#1E293B] bg-[#070707] p-5">
              <div className="text-[10px] font-mono text-[#BF953F] mb-1">{seal.code}</div>
              <div className="font-bold text-sm tracking-wide">{seal.title}</div>
              <div className="text-xs text-gray-400 mt-1">{seal.subtitle}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="catalogo" className="px-6 py-24 md:px-16 lg:px-24 max-w-7xl mx-auto border-b border-[#1E293B]">
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-12 border-b border-[#1E293B] pb-6">
          <div>
            <span className="text-xs font-mono text-[#BF953F] uppercase tracking-widest">
              {"// HAZ CLIC EN CADA PLAN PARA DESPLEGAR SUS ENTREGABLES"}
            </span>
            <h2 className="text-3xl font-bold mt-2">CATÁLOGO INTERACTIVO DE SISTEMAS</h2>
          </div>
          <span className="text-xs font-mono text-gray-400 mt-2 md:mt-0">
            * Selecciona un sistema para inspeccionar su alcance técnico
          </span>
        </div>

        <InteractiveCatalog />

        <div className="mt-16 p-8 border border-[#1E293B] bg-[#0B132B] flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold mb-2">¿Deseas recibir el Catálogo Privado con las tarifas para tu país?</h3>
            <p className="text-sm text-gray-400">
              Agenda tu auditoría diagnóstica de 30 minutos y te entregaremos la propuesta formal adaptada a tu mercado operativo.
            </p>
          </div>
          <AuditTriggerButton label="SOLICITAR CATÁLOGO PRIVADO" serviceTag="catalog_footer_cta" />
        </div>
      </section>

      <footer id="contacto" className="px-6 py-16 md:px-16 lg:px-24 max-w-7xl mx-auto text-sm text-gray-400">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-[#1E293B]">
          <div>
            <div className="font-bold text-white tracking-widest mb-3">LHYO GROUP</div>
            <p className="text-xs leading-relaxed">
              Firma de Ingeniería de Sistemas, Automatización de Procesos, Diseño Web Suizo e Inteligencia Artificial Aplicada.
            </p>
          </div>
          <div>
            <div className="font-mono text-xs text-[#BF953F] uppercase mb-3">CONTACTO DIRECTO</div>
            <p className="text-xs mb-2">Atención Ejecutiva / WhatsApp: +598 00 000 000</p>
            <p className="text-xs mb-2">Email Corporativo: contacto@lhyogroup.com</p>
            <p className="text-xs">Dirección General: Lhyonneth Araque (CEO)</p>
          </div>
          <div>
            <div className="font-mono text-xs text-[#BF953F] uppercase mb-3">OPERACIÓN INTERNACIONAL</div>
            <p className="text-xs mb-2">• Uruguay (Montevideo)</p>
            <p className="text-xs mb-2">• Venezuela (Mérida / Nacional)</p>
            <p className="text-xs">• Cobertura Remota Global (LATAM / USA / EU)</p>
          </div>
        </div>
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs font-mono text-gray-600">
          <span>© 2026 LHYO GROUP. TODOS LOS DERECHOS RESERVADOS.</span>
          <span>ARQUITECTURA: ARKOS · LUMINA · KINETIX</span>
        </div>
      </footer>
    </main>
  );
}
