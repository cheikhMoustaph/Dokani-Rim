import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { DokaniProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "دكاني — Dokani | منصة التجارة الإلكترونية في موريتانيا",
  description: "متجرك، طلباتك، وزبناؤك من رابط واحد. منصة موريتانية تساعد التجار على البيع أونلاين، استقبال الطلبات، ومتابعة الزبائن بسهولة.",
  keywords: ["دكاني", "تجارة إلكترونية موريتانيا", "متجر أونلاين", "Dokani", "e-commerce Mauritanie", "نواكشوط"],
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "دكاني — Dokani | منصة التجارة الإلكترونية في موريتانيا",
    description: "متجرك، طلباتك، وزبناؤك من رابط واحد. منصة موريتانية تساعد التجار على البيع أونلاين.",
    type: "website",
    locale: "ar_MR",
    siteName: "دكاني — Dokani",
    images: [{ url: "/logo-512.png", width: 512, height: 512, alt: "دكاني — Dokani" }],
  },
  twitter: {
    card: "summary",
    title: "دكاني — Dokani | منصة التجارة الإلكترونية في موريتانيا",
    description: "متجرك، طلباتك، وزبناؤك من رابط واحد. منصة موريتانية تساعد التجار على البيع أونلاين.",
    images: ["/logo-512.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className="antialiased">
        <DokaniProvider>
          {children}
        </DokaniProvider>
        <Toaster />
      </body>
    </html>
  );
}