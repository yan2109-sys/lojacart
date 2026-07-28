"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Store, Loader2 } from "lucide-react";

export default function PainelLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (data.success) router.push("/painel");
    else setError(data.error || "Senha incorreta");
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-lg text-zinc-100 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Store className="h-4 w-4" />
            </div>
            LojaCart
          </Link>
          <h1 className="text-2xl font-bold text-zinc-100">Entrar no painel</h1>
          <p className="text-zinc-500 text-sm mt-2">Gerencie sua loja FiveM</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8">
          <label className="block text-sm font-medium text-zinc-300 mb-1">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 mb-4 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            placeholder="Sua senha do painel"
          />
          {error && <p className="text-sm text-red-400 mb-3">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Entrar
          </button>
        </form>

        <p className="text-center text-sm text-zinc-500 mt-6">
          Não tem loja?{" "}
          <Link href="/painel/registro" className="text-blue-400 font-medium hover:underline">Criar grátis</Link>
        </p>
      </div>
    </div>
  );
}
