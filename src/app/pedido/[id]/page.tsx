"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Copy, CheckCircle, Loader2, RefreshCw } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Order {
  id: string;
  internalId: string;
  status: string;
  total: number;
  pixCopyPaste: string | null;
  clientIdentifier: string;
  paidAt: string | null;
  createdAt: string;
  items: { name: string; price: number; quantity: number }[];
}

export default function OrderPage() {
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [copied, setCopied] = useState(false);
  const [confirming, setConfirming] = useState(false);

  function loadOrder() {
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then((d) => d.success && setOrder(d.data));
  }

  useEffect(() => { loadOrder(); }, [id]);

  async function confirmPayment() {
    setConfirming(true);
    const res = await fetch(`/api/orders/${id}`, { method: "POST" });
    const data = await res.json();
    if (data.success) setOrder(data.data);
    setConfirming(false);
  }

  function copyPix() {
    if (order?.pixCopyPaste) {
      navigator.clipboard.writeText(order.pixCopyPaste);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const isPaid = order.status === "APPROVED" || order.status === "DELIVERED";

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-10">
      <div className="mx-auto max-w-lg">
        <Link href="/loja" className="text-sm text-zinc-500 hover:text-blue-400 mb-6 inline-block">← Voltar à loja</Link>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="flex items-center gap-3 mb-6">
            {isPaid ? (
              <CheckCircle className="h-8 w-8 text-blue-500" />
            ) : (
              <div className="h-8 w-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
            )}
            <div>
              <h1 className="text-xl font-bold text-zinc-100">
                {isPaid ? "Pagamento confirmado!" : "Aguardando pagamento"}
              </h1>
              <p className="text-sm text-zinc-500">Pedido #{order.internalId.slice(0, 8)}</p>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm text-zinc-400">
                <span>{item.quantity}x {item.name}</span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold pt-2 border-t border-zinc-800 text-zinc-100">
              <span>Total</span>
              <span className="text-blue-400">{formatCurrency(order.total)}</span>
            </div>
          </div>

          {!isPaid && order.pixCopyPaste && (
            <div className="mb-6">
              <p className="text-sm text-zinc-500 mb-2">Copie o código PIX e pague no app do seu banco:</p>
              <div className="relative">
                <textarea
                  readOnly
                  value={order.pixCopyPaste}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 p-3 text-xs font-mono text-zinc-300 h-24 resize-none"
                />
                <button
                  onClick={copyPix}
                  className="absolute top-2 right-2 rounded-lg p-1.5 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700"
                >
                  {copied ? <CheckCircle className="h-4 w-4 text-blue-400" /> : <Copy className="h-4 w-4 text-zinc-400" />}
                </button>
              </div>

              <button
                onClick={confirmPayment}
                disabled={confirming}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-blue-800 bg-blue-950 py-3 text-sm font-medium text-blue-400 hover:bg-blue-900 transition"
              >
                {confirming ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Já paguei — confirmar pagamento
              </button>
              <p className="text-xs text-zinc-600 mt-2 text-center">Em produção, a confirmação é automática via webhook PIX.</p>
            </div>
          )}

          {isPaid && (
            <div className="rounded-xl bg-blue-950 border border-blue-900 p-4 text-sm">
              <p className="text-blue-400 font-medium">Entrega em andamento</p>
              <p className="text-zinc-400 mt-1">
                Seus benefícios serão entregues automaticamente no servidor para o ID: <strong className="text-zinc-200">{order.clientIdentifier}</strong>
              </p>
              {order.paidAt && <p className="text-zinc-600 mt-2 text-xs">Pago em {formatDate(order.paidAt)}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
