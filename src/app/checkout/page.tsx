"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { StoreHeader } from "@/components/store-header";
import { useCart } from "@/components/cart-provider";
import { formatCurrency } from "@/lib/utils";
import { Trash2, Minus, Plus, Loader2 } from "lucide-react";
import { ProductImage } from "@/components/product-image";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, updateQty, removeItem, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const [storeName, setStoreName] = useState("Loja");
  const [form, setForm] = useState({
    clientEmail: "",
    clientName: "",
    clientIdentifier: "",
    clientDiscord: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/store").then((r) => r.json()).then((d) => d.success && setStoreName(d.data.settings.storeName));
  }, []);

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return setError("Carrinho vazio");
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          ...form,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error);
        return;
      }
      clear();
      router.push(`/pedido/${data.data.orderId}`);
    } catch {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20";

  return (
    <div className="min-h-screen bg-zinc-950">
      <StoreHeader storeName={storeName} />
      <div className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-2xl font-bold text-zinc-100 mb-8">Finalizar compra</h1>

        {items.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            <p className="mb-4">Seu carrinho está vazio</p>
            <Link href="/loja" className="text-blue-400 font-medium hover:underline">Ver produtos</Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                  <div className="relative h-14 w-14 shrink-0 rounded-lg border border-zinc-700 bg-zinc-950 overflow-hidden flex items-center justify-center">
                    <ProductImage src={item.imageUrl} alt={item.name} iconClassName="h-6 w-6 text-zinc-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-zinc-100">{item.name}</p>
                    <p className="text-sm text-blue-400">{formatCurrency(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(item.productId, item.quantity - 1)} className="rounded p-1 hover:bg-zinc-800 text-zinc-400">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-6 text-center text-sm text-zinc-300">{item.quantity}</span>
                    <button onClick={() => updateQty(item.productId, item.quantity + 1)} className="rounded p-1 hover:bg-zinc-800 text-zinc-400">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button onClick={() => removeItem(item.productId)} className="text-zinc-500 hover:text-red-400">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <div className="flex justify-between pt-4 border-t border-zinc-800 text-lg font-bold text-zinc-100">
                <span>Total</span>
                <span className="text-blue-400">{formatCurrency(total)}</span>
              </div>
            </div>

            <form onSubmit={handleCheckout} className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
              <h2 className="font-semibold text-zinc-100 mb-2">Seus dados</h2>
              <p className="text-xs text-zinc-500 mb-4">Informe seu ID do servidor (passaporte/vRP ID/license) para entrega automática.</p>

              {[
                { key: "clientEmail", label: "E-mail", type: "email", placeholder: "seu@email.com" },
                { key: "clientName", label: "Nome (opcional)", type: "text", placeholder: "Seu nome" },
                { key: "clientIdentifier", label: "ID no servidor *", type: "text", placeholder: "Ex: 1234 ou license:abc..." },
                { key: "clientDiscord", label: "Discord (opcional)", type: "text", placeholder: "usuario#0000" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">{f.label}</label>
                  <input
                    type={f.type}
                    required={f.key === "clientEmail" || f.key === "clientIdentifier"}
                    placeholder={f.placeholder}
                    value={form[f.key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    className={inputClass}
                  />
                </div>
              ))}

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Pagar com PIX · {formatCurrency(total)}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
