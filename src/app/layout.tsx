import type { Metadata } from "next";
import { PropostasProvider } from "@/context/PropostasContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Projeto GPS - Demo",
  description: "Dashboard do GPS Clínicas - Gerenciamento de Propostas Comerciais e Projetos Clínicos Interativos",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <PropostasProvider>{children}</PropostasProvider>
      </body>
    </html>
  );
}


