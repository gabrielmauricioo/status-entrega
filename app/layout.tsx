import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Trocamos Geist por Inter
import "./globals.css";

// Configuração da fonte Inter
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Compre Pegue | Registro de Vendas",
  description: "Sistema interno de gestão minimalista",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}