import { Metadata } from "next";
import MainWorkspace from "@/components/MainWorkspace";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.lhyogroup.com"),
  applicationName: "LHYO GROUP",
  title: "LHYO GROUP",
  description:
    "Construimos la presencia digital, los sistemas inteligentes 24/7 y las plataformas Todo-en-Uno que llevan su empresa al siguiente nivel.",
  keywords: [
    "LHYO GROUP",
    "Lhyo Group",
    "sistemas inteligentes 24/7",
    "plataformas web de alta gama",
    "automatización empresarial",
    "inteligencia artificial personalizada para empresas",
    "Lhyonneth Araque"
  ],
  authors: [{ name: "LHYO GROUP", url: "https://www.lhyogroup.com" }],
  creator: "LHYO GROUP",
  publisher: "LHYO GROUP",
  verification: {
    google: "yFCVXdhuZSVXSoIv7r9xV69G6QO2B028ZX9ZWGZIG8o",
  },
  alternates: {
    canonical: "https://www.lhyogroup.com",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml", sizes: "any" }
    ],
    shortcut: ["/icon.svg"],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "LHYO GROUP",
    description:
      "Construimos la presencia digital, los sistemas inteligentes 24/7 y las plataformas Todo-en-Uno que llevan su empresa al siguiente nivel.",
    url: "https://www.lhyogroup.com",
    siteName: "LHYO GROUP",
    locale: "es_UY",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LHYO GROUP",
    description:
      "Construimos la presencia digital, los sistemas inteligentes 24/7 y las plataformas Todo-en-Uno que llevan su empresa al siguiente nivel.",
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
        "@id": "https://www.lhyogroup.com/#website",
        url: "https://www.lhyogroup.com",
        name: "LHYO GROUP",
        alternateName: "Lhyo Group",
        publisher: { "@id": "https://www.lhyogroup.com/#organization" },
        inLanguage: "es"
      },
      {
        "@type": "Organization",
        "@id": "https://www.lhyogroup.com/#organization",
        name: "LHYO GROUP",
        url: "https://www.lhyogroup.com",
        logo: {
          "@type": "ImageObject",
          url: "https://www.lhyogroup.com/icon.svg",
          width: 512,
          height: 512
        },
        founder: {
          "@type": "Person",
          name: "Lhyonneth Araque",
          jobTitle: "CEO & Founder"
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
