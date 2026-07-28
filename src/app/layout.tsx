import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LojaCart — Plataforma de lojas FiveM",
  description: "Crie sua loja de VIP, veículos e scripts com entrega automática no servidor FiveM.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} min-h-screen antialiased`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
