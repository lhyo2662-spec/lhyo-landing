import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// 1. OBJETO METADATA: Inyección de Keywords para búsquedas por servicios y errores ortográficos
export const metadata: Metadata = {
  title: "LHYO GROUP | Arquitectura Digital y Sistemas Inteligentes 24/7",
  description: "Construimos e instalamos plataformas web de máximo prestigio, asistentes inteligentes 24/7 y ecosistemas propios que multiplican sus ventas en automático.",
  keywords: [
    "lhyogroup", 
    "lhyo group", 
    "lhyo", 
    "LHYO", 
    "Grupo Lhyo", 
    "Lio Group", 
    "lhyogrup",
    "automatización de empresas", 
    "página web corporativa", 
    "chatbots IA",
    "asistente virtual whatsapp 24/7", 
    "agencia de inteligencia artificial", 
    "CRM automatizado",
    "Lhyonneth Araque"
  ],
  alternates: {
    canonical: "https://www.lhyogroup.com",
  },
  openGraph: {
    title: "LHYO GROUP | Ingeniería de Lujo y Automatización",
    url: "https://www.lhyogroup.com",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        {/* 2. ESQUEMA JSON-LD: Obliga a Google a registrar "lhyogroup" pegado como entidad tuya */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "LHYO GROUP",
              "alternateName": ["lhyogroup", "LhyoGroup", "Grupo Lhyo", "Lhyo", "LHYO", "Lhyo Group"],
              "url": "https://www.lhyogroup.com",
              "founder": {
                "@type": "Person",
                "name": "Lhyonneth Araque"
              }
            })
          }}
        />
      </head>
      <body className={`${inter.className} bg-[#050507] text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}