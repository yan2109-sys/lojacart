"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { cn, formatCurrency } from "@/lib/utils";

export function StoreHeader({ storeName }: { storeName: string }) {
  const { count, total } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/loja" className="flex items-center gap-2 font-bold text-lg text-zinc-100">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white text-sm font-bold">
            {storeName.charAt(0)}
          </div>
          {storeName}
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/loja#produtos" className="text-sm text-zinc-400 hover:text-blue-400 hidden sm:block">
            Produtos
          </Link>
          <Link
            href="/checkout"
            className={cn(
              "flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
            )}
          >
            <ShoppingCart className="h-4 w-4" />
            Carrinho
            {count > 0 && (
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
                {count} · {formatCurrency(total)}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
