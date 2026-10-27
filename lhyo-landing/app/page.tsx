import { Metadata } from "next";
import MainWorkspace from "@/components/MainWorkspace";

export const metadata: Metadata = {
  metadataBase: new URL("https://lhyogroup.vercel.app"),
  applicationName: "LHYO GROUP",
  title: {
    default: "LHYO GROUP",
    template: "%s | LHYO GROUP",
  },
  description:
    "Desarrollamos páginas web corporativas modernas, catálogos digitales, asistentes inteligentes con IA 24/7 para WhatsApp e Instagram y sistemas de organización automática de clientes y ventas (CRM) para impulsar el crecimiento de empresas y profesionales en Uruguay, Venezuela y a nivel internacional.",
  keywords: [
    "LHYO GROUP",
    "Lhyo Group",
    "Lhyo Growth",
    "Lhyo Systems",
    "Lhyonneth Araque",
    "Lhyo Group oficial",
    "agencia de inteligencia artificial",
    "agencia de automatización de negocios",
    "asistentes inteligentes para WhatsApp",
    "asistentes inteligentes para Instagram",
    "chatbot con inteligencia artificial WhatsApp 24/7",
    "automatizar atención al cliente WhatsApp",
    "vender más por WhatsApp automáticamente",
    "agendamiento automático de citas por WhatsApp",
    "diseño de páginas web corporativas",
    "desarrollo de páginas web modernas para empresas",
    "crear página web profesional",
    "catálogos digitales interactivos",
    "páginas web de alta conversión B2B",
    "organización automática de clientes CRM",
    "sistema CRM automatizado para empresas",
    "automatización de ventas y seguimiento comercial",
    "integración de Make y CRM para negocios",
    "soluciones digitales para clínicas y consultorios",
    "soluciones digitales para firmas de abogados y contadores",
    "soluciones digitales para inmobiliarias y comercios",
    "agencia de páginas web y automatización en Uruguay",
    "agencia de páginas web y automatización en Montevideo",
    "agencia de páginas web y automatización en Venezuela",
    "agencia de páginas web y automatización en Mérida",
    "consultoría de transformación digital e IA",
    "implementación de sistemas comerciales automatizados"
  ],
  authors: [{ name: "Lhyonneth Araque - CEO LHYO GROUP", url: "https://lhyogroup.vercel.app" }],
  creator: "LHYO GROUP",
  publisher: "LHYO GROUP",
  verification: {
    google: "yFCVXdhuZSVXSoIv7r9xV69G6QO2B028ZX9ZWGZIG8o",
  },
  alternates: {
    canonical: "https://lhyogroup.vercel.app",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: ["/icon.svg"],
    apple: ["/icon.svg"],
  },
  openGraph: {
    title: "LHYO GROUP",
    description:
      "Desarrollamos páginas web corporativas modernas, asistentes inteligentes con IA 24/7 para WhatsApp e Instagram y sistemas de organización automática de clientes y ventas (CRM) para empresas y profesionales.",
    url: "https://lhyogroup.vercel.app",
    siteName: "LHYO GROUP",
    locale: "es_UY",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LHYO GROUP",
    description:
      "Páginas web corporativas modernas, asistentes inteligentes 24/7 para WhatsApp e Instagram y sistemas de organización automática de clientes (CRM).",
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

export default function LandingPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://lhyogroup.vercel.app/#website",
        url: "https://lhyogroup.vercel.app",
        name: "LHYO GROUP",
        alternateName: ["Lhyo Group", "Lhyo Growth"],
        publisher: { "@id": "https://lhyogroup.vercel.app/#organization" },
        inLanguage: "es"
      },
      {
        "@type": "ProfessionalService",
        "@id": "https://lhyogroup.vercel.app/#organization",
        name: "LHYO GROUP",
        alternateName: ["Lhyo Group", "Lhyo Growth", "Lhyo Systems"],
        url: "https://lhyogroup.vercel.app",
        logo: "https://lhyogroup.vercel.app/icon.svg",
        image: "https://lhyogroup.vercel.app/icon.svg",
        founder: {
          "@type": "Person",
          name: "Lhyonneth Araque",
          jobTitle: "CEO & Founder"
        },
        description:
          "Desarrollamos páginas web corporativas modernas, catálogos digitales, asistentes inteligentes con IA 24/7 para WhatsApp e Instagram y sistemas de organización automática de clientes y ventas (CRM) para empresas y profesionales.",
        areaServed: [
          { "@type": "Country", name: "Uruguay" },
          { "@type": "Country", name: "Venezuela" },
          { "@type": "Country", name: "United States" },
          { "@type": "Country", name: "Spain" }
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Servicios de LHYO GROUP",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Asistentes Inteligentes para WhatsApp e Instagram (24/7)",
                description: "Atención automatizada 24 horas, respuestas inmediatas a clientes y agendamiento automático de citas comerciales."
              }
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Páginas Web Modernas y Catálogos Digitales",
                description: "Diseño y desarrollo de páginas web corporativas rápidas, elegantes y conectadas a WhatsApp y calendario de reservas."
              }
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Organización Automática de Clientes y Ventas (CRM)",
                description: "Registro y clasificación automática de clientes potenciales y control total de oportunidades de venta."
              }
            }
          ]
        }
      }
    ]
  };

  return (
    <main className="min-h-screen bg-[#070707] text-white selection:bg-[#BF953F] selection:text-[#070707]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <MainWorkspace />
    </main>
  );
}
