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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch("/api/admin/orders").then((r) => r.json()).then((d) => d.success && setOrders(d.data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Pedidos</h1>
      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="rounded-xl border border-[var(--border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
              <div>
                <p className="font-medium">{o.clientEmail}</p>
                <p className="text-xs text-zinc-500">ID servidor: {o.clientIdentifier} · #{o.internalId.slice(0, 8)}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-400">{formatCurrency(o.total)}</p>
                <span className={`text-xs rounded-full px-2 py-0.5 ${
                  o.status === "DELIVERED" ? "bg-green-500/20 text-green-400" :
                  o.status === "APPROVED" ? "bg-blue-500/20 text-blue-400" :
                  "bg-yellow-500/20 text-yellow-400"
                }`}>{o.status}</span>
              </div>
            </div>
            <p className="text-sm text-zinc-400">{o.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}</p>
            <p className="text-xs text-zinc-600 mt-1">{formatDate(o.createdAt)} · {o.deliveries.filter(d => d.status === "EXECUTED").length}/{o.deliveries.length} entregas</p>
          </div>
        ))}
      </div>
    </div>
  );
}
