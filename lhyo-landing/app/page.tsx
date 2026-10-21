import { Metadata } from "next";
import AuditTriggerButton from "@/components/AuditTriggerButton";
import InteractiveCatalog from "@/components/InteractiveCatalog";

export const metadata: Metadata = {
  title: "LHYO GROUP | Páginas Web, Asistentes Inteligentes y Automatización",
  description: "Ayudamos a tu negocio a atender más rápido, verse profesional y organizar sus ventas en automático.",
  robots: { index: true, follow: true },
};

const TRUST_SEALS = [
  { badge: "COMPROMISO 01", title: "CALIDAD SUPERIOR", subtitle: "Sistemas rápidos, elegantes y hechos a la medida de tu negocio" },
  { badge: "COMPROMISO 02", title: "ATENCIÓN 24 HORAS", subtitle: "Tus clientes reciben respuesta inmediata aunque estés ocupado" },
  { badge: "COMPROMISO 03", title: "CERO COMPLICACIONES", subtitle: "Nosotros dejamos todo listo y funcionando paso a paso por ti" },
  { badge: "COMPROMISO 04", title: "PRESENCIA GLOBAL", subtitle: "Atención personalizada en Uruguay, Venezuela y todo el mundo" },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#070707] text-white selection:bg-[#BF953F] selection:text-[#070707]">
      <header className="border-b border-[#1E293B] bg-[#070707]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 border border-[#BF953F] bg-[#0B132B] flex items-center justify-center font-bold text-[#BF953F] text-sm">
              LG
            </div>
            <div>
              <span className="font-bold tracking-widest text-sm block">LHYO GROUP</span>
              <span className="text-[11px] text-gray-400 block">SOLUCIONES DIGITALES PARA NEGOCIOS</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-xs font-bold tracking-wider text-gray-300">
            <a href="#catalogo" className="hover:text-[#BF953F] transition">SERVICIOS Y PLANES</a>
            <a href="#garantia" className="hover:text-[#BF953F] transition">NUESTRA GARANTÍA</a>
            <a href="#contacto" className="hover:text-[#BF953F] transition">CONTACTO</a>
          </div>
        </div>
      </header>

      {/* SECCIÓN PRINCIPAL (PRIMER BOTÓN INTACTO PARA AUDITORÍA NORMAL) */}
      <section className="border-b border-[#1E293B] px-6 py-24 md:px-16 lg:px-24 max-w-7xl mx-auto">
        <div className="mb-4 text-xs font-bold tracking-wider text-[#BF953F] uppercase">
          SOLUCIONES MODERNAS Y FÁCILES DE ENTENDER PARA TU EMPRESA
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-8 max-w-4xl">
          Hacemos que tu negocio venda más, se vea increíble y atienda en automático
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-12 font-normal leading-relaxed">
          Diseñamos páginas web modernas, creamos asistentes virtuales que responden tu WhatsApp las 24 horas y organizamos toda tu lista de clientes para que no pierdas ni una sola venta.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <AuditTriggerButton 
            label="AGENDAR AUDITORÍA Y RECIBIR CATÁLOGO" 
            selectedPlan="AUDITORÍA GENERAL (Botón Principal)" 
          />
        </div>
      </section>

      <section id="garantia" className="border-b border-[#1E293B] bg-[#0B132B]/40">
        <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {TRUST_SEALS.map((seal) => (
            <div key={seal.badge} className="border border-[#1E293B] bg-[#070707] p-6">
              <div className="text-xs font-bold text-[#BF953F] mb-1">{seal.badge}</div>
              <div className="font-bold text-base tracking-wide text-white">{seal.title}</div>
              <div className="text-xs text-gray-300 mt-2 leading-relaxed">{seal.subtitle}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="catalogo" className="px-6 py-24 md:px-16 lg:px-24 max-w-7xl mx-auto border-b border-[#1E293B]">
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-12 border-b border-[#1E293B] pb-6">
          <div>
            <span className="text-xs font-bold text-[#BF953F] uppercase tracking-wider">
              EXPLORA Y PERSONALIZA LO QUE NECESITAS
            </span>
            <h2 className="text-3xl font-bold mt-2">CATÁLOGO INTERACTIVO DE SERVICIOS</h2>
          </div>
          <span className="text-sm text-gray-300 mt-2 md:mt-0">
            Toca cualquier servicio para ver qué incluye y marcar las opciones que te interesan
          </span>
        </div>

        <InteractiveCatalog />
      </section>

      <footer id="contacto" className="px-6 py-16 md:px-16 lg:px-24 max-w-7xl mx-auto text-sm text-gray-300">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-[#1E293B]">
          <div>
            <div className="font-bold text-white tracking-widest mb-3">LHYO GROUP</div>
            <p className="text-xs leading-relaxed text-gray-400">
              Especialistas en ayudar a negocios y profesionales a crecer en internet con páginas web de lujo, asistentes de atención automática y organización de clientes.
            </p>
          </div>
          <div>
            <div className="font-bold text-xs text-[#BF953F] uppercase tracking-wider mb-3">CONTACTO DIRECTO</div>
            <p className="text-xs mb-2">Atención Ejecutiva / WhatsApp: +598 00 000 000</p>
            <p className="text-xs mb-2">Email Corporativo: contacto@lhyogroup.com</p>
            <p className="text-xs">Dirección General: Lhyonneth Araque (CEO)</p>
          </div>
          <div>
            <div className="font-bold text-xs text-[#BF953F] uppercase tracking-wider mb-3">OPERACIÓN INTERNACIONAL</div>
            <p className="text-xs mb-2">• Uruguay (Montevideo)</p>
            <p className="text-xs mb-2">• Venezuela (Mérida / Nacional)</p>
            <p className="text-xs">• Cobertura Online en todo el mundo</p>
          </div>
        </div>
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500">
          <span>© 2026 LHYO GROUP. TODOS LOS DERECHOS RESERVADOS.</span>
          <span>SOLUCIONES DIGITALES Y AUTOMATIZACIÓN</span>
        </div>
      </footer>
    </main>
  );
}
