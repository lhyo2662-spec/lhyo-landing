// @ts-ignore
import "./globals.css";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.lhyogroup.com"),
  title: {
    default: "Lhyo Group | Sistemas Inteligentes 24/7, Páginas Web y Automatización",
    template: "%s | Lhyo Group",
  },
  description:
    "Lhyo Group (lhyogroup): Desarrollamos Asistentes Inteligentes 24/7 para WhatsApp e Instagram, Plataformas Web de alto prestigio, CRM Automático, IA Personalizada y Sistemas Todo-en-Uno para empresas.",
  keywords: [
    "lhyogroup",
    "LhyoGroup",
    "Lhyo Group",
    "Lhyo",
    "Grupo Lhyo",
    "automatización de empresas",
    "asistentes inteligentes whatsapp 24/7",
    "diseño de páginas web corporativas",
    "inteligencia artificial para empresas",
    "sistema todo en uno para negocios",
    "crm automático",
  ],
  alternates: {
    canonical: "https://www.lhyogroup.com",
  },
  openGraph: {
    title: "Lhyo Group | Presencia Digital, Sistemas e Inteligencia Artificial 24/7",
    description:
      "Instalamos la infraestructura digital, los asistentes 24/7 y el sistema Todo-en-Uno que llevan su empresa al siguiente nivel.",
    url: "https://www.lhyogroup.com",
    siteName: "Lhyo Group",
    locale: "es_ES",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const JSON_LD_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Lhyo Group",
  alternateName: ["lhyogroup", "LhyoGroup", "LHYO GROUP", "Lhyo", "Grupo Lhyo"],
  url: "https://www.lhyogroup.com",
  email: "ceo@lhyogroup.com",
  telephone: "+584247383164",
  description:
    "Firma de ingeniería digital, asistentes inteligentes 24/7 para WhatsApp e Instagram, páginas web corporativas y automatización empresarial.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" translate="no" className="notranslate">
      <head>
        <meta name="google" content="notranslate" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD_SCHEMA) }}
        />
      </head>
      <body
        className={`${jakarta.className} antialiased bg-[#050507] text-white selection:bg-[#BF953F] selection:text-[#070707]`}
      >
        {children}
      </body>
    </html>
  );
}