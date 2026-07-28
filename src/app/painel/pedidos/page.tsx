"use client";

import { useEffect, useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Order {
  id: string;
  internalId: string;
  clientEmail: string;
  clientIdentifier: string;
  total: number;
  status: string;
  createdAt: string;
  items: { name: string; quantity: number }[];
  deliveries: { status: string }[];
}

export default function PainelPedidosPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch("/api/admin/orders").then((r) => r.json()).then((d) => d.success && setOrders(d.data));
  }, []);

  const statusStyle: Record<string, string> = {
    DELIVERED: "bg-blue-950 text-blue-400",
    APPROVED: "bg-blue-900 text-blue-300",
    PENDING: "bg-amber-950 text-amber-400",
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-100">Pedidos</h1>
        <p className="text-zinc-500 text-sm mt-1">Acompanhe compras e entregas no servidor</p>
      </div>
      <div className="space-y-3">
        {orders.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-12 text-center text-zinc-600">
            Nenhum pedido ainda. Compartilhe sua loja com os jogadores!
          </div>
        ) : orders.map((o) => (
          <div key={o.id} className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
              <div>
                <p className="font-medium text-zinc-100">{o.clientEmail}</p>
                <p className="text-xs text-zinc-500">ID servidor: {o.clientIdentifier} · #{o.internalId.slice(0, 8)}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-blue-400">{formatCurrency(o.total)}</p>
                <span className={`text-xs rounded-full px-2.5 py-0.5 font-medium ${statusStyle[o.status] || "bg-zinc-800 text-zinc-400"}`}>
                  {o.status}
                </span>
              </div>
            </div>
            <p className="text-sm text-zinc-500">{o.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}</p>
            <p className="text-xs text-zinc-600 mt-2">
              {formatDate(o.createdAt)} · {o.deliveries.filter((d) => d.status === "EXECUTED").length}/{o.deliveries.length} entregas
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
