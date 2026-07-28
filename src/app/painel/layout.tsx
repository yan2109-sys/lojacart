"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, Settings, LogOut, Store, ExternalLink, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/painel", label: "Dashboard", icon: LayoutDashboard },
  { href: "/painel/faturamento", label: "Faturamento", icon: Wallet },
  { href: "/painel/pedidos", label: "Pedidos", icon: ShoppingBag },
  { href: "/painel/produtos", label: "Produtos", icon: Package },
  { href: "/painel/config", label: "Configurações", icon: Settings },
];

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/painel/login" || pathname === "/painel/registro") return <>{children}</>;

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    window.location.href = "/painel/login";
  }

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <aside className="w-60 border-r border-zinc-800 bg-black p-4 flex flex-col shrink-0">
        <Link href="/" className="flex items-center gap-2 mb-8 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Store className="h-4 w-4" />
          </div>
          <span className="font-bold text-sm text-zinc-100">LojaCart</span>
        </Link>
        <nav className="flex-1 space-y-1">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                pathname === item.href
                  ? "bg-blue-950 text-blue-400"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
              )}>
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/loja" target="_blank"
          className="flex items-center gap-2 text-xs text-zinc-500 hover:text-blue-400 px-3 py-2 mb-1">
          <ExternalLink className="h-3.5 w-3.5" /> Ver loja pública
        </Link>
        <button onClick={logout}
          className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-500 hover:text-red-400 mt-1">
          <LogOut className="h-4 w-4" /> Sair
        </button>
      </aside>
      <main className="flex-1 p-6 md:p-8 overflow-auto">{children}</main>
    </div>
  );
}
