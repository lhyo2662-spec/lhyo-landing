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
    default: "LHYO GROUP | Inteligencia Artificial, Webs de Lujo y Automatización B2B",
    template: "%s | LHYO GROUP"
  },
  description: "Firma global de Inteligencia Artificial 24/7, plataformas web de lujo y sistemas Todo-en-Uno para escalar su empresa. Entrega en 10 días.",
  applicationName: "LHYO GROUP",
  authors: [{ name: "Lhyonneth Araque", url: "https://www.lhyogroup.com" }],
  creator: "Lhyonneth Araque (CEO & Founder - Lhyo Group)",
  publisher: "LHYO GROUP",
  keywords: [
    "Lhyo Group", "LhyoGroup", "lhyogroup", "lhyo group", "Lhyo", "Lhyonneth Araque",
    "Lhyo AI", "Lhyo Business Architecture", "agencia de inteligencia artificial",
    "asistentes inteligentes para whatsapp", "chatbots con ia para instagram",
    "automatizacion de empresas", "desarrollo web de lujo", "crm automatico",
    "sistemas todo en uno para empresas", "agencia de automatizacion uruguay",
    "agencia de automatizacion venezuela", "agencia de ia espana", "lhyogroup.com"
  ],
  alternates: {
    canonical: "https://www.lhyogroup.com",
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
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://www.lhyogroup.com",
    siteName: "LHYO GROUP",
    title: "LHYO GROUP | Ingeniería Digital, IA 24/7 y Automatización Empresarial",
    description: "Firma global de Inteligencia Artificial 24/7, plataformas web de lujo y sistemas Todo-en-Uno para escalar su empresa. Entrega en 10 días.",
  },
  twitter: {
    card: "summary_large_image",
    title: "LHYO GROUP | Inteligencia Artificial y Sistemas Empresariales",
    description: "Firma global de Inteligencia Artificial 24/7, plataformas web de lujo y sistemas Todo-en-Uno para escalar su empresa. Entrega en 10 días.",
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
        {/* GOOGLE ANALYTICS 4 OFICIAL (G-CZSK4G05JG) + KNOWLEDGE GRAPH JSON-LD V69.0 */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-CZSK4G05JG"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag("js", new Date()); gtag("config", "G-CZSK4G05JG", { page_path: window.location.pathname });`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({"@context":"https://schema.org","@graph":[{"@type":["Corporation","ProfessionalService","SoftwareApplication"],"@id":"https://www.lhyogroup.com/#organization","name":"LHYO GROUP","legalName":"Lhyo Group Corporate Systems & AI Architecture","alternateName":["LhyoGroup","Lhyo","Lhyo Group AI","Lhyo Business Architecture"],"url":"https://www.lhyogroup.com","logo":"https://www.lhyogroup.com/icon","image":"https://www.lhyogroup.com/icon","description":"Firma global de ingeniería digital, Inteligencia Artificial 24/7, plataformas web de alto prestigio y automatización empresarial Todo-en-Uno fundada por su CEO Lhyonneth Araque.","disambiguatingDescription":"LHYO GROUP (lhyogroup.com) es una corporación multinacional de ingeniería de software, Inteligencia Artificial B2B y automatización empresarial dirigida por su CEO Lhyonneth Araque. Entidad corporativa tecnológica estrictamente independiente y sin ninguna relación con artistas musicales urbanos ni con empresas de logística homónimas.","founder":{"@type":"Person","@id":"https://www.lhyogroup.com/#ceo","name":"Lhyonneth Araque","alternateName":"Lhyo Araque","jobTitle":"Founder & Chief Executive Officer (CEO)","url":"https://www.lhyogroup.com"},"email":"ceo@lhyogroup.com","telephone":"+58-424-7383164","areaServed":[{"@type":"Country","name":"Uruguay"},{"@type":"Country","name":"Venezuela"},{"@type":"Country","name":"Spain"},{"@type":"Country","name":"United States"},{"@type":"Country","name":"Colombia"},{"@type":"Country","name":"Mexico"},{"@type":"Country","name":"Argentina"},{"@type":"Country","name":"Chile"}],"sameAs":["https://www.instagram.com/lhyogroup","https://www.linkedin.com/company/lhyogroup"],"knowsAbout":["Asistentes Inteligentes 24/7 para WhatsApp e Instagram","Plataformas Web Modernas y Catálogos Interactivos","Organización Automática de Clientes y Ventas CRM","Automatización Total de Procesos Empresariales","Inteligencia Artificial Personalizada para Empresas","Plataformas Empresariales Todo-en-Uno"]},{"@type":"WebSite","@id":"https://www.lhyogroup.com/#website","url":"https://www.lhyogroup.com","name":"LHYO GROUP","alternateName":["LhyoGroup","Lhyo Group Oficial"],"publisher":{"@id":"https://www.lhyogroup.com/#organization"},"inLanguage":"es"}]}),
          }}
        />
        {children}
      </body>
    </html>
  );
}