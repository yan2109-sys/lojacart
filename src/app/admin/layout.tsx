"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, Settings, LogOut, Gamepad2 } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/config", label: "Configurações", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin/login") return <>{children}</>;

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    window.location.href = "/admin/login";
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 border-r border-[var(--border)] bg-[var(--card)] p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-8 px-2">
          <Gamepad2 className="h-5 w-5 text-green-500" />
          <span className="font-bold text-sm">Admin Loja</span>
        </div>
        <nav className="flex-1 space-y-1">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition",
                pathname === item.href ? "bg-green-600/20 text-green-400" : "text-zinc-400 hover:bg-zinc-800"
              )}>
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300 px-3 py-2">Ver loja →</Link>
        <button onClick={logout} className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-500 hover:text-red-400 mt-2">
          <LogOut className="h-4 w-4" /> Sair
        </button>
      </aside>
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
