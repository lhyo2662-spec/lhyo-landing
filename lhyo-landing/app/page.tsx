import { Metadata } from "next";
import AuditTriggerButton from "@/components/AuditTriggerButton";
import InteractiveCatalog from "@/components/InteractiveCatalog";
import BrandLogo from "@/components/BrandLogo";
import LiveAiSimulator from "@/components/LiveAiSimulator";
import DirectContactSection from "@/components/DirectContactSection";
import FloatingOmniDock from "@/components/FloatingOmniDock";

export const metadata: Metadata = {
  metadataBase: new URL("https://lhyogroup.vercel.app"),
  title: {
    default: "LHYO GROUP | Páginas Web, Asistentes IA 24/7 para WhatsApp y Automatización CRM",
    template: "%s | LHYO GROUP",
  },
  description:
    "Lhyo Group (Lhyo Growth): Especialistas en desarrollo de páginas web corporativas modernas, asistentes inteligentes con IA para WhatsApp e Instagram 24/7 y sistemas de automatización de clientes (CRM) en Uruguay, Venezuela e Internacional.",
  keywords: [
    "Lhyo Group",
    "Lhyo Growth",
    "Lhyo Systems",
    "Lhyonneth Araque",
    "agencia de automatización e inteligencia artificial",
    "asistentes inteligentes para WhatsApp",
    "chatbots con IA para WhatsApp e Instagram",
    "automatizar ventas por WhatsApp",
    "diseño de páginas web corporativas",
    "crear página web profesional para empresas",
    "desarrollo web moderno Uruguay",
    "desarrollo web moderno Venezuela",
    "sistema CRM automatizado para negocios",
    "organizar clientes y ventas automáticamente",
    "soluciones digitales para empresas B2B"
  ],
  authors: [{ name: "Lhyonneth Araque", url: "https://lhyogroup.vercel.app" }],
  creator: "Lhyo Group",
  publisher: "Lhyo Group",
  verification: {
    google: "yFCVXdhuZSVXSoIv7r9xV69G6QO2B028ZX9ZWGZIG8o",
  },
  alternates: {
    canonical: "https://lhyogroup.vercel.app",
  },
  openGraph: {
    title: "LHYO GROUP | Soluciones Digitales, Páginas Web y Automatización con IA",
    description:
      "Impulsamos el crecimiento de su negocio con páginas web de alto nivel, asistentes inteligentes 24/7 en WhatsApp e Instagram y automatización comercial CRM.",
    url: "https://lhyogroup.vercel.app",
    siteName: "LHYO GROUP",
    locale: "es_UY",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LHYO GROUP | Páginas Web, Asistentes IA 24/7 y Automatización CRM",
    description:
      "Desarrollamos páginas web corporativas, asistentes inteligentes que atienden 24/7 y sistemas automatizados de ventas.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const TRUST_SEALS = [
  {
    title: "CALIDAD SUPERIOR",
    subtitle: "Sistemas veloces, estables y desarrollados a la medida de su empresa."
  },
  {
    title: "ATENCIÓN 24 HORAS",
    subtitle: "Sus clientes reciben respuesta inmediata y profesional en todo momento."
  },
  {
    title: "IMPLEMENTACIÓN INTEGRAL",
    subtitle: "Ejecución llave en mano donde configuramos todo el sistema por usted."
  },
  {
    title: "PRESENCIA GLOBAL",
    subtitle: "Operación activa en Uruguay, Venezuela y cobertura a nivel internacional."
  },
];

export default function LandingPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": "https://lhyogroup.vercel.app/#organization",
        name: "Lhyo Group",
        alternateName: ["LHYO GROUP", "Lhyo Growth", "Lhyo Systems"],
        url: "https://lhyogroup.vercel.app",
        founder: {
          "@type": "Person",
          name: "Lhyonneth Araque",
          jobTitle: "CEO & Founder"
        },
        description:
          "Empresa especializada en desarrollo de páginas web corporativas, asistentes inteligentes de atención automatizada 24/7 para WhatsApp e Instagram y sistemas CRM para negocios y profesionales.",
        areaServed: [
          { "@type": "Country", name: "Uruguay" },
          { "@type": "Country", name: "Venezuela" },
          { "@type": "Country", name: "United States" },
          { "@type": "Country", name: "Spain" }
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Catálogo de Soluciones Digitales y Automatización",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Asistentes Inteligentes para WhatsApp e Instagram (24/7)",
                description: "Atención automatizada 24/7, cualificación de clientes y agendamiento automático de citas comerciales."
              }
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Páginas Web Modernas y Catálogos Digitales Corporativos",
                description: "Diseño y programación de sitios web corporativos rápidos, elegantes y enfocados en conversión de clientes."
              }
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Organización Automática de Clientes y Ventas (CRM)",
                description: "Centralización automática de prospectos, clasificación por prioridad y seguimiento comercial."
              }
            }
          ]
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://lhyogroup.vercel.app/#website",
        url: "https://lhyogroup.vercel.app",
        name: "LHYO GROUP | Soluciones Digitales y Automatización IA",
        publisher: { "@id": "https://lhyogroup.vercel.app/#organization" },
        inLanguage: "es"
      }
    ]
  };

  return (
    <main className="min-h-screen bg-[#070707] text-white selection:bg-[#BF953F] selection:text-[#070707]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <header className="border-b border-[#1E293B] bg-[#070707]/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 h-20 flex justify-between items-center">
          <BrandLogo />
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold tracking-wider text-gray-300">
            <a href="#catalogo" className="hover:text-[#BF953F] transition">SERVICIOS Y PLANES</a>
            <a href="#garantia" className="hover:text-[#BF953F] transition">NUESTRA GARANTÍA</a>
            <a href="#contacto" className="hover:text-[#BF953F] transition">CONTACTO</a>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-[#1E293B] px-6 py-24 md:px-16 lg:px-24 max-w-7xl mx-auto">
        <div className="relative z-10 max-w-3xl">
          <div className="mb-4 text-xs font-bold tracking-wider text-[#BF953F] uppercase">
            INNOVACIÓN, PRESENCIA DIGITAL Y AUTOMATIZACIÓN COMERCIAL
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-8">
            Impulsamos el crecimiento de su negocio con tecnología inteligente y diseño de alto nivel
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-12 font-normal leading-relaxed">
            Desarrollamos páginas web corporativas, asistentes inteligentes que atienden a sus clientes las 24 horas y sistemas automatizados que organizan sus ventas con total precisión.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <AuditTriggerButton 
              label="AGENDAR AUDITORÍA Y RECIBIR CATÁLOGO" 
              selectedPlan="AUDITORÍA GENERAL (Botón Principal)" 
            />
          </div>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none select-none absolute right-4 md:right-12 lg:right-20 top-1/2 -translate-y-1/2 z-0 opacity-20 md:opacity-35 transition-opacity duration-500"
        >
          <svg
            viewBox="0 0 120 110"
            className="w-64 h-64 md:w-96 md:h-96 lg:w-[430px] lg:h-[430px] -rotate-[22deg] drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="lhyoMonogramGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F8FAFC" stopOpacity="0.95" />
                <stop offset="55%" stopColor="#E2E8F0" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#BF953F" stopOpacity="0.55" />
              </linearGradient>
            </defs>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10 42 L40 18 L40 70 L102 70 L84 96 L28 96 L28 80 L10 80 Z M20 46 L30 38 L30 70 L20 70 Z M40 80 L86 80 L80 87 L40 87 Z"
              fill="url(#lhyoMonogramGrad)"
            />
            <path
              d="M48 11 L58 3 L58 63 L48 63 Z"
              fill="url(#lhyoMonogramGrad)"
            />
          </svg>
        </div>
      </section>

      <section id="garantia" className="scroll-mt-36 border-b border-[#1E293B] bg-[#0B132B]/40">
        <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {TRUST_SEALS.map((seal) => (
              <div
                key={seal.title}
                className="seal-card-lhyo p-6 h-full flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-0.5 bg-[#BF953F] mb-4" />
                  <h3 className="font-bold text-base tracking-wide text-[#FCF6BA] mb-2">
                    {seal.title}
                  </h3>
                </div>
                <p className="text-xs text-gray-200 leading-relaxed">
                  {seal.subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="catalogo" className="scroll-mt-20 px-6 pt-12 pb-24 md:px-16 lg:px-24 max-w-7xl mx-auto border-b border-[#1E293B]">
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-10 border-b border-[#1E293B] pb-6">
          <div>
            <span className="text-xs font-bold text-[#BF953F] uppercase tracking-wider">
              SOLUCIONES EMPRESARIALES A MEDIDA
            </span>
            <h2 className="text-3xl font-bold mt-2">CATÁLOGO DE SERVICIOS</h2>
          </div>
          <span className="text-sm text-gray-300 mt-2 md:mt-0">
            Seleccione cualquier servicio para conocer su alcance y personalizar su solicitud
          </span>
        </div>

        <InteractiveCatalog />
      </section>

      <LiveAiSimulator />
      <DirectContactSection />
      <FloatingOmniDock />
    </main>
  );
}

