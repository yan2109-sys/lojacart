"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { Trash2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  enabled: boolean;
  featured: boolean;
  command: string;
  category: { name: string };
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  function load() {
    fetch("/api/admin/products").then((r) => r.json()).then((d) => d.success && setProducts(d.data));
  }

  useEffect(() => { load(); }, []);

  async function toggleEnabled(id: string, enabled: boolean) {
    await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: !enabled }),
    });
    load();
  }

  async function deleteProduct(id: string) {
    if (!confirm("Excluir produto?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Produtos</h1>
      <div className="space-y-3">
        {products.map((p) => (
          <div key={p.id} className="flex items-center gap-4 rounded-xl border border-[var(--border)] p-4">
            <div className="flex-1">
              <p className="font-medium">{p.name}</p>
              <p className="text-xs text-zinc-500">{p.category.name} · cmd: {p.command}</p>
            </div>
            <span className="font-bold text-green-400">{formatCurrency(p.price)}</span>
            <button
              onClick={() => toggleEnabled(p.id, p.enabled)}
              className={`rounded-full px-3 py-1 text-xs ${p.enabled ? "bg-green-500/20 text-green-400" : "bg-zinc-700 text-zinc-400"}`}
            >
              {p.enabled ? "Ativo" : "Inativo"}
            </button>
            <button onClick={() => deleteProduct(p.id)} className="text-zinc-500 hover:text-red-400">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
