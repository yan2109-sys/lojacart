"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Store, Loader2 } from "lucide-react";

export default function PainelRegistroPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    storeName: "",
    serverName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Senhas não coincidem");
      return;
    }
    if (form.password.length < 6) {
      setError("Senha deve ter pelo menos 6 caracteres");
      return;
    }
    setLoading(true);
    setError("");
    const res = await fetch("/api/painel/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) {
      router.push("/painel");
    } else {
      setError(data.error || "Erro ao criar loja");
    }
    setLoading(false);
  }

  const fields = [
    { key: "storeName", label: "Nome da loja", placeholder: "Ex: Cidade RP Store" },
    { key: "serverName", label: "Nome do servidor FiveM", placeholder: "Ex: Cidade RP" },
    { key: "email", label: "Seu e-mail", placeholder: "admin@email.com", type: "email" },
    { key: "password", label: "Senha do painel", placeholder: "Mínimo 6 caracteres", type: "password" },
    { key: "confirmPassword", label: "Confirmar senha", placeholder: "Repita a senha", type: "password" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-lg text-zinc-100 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Store className="h-4 w-4" />
            </div>
            LojaCart
          </Link>
          <h1 className="text-2xl font-bold text-zinc-100">Criar minha loja</h1>
          <p className="text-zinc-500 text-sm mt-2">Configure sua loja FiveM em minutos</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 space-y-4">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-zinc-300 mb-1">{f.label}</label>
              <input
                type={f.type || "text"}
                required
                placeholder={f.placeholder}
                value={form[f.key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>
          ))}

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Criar loja grátis
          </button>
        </form>

        <p className="text-center text-sm text-zinc-500 mt-6">
          Já tem uma loja?{" "}
          <Link href="/painel/login" className="text-blue-400 font-medium hover:underline">Entrar no painel</Link>
        </p>
      </div>
    </div>
  );
}
