import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { VisitorBeacon } from "./components/VisitorBeacon";
import "./globals.css";

const siteUrl = new URL("https://chitthway-portfolio.pages.dev");

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateMetadata(): Metadata {
  return {
    metadataBase: siteUrl,
    title: "CHIT THWAY | Application Support, QA & Web Support",
    description:
      "Portfolio of CHIT THWAY, a Perth-based Computer Science graduate focused on application support, technical support, QA and web support.",
    keywords: [
      "CHIT THWAY",
      "Application Support",
      "Technical Support",
      "QA Testing",
      "Web Support",
      "Computer Science Graduate",
      "Perth",
    ],
    authors: [{ name: "CHIT THWAY" }],
    creator: "CHIT THWAY",
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      url: "/",
      title: "CHIT THWAY | Support-minded. Curious by default.",
      description:
        "Application support, technical support, QA and web support portfolio based in Perth, Western Australia.",
      siteName: "CHIT THWAY — Portfolio",
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 627,
          alt: "CHIT THWAY — support-minded, curious by default",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "CHIT THWAY | Support-minded. Curious by default.",
      description:
        "Application support, technical support, QA and web support portfolio based in Perth, Western Australia.",
      images: ["/og.png"],
    },
    robots: { index: true, follow: true },
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f3" },
    { media: "(prefers-color-scheme: dark)", color: "#111210" },
  ],
  colorScheme: "light dark",
};

const themeBootScript = `
  (() => {
    try {
      const storedTheme = window.localStorage.getItem("portfolio-theme");
      document.documentElement.dataset.theme =
        storedTheme === "light" || storedTheme === "dark" ? storedTheme : "light";
    } catch {
      document.documentElement.dataset.theme = "light";
    }
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <VisitorBeacon />
        {children}
      </body>
    </html>
  );
}
