import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import { VisitorBeacon } from "./components/VisitorBeacon";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.includes("localhost") ? "http" : "https");
  const metadataBase = new URL(`${protocol}://${host}`);

  return {
    metadataBase,
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
    openGraph: {
      type: "website",
      title: "CHIT THWAY | Support-minded. Curious by default.",
      description:
        "Application support, technical support, QA and web support portfolio based in Perth, Western Australia.",
      siteName: "CHIT THWAY — Portfolio",
      images: [
        {
          url: "/og.png",
          width: 1568,
          height: 1003,
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
  themeColor: "#0b1114",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <VisitorBeacon />
        {children}
      </body>
    </html>
  );
}
