import { Metadata } from "next";
import MainWorkspace from "@/components/MainWorkspace";

export const metadata: Metadata = {
  metadataBase: new URL("https://lhyogroup.com"),
  applicationName: "Lhyo Group",
  title: {
    default: "Lhyo Group | Infraestructura Enterprise y Automatización B2B",
    template: "%s | Lhyo Group",
  },
  description:
    "Firma de ingeniería e infraestructura Enterprise B2B. Migramos operaciones corporativas a servidores privados n8n (Self-hosted), construimos Agentes RAG con memoria institucional privada y desarrollamos ecosistemas SaaS internos a medida para mitigar la fuga de capital y escalar con soberanía tecnológica.",
  keywords: [
    "Lhyo Group",
    "LHYO GROUP",
    "infraestructura enterprise",
    "automatización B2B",
    "n8n self-hosted",
    "servidores privados n8n",
    "Agentes RAG",
    "memoria institucional privada",
    "inteligencia artificial corporativa privada",
    "SaaS corporativo interno",
    "desarrollo de ecosistemas SaaS B2B",
    "mitigación de fuga de capital",
    "arquitectura de sistemas empresariales",
    "soberanía tecnológica",
    "Lhyonneth Araque"
  ],
  authors: [{ name: "Lhyo Group", url: "https://lhyogroup.com" }],
  creator: "Lhyo Group",
  publisher: "Lhyo Group",
  verification: {
    google: "yFCVXdhuZSVXSoIv7r9xV69G6QO2B028ZX9ZWGZIG8o",
  },
  alternates: {
    canonical: "https://lhyogroup.com",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: ["/icon.svg"],
    apple: ["/icon.svg"],
  },
  openGraph: {
    title: "Lhyo Group | Infraestructura Enterprise y Automatización B2B",
    description:
      "Migramos su operación a n8n en servidores privados, desplegamos Agentes RAG de memoria institucional privada y desarrollamos SaaS corporativo interno para eliminar la fuga de capital en suscripciones ineficientes.",
    url: "https://lhyogroup.com",
    siteName: "Lhyo Group",
    locale: "es_UY",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lhyo Group | Infraestructura Enterprise y Automatización B2B",
    description:
      "Infraestructura n8n Self-hosted, Agentes RAG privados y ecosistemas SaaS corporativos internos para mitigar la fuga de capital operativo.",
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
        "@id": "https://lhyogroup.com/#website",
        url: "https://lhyogroup.com",
        name: "Lhyo Group | Infraestructura Enterprise y Automatización B2B",
        publisher: { "@id": "https://lhyogroup.com/#organization" },
        inLanguage: "es"
      },
      {
        "@type": "Corporation",
        "@id": "https://lhyogroup.com/#organization",
        name: "Lhyo Group",
        url: "https://lhyogroup.com",
        logo: "https://lhyogroup.com/icon.svg",
        founder: {
          "@type": "Person",
          name: "Lhyonneth Araque",
          jobTitle: "CEO & Founder"
        },
        description:
          "Firma de ingeniería e infraestructura Enterprise B2B especializada en migración a servidores privados n8n (Self-hosted), Agentes RAG de memoria institucional privada y desarrollo de ecosistemas SaaS corporativos internos.",
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Infraestructura Enterprise Lhyo Group",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Automatización Libre de Costos (Infraestructura n8n Self-Hosted)",
                description: "Migración de operaciones a n8n en servidores privados eliminando costos mensuales de terceros."
              }
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Agentes RAG (Memoria Institucional Privada)",
                description: "Cerebros de IA locales conectados a bases de datos, contratos y documentos internos con privacidad absoluta."
              }
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "SaaS Corporativo Interno",
                description: "Desarrollo de ecosistemas a medida unificando operaciones en un panel de control centralizado."
              }
            }
          ]
        }
      }
    ]
  };

  return (
    <main className="min-h-screen bg-[#050507] text-white selection:bg-[#C5A059] selection:text-[#050507]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <MainWorkspace />
    </main>
  );
}
