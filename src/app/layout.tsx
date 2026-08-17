import localFont from "next/font/local";
import type { Metadata } from "next";
import { Geist, Roboto } from "next/font/google";
import { merri } from "@/app/fonts/merri";
import "./globals.css";
import { AuthProvider } from "@/lib/authContext";
import PageSettingsProvider from "@/components/PageSettingsProvider";
import { getPageSettings } from "@/lib/data/pageSettings";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"] as const,
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
});

export const runtime = 'nodejs'

export const metadata: Metadata = {
  metadataBase: new URL("https://mahabharatadialogues.com"),

  title: {
    default: "Mahabharata Dialogues",
    template: "%s | Mahabharata Dialogues",
  },

  description:
    "Explore the profound wisdom and timeless dialogues from the Mahabharata",

  alternates: {
    canonical: "https://mahabharatadialogues.com",
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },

  openGraph: {
    title: "Mahabharata Dialogues",
    description:
      "Explore the profound wisdom and timeless dialogues from the Mahabharata",
    url: "https://mahabharatadialogues.com",
    siteName: "Mahabharata Dialogues",
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Mahabharata Dialogues",
    description:
      "Explore the profound wisdom and timeless dialogues from the Mahabharata",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // SERVER FETCH (runs once per request)
  const settings = await getPageSettings();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${roboto.variable} ${merri.variable} antialiased`}
      >
        <AuthProvider>
          <PageSettingsProvider initialSettings={settings}>
            {children}
          </PageSettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
