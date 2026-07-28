"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Crown, Car, Banknote, Package, ShoppingCart, Zap, Shield, MessageCircle, ChevronRight } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { ProductImage } from "@/components/product-image";
import { formatCurrency } from "@/lib/utils";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Crown, Car, Banknote, Package,
};

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  featured: boolean;
  imageUrl?: string | null;
  category?: { name: string; icon: string };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string;
  products: Product[];
}

interface StoreData {
  settings: {
    storeName: string;
    slogan: string;
    serverName: string;
    discordUrl: string | null;
  };
  categories: Category[];
  featured: Product[];
}

export default function LojaPage() {
  const [store, setStore] = useState<StoreData | null>(null);
  const { addItem, count, total } = useCart();

  useEffect(() => {
    fetch("/api/store")
      .then((r) => r.json())
      .then((d) => d.success && setStore(d.data));
  }, []);

  if (!store) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  const { settings, categories, featured } = store;

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">
              {settings.storeName.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-zinc-100 leading-none">{settings.storeName}</p>
              <p className="text-xs text-zinc-500">{settings.serverName}</p>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-zinc-400 md:flex">
            <a href="#produtos" className="hover:text-blue-400 transition">Produtos</a>
            {settings.discordUrl && (
              <a href={settings.discordUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-blue-400">
                <MessageCircle className="h-4 w-4" /> Discord
              </a>
            )}
          </nav>
          <Link
            href="/checkout"
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
          >
            <ShoppingCart className="h-4 w-4" />
            Carrinho
            {count > 0 && (
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">{count} · {formatCurrency(total)}</span>
            )}
          </Link>
        </div>
      </header>

      <section className="store-gradient border-b border-zinc-800 px-4 py-14">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-950 border border-blue-800 px-3 py-1 text-xs font-medium text-blue-400 mb-4">
                <Zap className="h-3 w-3" /> Entrega automática no servidor
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-3">{settings.storeName}</h1>
              <p className="text-zinc-400 max-w-lg">{settings.slogan}</p>
            </div>
            <div className="flex gap-4">
              <div className="rounded-xl bg-zinc-900 border border-zinc-800 px-5 py-4 text-center">
                <Shield className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                <p className="text-xs text-zinc-500">Pagamento</p>
                <p className="text-sm font-semibold text-zinc-200">100% Seguro</p>
              </div>
              <div className="rounded-xl bg-zinc-900 border border-zinc-800 px-5 py-4 text-center">
                <Zap className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                <p className="text-xs text-zinc-500">Entrega</p>
                <p className="text-sm font-semibold text-zinc-200">Instantânea</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="py-12 px-4">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-xl font-bold text-zinc-100 mb-6">🔥 Mais vendidos</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} onAdd={() => addItem({ productId: p.id, name: p.name, price: p.price, slug: p.slug, imageUrl: p.imageUrl })} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="produtos" className="py-12 px-4">
        <div className="mx-auto max-w-6xl">
          {categories.map((cat) => {
            const Icon = ICONS[cat.icon] || Package;
            return (
              <div key={cat.id} className="mb-12">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-zinc-800">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-950 text-blue-500">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-zinc-100">{cat.name}</h2>
                    {cat.description && <p className="text-sm text-zinc-500">{cat.description}</p>}
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {cat.products.map((p) => (
                    <ProductCard key={p.id} product={{ ...p, category: cat }} onAdd={() => addItem({ productId: p.id, name: p.name, price: p.price, slug: p.slug, imageUrl: p.imageUrl })} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="border-t border-zinc-800 bg-zinc-900 py-8 text-center text-sm text-zinc-600">
        © {new Date().getFullYear()} {settings.storeName} · Pagamento seguro via PIX
      </footer>
    </div>
  );
}

function ProductCard({ product, onAdd }: { product: Product; onAdd: () => void }) {
  return (
    <div className="group rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden hover:border-blue-700 transition-all duration-200">
      <div className="relative h-40 bg-gradient-to-br from-blue-950 to-zinc-900 flex items-center justify-center border-b border-zinc-800 overflow-hidden">
        <ProductImage
          src={product.imageUrl}
          alt={product.name}
          className="group-hover:scale-105 transition-transform duration-300"
          iconClassName="h-12 w-12 text-blue-800 group-hover:text-blue-500 transition"
        />
      </div>
      <div className="p-5">
        {product.category && (
          <span className="text-xs font-medium text-blue-400 uppercase tracking-wide">{product.category.name}</span>
        )}
        <h3 className="font-semibold text-zinc-100 mt-1 mb-2">{product.name}</h3>
        <p className="text-sm text-zinc-500 mb-4 line-clamp-2 leading-relaxed">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-zinc-100">{formatCurrency(product.price)}</span>
          <button
            onClick={onAdd}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
          >
            Comprar
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
