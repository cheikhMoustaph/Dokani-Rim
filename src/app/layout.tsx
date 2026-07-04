import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { DokaniProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "دكاني — Dokani | منصة التجارة الإلكترونية في موريتانيا",
  description: "متجرك، طلباتك، وزبناؤك من رابط واحد. منصة موريتانية تساعد التجار على البيع أونلاين.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🛒</text></svg>",
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