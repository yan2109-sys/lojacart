"use client";

import { useEffect, useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Wallet, TrendingUp, Calendar, ArrowDownToLine, Loader2, CheckCircle } from "lucide-react";

interface BillingData {
  totalEarned: number;
  todayEarned: number;
  weekEarned: number;
  monthEarned: number;
  totalWithdrawn: number;
  pendingWithdrawals: number;
  availableBalance: number;
  pixKey: string | null;
  pixBeneficiary: string | null;
  monthlyRevenue: { month: string; revenue: number }[];
  recentPaidOrders: {
    id: string;
    internalId: string;
    clientEmail: string;
    total: number;
    paidAt: string | null;
    items: { name: string; quantity: number }[];
  }[];
  withdrawals: {
    id: string;
    amount: number;
    pixKey: string;
    status: string;
    note: string | null;
    createdAt: string;
    completedAt: string | null;
  }[];
}

const MONTH_NAMES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function formatMonth(key: string) {
  const [, m] = key.split("-");
  return MONTH_NAMES[parseInt(m, 10) - 1] || key;
}

export default function FaturamentoPage() {
  const [data, setData] = useState<BillingData | null>(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function load() {
    fetch("/api/admin/billing").then((r) => r.json()).then((d) => d.success && setData(d.data));
  }

  useEffect(() => { load(); }, []);

  async function handleWithdraw(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const res = await fetch("/api/admin/withdrawals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: parseFloat(amount) }),
    });
    const json = await res.json();
    if (json.success) {
      setSuccess(`Saque de ${formatCurrency(json.data.amount)} processado com sucesso!`);
      setAmount("");
      load();
    } else {
      setError(json.error || "Erro ao sacar");
    }
    setLoading(false);
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  const maxMonthly = Math.max(...data.monthlyRevenue.map((m) => m.revenue), 1);

  const cards = [
    { label: "Saldo disponível", value: formatCurrency(data.availableBalance), icon: Wallet, highlight: true },
    { label: "Faturamento total", value: formatCurrency(data.totalEarned), icon: TrendingUp },
    { label: "Este mês", value: formatCurrency(data.monthEarned), icon: Calendar },
    { label: "Total sacado", value: formatCurrency(data.totalWithdrawn), icon: ArrowDownToLine },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-100">Faturamento</h1>
        <p className="text-zinc-500 text-sm mt-1">Acompanhe suas vendas e solicite saques via PIX</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className={`rounded-xl border p-5 ${c.highlight ? "border-blue-700 bg-blue-950/40" : "border-zinc-800 bg-zinc-900"}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-zinc-500">{c.label}</span>
              <c.icon className={`h-5 w-5 ${c.highlight ? "text-blue-400" : "text-zinc-500"}`} />
            </div>
            <p className={`text-2xl font-bold ${c.highlight ? "text-blue-400" : "text-zinc-100"}`}>{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="font-semibold text-zinc-100 mb-4">Resumo do período</h2>
          <div className="space-y-3">
            {[
              { label: "Hoje", value: data.todayEarned },
              { label: "Esta semana", value: data.weekEarned },
              { label: "Este mês", value: data.monthEarned },
            ].map((r) => (
              <div key={r.label} className="flex justify-between text-sm">
                <span className="text-zinc-500">{r.label}</span>
                <span className="font-medium text-zinc-200">{formatCurrency(r.value)}</span>
              </div>
            ))}
          </div>

          <h3 className="font-medium text-zinc-300 mt-6 mb-3 text-sm">Últimos 6 meses</h3>
          <div className="space-y-2">
            {data.monthlyRevenue.map((m) => (
              <div key={m.month} className="flex items-center gap-3">
                <span className="text-xs text-zinc-500 w-8">{formatMonth(m.month)}</span>
                <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(m.revenue / maxMonthly) * 100}%` }} />
                </div>
                <span className="text-xs text-zinc-400 w-20 text-right">{formatCurrency(m.revenue)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="font-semibold text-zinc-100 mb-1">Sacar dinheiro</h2>
          <p className="text-xs text-zinc-500 mb-4">
            O saque será enviado para sua chave PIX cadastrada
            {data.pixKey ? `: ${data.pixKey}` : " (configure em Configurações)"}
          </p>

          <form onSubmit={handleWithdraw} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Valor do saque (R$)</label>
              <input
                type="number"
                step="0.01"
                min="10"
                max={data.availableBalance}
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Máx: ${formatCurrency(data.availableBalance)}`}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
              <p className="text-xs text-zinc-600 mt-1">Mínimo: R$ 10,00</p>
            </div>

            <button
              type="button"
              onClick={() => setAmount(String(data.availableBalance))}
              className="text-xs text-blue-400 hover:underline"
            >
              Sacar saldo total
            </button>

            {error && <p className="text-sm text-red-400">{error}</p>}
            {success && (
              <p className="text-sm text-blue-400 flex items-center gap-1">
                <CheckCircle className="h-4 w-4" /> {success}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || data.availableBalance < 10 || !data.pixKey}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowDownToLine className="h-4 w-4" />}
              Solicitar saque via PIX
            </button>
          </form>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="font-semibold text-zinc-100 mb-4">Vendas pagas recentes</h2>
          <div className="space-y-2">
            {data.recentPaidOrders.length === 0 ? (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center text-zinc-600 text-sm">
                Nenhuma venda paga ainda
              </div>
            ) : data.recentPaidOrders.map((o) => (
              <div key={o.id} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-zinc-300">{o.clientEmail}</span>
                  <span className="font-bold text-blue-400">{formatCurrency(o.total)}</span>
                </div>
                <p className="text-xs text-zinc-500">
                  {o.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                </p>
                {o.paidAt && <p className="text-xs text-zinc-600 mt-1">{formatDate(o.paidAt)}</p>}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-zinc-100 mb-4">Histórico de saques</h2>
          <div className="space-y-2">
            {data.withdrawals.length === 0 ? (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center text-zinc-600 text-sm">
                Nenhum saque realizado
              </div>
            ) : data.withdrawals.map((w) => (
              <div key={w.id} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                <div className="flex justify-between mb-1">
                  <span className="font-bold text-zinc-200">{formatCurrency(w.amount)}</span>
                  <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${
                    w.status === "COMPLETED" ? "bg-blue-950 text-blue-400" :
                    w.status === "PENDING" ? "bg-amber-950 text-amber-400" :
                    "bg-red-950 text-red-400"
                  }`}>{w.status === "COMPLETED" ? "Concluído" : w.status}</span>
                </div>
                <p className="text-xs text-zinc-500">PIX: {w.pixKey}</p>
                <p className="text-xs text-zinc-600 mt-1">{formatDate(w.createdAt)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
