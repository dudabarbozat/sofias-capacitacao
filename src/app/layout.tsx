import type { Metadata, Viewport } from "next";
import { League_Spartan, Montserrat, Poppins, Ubuntu } from "next/font/google";
import { AvisoProvider } from "@/components/Aviso";
import { caminho } from "@/lib/base";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-montserrat", display: "swap" });
const ubuntu = Ubuntu({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-ubuntu", display: "swap" });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-poppins", display: "swap" });
const spartan = League_Spartan({ subsets: ["latin"], weight: ["700"], variable: "--font-league-spartan", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Sofias", template: "%s · Sofias" },
  description: "Capacitação online e offline para jovens mulheres que querem entrar no mercado de trabalho, com trilhas de empresas parceiras.",
  manifest: caminho("/manifest.webmanifest"),
  icons: { icon: caminho("/img/favicon.png"), apple: caminho("/img/apple-touch-icon.png") },
  appleWebApp: { capable: true, title: "Sofias", statusBarStyle: "default" },
};

export const viewport: Viewport = { themeColor: "#4e138b", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${montserrat.variable} ${ubuntu.variable} ${poppins.variable} ${spartan.variable}`}>
      <body>
        <AvisoProvider>{children}</AvisoProvider>
      </body>
    </html>
  );
}
