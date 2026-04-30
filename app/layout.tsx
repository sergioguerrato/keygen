import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://kyru.vercel.app";
const SITE_TITLE = "Free Password Generator | Kyru — Gerador de Senhas";
const SITE_DESCRIPTION =
  "Generate strong, random passwords instantly. Free, no signup, no tracking. Gere senhas seguras e aleatórias gratuitamente. Sem cadastro.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: [
    "password generator",
    "secure password generator",
    "random key generator",
    "strong password",
    "free password generator",
    "gerador de senhas",
    "gerador de senhas seguras",
    "gerador de chave aleatória",
    "senha aleatória",
    "kyru",
  ],
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: SITE_URL,
    languages: {
      en: SITE_URL,
      "pt-BR": SITE_URL,
      "x-default": SITE_URL,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Kyru Password Generator",
  url: SITE_URL,
  description: "Free secure password generator. No signup required.",
  applicationCategory: "SecurityApplication",
  operatingSystem: "All",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  inLanguage: ["en", "pt-BR"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
